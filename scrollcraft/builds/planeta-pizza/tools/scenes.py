#!/usr/bin/env python3
"""
scenes: the ChatGPT images for the acts after the vitrine (see
PROMPTS-CHATGPT.md, groups Q, E and L). Like ingest.py, nothing here draws
food; it aligns, crops and encodes.

    python3 tools/scenes.py                 reads assets/src/, writes assets/scene/
    python3 tools/scenes.py --src some/dir

Inputs (any missing group is skipped and its act stays off the page):
    q1-fatia q2-puxando                    the slice lifts, the cheese stretches
    e1-caixa-aberta e2-caixa-fechada       the lid closes
    e3-motoboy e4-rua                      the ride (E3 with real alpha)
    l1-capa                                the store cover

    Also writes assets/menu/calabresa.webp from the vitrine's final frame
    (V6 is the house calabresa), once ingest.py has run.
"""
import argparse
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'assets', 'src')
OUT = os.path.join(ROOT, 'assets', 'scene')
F = np.float32


def log(*a):
    print(*a, flush=True)


def save(im, name, width=None, q=78, aq=85):
    if width and im.size[0] != width:
        im = im.resize((width, round(im.size[1] * width / im.size[0])), Image.LANCZOS)
    path = os.path.join(OUT, name)
    im.save(path, 'WEBP', quality=q, alpha_quality=aq, method=6)
    kb = os.path.getsize(path) // 1024
    log(f'  wrote {name} {im.size[0]}x{im.size[1]} {kb} KB')


def grey(im):
    return np.asarray(im.convert('L'), dtype=F)


def best_shift(a, b, region, span=40, step=2):
    """Integer (dy, dx) that moves b onto a inside region, by brute force."""
    best = None
    for dy in range(-span, span + 1, step):
        for dx in range(-span // 2, span // 2 + 1, step):
            bb = np.roll(np.roll(b, dy, 0), dx, 1)
            e = float(np.mean(np.abs(a[region] - bb[region])))
            if best is None or e < best[0]:
                best = (e, dy, dx)
    return best


def box_edges(im):
    """Outer edges of a top-down pizza box: the strongest straight gradients."""
    L = np.asarray(im.convert('RGB'), dtype=F).mean(2)
    h, w = L.shape
    gy = np.abs(np.diff(L, axis=0))[:, int(w * 0.2):int(w * 0.8)].mean(1)
    gx = np.abs(np.diff(L, axis=1))[int(h * 0.2):int(h * 0.8)].mean(0)
    top = int(np.argmax(gy[:h // 4]))
    bottom = h // 2 + int(np.argmax(gy[h // 2:]))
    left = int(np.argmax(gx[:w // 6]))
    right = w - w // 6 + int(np.argmax(gx[w - w // 6:]))
    return left, top, right, bottom


def pull(src):
    a, b = os.path.join(src, 'q1-fatia.png'), os.path.join(src, 'q2-puxando.png')
    if not (os.path.exists(a) and os.path.exists(b)):
        return 'missing'
    q1, q2 = Image.open(a).convert('RGB'), Image.open(b).convert('RGB')
    if q2.size != q1.size:
        q2 = q2.resize(q1.size, Image.LANCZOS)
    w, h = q1.size
    # the pizza's near rim (lower left) is untouched by the edit: align on it
    region = (slice(int(h * 0.6), h), slice(0, int(w * 0.48)))
    e, dy, dx = best_shift(grey(q1), grey(q2), region)
    log(f'  q2 aligned to q1 by ({dx}, {dy}) px')
    q2 = q2.transform(q2.size, Image.AFFINE, (1, 0, -dx, 0, 1, -dy), Image.BICUBIC)
    for im, nm in ((q1, 'pull-1'), (q2, 'pull-2')):
        save(im, f'{nm}-d.webp', 1024, q=76)
        save(im, f'{nm}-m.webp', 720, q=74)
    return 'ok'


def box(src):
    a, b = os.path.join(src, 'e1-caixa-aberta.png'), os.path.join(src, 'e2-caixa-fechada.png')
    if not (os.path.exists(a) and os.path.exists(b)):
        return 'missing'
    e1, e2 = Image.open(a).convert('RGB'), Image.open(b).convert('RGB')
    if e2.size != e1.size:
        e2 = e2.resize(e1.size, Image.LANCZOS)
    r1, r2 = box_edges(e1), box_edges(e2)
    log(f'  box open {r1}, closed {r2}')
    sx = (r1[2] - r1[0]) / max(r2[2] - r2[0], 1)
    sy = (r1[3] - r1[1]) / max(r2[3] - r2[1], 1)
    if abs(sx - 1) > 0.08 or abs(sy - 1) > 0.08:
        log('  box edges disagree by more than 8%, closed box left as is')
        sx = sy = 1.0
        r2 = r1
    # map the closed box onto the open box's outline
    inv = (1 / sx, 0, r2[0] - r1[0] / sx, 0, 1 / sy, r2[1] - r1[1] / sy)
    e2 = e2.transform(e2.size, Image.AFFINE, inv, Image.BICUBIC)
    for im, nm in ((e1, 'box-open'), (e2, 'box-shut')):
        save(im, f'{nm}-d.webp', 1024, q=76)
        save(im, f'{nm}-m.webp', 720, q=74)
    w, h = e1.size
    return {'box': [round(r1[0] / w, 4), round(r1[1] / h, 4), round(r1[2] / w, 4), round(r1[3] / h, 4)]}


def ride(src):
    a, b = os.path.join(src, 'e3-motoboy.png'), os.path.join(src, 'e4-rua.png')
    if not (os.path.exists(a) and os.path.exists(b)):
        return 'missing'
    m = Image.open(a)
    if m.mode != 'RGBA' or m.getchannel('A').getextrema()[0] > 8:
        return 'e3-motoboy has no transparent background (ask for the grey version and cut it)'
    m = m.convert('RGBA')
    al = np.asarray(m.getchannel('A'))
    ys, xs = np.nonzero(al > 8)
    pad = 8
    bbox = (max(xs.min() - pad, 0), max(ys.min() - pad, 0), min(xs.max() + pad + 1, m.size[0]), min(ys.max() + pad + 1, m.size[1]))
    m = m.crop(bbox)
    log(f'  rider cut to {m.size}')
    save(m, 'rider-d.webp', min(1100, m.size[0]), q=80, aq=88)
    save(m, 'rider-m.webp', 640, q=78, aq=86)
    st = Image.open(b).convert('RGB')
    save(st, 'street-d.webp', 1536, q=72)
    save(st, 'street-m.webp', 1152, q=70)
    return 'ok'


def cover(src):
    a = os.path.join(src, 'l1-capa.png')
    if not os.path.exists(a):
        return 'missing'
    im = Image.open(a).convert('RGB')
    save(im, 'cover-d.webp', 1536, q=76)
    save(im, 'cover-m.webp', 900, q=74)
    return 'ok'


def menu_calabresa():
    """The menu's calabresa is the vitrine's own finished pizza."""
    p = os.path.join(ROOT, 'assets', 'vt', 'final-d.webp')
    if not os.path.exists(p):
        return 'missing'
    im = Image.open(p).convert('RGBA')
    n = im.size[0]
    # the menu sits on a light card: keep the pizza and the shadow right under
    # it, drop the flour scattered on the red board
    a = np.asarray(im).astype(F)
    yy, xx = np.mgrid[0:n, 0:n].astype(F)
    rr = np.hypot(xx - n / 2 - n * 0.008, yy - n / 2 - n * 0.008) / (0.43 * n)
    keep = np.clip((1.045 - rr) / 0.03, 0, 1)
    a[..., 3] *= keep
    im = Image.fromarray(a.round().astype(np.uint8), 'RGBA')
    s = (0.44 * 520) / (0.43 * n)                 # menu frames: radius 0.44, vitrine: 0.43
    k = round(n * s)
    im = im.resize((k, k), Image.LANCZOS)
    o = (k - 520) // 2
    im = im.crop((o, o, o + 520, o + 520))
    im.save(os.path.join(ROOT, 'assets', 'menu', 'calabresa.webp'), 'WEBP', quality=82, alpha_quality=85, method=6)
    return 'ok'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default=SRC)
    args = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    src = os.path.abspath(args.src)
    report = {}
    log('pull'); report['pull'] = pull(src)
    log('box'); report['box'] = box(src)
    log('ride'); report['ride'] = ride(src)
    log('cover'); report['cover'] = cover(src)
    report['menu calabresa'] = menu_calabresa()
    log('\nresult')
    for k, v in report.items():
        log(f'  {k:15s} {v}')


if __name__ == '__main__':
    main()
