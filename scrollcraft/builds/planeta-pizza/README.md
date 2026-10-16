# Planeta Pizza · cardápio online

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

Já são fotos do ChatGPT: a vitrine inteira (V1 a V6), a caixa, o motoboy, a
rua, a capa da loja e a calabresa do cardápio. As outras pizzas do cardápio
são ilustrações provisórias, todas no mesmo estilo e com os ingredientes da
descrição de cada sabor na Anotaí. A Calabresa Barbecue fica sem imagem até a
pizzaria confirmar os ingredientes dela.

**Fotos do cardápio:** o `PROMPTS-CHATGPT.md` tem um prompt por pizza (M1 a
M34), com os ingredientes da descrição de cada sabor na Anotaí. Cada foto vem
como `m-<sabor>.png`. Para colocar no site:

```bash
python3 tools/ingest.py --so-cardapio   # recorta e gera assets/menu/<sabor>.webp
python3 tools/cardapio.py               # liga cada foto ao sabor no cardápio
```

Pode ser aos poucos: sabor sem foto continua sem foto.

## Partes da página

1. **Vitrine**: a pizza se monta no scroll, a comanda imprime e leva o
   carimbo; fecha em "Pizzas a partir de R$ 32" e passa direto para a loja.
2. **Loja**: capa, busca, destaques, abas e itens no formato dos apps de
   delivery. Cada item abre uma janela com as opções dele (meio a meio, borda,
   acréscimos, molho), observação e quantidade.
3. **Entrega**: a caixa fecha, leva o logo, vira a bag do motoboy e ele
   atravessa a rua.
4. **Comanda**: o pedido do visitante, com a taxa de entrega (também abre
   como gaveta pelo botão "Ver comanda").

## Configuração e integrações

- **WhatsApp e taxa de entrega:** no fim do `index.html`, em
  `<script type="application/json" id="planeta-config">`.
  - `"whatsapp"`: só dígitos, com DDI e DDD. É o WhatsApp de pedidos, o da
    fachada: (34) 98837-1707 (`5534988371707`). O (34) 98408-9429, cadastrado
    na Anotaí, é o das mensagens automáticas do robô dela e não recebe pedidos
    do site.
  - `"entrega"`: a taxa única da loja na Anotaí, R$ 10.
  - Com o número, os botões "Fazer pedido no WhatsApp" abrem a conversa, e o
    "Fazer pedido" da comanda manda a comanda pronta (itens, entrega e total).
  - Vazio, os botões ficam no lugar e avisam que o número ainda não foi
    informado. Nenhum contato é inventado.
- **Pedido pelo site (Anotaí, etapa separada):** a integração registra
  `PlanetaPizza.integracao = { enviarPedido(pedido) }`, que devolve uma
  promessa de `{ recebido: true, numero?, previsao? }`.
  - Com o pedido confirmado, o site toca a animação do motoboy sozinha e
    mostra "Pedido recebido!" com o número e a previsão.
  - Também dá para chamar `PlanetaPizza.pedidoRecebido({ numero, previsao })`
    diretamente, mas só depois da confirmação real.
- **Logo:** `assets/logo.jpg` é o arquivo oficial da loja na Anotaí, sem
  nenhuma alteração. Aparece na barra, no cartão da loja, na tampa da caixa,
  no rodapé e como ícone da aba.

## Próximas fases e testes

- `CHECKOUT.md`: a finalização do pedido (Fase 1, pronta).
- `BACKEND.md`: o prompt completo do sistema próprio. Cobre:
  - banco de dados, API de pedidos e motor de preço;
  - painel da cozinha, painel de gestão, acompanhamento e relatórios;
  - Mercado Pago e WhatsApp em modo de teste, e o passo a passo para ligar.
- `tests/`: os testes de navegador do cardápio e do checkout. Veja
  `tests/README.md`.

## Cardápio (vem da Anotaí)

O cardápio é o da loja oficial,
[pedido.anota.ai/loja/anotaai-planeta-pizza](https://pedido.anota.ai/loja/anotaai-planeta-pizza),
lido em 15/10/2026.

- `dados/anotai-menu.txt`: o cardápio como a Anotaí entrega, uma linha por
  registro: categorias, produtos, bordas, acréscimos e molhos, com os preços.
- `python3 tools/cardapio.py`: refaz os itens, as abas, os destaques e as
  opções no `index.html` (entre os comentários `cardapio`, `destaques` e
  `opcoes`) e grava `dados/cardapio.json`, legível.
  - Não cria produto, preço nem descrição. Só arruma a grafia das opções
    ("Crean cheese", "Acrésscimo") e deixa de fora o que a loja pausou.
  - Ele confere que o meio a meio da Anotaí usa os mesmos sabores, bordas e
    acréscimos, e que a regra continua "vale o sabor mais caro". Se a loja
    mudar isso, ele para com um erro em vez de gerar um cardápio errado.
- Para atualizar preços: troque o `dados/anotai-menu.txt` pelo novo e rode o
  script.

Regras da Anotaí que o site segue:

- **Pizza:** 8 fatias. Meio a meio com qualquer outro sabor, salgado ou doce,
  pelo preço do mais caro.
- **Bordas:** a pizza doce inteira tem a lista própria dela (cream cheese
  R$ 8). As outras pizzas usam a lista geral (cream cheese R$ 12).
- **Acréscimos:** em qualquer pizza, menos na doce inteira.
- **Planeta Cone:** 1 molho à escolha (obrigatório), com acréscimos opcionais.
- **Horário:** todos os dias, das 17h45 às 23h (`HOURS` no `site.js`).
- **Entrega:** de 45 a 60 min, taxa de R$ 10.

## A confirmar com a pizzaria

- **Fotos de verdade** no lugar das ilustrações provisórias (prompts M1 a M34).
- **Calabresa Barbecue:** na Anotaí ela tem a mesma descrição da Calabresa
  Cheese (com cream cheese, sem barbecue). O site repete o que está lá.
- **Textos** com promessas da casa ("massa aberta na hora", "molho da casa").
