# BRIEF: Planeta Pizza, cardápio online (demo)

> **Assembled from the client's written request, not interviewed.** Every
> answer quoted below is the client's own wording from the request (written in
> English "only for clarity"; the site itself is pt-BR). Where the request is
> silent, the decision is marked **authored** and was made under the request's
> own constraints. The client was not available for a live interview in this
> session, so nothing here is a user quotation unless it is in quotes.

## Hard constraints the request sets (they outrank taste)

- "Delivery only: no dine-in, no tables."
- Core message, everywhere: **"A melhor pizza da cidade pelo melhor preço."**
- "The first screen already shows the logo, the core promise, open/closed status
  and the order button. A hungry customer can order without scrolling."
- "The immersive effect lives only at the top and stays short, so the menu is
  always a quick scroll away." "Never hijack the scroll or make it feel stuck."
- "Past the showcase, the menu is straight to the point: clean, fast, with
  category tabs and prices front and center."
- "Add a sticky 'Fazer pedido' button that is always within reach, especially on
  mobile." "Build mobile-first."
- "All on-site text must be in Brazilian Portuguese (pt-BR)." Prices as
  `R$ 39,90`. `lang="pt-BR"`.
- "The ordering system (cart, checkout) will be built in a separate step; here,
  the order buttons just need to look and feel right."

## What could not be reached, and what stands in for it

| Asked for | Status in this session | Stand-in (swap later) |
|---|---|---|
| Logo, colours, menu, prices from `pedido.anota.ai/loja/anotaai-planeta-pizza`, Instagram `@planetapizzaaraguari`, Google profile | **Blocked** by the environment's egress policy (CONNECT 403 / DNS failure). Web search found nothing on this business. | Placeholder wordmark (`assets/logo.svg`), red chosen by hand as one token, a short sample menu with **placeholder prices**, placeholder hours. All of it lives in one data block in `index.html` and one token block in the page CSS. |
| "Generate all pizza images with ChatGPT in the browser" | **Blocked**: chatgpt.com and every image host are unreachable, and there is no kie.ai key (the skill's own generator). | Every pizza image is **rendered by code** (`tools/render_pizza.py`): one physically shaded top-down scene, one light, one camera, so the assembly layers line up exactly. Same file names can later take photographs or generated stills. |

## The eight topics

1. **Vibe.** Client: "warm, casual, appetizing and direct, like the
   neighborhood's favorite pizzeria talking to its customers." "Appetizing
   enough to make people hungry just by looking." References (authored):
   a hard-light food flat-lay on a saturated seamless backdrop (the kind used on
   pizza-box print and street posters), a thermal order ticket from a busy
   counter, a rubber stamp.
2. **Journey, in the client's words.** "As the customer scrolls through the
   first section, a pizza assembles in front of them: the dough appears, the
   sauce spreads, the cheese falls and melts, the toppings land." "When the
   pizza is complete, deliver the 'best price' half. The price reveal is the
   payoff." Then the menu, then the order.
3. **Energy curve.** Client: wow at the top, then "straight to the point".
   Authored detail: rising through the assembly, one held breath, one loud
   moment (the price), then calm, fast, useful.
4. **Feeling, stage by stage, and the one moment.** Client: "The goal is
   desire, with the pizza coming to life as they scroll." "The price reveal is
   the payoff." See the feeling curve and the peak below.
5. **One thing no other site does.** Client: the pizza that assembles under the
   scroll. Authored addition, the signature move: **the comanda that prints
   itself** (below).
6. **Distance from premium-minimal.** Not stated. Authored: **maximalist food
   poster** (uniqueness.md §5: "food, anything abundant"), saturated red ground,
   generous imagery at the top, then a dense, plain, information-forward menu.
   Taste floor holds everywhere.
7. **One unbroken world or distinct scenes?** Client sequence implies one scene
   (the assembly) followed by a working menu. Authored: two zones, one hard
   handoff. Not a worldflight.
8. **Assets they already have.** Logo, menu and photos exist at the links
   above, unreachable here. Treated as "nothing usable in this session".

## Journey (beats)

```
1  Promise      the promise, the open sign and the order button, over a dough ball on red
2  Proof        dough opens, sauce spreads, cheese falls and melts, toppings land
3  Payoff       the finished pizza, then the price stamped on its ticket
4  Choice       the menu: tabs, photos, prices big
5  Commitment   your comanda: what you picked, the total, one button
```

## Grammar: **Vitrine e balcão** (shop window, then counter). New, defined here.

None of the eight fits, and the reasons are structural:

- *Filmic one-shot* forbids more than one entry point and chrome that implies a
  tool. The client requires an order button on screen one that skips the film,
  and a menu with tabs (a tool).
- *Gallery / catalog* is the closest for the menu, but forbids "a single hero
  claim". The client requires one, verbatim.
- *Live surface* forbids full-bleed photography and a hero claim over media,
  both required.
- *Continuous world* forbids any section boundary; the menu is one.
- *Typographic poster* forbids photographic ground; the brief is "appetizing".
- *Split stage* is a two-sided argument where one side wins. Both halves of
  this promise win together.
- *Chaptered editorial* forbids the full-bleed scrub hero and is long-form.
- *Rhythmic cutlist* forbids `pin`, and the assembly needs the frame to hold.

**Vitrine e balcão** is defined by these constraints:

- **Sequence:** exactly one pinned showcase at the very top (the vitrine),
  then a hard cut to a working counter (the balcão) in normal document flow,
  then the order ticket. Nothing scroll-driven below the vitrine except entry
  fades and one wipe.
- **Navigation:** the chrome is a counter, not a menu bar. Top: logo plus a
  live open/closed sign. A persistent "Fazer pedido" action (bottom bar on
  phones, top-right on desktop) that always skips the film. Inside the counter,
  sticky category tabs are the index.
- **Hero:** the promise and the order action are complete at p = 0. The film
  only ever adds; it never withholds the order.
- **Ending:** the visitor's own order ticket, typeset like the ticket that
  printed during the showcase, with the total and one button.
- **Bans:** `pan` anywhere (it hijacks vertical scroll into lateral travel);
  `scrub` video; any pinned act after the vitrine; kinetic type or parallax in
  the counter; persuasion inside item labels (labels are name, ingredients,
  size, price); a scroll cue; hiding a price behind an interaction.

## Signature move: **a comanda que se imprime**

A thermal order ticket sits beside the pizza. As each layer lands, the ticket
feeds out one printed line (massa, molho, mussarela, recheio). When the pizza is
complete, after a beat of stillness, a red rubber stamp slams onto the ticket
with the price. Below the fold the same ticket becomes the visitor's own
comanda: every "Adicionar" prints a line onto it, and the close is that ticket
with its total. The visitor's scroll printed the receipt; their taps fill it.

**Tell-someone sentence:** "It's the site where a pizza builds itself while you
scroll, a little order ticket prints every ingredient next to it, and then they
stamp the price on it: R$ 39,90 for all of that."

## Feeling curve (written before the score)

| Beat | Feeling | What on screen causes it |
|---|---|---|
| 1 Promise | Hunger, curiosity | Big promise on a saturated red ground, a floured dough ball, real ingredients floating at different depths, "Aberto agora" |
| 2a Dough, sauce | Anticipation | The ball opens into a disc; red sauce spirals out to the rim |
| 2b Cheese | Craving | Handfuls of mozzarella fall toward the lens and land; the oven light blooms and the cheese melts, the crust browns |
| 2c Toppings | Abundance | Calabresa slices drop one after another, shadows meeting them at contact; onion, olives, oregano |
| (silence) | Held breath | Pizza complete, steam, ticket fully printed, copy clears. Authored silence, about 0.06 of the act |
| 3 Payoff | Delight, surprise (**PEAK**) | The stamp slams the price onto the ticket: **R$ 39,90**. The promise returns, now proven |
| 4 Choice | Confidence | Clean menu on a flour-white ground, prices large, photos from the same "shoot" |
| 5 Commitment | Resolve | The visitor's own ticket, their lines, their total, one button. Holds to the last pixel |

**Peak:** "the pizza built itself in front of me and then they stamped the price
on the ticket: R$ 39,90." It lives in act 1, which is the largest span on the
page by a wide margin. The act before the peak inside the timeline is the
authored silence.

**Authored silence:** vitrine progress ~0.78 to ~0.84. No copy cue is open
there on purpose; the steam and ticket are the only motion. It is not dead
scroll.

## Score

| Act | Beat | Device | Why |
|---|---|---|---|
| 1 Vitrine | Promise > Proof > Payoff | `pin` span ≈3.3 (phone ≈3.0, reduced motion 2.0) + bespoke `--sc-p` choreography + `parallax` planes + `kinetic` h1 on a greet cue + pointer `tilt` (fine pointers) + one `magnet` CTA | The frame has to hold still while the object changes; the argument is the object |
| 2 Balcão | Choice | `flow` + `in` (fires once), sticky tabs with scroll-spy | Ordinary sections done well. Information, not experience |
| 3 Comanda | Commitment | `flow` + `reveal` (the ticket feeds down like paper out of a printer) | A wipe is a change of state: blank paper to your order |

Device families: pin, parallax, kinetic, pointer, flow/in, reveal (6). No
family twice in a row. Zero `scrub`. Total length ≈7 to 9 viewport-heights,
most of it the menu itself, which is content rather than effect.

## Layer contract (vitrine)

Top-down overhead camera, one hard warm key from the upper left, seamless red
backdrop. Every plane is rendered by the same code with the same light.

| Plane | Asset | Independent movement | Contact / occlusion rule |
|---|---|---|---|
| Ground | CSS red seamless + grain, warms during the oven beat | none | Never darker than the type needs |
| Far props (on the ground) | Rendered cherry tomatoes, basil, onion, olives, calabresa link (alpha) | `parallax` slow, rate ≈ -0.6 | Each has a contact shadow on the ground |
| Subject | Pizza stack: dough ball, dough disc, sauce, 3 cheese handfuls, melt keyframes, toppings, final render | Slow rotation (−10° to 0°), slight push-in, pointer tilt | All layers share one centre and one rotation; shadow is a separate plane under it |
| Falling toppings | Rendered sprites, each with its own shadow | Scale from near-lens to contact; shadow converges | Lands exactly on the final render's positions |
| Near foreground | Two pre-blurred props at the frame corners | `parallax` fast, rate ≈ 1.6, exits frame | Never covers the headline or the CTA |
| Atmosphere | Oven glow, steam | Opacity only | Never washes the copy |
| Type and controls | Semantic HTML | Engine cues | Promise readable at p = 0; order action always reachable |

## Copy (pt-BR, short sentences, no em dashes)

- h1: "A melhor pizza da cidade pelo melhor preço."
- sub: "Só delivery, em Araguari. Feita na hora e entregue quentinha."
- massa: "Primeiro, a massa." / "Aberta na hora. Leve no meio, borda que estala."
- molho: "Depois, o molho." / "Tomate encorpado, temperado do nosso jeito."
- queijo: "Mussarela sem dó." / "Cai muita. Derrete no forno e chega puxando fio."
- recheio: "Recheio até a borda." / "Calabresa, cebola e azeitona. Sem economizar."
- payoff: "Tudo isso por" / **R$ 39,90** / "Calabresa grande, 8 fatias."
  / "A melhor pizza da cidade. Pelo melhor preço." / [Fazer pedido]

Product claims in this copy (massa aberta na hora, borda, molho da casa) are
the kind any pizzeria makes but are **unverified for this business** and must be
confirmed by the owner before launch.

---

## Build report (ScrollCraft Step 5)

**Images.** On the client's direction, every final image comes from ChatGPT,
prompted with `PROMPTS-CHATGPT.md` (one preamble per set, reused verbatim, empty
space named, no text). This session cannot reach ChatGPT (no access to the
client's browser; `chatgpt.com` and `api.openai.com` are blocked by the
environment's network policy). Until the PNGs arrive the page runs on stand-in
layers that already go through the same pipeline (`tools/ingest.py`), so the
swap is one command and changes no code.

**Fingerprint gate.** First build in this registry: nothing to clear. Row added.

**Harness (`shoot.mjs`, 12 samples per act, Chromium 140 headless).**

| Run | Dead scroll | Cues that never peak | Contrast at worst frame |
|---|---|---|---|
| Desktop 1440×900 | none | none | all ≥ 4.5:1 |
| Phone 390×844 | none | none | all ≥ 4.5:1 |
| Compact phone 360×640 | none | none | all ≥ 4.5:1 |
| Reduced motion 1440×900 | none | none | all ≥ 4.5:1 |

Superseded failures, fixed and re-run: the hero headline at 3.69:1 (tomato
highlights inside its box; props moved, headline set to two lines); the payoff
at 1.22:1 then 4.31:1 on phones and 1.05:1 then 2.78:1 on a compact phone (the
peak ticket and a near-foreground prop drifted under the price; the ticket now
stops above it and near props are off on phones); two beat cues that never
peaked at 6 samples per act (plateaus widened).

Functional checks (scripted): the order action jumps past the film to the menu;
three Adicionar taps update the badge, the phone order bar ("3 itens, R$ 127,70"),
the ticket lines with +/− and the total; the checkout button answers with an
honest demo message; no horizontal overflow at 390 or 1440; no console errors.

**Feel check (cold, one word per beat):** promise *curiosity*, dough
*anticipation*, sauce *anticipation*, cheese *abundance*, oven *warmth*,
toppings *abundance*, silence *held*, stamp *delight* (the biggest change on the
sheet, as planned), menu *clarity*, comanda *resolve*. Diff against the curve:
the grated-cheese beat reads as abundance rather than craving (craving arrives
with the melt), and dough and sauce share a feeling; both live inside one act
whose job is the build-up, so they were kept. The peak is unambiguous.

**Not verified:** a real phone (iOS Safari, touch scrolling, Low Power Mode).
Headless Chromium cannot stand in for it.

---

# Revisão 2 (pedido do cliente depois da primeira prévia)

## O que o cliente pediu, nas palavras dele

> "Está perfeito só altere mais umas coisas, ainda está muito simples, e não
> deve falar o preço ali logo no início, deve falar a partir de 38, pode fazer
> prompts pra eu jogar no chat gpt e gerar imagens pra compor e pra passar
> mais uma experiência de scroll, e pode ficar mais profissional estilo ifood"

Ele gerou as imagens no ChatGPT e enviou 14 delas pelo GitHub: V1 a V6, V4b,
Q1, Q2, E1 a E4 e L1. O mapa de cada arquivo está em `assets/src/ORIGENS.md`.

## O que mudou

- **Preço:** a vitrine não mostra mais um preço fechado. A comanda imprime
  "Pizza grande · 8 fatias" no lugar do total, e o fechamento diz "Pizzas a
  partir de **R$ 38**". No cardápio, Mussarela, Calabresa e Banana com Canela
  custam R$ 38,00. Os preços continuam sendo de exemplo.
- **A vitrine é fotografia:** as sete etapas são as fotos do ChatGPT, montadas
  pelo `tools/ingest.py`. Os 32 pedaços de recheio caem no lugar exato da V6.
- **Dois atos novos (mais scroll):**
  - *Puxa*: a fatia sobe e o queijo estica. É uma foto e a edição dela, que
    entra de baixo para cima por uma máscara, então os fios aparecem antes da
    fatia lá no alto.
  - *Entrega*: a tampa fecha, o carimbo da casa bate na caixa, a caixa encolhe
    até virar a bag do motoboy e ele atravessa a rua à noite.
- **Loja no formato dos apps de delivery:**
  - capa e cartão da loja (logo, selo de aberto, horário, "a partir de R$ 38");
  - busca que ignora acentos e destaques;
  - abas fixas e itens com a foto à direita;
  - janela do item com meio a meio, borda recheada, observação, quantidade e
    "Adicionar R$ X";
  - gaveta "Sua comanda".
  
  Só os padrões de uso vêm desses apps: nenhuma marca, nota ou avaliação
  inventada.

## Gramática: **Vitrine, balcão e entrega** (revisão da "Vitrine e balcão")

- **Sequência:**
  1. vitrine fixa no topo;
  2. um ato curto fixo (puxa) que ainda é apetite;
  3. corte seco para o balcão, em fluxo normal;
  4. um segundo ato fixo (entrega), que só aparece depois do cardápio;
  5. a comanda.
- **Navegação:** o botão "Fazer pedido" está sempre na tela e pula os atos.
  Com itens, vira "Ver comanda" e abre a gaveta.
- **Proibido:**
  - `pan`;
  - vídeo em `scrub`;
  - efeito de scroll dentro do balcão (o balcão é ferramenta);
  - esconder preço atrás de interação (o preço fica na linha; a janela só
    soma extras);
  - indicador de scroll;
  - números de entrega inventados (tempo, taxa, nota).

## Curva de sentimento (revisão 2)

| Ato | Sentimento | O que causa |
|---|---|---|
| Vitrine: promessa | Fome, curiosidade | A bola de massa enfarinhada no vermelho, a promessa grande |
| Vitrine: montagem | Antecipação, desejo, fartura | Massa, molho, queijo que cai, forno, recheio caindo |
| (silêncio) | Respiração presa | Pizza pronta, vapor, comanda impressa |
| Vitrine: carimbo | Prazer, surpresa (**PICO**) | O carimbo "Melhor preço da cidade" e "Pizzas a partir de R$ 38" |
| Puxa | Vontade, devagar | Close: a fatia sobe e o queijo estica |
| Loja | Confiança, facilidade | Um app que todo mundo já sabe usar |
| Entrega | Segurança, antecipação | A caixa fecha, o carimbo, a bag, a moto na rua |
| Comanda | Decisão | O seu pedido, o total, um botão |

O pico continua no carimbo e continua sendo o maior trecho da página (3,3
telas). O ato seguinte (puxa) é mais calmo no movimento, para não disputar com
ele.

**Frase para contar a alguém:** "É o site em que a pizza se monta enquanto
você rola, uma comanda imprime cada ingrediente e no fim carimbam: pizzas a
partir de R$ 38. Depois a fatia sai puxando queijo, e quando você pede a caixa
fecha e vira a bag do motoboy."

## Verificação (revisão 2)

`shoot.mjs`, 8 amostras por ato, Chromium 140 sem janela:

| Rodada | Rolagem morta | Contraste |
|---|---|---|
| Desktop 1440×900 | nenhuma | tudo ≥ 4,5:1 |
| Celular 390×844 | nenhuma | tudo ≥ 4,5:1 |
| Celular pequeno 360×640 | nenhuma | ≥ 4,5:1 com o texto em tela. O único alerta (2,38:1) é o quadro em que o texto da entrega já saiu por baixo da barra (conferido no `33.png`) |
| Movimento reduzido 1440×900 | nenhuma | tudo ≥ 4,5:1 |

O contraste da entrega foi corrigido com um céu mais escuro sob o texto. No
celular pequeno estava em 3,16:1 sobre a luz do poste.

Fluxo testado por script, no celular e no desktop:

- o botão de pedido leva à loja;
- busca ("frango", "catupiry" sem acento, termo vazio);
- janela da calabresa: meia portuguesa (vale o mais caro), borda (+ R$ 8),
  observação 10/140, quantidade 2 (R$ 105,80);
- a linha impressa na comanda;
- o foco volta para o item;
- bebida sem sabor fica presa, com o grupo marcado;
- os destaques abrem a janela, e o Esc fecha;
- a barra mostra "Ver comanda · 3 itens";
- a gaveta abre, o "+" funciona e o pedido responde com o aviso de
  demonstração.

Sem rolagem horizontal e sem erros no console.

**Não verificado:** celular de verdade (iOS Safari, rolagem por toque).

---

# Revisão 3

> "no início tem a pizza realista e uns elementos em volta que não estão
> realistas [...] quero que você remova esses elementos [...] pode remover o
> efeito escuro da pizza puxando queijo [...] deixa só a pizza sendo montada
> no começo e embaixo o cardápio. [...] a foto da capa do cardápio [...] tá
> cortada [...] deixa o efeito da pizza sendo montada mais suave e mais leve
> para celulares"

- **Vitrine:** saíram os ingredientes soltos em volta da pizza, que eram
  renderizações provisórias. Fica só a pizza fotografada, a comanda e o
  texto.
- **Puxa:** o ato saiu. Depois da vitrine vem direto o cardápio.
- **Capa:**
  - não fica mais presa sob o cartão da loja;
  - no celular aparece inteira (3:2, sem corte);
  - o topo dela se funde com o vermelho da vitrine;
  - entra uma vez, com um leve zoom e fade.
- **Celular mais leve:**
  - as camadas da vitrine vêm por `<picture>`, então o celular nunca baixa o
    arquivo de desktop (antes, telas 3x baixavam o de 1440 px);
  - os arquivos de celular foram recomprimidos (2,1 MB contra cerca de 4,4 MB
    antes);
  - no celular saem a granulação fixa, o brilho com blend, as sombras dos
    pedaços que caem e a máscara do molho (vira um círculo);
  - as camadas cobertas por uma opaca param de ser pintadas.
- **Verificação:** desktop, celular, celular pequeno e movimento reduzido
  ficaram sem rolagem morta. O único alerta de contraste é o quadro em que o
  texto da entrega já saiu por baixo da barra. O fluxo de pedido segue
  passando.
