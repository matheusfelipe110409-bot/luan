#!/usr/bin/env python3
"""
ingest: turn the ChatGPT images (see PROMPTS-CHATGPT.md) into the layers the
page uses. Nothing here draws food; it measures, aligns, cuts and encodes.

    python3 tools/ingest.py                 everything found in assets/src/
    python3 tools/ingest.py --src some/dir  read the PNGs from another folder
    python3 tools/ingest.py --check         report what is missing, write nothing

Inputs (assets/src/, names from the prompt pack; any missing file is skipped):
    v1-bola v2-massa v3-molho v4-queijo [v4b-derretendo] v5-assada v6-completa
    m-<sabor> (11)   p1-tomates p2-manjericao p3-azeitonas p4-calabresa p5-farinha
    s1-compartilhar

What it does, in ScrollCraft terms (references/hero-depth.md):
  * Clean plates with genuine alpha: the red seamless is modelled as a smooth
    field (ChatGPT backdrops are never perfectly flat) and un-composited, so
    the pizza and its real shadow sit on whatever red the page paints.
  * One camera: every vitrine frame is re-centred and re-scaled on the
    pizza's own outline, because edits drift by a few percent and a frame
    that jumps breaks the film. V1 (the ball) takes V2's scale: same camera.
  * Layers the eye reads as separate objects are separated: the grated cheese
    of V4 is split into three handfuls, and every topping of V6 is cut out at
    the exact spot it occupies in V6, so the falling pieces land where the
    final photo has them.
"""
import argparse
import json
import math
import os
import re
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'src')
VT = os.path.join(ROOT, 'assets', 'vt')
MENU = os.path.join(ROOT, 'assets', 'menu')

DESK, MOB = 1440, 960
PIZZA_R = 0.43            # pizza radius as a fraction of the output frame
F = np.float32

VITRINE = ['v1-bola', 'v2-massa', 'v3-molho', 'v4-queijo', 'v4b-derretendo', 'v5-assada', 'v6-completa']
MENU_SLUGS = ['mussarela', 'calabresa', 'marguerita', 'portuguesa', 'frango-catupiry', 'quatro-queijos',
              'pepperoni', 'bacon', 'chocolate-morango', 'romeu-julieta', 'banana-canela']
PROPS = {'p1-tomates': 'tomatoes', 'p2-manjericao': 'basil', 'p3-azeitonas': 'olives',
         'p4-calabresa': 'calabresa', 'p5-farinha': 'flour'}


def log(*a):
    print(*a, flush=True)


# ------------------------------------------------------------ colour ----
def to_lab(rgb):
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124564, 0.3575761, 0.1804375],
                  [0.2126729, 0.7151522, 0.0721750],
                  [0.0193339, 0.1191920, 0.9503041]], F)
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883], F)
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1).astype(F)


def load(path):
    im = Image.open(path)
    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    im = im.convert('RGBA')
    a = np.asarray(im).astype(F) / 255.0
    return a[..., :3], a[..., 3], has_alpha and a[..., 3].min() < 0.98


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ------------------------------------------------- backdrop and matte ----
def backdrop_field(rgb, band=0.07, kind='seamless'):
    """Model the backdrop as a smooth quadratic field fitted to the border,
    so a slight vignette or gradient from the generator does not read as
    'object' in the matte. For a drawn checkerboard, return the two tones."""
    h, w = rgb.shape[:2]
    b = max(4, int(min(h, w) * band))
    yy, xx = np.mgrid[0:h, 0:w].astype(F)
    border = np.zeros((h, w), bool)
    border[:b, :] = border[-b:, :] = border[:, :b] = border[:, -b:] = True
    lab = to_lab(rgb)
    pts = lab[border]
    # checkerboard: two clusters of grey a fixed distance apart
    if kind == 'auto':
        L = pts[:, 0]
        lo, hi = np.percentile(L, 20), np.percentile(L, 80)
        chroma = np.hypot(pts[:, 1], pts[:, 2]).mean()
        if hi - lo > 6 and chroma < 6:
            return ('checker', np.array([[lo, 0, 0], [hi, 0, 0]], F))
    # robust quadratic fit per channel
    X = np.stack([np.ones_like(xx), xx / w, yy / h, (xx / w) ** 2, (yy / h) ** 2, (xx / w) * (yy / h)], -1)
    Xb = X[border]
    field = np.zeros_like(lab)
    keep = np.ones(len(pts), bool)
    for _ in range(3):
        coef = [np.linalg.lstsq(Xb[keep], pts[keep, c], rcond=None)[0] for c in range(3)]
        pred = np.stack([Xb @ coef[c] for c in range(3)], -1)
        err = np.linalg.norm(pred - pts, axis=-1)
        keep = err < max(4.0, np.percentile(err, 85))
    for c in range(3):
        field[..., c] = X @ coef[c]
    return ('field', field)


def matte(rgb, bd, lo=7.0, hi=22.0):
    """Alpha from colour distance to the backdrop, then remove the backdrop's
    colour from the semi-transparent edge (and shadow) pixels."""
    lab = to_lab(rgb)
    if bd[0] == 'checker':
        d = np.min(np.stack([np.linalg.norm(lab - t, axis=-1) for t in bd[1]], 0), 0)
        bg_rgb = None
    else:
        d = np.linalg.norm(lab - bd[1], axis=-1)
        bg_rgb = None
    a = smoothstep(lo, hi, d).astype(F)
    a = ndi.gaussian_filter(a, 0.6)
    return d, a


def decontaminate(rgb, alpha, bg_rgb):
    a = np.maximum(alpha, 1e-3)[..., None]
    out = (rgb - (1 - alpha)[..., None] * bg_rgb) / a
    return np.clip(out, 0, 1)


def border_rgb(rgb, band=0.07):
    h, w = rgb.shape[:2]
    b = max(4, int(min(h, w) * band))
    pts = np.concatenate([rgb[:b].reshape(-1, 3), rgb[-b:].reshape(-1, 3), rgb[:, :b].reshape(-1, 3), rgb[:, -b:].reshape(-1, 3)])
    return np.median(pts, axis=0)


def bg_rgb_field(rgb, band=0.07):
    """The backdrop as an RGB field (same quadratic model, in RGB)."""
    h, w = rgb.shape[:2]
    b = max(4, int(min(h, w) * band))
    yy, xx = np.mgrid[0:h, 0:w].astype(F)
    border = np.zeros((h, w), bool)
    border[:b, :] = border[-b:, :] = border[:, :b] = border[:, -b:] = True
    X = np.stack([np.ones_like(xx), xx / w, yy / h, (xx / w) ** 2, (yy / h) ** 2, (xx / w) * (yy / h)], -1)
    out = np.zeros_like(rgb)
    for c in range(3):
        coef = np.linalg.lstsq(X[border], rgb[border][:, c], rcond=None)[0]
        out[..., c] = X @ coef
    return np.clip(out, 0, 1)


# ---------------------------------------------------------- geometry ----
def _kasa(xs, ys):
    """Algebraic least-squares circle through boundary points."""
    A = np.stack([xs, ys, np.ones_like(xs)], -1)
    b = -(xs * xs + ys * ys)
    D, E, Fc = np.linalg.lstsq(A, b, rcond=None)[0]
    cx, cy = -D / 2, -E / 2
    return cx, cy, math.sqrt(max(cx * cx + cy * cy - Fc, 1.0))


def subject_circle(rgb, bd):
    """Centre and radius of the main subject (pizza or dough ball).

    The key light comes from the upper left, so the subject's lower-right
    edge is darker and merges with its own cast shadow; a blob centroid
    drifts toward the light and under-reads the radius. Fit the circle only
    on the lit part of the outline instead, then refit once."""
    lab = to_lab(rgb)
    if bd[0] == 'field':
        d = np.linalg.norm(lab - bd[1], axis=-1)
    else:
        d = np.min(np.stack([np.linalg.norm(lab - t, axis=-1) for t in bd[1]], 0), 0)
    m = ndi.binary_opening(d > 18, iterations=2)
    lab_, n = ndi.label(m)
    if n == 0:
        raise ValueError('no subject found')
    sizes = ndi.sum(m, lab_, range(1, n + 1))
    m = ndi.binary_fill_holes(ndi.binary_closing(lab_ == (1 + int(np.argmax(sizes))), iterations=3))
    cy, cx = ndi.center_of_mass(m)
    edge = m & ~ndi.binary_erosion(m, iterations=1)
    ys, xs = np.nonzero(edge)
    xs, ys = xs.astype(np.float64), ys.astype(np.float64)
    for _ in range(2):
        ang = np.degrees(np.arctan2(ys - cy, xs - cx))     # 0 = right, 90 = down
        keep = ~((ang > -25) & (ang < 115))                 # drop the shadowed lower-right arc
        cx, cy, r = _kasa(xs[keep], ys[keep])
        rad = np.hypot(xs - cx, ys - cy)
        ok = keep & (np.abs(rad - r) < 0.06 * r)
        if ok.sum() > 50:
            cx, cy, r = _kasa(xs[ok], ys[ok])
    return cx, cy, r, m


def warp(rgba, cx, cy, scale, n):
    """Map source so (cx, cy) lands in the centre of an n x n frame, scaled."""
    im = Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA')
    # premultiply so bicubic does not drag dark fringes from transparent pixels
    pm = np.asarray(im).astype(F) / 255
    pm[..., :3] *= pm[..., 3:4]
    im = Image.fromarray((pm * 255 + 0.5).astype(np.uint8), 'RGBA')
    inv = 1.0 / scale
    out = im.transform((n, n), Image.AFFINE, (inv, 0, cx - n / 2 * inv, 0, inv, cy - n / 2 * inv),
                       resample=Image.BICUBIC, fillcolor=(0, 0, 0, 0))
    o = np.asarray(out).astype(F) / 255
    a = o[..., 3:4]
    o[..., :3] = np.where(a > 1e-3, o[..., :3] / np.maximum(a, 1e-3), 0)
    if scale > 1.15:
        sharp = Image.fromarray((np.clip(o, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA').filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
        o = np.asarray(sharp).astype(F) / 255
    return o


def save_webp(path, rgba, size=None, q=84, aq=88):
    im = Image.fromarray((np.clip(rgba, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGBA')
    if size and im.size != (size, size):
        im = im.resize((size, size), Image.LANCZOS)
    im.save(path, 'WEBP', quality=q, alpha_quality=aq, method=6)
    return os.path.getsize(path) // 1024


# ---------------------------------------------------------- vitrine -----
def plate(name, src):
    """Load one vitrine frame and return (rgba at source res, circle).

    Colour distance alone cannot matte a pizza on red: the tomato sauce is
    as red as the backdrop. So the subject's body is made solid (the fitted
    disc, slightly inset, joined with the strict colour mask so a handmade,
    wobbly rim keeps its own outline) and only the rim edge and the cast
    shadow take a soft matte."""
    rgb, a_in, has_alpha = load(src)
    bd = backdrop_field(rgb)
    d, alpha = matte(rgb, bd)
    bgf = bg_rgb_field(rgb)
    cx, cy, r, m = subject_circle(rgb, bd)
    h, w = alpha.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(F)
    disc = np.hypot(xx - cx, yy - cy) < r * 0.965
    strict = ndi.binary_opening(d > 26, iterations=1)
    solid = ndi.binary_fill_holes(strict | disc)
    solid = ndi.gaussian_filter(solid.astype(F), 0.8)
    alpha = np.maximum(alpha, solid)
    rgb_c = decontaminate(rgb, alpha, bgf)
    return np.dstack([rgb_c, alpha]), (cx, cy, r), bgf


def vitrine(src_dir, report):
    files = {k: os.path.join(src_dir, k + '.png') for k in VITRINE}
    have = {k: os.path.exists(p) for k, p in files.items()}
    need = [k for k in VITRINE if k != 'v4b-derretendo']
    if not all(have[k] for k in need):
        report['vitrine'] = 'missing: ' + ', '.join(k for k in need if not have[k])
        return None
    plates = {}
    for k in VITRINE:
        if have[k]:
            plates[k] = plate(k, files[k])
            cx, cy, r = plates[k][1]
            log(f'  {k}: centre ({cx:.0f}, {cy:.0f}) radius {r:.0f}px')

    out = {}
    for n, tag in ((DESK, 'd'), (MOB, 'm')):
        target = PIZZA_R * n
        frames = {}
        for k, (rgba, (cx, cy, r), _) in plates.items():
            if k == 'v1-bola':
                # the ball is not the pizza: same camera as V2, centred on the ball
                r2 = plates['v2-massa'][1][2]
                frames[k] = warp(rgba, cx, cy, target / r2, n)
            else:
                frames[k] = warp(rgba, cx, cy, target / r, n)
        out[tag] = frames

    os.makedirs(VT, exist_ok=True)
    names = {'v1-bola': 'ball', 'v2-massa': 'dough', 'v3-molho': 'sauce', 'v4b-derretendo': 'melt',
             'v5-assada': 'baked', 'v6-completa': 'final'}
    for k, nm in names.items():
        if k not in out['d']:
            continue
        kb = [save_webp(os.path.join(VT, f'{nm}-{t}.webp'), out[t][k], q=84 if nm == 'final' else 80) for t in ('d', 'm')]
        log(f'  wrote {nm}: {kb[0]} / {kb[1]} KB')

    # the three handfuls of cheese: what V4 adds over V3
    for t in ('d', 'm'):
        f3, f4 = out[t]['v3-molho'], out[t]['v4-queijo']
        n = f3.shape[0]
        L3, L4 = to_lab(f3[..., :3]), to_lab(f4[..., :3])
        yy, xx = np.mgrid[0:n, 0:n].astype(F)
        rr = np.hypot(xx - n / 2, yy - n / 2) / (PIZZA_R * n)
        chroma4 = np.hypot(L4[..., 1], L4[..., 2])
        cheese = (L4[..., 0] - L3[..., 0] > 12) & (chroma4 < 42) & (L4[..., 0] > 55) & (rr < 0.86)
        cheese = ndi.binary_opening(cheese, iterations=1)
        rng = np.random.default_rng(31)
        cells = int(2600)          # small cells: each handful reads as a sprinkle, not as patches
        seeds = np.stack([rng.uniform(0, n, cells), rng.uniform(0, n, cells)], -1)
        # nearest seed via a coarse grid lookup
        from scipy.spatial import cKDTree
        tree = cKDTree(seeds)
        _, idx = tree.query(np.stack([xx.ravel(), yy.ravel()], -1), k=1)
        part = (idx.reshape(n, n) % 3)
        for k in range(3):
            m = (cheese & (part == k)).astype(F)
            m = ndi.gaussian_filter(m, 0.7)
            layer = np.dstack([f4[..., :3], np.clip(m, 0, 1) * f4[..., 3]])
            save_webp(os.path.join(VT, f'cheese{k + 1}-{t}.webp'), layer, q=74, aq=70)
        log(f'  wrote cheese1-3 ({t}): cheese covers {cheese.mean() * 100:.1f}% of the frame')

    # toppings: what V6 adds over V5, cut out where V6 has them
    sprites_layout = toppings(out, report)
    css = ['/* written by tools/ingest.py from the ChatGPT images. Do not edit by hand. */',
           '.vt { --ball-s: 1; --dough-from: 0.42; }']
    if 'v4b-derretendo' not in out['d']:
        css.append('.L-melt { display: none; }')
    if not sprites_layout:
        css.append('.vt { --drop-mode: frame; } .drops { display: none; }')
        css.append('.L-final { transform: scale(calc(1 + (1 - var(--e)) * 0.06)); }')
    with open(os.path.join(VT, 'frames.css'), 'w') as fh:
        fh.write('\n'.join(css) + '\n')
    report['vitrine'] = 'ok' + ('' if 'v4b-derretendo' in out['d'] else ' (no V4b: the melt layer is skipped)')
    return out


def toppings(out, report):
    f5, f6 = out['d']['v5-assada'], out['d']['v6-completa']
    n = f5.shape[0]
    L5 = to_lab(ndi.gaussian_filter(f5[..., :3], (2.0, 2.0, 0)))
    L6 = to_lab(ndi.gaussian_filter(f6[..., :3], (2.0, 2.0, 0)))
    yy, xx = np.mgrid[0:n, 0:n].astype(F)
    rr = np.hypot(xx - n / 2, yy - n / 2) / (PIZZA_R * n)
    dE = np.linalg.norm(L6 - L5, axis=-1)
    Lc, ac, bc = L6[..., 0], L6[..., 1], L6[..., 2]
    chroma = np.hypot(ac, bc)
    hue = np.degrees(np.arctan2(bc, ac))
    sausage = (ac > 22) & (Lc > 22) & (Lc < 72) & (hue < 55)        # pink-red, not orange cheese
    olive = (Lc < 30) & (chroma < 30)
    onion = (Lc > 66) & (chroma < 22) & (dE > 10)
    cand = (dE > 14) & (sausage | olive | onion) & (rr < 0.92)
    cand = ndi.binary_closing(cand, iterations=2)
    cand = ndi.binary_opening(cand, iterations=2)
    cand = ndi.binary_fill_holes(cand)
    R = PIZZA_R * n
    lab_, cnt = ndi.label(cand)
    # pieces that touch merge into one blob: split them at the necks, one
    # piece per peak of the distance transform
    dist = ndi.distance_transform_edt(cand)
    peaks = (dist == ndi.maximum_filter(dist, size=int(0.10 * R) | 1)) & (dist > 0.025 * R)
    mk, nmk = ndi.label(ndi.binary_dilation(peaks, iterations=2))
    if nmk:
        idx = ndi.distance_transform_edt(mk == 0, return_distances=False, return_indices=True)
        nearest = mk[idx[0], idx[1]]
        big = np.isin(lab_, [i for i, a in enumerate(ndi.sum(cand, lab_, range(1, cnt + 1)), start=1) if a > 0.05 * R * R])
        split = np.where(big & cand, nearest + cnt, lab_)
        lab_, cnt = ndi.label(split > 0)
        lab_ = np.where(cand, split, 0)
        ids = np.unique(lab_[lab_ > 0])
        remap = np.zeros(lab_.max() + 1, np.int32)
        remap[ids] = np.arange(1, len(ids) + 1)
        lab_ = remap[lab_]
        cnt = len(ids)
    areas = ndi.sum(cand, lab_, range(1, cnt + 1))
    sprites = []
    for i, ar in enumerate(areas, start=1):
        if ar < 0.004 * R * R or ar > 0.07 * R * R:
            continue
        sl = ndi.find_objects((lab_ == i).astype(np.uint8))[0]
        y0, y1 = max(0, sl[0].start - 6), min(n, sl[0].stop + 6)
        x0, x1 = max(0, sl[1].start - 6), min(n, sl[1].stop + 6)
        m = ndi.binary_dilation(lab_[y0:y1, x0:x1] == i, iterations=2).astype(F)
        m = ndi.gaussian_filter(m, 0.9)
        rgba = np.dstack([f6[y0:y1, x0:x1, :3], np.clip(m, 0, 1) * f6[y0:y1, x0:x1, 3]])
        cy, cx = ndi.center_of_mass(lab_ == i)
        kind = 'azeitona' if olive[lab_ == i].mean() > 0.5 else ('cebola' if onion[lab_ == i].mean() > 0.4 else 'calabresa')
        sprites.append(dict(kind=kind, rgba=rgba, x0=x0, y0=y0, w=x1 - x0, h=y1 - y0, cx=cx, cy=cy))
    log(f'  toppings found in V6: {len(sprites)} ' +
        f"({sum(s['kind'] == 'calabresa' for s in sprites)} calabresa, {sum(s['kind'] == 'cebola' for s in sprites)} cebola, {sum(s['kind'] == 'azeitona' for s in sprites)} azeitona)")
    if len(sprites) < 6:
        report['toppings'] = f'only {len(sprites)} toppings separated from V6: the page drops the whole V6 frame instead'
        with open(os.path.join(VT, 'layout.json'), 'w') as fh:
            json.dump(dict(frame=n, atlas=[1, 1], sprites=[]), fh)
        return None
    # pack (desktop pixels); phones use the same atlas scaled
    order = sorted(range(len(sprites)), key=lambda i: -sprites[i]['h'])
    AW, x, y, rowh = 1024, 0, 0, 0
    for i in order:
        s = sprites[i]
        if x + s['w'] > AW:
            x, y, rowh = 0, y + rowh + 2, 0
        s['ax'], s['ay'] = x, y
        x += s['w'] + 2
        rowh = max(rowh, s['h'])
    AH = y + rowh
    atlas = np.zeros((AH, AW, 4), F)
    for s in sprites:
        atlas[s['ay']:s['ay'] + s['h'], s['ax']:s['ax'] + s['w']] = s['rgba']
    im = Image.fromarray((atlas * 255 + 0.5).astype(np.uint8), 'RGBA')
    im.save(os.path.join(VT, 'sprites-d.webp'), 'WEBP', quality=84, alpha_quality=88, method=6)
    im.resize((round(AW * MOB / DESK), round(AH * MOB / DESK)), Image.LANCZOS).save(
        os.path.join(VT, 'sprites-m.webp'), 'WEBP', quality=84, alpha_quality=88, method=6)
    rank = {'calabresa': 0, 'cebola': 1, 'azeitona': 2}
    seq = sorted(sprites, key=lambda s: (rank[s['kind']], -math.hypot(s['cx'] - n / 2, s['cy'] - n / 2)))
    layout = dict(frame=n, atlas=[AW, AH], sprites=[dict(
        kind=s['kind'], x=round((s['x0'] + s['w'] / 2) / n, 5), y=round((s['y0'] + s['h'] / 2) / n, 5),
        w=round(s['w'] / n, 5), h=round(s['h'] / n, 5), box=[s['ax'], s['ay'], s['w'], s['h']]) for s in seq])
    with open(os.path.join(VT, 'layout.json'), 'w') as fh:
        json.dump(layout, fh, indent=1)
    report['toppings'] = f'{len(sprites)} pieces will fall and land where V6 has them'
    return layout


# ------------------------------------------------------------- props ----
def props(src_dir, report):
    done = []
    for src, name in PROPS.items():
        p = os.path.join(src_dir, src + '.png')
        if not os.path.exists(p):
            continue
        rgb, a_in, has_alpha = load(p)
        if has_alpha:
            alpha = a_in
            rgb_c = rgb
        else:
            bd = backdrop_field(rgb, kind='auto')
            d, alpha = matte(rgb, bd, lo=8, hi=20)
            if bd[0] == 'field':
                rgb_c = decontaminate(rgb, alpha, bg_rgb_field(rgb))
            else:
                rgb_c = rgb
        # trim to the object, square, with room for its shadow
        ys, xs = np.nonzero(alpha > 0.05)
        if len(xs) == 0:
            continue
        cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
        side = max(xs.max() - xs.min(), ys.max() - ys.min()) * 1.22
        rgba = np.dstack([rgb_c, alpha])
        frame = warp(rgba, cx, cy, 900 / side, 900)
        if name != 'flour':
            # one hard key from the upper left: shadow to the lower right
            a = frame[..., 3]
            sh = ndi.shift(a, (900 * 0.035, 900 * 0.035), order=1)
            sh = ndi.gaussian_filter(sh, 6) * 0.5
            out_a = a + sh * (1 - a)
            out_rgb = frame[..., :3] * (a / np.maximum(out_a, 1e-4))[..., None]
            frame = np.dstack([out_rgb, out_a])
        for px, tag in ((560, 'd'), (360, 'm')):
            save_webp(os.path.join(VT, f'prop-{name}-{tag}.webp'), frame, size=px, q=82, aq=85)
        if name in ('basil', 'tomatoes'):
            pm = frame.copy(); pm[..., :3] *= pm[..., 3:4]
            pm = np.stack([ndi.gaussian_filter(pm[..., c], 16) for c in range(4)], -1)
            pm[..., :3] /= np.maximum(pm[..., 3:4], 1e-4)
            for px, tag in ((560, 'd'), (360, 'm')):
                save_webp(os.path.join(VT, f'prop-{name}-blur-{tag}.webp'), pm, size=px, q=78, aq=80)
        done.append(name)
    report['props'] = ', '.join(done) if done else 'none found'


# -------------------------------------------------------------- menu ----
def menu(src_dir, report):
    done = []
    for slug in MENU_SLUGS:
        p = os.path.join(src_dir, f'm-{slug}.png')
        if not os.path.exists(p):
            continue
        rgb, a_in, has_alpha = load(p)
        bd = backdrop_field(rgb)
        d, alpha = matte(rgb, bd, lo=5, hi=16)
        rgb_c = decontaminate(rgb, alpha, bg_rgb_field(rgb))
        lab = to_lab(rgb)
        m = (d > 14)
        m = ndi.binary_opening(m, iterations=2)
        lab_, cnt = ndi.label(m)
        sizes = ndi.sum(m, lab_, range(1, cnt + 1))
        m = ndi.binary_fill_holes(lab_ == (1 + int(np.argmax(sizes))))
        cy, cx = ndi.center_of_mass(m)
        r = math.sqrt(m.sum() / math.pi)
        frame = warp(np.dstack([rgb_c, alpha]), cx, cy, (0.44 * 520) / r, 520)
        save_webp(os.path.join(MENU, f'{slug}.webp'), frame, q=82, aq=85)
        done.append(slug)
    report['menu'] = f'{len(done)}/11' + ('' if len(done) == 11 else ' (missing: ' + ', '.join(s for s in MENU_SLUGS if s not in done) + ')')


# --------------------------------------------------------------- share ----
def share(src_dir, report):
    p = os.path.join(src_dir, 's1-compartilhar.png')
    if not os.path.exists(p):
        report['share'] = 'missing'
        return
    im = Image.open(p).convert('RGB')
    w, h = im.size
    th = int(round(w * 630 / 1200))
    top = max(0, (h - th) // 2)
    im.crop((0, top, w, top + th)).resize((1200, 630), Image.LANCZOS).save(
        os.path.join(ROOT, 'assets', 'og.jpg'), 'JPEG', quality=84, optimize=True, progressive=True)
    report['share'] = 'ok'


def inline_layout():
    """Put layout.json into index.html so the page needs no extra request."""
    page = os.path.join(ROOT, 'index.html')
    lay = os.path.join(VT, 'layout.json')
    if not (os.path.exists(page) and os.path.exists(lay)):
        return
    with open(lay) as fh:
        data = json.dumps(json.load(fh), separators=(',', ':'))
    with open(page) as fh:
        html = fh.read()
    html2 = re.sub(r'(<script type="application/json" id="drops-layout">)(.*?)(</script>)',
                   lambda m: m.group(1) + data + m.group(3), html, flags=re.S)
    if html2 != html:
        with open(page, 'w') as fh:
            fh.write(html2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default=SRC)
    ap.add_argument('--check', action='store_true')
    ap.add_argument('--out', default=None, help='write to OUT/vt and OUT/menu instead of assets/ (for tests)')
    args = ap.parse_args()
    global VT, MENU
    if args.out:
        VT = os.path.join(os.path.abspath(args.out), 'vt')
        MENU = os.path.join(os.path.abspath(args.out), 'menu')
    os.makedirs(VT, exist_ok=True)
    os.makedirs(MENU, exist_ok=True)
    src = os.path.abspath(args.src)
    found = sorted(f for f in os.listdir(src) if f.lower().endswith('.png')) if os.path.isdir(src) else []
    log(f'reading {src}: {len(found)} PNG file(s)')
    if args.check:
        want = [k + '.png' for k in VITRINE] + [f'm-{s}.png' for s in MENU_SLUGS] + [k + '.png' for k in PROPS] + ['s1-compartilhar.png']
        for w in want:
            log(('  ok      ' if w in found else '  missing ') + w)
        return
    report = {}
    log('vitrine'); vitrine(src, report)
    log('props'); props(src, report)
    log('menu'); menu(src, report)
    share(src, report)
    if not args.out:
        inline_layout()
    log('\nresult')
    for k, v in report.items():
        log(f'  {k:9s} {v}')


if __name__ == '__main__':
    main()
