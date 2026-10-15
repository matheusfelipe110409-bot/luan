#!/usr/bin/env python3
"""
cardapio: the menu, from the pizzeria's own Anotaí store.

    python3 tools/cardapio.py           reads dados/anotai-menu.txt, rewrites
                                        the marked blocks of index.html and
                                        writes dados/cardapio.json

dados/anotai-menu.txt is the store's menu as the Anotaí API served it
(pedido.anota.ai/loja/anotaai-planeta-pizza), one line per record:

    C|categoria|tipo
    I|produto|descrição|preço|preço mínimo|X se pausado|passos
    A|id do complemento|título|tipo
    O|opção|descrição|preço|X se pausada

Nothing here adds a product, a price or a description. It only tidies the
spelling of option labels (Crean cheese, Acrésscimo) and leaves out what the
store has paused. Photos are matched by flavour, and only where the photo
shows that flavour.
"""
import html
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'dados', 'anotai-menu.txt')
PAGE = os.path.join(ROOT, 'index.html')
OUT = os.path.join(ROOT, 'dados', 'cardapio.json')

# A flavour's photo is assets/menu/<id>.webp, made by tools/ingest.py from
# m-<id>.png (PROMPTS-CHATGPT.md). Until it arrives, the provisional pictures
# already on the site stand in under their old names; a flavour with neither
# shows no photo.
ANTIGAS = {'mucarela': 'mussarela', '4-queijos': 'quatro-queijos', 'banana': 'banana-canela'}
ALT = {
    'mucarela': 'Pizza de muçarela com tomate e azeitona, vista de cima',
    'marguerita': 'Pizza marguerita com tomate e manjericão, vista de cima',
    'calabresa': 'Pizza de calabresa com cebola e azeitona, vista de cima',
    'frango-catupiry': 'Pizza de frango com catupiry, vista de cima',
    '4-queijos': 'Pizza quatro queijos, vista de cima',
    'banana': 'Pizza de banana com canela, vista de cima',
}


def foto(r):
    for nome in (r['id'], ANTIGAS.get(r['id'])):
        if nome and os.path.exists(os.path.join(ROOT, 'assets', 'menu', nome + '.webp')):
            return nome, ALT.get(r['id'], 'Pizza %s, vista de cima' % r['nome'])
    return None
DESTAQUES = ['calabresa', 'mucarela', 'frango-catupiry', '4-queijos', 'banana']

# what the site calls each Anotaí category
SECOES = [
    # id, tab, title, note, kind
    ('salgadas', 'Salgadas', 'Pizzas salgadas', '8 fatias. Pode ser meio a meio: vale o preço do sabor mais caro.', 'salgada'),
    ('doces', 'Doces', 'Pizzas doces', '8 fatias. Pode ser meio a meio: vale o preço do sabor mais caro.', 'doce'),
    ('esfihas', 'Esfihas', 'Esfihas', None, 'esfiha'),
    ('cone', 'Planeta Cone', 'Planeta Cone', None, 'cone'),
    ('bebidas', 'Bebidas', 'Bebidas', None, 'bebida'),
]


def slug(s):
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def money(v):
    return 'R$ ' + ('%.2f' % v).replace('.', ',')


def num(s):
    return float(s) if s else 0.0


def frase(s):
    s = re.sub(r'\s+,', ',', s.strip())
    s = re.sub(r',(?=\S)', ', ', s)
    s = s.replace('brocólis', 'brócolis')
    return s if not s or s.endswith('.') else s + '.'


def parse(path):
    cats, aux = [], {}
    cur = None
    for line in open(path, encoding='utf-8').read().split('\n'):
        f = line.split('|')
        if f[0] == 'C':
            cats.append({'titulo': f[1], 'tipo': f[2], 'itens': []})
        elif f[0] == 'I':
            steps = []
            for s in filter(None, f[6].split(';')):
                a, mn, mx, pm = s.split(',')
                steps.append({'complemento': a, 'min': int(mn), 'max': int(mx), 'price_model': int(pm)})
            cats[-1]['itens'].append({'titulo': f[1], 'descricao': f[2], 'preco': num(f[3]),
                                      'preco_minimo': num(f[4]), 'pausado': f[5] == 'X', 'passos': steps})
        elif f[0] == 'A':
            cur = aux[f[1]] = {'titulo': f[2].strip(), 'tipo': f[3], 'opcoes': []}
        elif f[0] == 'O':
            cur['opcoes'].append({'titulo': f[1], 'descricao': f[2], 'preco': num(f[3]), 'pausada': f[4] == 'X'})
    return cats, aux


def cat(cats, titulo):
    return [c for c in cats if c['titulo'] == titulo][0]


def step_aux(aux, item, i):
    return aux[item['passos'][i]['complemento']]


def tidy_borda(t):
    t = re.sub(r'^Borda (de )?', '', t)
    t = t.replace('Crean', 'Cream')
    return t[0].upper() + t[1:].lower() if t.lower() != t else t


def tidy_acrescimo(t):
    t = re.sub(r'^Acr[ée]s*cimo (de )?', '', t, flags=re.I)
    return t[0].upper() + t[1:].lower()


def tidy_molho(t):
    t = t.replace('Rose', 'rosé').replace('c/', 'com')
    return t[0] + t[1:].lower()


def opts(a, tidy):
    return [[tidy(o['titulo']), int(o['preco']) if o['preco'] % 1 == 0 else o['preco']]
            for o in a['opcoes'] if not o['pausada']]


def build(cats, aux):
    salgada = cat(cats, 'Pizza Salgada')['itens'][0]
    meio = cat(cats, 'Pizzas Meio a Meio')['itens'][0]
    doce = cat(cats, 'Pizza Doce')['itens'][0]
    sab_s, borda_s, adic_s = (step_aux(aux, salgada, i) for i in range(3))
    sab_m, adic_m, borda_m = (step_aux(aux, meio, i) for i in range(3))
    sab_d, borda_d = (step_aux(aux, doce, i) for i in range(2))

    # the site offers meio a meio inside each flavour, with one set of lists.
    # That only holds if Anotaí's meio a meio product uses the same flavours,
    # bordas and acréscimos at the same prices: check, never assume.
    key = lambda l: sorted((n, p) for n, p in l)
    sab_whole = [(o['titulo'], o['preco']) for o in sab_s['opcoes'] + sab_d['opcoes']]
    assert key(sab_whole) == key((o['titulo'], o['preco']) for o in sab_m['opcoes']), 'meio a meio flavours differ'
    assert key(opts(borda_s, tidy_borda)) == key(opts(borda_m, tidy_borda)), 'meio a meio bordas differ'
    assert key(opts(adic_s, tidy_acrescimo)) == key(opts(adic_m, tidy_acrescimo)), 'meio a meio acréscimos differ'
    assert salgada['passos'][0]['price_model'] == 2 and meio['passos'][0]['price_model'] == 2, 'pizza price model changed'
    assert meio['passos'][0]['max'] == 2, 'meio a meio is no longer two flavours'
    assert doce['passos'] and len(doce['passos']) == 2, 'pizza doce gained or lost a step'

    rows = {k: [] for _, _, _, _, k in SECOES}
    for o in sab_s['opcoes']:
        if not o['pausada']:
            rows['salgada'].append({'id': slug(o['titulo']), 'nome': o['titulo'], 'desc': frase(o['descricao']), 'preco': o['preco']})
    for o in sab_d['opcoes']:
        if not o['pausada']:
            rows['doce'].append({'id': slug(o['titulo']), 'nome': o['titulo'], 'desc': frase(o['descricao']), 'preco': o['preco']})
    for it in cat(cats, 'Esfihas')['itens']:
        if not it['pausado']:
            rows['esfiha'].append({'id': slug(it['titulo']), 'nome': it['titulo'], 'desc': frase(it['descricao']), 'preco': it['preco']})
    cone = cat(cats, 'Planeta Cone')['itens']
    molho = adic_cone = None
    for it in cone:
        if it['pausado']:
            continue
        a = [aux[s['complemento']] for s in it['passos']]
        assert [x['titulo'] for x in a] == ['Escolha o molho', 'Acréscimo'], 'cone steps changed: ' + it['titulo']
        assert it['passos'][0]['min'] == 1 and it['passos'][0]['max'] == 1
        molho, adic_cone = a
        nome = re.sub(r'( no Cone)+$', ' no Cone', it['titulo'])
        rows['cone'].append({'id': slug(nome), 'nome': nome, 'desc': 'Com 1 molho à escolha.', 'preco': it['preco']})
    for it in cat(cats, 'Refrigerantes')['itens']:
        if it['pausado']:
            continue
        nome = re.sub(r'(\d)l$', r'\1 L', it['titulo']).replace('Coca Cola', 'Coca-Cola').replace(' Gás', ' gás')
        rows['bebida'].append({'id': slug(nome), 'nome': nome, 'desc': '', 'preco': it['preco']})

    seen = set()
    for k, lst in rows.items():
        for r in lst:
            assert r['id'] not in seen, 'duplicate id ' + r['id']
            seen.add(r['id'])

    opcoes = {
        'bordas': {'pizza': opts(borda_s, tidy_borda), 'doce': opts(borda_d, tidy_borda)},
        'acrescimos': {'pizza': opts(adic_s, tidy_acrescimo)},
        'cone': {'molhos': [m for m, _ in opts(molho, tidy_molho)], 'acrescimos': opts(adic_cone, tidy_molho)},
    }
    pausados = [it['titulo'] for c in cats for it in c['itens'] if it['pausado']]
    pausados += [a['titulo'] + ': ' + o['titulo'] for a in aux.values() for o in a['opcoes'] if o['pausada']]
    return rows, opcoes, pausados


def e(s):
    return html.escape(s, quote=True)


def item_html(r, kind):
    img = foto(r) if kind in ('salgada', 'doce') else None
    attrs = 'class="item%s" data-item="%s" data-name="%s" data-price="%.2f" data-kind="%s"' % (
        '' if img else ' item--plain', r['id'], e(r['nome']), r['preco'], kind)
    if img:
        attrs += ' data-img="assets/menu/%s.webp"' % img[0]
    out = ['          <li %s>' % attrs,
           '            <div class="item__txt">',
           '              <h4 class="item__name"><button class="item__open" type="button" data-open="%s" aria-haspopup="dialog">%s</button></h4>' % (r['id'], e(r['nome']))]
    if r['desc']:
        out.append('              <p class="item__desc">%s</p>' % e(r['desc']))
    out.append('              <p class="item__price">%s</p>' % money(r['preco']))
    out.append('            </div>')
    if img:
        out.append('            <img class="item__img" src="assets/menu/%s.webp" alt="%s" width="520" height="520" loading="lazy" decoding="async">' % (img[0], e(img[1])))
    out.append('          </li>')
    return out


def menu_html(rows):
    out = ['      <nav class="tabs" aria-label="Categorias do cardápio">',
           '        <div class="tabs__track wrap">']
    for i, (sid, tab, _, _, _) in enumerate(SECOES):
        out.append('          <a href="#%s" class="tab"%s>%s</a>' % (sid, ' aria-current="true"' if i == 0 else '', tab))
    out += ['        </div>', '      </nav>', '', '      <div class="wrap menu">']
    for sid, _, title, note, kind in SECOES:
        out.append('      <section id="%s" class="cat" aria-labelledby="h-%s" data-cat>' % (sid, sid))
        out.append('        <h3 id="h-%s" class="cat__title">%s</h3>' % (sid, title))
        if note:
            out.append('        <p class="cat__note">%s</p>' % note)
        out.append('        <ul class="items" role="list">')
        for r in rows[kind]:
            out += item_html(r, kind)
        out += ['        </ul>', '      </section>']
    return out


def rail_html(rows):
    by = {r['id']: r for k in ('salgada', 'doce') for r in rows[k]}
    out = []
    for sid in DESTAQUES:
        r, img = by[sid], foto(by[sid])
        out += ['          <li><button class="card" type="button" data-open="%s" aria-haspopup="dialog">' % sid,
                '            <img class="card__img" src="assets/menu/%s.webp" alt="" width="520" height="520" loading="lazy" decoding="async">' % img[0],
                '            <span class="card__name">%s</span>' % e(r['nome']),
                '            <span class="card__price">%s</span>' % money(r['preco']),
                '          </button></li>']
    return out


def splice(page, name, lines):
    a, b = '<!-- %s:inicio -->' % name, '<!-- %s:fim -->' % name
    i, j = page.index(a), page.index(b)
    indent = page[page.rindex('\n', 0, i) + 1:i]
    return page[:i + len(a)] + '\n' + '\n'.join(lines) + '\n' + indent + page[j:]


def main():
    cats, aux = parse(SRC)
    rows, opcoes, pausados = build(cats, aux)
    page = open(PAGE, encoding='utf-8').read()
    page = splice(page, 'destaques', rail_html(rows))
    page = splice(page, 'cardapio', menu_html(rows))
    page = splice(page, 'opcoes', ['<script type="application/json" id="planeta-opcoes">' +
                                   json.dumps(opcoes, ensure_ascii=False, separators=(',', ':')) + '</script>'])
    open(PAGE, 'w', encoding='utf-8').write(page)
    json.dump({'fonte': 'https://pedido.anota.ai/loja/anotaai-planeta-pizza', 'secoes': [
        {'id': sid, 'titulo': title, 'itens': rows[kind]} for sid, _, title, _, kind in SECOES],
        'opcoes': opcoes, 'pausados_na_anotai': pausados},
        open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for sid, _, title, _, kind in SECOES:
        print('%-16s %2d itens' % (title, len(rows[kind])))
    print('pausados na Anotaí (fora do site):', '; '.join(pausados) or 'nenhum')
    low = min(r['preco'] for k in ('salgada', 'doce') for r in rows[k])
    print('pizza mais barata:', money(low))


if __name__ == '__main__':
    sys.exit(main())
