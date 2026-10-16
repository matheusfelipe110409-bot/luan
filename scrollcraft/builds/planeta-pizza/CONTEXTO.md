# Contexto do projeto: para começar uma sessão nova

Resumo de tudo o que já existe (o front-end pronto e a especificação do
backend), para continuar o desenvolvimento do front-end numa sessão nova sem
reler o histórico. Para detalhes, leia o arquivo indicado, e só a seção de que
precisar.

## 1. O projeto em uma linha

Site de cardápio e pedidos da **Planeta Pizza** (Araguari, MG), feito com a
skill **ScrollCraft** (`.claude/skills/scroll-craft`), em
`scrollcraft/builds/planeta-pizza/`.

- **Quem é quem:** o dono do repositório é o desenvolvedor; a pizzaria é o
  cliente dele.
- **Branch:** `claude/pizzeria-delivery-menu-rhwn1f`, PR #1, em rascunho.
- **No ar (prévia, noindex):** https://planeta-pizza-cardapio.vercel.app,
  projeto Vercel `planeta-pizza-cardapio`.
- **Não mexa** no projeto Vercel `planeta-pizza-araguari`.

## 2. Regras que valem sempre

- Responder em **português** simples.
- **Economizar tokens:**
  - buscar em vez de ler arquivo inteiro;
  - rodar cada teste uma vez, com a saída salva em arquivo;
  - uma folha de capturas por conferência visual;
  - não deixar servidor em segundo plano;
  - respostas curtas.
- **Nunca** pedir ou receber senha ou chave secreta no chat. O cliente cola na
  Vercel.
- **Não inventar dados:** preço, produto, avaliação, número ou contato.
- **O motoboy (`PlanetaPizza.pedidoRecebido`) só toca com o pedido recebido de
  verdade**, confirmado pelo servidor.
- **A Anotaí continua funcionando em paralelo.** Não acessar a API privada dela
  nem driblar bloqueios (Cloudflare).
- **Não editar o motor** `scrollcraft.js` e `scrollcraft.css`. O tema é feito
  com tokens.
- **Os testes `tests/e2e/` continuam passando.** Veja `tests/README.md`.

## 3. Dados reais da loja

| Campo | Valor |
|---|---|
| Razão social | Andrade e Zanon Alimentação e Comércio |
| CNPJ | 33.363.935/0001-91 (⚠️ **inapto** na Receita desde 28/05/2026, por omissão de declarações; a pizzaria precisa regularizar com o contador) |
| Endereço | Rua Padre Anchieta, 154, Loja A, Jardim Regina, Araguari - MG, 38440-132 |
| Horário | Todos os dias, 17h45 às 23h (America/Sao_Paulo) |
| Entrega | 45 a 60 min, taxa única de R$ 10 |
| Retirada | 20 a 25 min, sem taxa (confirmada) |
| WhatsApp de pedidos (pessoas) | (34) 98837-1707, o da fachada |
| WhatsApp do robô da Anotaí | (34) 98408-9429: não usar |
| WhatsApp automático do sistema | chip novo, ainda não comprado |
| Pagamento hoje | na entrega: dinheiro com troco e cartão na maquininha |
| Instagram | @planetapizzaaraguari |
| Cardápio | 31 salgadas, 5 doces, 25 esfihas, 9 Planeta Cone e 9 bebidas, da Anotaí (`dados/cardapio.json`) |

## 4. Identidade visual (o que todo front-end novo deve seguir)

**Tokens** (`site.css`, `:root`):

| Token | Valor | Uso |
|---|---|---|
| `--red` | `#B8141B` | fundo vermelho da casa: vitrine, barra e fecho |
| `--red-hot` | `#D2261A` | o fundo esquenta no forno |
| `--red-ink` | `#C0161D` | vermelho de texto e botões no fundo claro |
| `--red-deep` | `#8C0F14` | pressionado e sombra |
| `--flour` | `#FFF8F1` | fundo claro (o "balcão") |
| `--paper` | `#FFFDF8` | papel térmico |
| `--ink` | `#23140F` | texto |
| `--ink-soft` | `#6B5650` | texto secundário |
| `--on-red` | `#FFF6EE` | texto sobre o vermelho |
| `--on-red-soft` | `#FFD8CB` | texto secundário sobre o vermelho |
| `--thermal` | `#2E2622` | tinta da comanda |
| `--gut` | `clamp(20px, 4.6vw, 72px)` | margem lateral |

- **Fontes** (em `fonts/`, com licença OFL): **Bricolage Grotesque** nos
  títulos, **Geist** no texto e **Geist Mono** na comanda.
- **Assinatura visual:**
  - a **comanda em papel térmico** (borda serrilhada, fonte mono, carimbo
    com o logo `assets/stamp-ink.webp`);
  - o **vermelho da casa** como fundo;
  - a **cena do motoboy**: caixa que fecha → bag → motoboy na rua à noite.
- **Logo oficial:** `assets/logo.jpg`. É o arquivo da Anotaí; não altere.
- **Componentes prontos para reaproveitar** (classes em `site.css`):
  - `.btn` (`--red`, `--wa`, `--quiet`, `--block`), `.add`, `.opt` (opção da
    janela do item), `.field` / `.field-row` / `.field__err`;
  - `.ticket` / `.ticket__paper` / `.ticket__lines` / `.ticket__total`;
  - `.co__card` (cartão de escolha), `.co__seg` (segmentado), `.toast`;
  - os diálogos `.drawer`, `.aviso` e `.entrega`.
- **Movimento:**
  - entradas suaves;
  - nada pisca sem motivo;
  - `prefers-reduced-motion` desliga as animações;
  - toque de 44 px ou mais;
  - campos com 16 px;
  - sem rolagem lateral em 360, 390 e 1440 px.

## 5. Front-end já feito (`index.html`, `site.js`, `site.css`)

Página única em atos do ScrollCraft (`data-sc-*`):

1. **Vitrine (hero):**
   - a pizza se monta no scroll, com os quadros de `assets/vt/`;
   - a comanda imprime uma linha a cada camada e leva o carimbo;
   - termina em "A melhor pizza da cidade, pelo melhor preço".
2. **Payoff:** "Pizzas a partir de R$ 32".
3. **Loja** (`#cardapio`), no estilo dos apps de delivery:
   - cartão da loja com logo, status "Aberto agora" e informações;
   - "Pedir de novo";
   - busca sem acento e abas por categoria;
   - destaques e a lista de itens com foto (`assets/menu/<id>.webp`).
4. **Entrega:** a caixa fecha com o logo, vira a bag e o motoboy atravessa a
   rua (`assets/scene/`).
5. **Comanda** (`#comanda`): o pedido impresso, informações da loja e o
   rodapé com razão social, CNPJ e endereço.

**Diálogos:**
- `#sheet`: a janela do item, com meio a meio, borda, acréscimos, molho
  obrigatório do cone, observação e quantidade.
- `#drawer`: "Sua comanda", a sacola e o checkout numa rolagem só (a Fase 1,
  especificada no `CHECKOUT.md`).
- `#pedido-whats`: "Seu pedido está no WhatsApp".
- `#pedido-recebido`: o filme do motoboy mais o cartão "Pedido recebido!".

**Barras:**
- topo: status, "Fazer pedido no WhatsApp" e "Fazer pedido";
- `.orderbar` fixa no celular: "Ver comanda".

**Ganchos para o backend** (em `site.js`):
- `PlanetaPizza.integracao.enviarPedido(pedido)` → promessa de
  `{ recebido, numero, previsao }`;
- `PlanetaPizza.integracao.abrirCheckout(pedido)` → pagamento online;
- `PlanetaPizza.pedidoRecebido({ numero, previsao })` → toca o motoboy.

**Configuração atual:** `<script id="planeta-config">` no fim do
`index.html`, com:
- `whatsapp`, `entrega`, `tempoEntrega`;
- `retirada` (`null` desliga a retirada);
- `pagamentoOnline` (`false`; mostra Pix e cartão quando for `true`).

**Valores ainda fixos no HTML e no JS**, que o backend vai alimentar:
- `HOURS` em `site.js`;
- os textos de horário, taxa, tempo e "a partir de";
- "Começar pela Calabresa, R$ 36,00".

A lista completa está no `BACKEND.md`, seção 10.1.

**Ferramentas:**
- `tools/cardapio.py` gera o cardápio no HTML, entre os marcadores
  `destaques`, `cardapio` e `opcoes`;
- `tools/ingest.py` e `tools/scenes.py` processam as imagens.

## 6. Backend: só a especificação (ainda não construído)

O `BACKEND.md` é a especificação fechada. Para o front-end, importam:

| Seção | O que tem |
|---|---|
| 3 | Pilha: Vercel + Supabase + Mercado Pago (Orders API, Pix e Card Payment Brick) + WhatsApp Cloud API; front sem framework, em ES modules |
| 4 | Estrutura de pastas (`painel/`, `pedido/`, `privacidade/`, `shared/`) |
| 5.3 | Estados do pedido: `aguardando_pagamento → novo → em_preparo → pronto → saiu → concluido` ou `cancelado` |
| 7.1 a 7.4, 7.7 | Contratos da API pública (`/api/loja`, `/api/cardapio`, `/api/pedidos`, `/api/pedidos/status`, `/api/pedidos/pagar`), com os formatos de entrada e saída |
| 8.2 e 8.3 | Botão "Acompanhar pelo WhatsApp" e os textos das mensagens |
| 9 | **Painel da pizzaria:** login, cozinha (alarme, colunas, cartão de pedido, impressão), gestão (loja, cardápio, equipe, mensagens, integrações), relatórios e clientes |
| 10 | **Mudanças no site:** dados vivos, envio, telas de Pix e cartão, cartão de "pedido aberto", rodapé e privacidade |
| 11 | **Página de acompanhamento** `/p/:token`, com linha do tempo e o motoboy quando sai |
| 14 | Testes exigidos |
| 15 | Marcos M0 a M8 |

**Como desenvolver o front-end antes do backend existir:**
- crie uma camada `api.js` com uma **simulação** que devolva exatamente os
  formatos das seções 7.1 a 7.4 e 7.7;
- ligue a simulação com `?mock=1` ou com uma variável de desenvolvimento;
- quando o backend existir, só a camada troca.

## 7. Publicação (como está hoje)

O deploy é feito com `create_deployment` (MCP da Vercel), enviando três
arquivos.

**`build.sh`:**
1. baixa o repositório no **commit fixado**
   (`codeload.github.com/matheusfelipe110409-bot/luan/tar.gz/<SHA>`);
2. copia para `dist/` só estes itens:
   - `index.html`, `site.css`, `site.js`;
   - `scrollcraft.js`, `scrollcraft.css`, `fonts/`;
   - de `assets/`: `logo.jpg`, `og.jpg`, `stamp-ink.webp`, `vt/` (sem
     `layout.json`), `menu/` e `scene/`;
3. roda o `preview.py`.

**`preview.py`:** acrescenta `noindex`, as URLs absolutas do `og:` e o recuo
da área segura na barra.

**`vercel.json`:**
- `framework: null`, `outputDirectory: dist`;
- cabeçalho `X-Robots-Tag: noindex`.

**Conferência:** um sandbox da Vercel baixa os arquivos no ar e compara o
sha1 com o build local. O container não acessa `vercel.app`.

Esse jeito **não publica funções** (`api/`). Quando o backend entrar, o
projeto passa a publicar da pasta, com `build.sh` local (`BACKEND.md`,
seção 4).

## 8. Pendências

- **Imagens do ChatGPT** que o desenvolvedor vai mandar (prompts em
  `PROMPTS-CHATGPT.md`):
  - fotos dos sabores: M1 a M34; muitos estão com ilustração provisória;
  - fachada à noite: `e4-fachada.png`, para o fundo do motoboy;
  - caixa real aberta e fechada: `e1` e `e2`, para trocar o efeito de abrir
    e fechar. Confirmar se o carimbo do logo sai da tampa.
- **CNPJ inapto:** regularizar antes do Mercado Pago e da verificação na Meta.
- **Chip** do WhatsApp automático.
- **Contas:** Supabase (projeto de teste), Vercel Pro e, depois, Mercado Pago e
  Meta no CNPJ.
- **Celular de verdade:** ainda não foi testado em um.

## 9. Arquivos de referência

| Arquivo | Para quê |
|---|---|
| `BRIEF.md` | Decisões de design, a curva de sensação e o histórico |
| `README.md` | Estrutura, configuração e as regras do cardápio da Anotaí |
| `CHECKOUT.md` | Especificação da finalização (Fase 1) |
| `BACKEND.md` | Especificação do sistema próprio |
| `PROMPTS-CHATGPT.md` | Prompts das imagens |
| `tests/README.md` | Como rodar os testes de navegador |
