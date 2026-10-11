# Planeta Pizza · cardápio online (demo)

Site estático, sem build: `index.html`, `site.css`, `site.js` e o motor do
ScrollCraft (`scrollcraft.js` / `scrollcraft.css`, sem edição).

## Ver

Abra `index.html` no navegador, ou sirva a pasta:

```bash
node ../../../.claude/skills/scroll-craft/scripts/serve.mjs --root . --port 4600
```

## Trocar as imagens pelas do ChatGPT

1. Gere as imagens com `PROMPTS-CHATGPT.md` e salve com os nomes indicados.
2. Coloque os PNG em `assets/src/`.
3. Rode `python3 tools/ingest.py` (precisa de `numpy`, `scipy`, `pillow`).

O script alinha a sequência pelo contorno da pizza, tira o fundo vermelho
mantendo as sombras, separa o queijo em três punhados e recorta cada
ingrediente da V6 para cair no lugar certo. `python3 tools/ingest.py --check`
mostra o que falta.

As imagens que estão no site agora são **provisórias**: servem só para o site
funcionar até as do ChatGPT chegarem.

## O que é de exemplo e precisa ser confirmado com a pizzaria

- **Preços** e sabores: no `index.html` (cada item tem o preço no texto e em
  `data-price`).
- **Horário**: `HOURS` no começo do `site.js` (o selo "Aberto agora" usa o
  horário de Brasília).
- **Logo**: provisório (`assets/logo.svg` e o símbolo `#i-mark` no
  `index.html`). Trocar pelo logo real.
- **Cor**: o vermelho está em `--red` no topo do `site.css`. Ajustar pelo logo.
- **Textos** com promessas da casa ("massa aberta na hora", "molho da casa"):
  confirmar com o dono.
- O botão final de pedido mostra um aviso de demonstração: o carrinho e o
  checkout são a próxima etapa.
