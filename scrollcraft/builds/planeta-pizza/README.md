# Planeta Pizza · cardápio online (demo)

Site estático, sem build: `index.html`, `site.css`, `site.js` e o motor do
ScrollCraft (`scrollcraft.js` / `scrollcraft.css`, sem edição).

## Ver

Abra `index.html` no navegador, ou sirva a pasta:

```bash
node ../../../.claude/skills/scroll-craft/scripts/serve.mjs --root . --port 4600
```

## As imagens do ChatGPT

1. Gere com `PROMPTS-CHATGPT.md` e envie pelo GitHub (raiz do `main`).
2. Copie para `assets/src/` com os nomes do prompt (`assets/src/ORIGENS.md`
   tem a tabela de cada arquivo enviado).
3. Rode `python3 tools/ingest.py` (vitrine, cardápio, ingredientes) e depois
   `python3 tools/scenes.py` (queijo puxando, caixa, motoboy, rua, capa).
   Precisam de `numpy`, `scipy`, `pillow`.

O `ingest.py` alinha a sequência pelo contorno da pizza, tira o fundo
vermelho mantendo as sombras, separa o queijo em três punhados e recorta cada
ingrediente da V6 para cair no lugar certo. O `scenes.py` alinha a fatia
levantada com a pizza inteira, encaixa a caixa fechada no contorno da aberta e
recorta o motoboy. `--check` no ingest mostra o que falta.

Já são fotos do ChatGPT: a vitrine inteira (V1 a V6), o queijo puxando, a
caixa, o motoboy, a rua, a capa da loja e a calabresa do cardápio. Ainda são
provisórios: as outras fotos do cardápio (M), os ingredientes soltos da
vitrine (P) e a imagem de compartilhamento (S).

## Partes da página

1. **Vitrine**: a pizza se monta no scroll, a comanda imprime e leva o
   carimbo; fecha em "Pizzas a partir de R$ 38".
2. **Puxa**: a fatia sobe e o queijo estica.
3. **Loja**: capa, busca, destaques, abas e itens no formato dos apps de
   delivery. Cada item abre uma janela com meio a meio, borda, observação e
   quantidade.
4. **Entrega**: a caixa fecha, leva o carimbo, vira a bag do motoboy e ele
   atravessa a rua.
5. **Comanda**: o pedido do visitante (também abre como gaveta pelo botão
   "Ver comanda").

## O que é de exemplo e precisa ser confirmado com a pizzaria

- **Preços** e sabores: no `index.html` (cada item tem o preço no texto e em
  `data-price`). As bordas recheadas (+ R$ 8,00) estão em `BORDAS` no
  `site.js`. A regra do meio a meio (vale o sabor mais caro) também.
- **Horário**: `HOURS` no começo do `site.js` (o selo "Aberto agora" usa o
  horário de Brasília).
- **Logo**: provisório (`assets/logo.svg` e o símbolo `#i-mark` no
  `index.html`). Trocar pelo logo real.
- **Cor**: o vermelho está em `--red` no topo do `site.css`. Ajustar pelo logo.
- **Textos** com promessas da casa ("massa aberta na hora", "molho da casa"):
  confirmar com o dono.
- O botão final de pedido mostra um aviso de demonstração: o carrinho e o
  checkout são a próxima etapa.
