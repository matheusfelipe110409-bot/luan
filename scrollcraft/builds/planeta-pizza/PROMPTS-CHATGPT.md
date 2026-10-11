# Prompts para o ChatGPT · Planeta Pizza

Todas as imagens do site vêm daqui. São 23 imagens em 4 grupos, pela ordem de
prioridade. Os prompts seguem o método do ScrollCraft: **o mesmo preâmbulo de
estilo, palavra por palavra, em todos os prompts de um grupo** (é isso que faz
imagens geradas separadamente parecerem uma única sessão de fotos), o espaço
vazio sempre nomeado, e nenhum texto dentro da imagem.

## Como fazer (5 minutos de leitura, depois é só colar)

1. **Um chat novo para cada grupo.** A sequência V (vitrine) precisa ser toda
   no **mesmo chat, na ordem**, porque V3 a V6 são *edições da imagem anterior*.
2. **Uma imagem por mensagem.** Cole o bloco inteiro, do jeito que está.
3. **Se o enquadramento mudar** (pizza maior, menor ou fora do centro),
   responda: `Keep the pizza exactly the same size and position as in the previous image.`
4. **Reprove e refaça** se vier: borda da pizza cortada, pizza fora do centro,
   sombra preta, cara de 3D/plástico, texto, mãos, prato ou tábua.
5. **Baixe em PNG** e salve com o **nome exato** indicado em cada bloco.
6. **Envie os arquivos** de um destes jeitos:
   - no GitHub, na branch `claude/pizzeria-delivery-menu-rhwn1f`, pasta
     `scrollcraft/builds/planeta-pizza/assets/src/` (*Add file → Upload files*); ou
   - anexando aqui na conversa.

Eu rodo `python3 tools/ingest.py`: ele alinha a sequência pelo contorno da
pizza, recorta, separa o queijo e cada ingrediente da cobertura para a
animação, gera as versões leves para celular e desktop e liga tudo no site.

> O **logo não deve ser gerado**. Preciso do arquivo original da pizzaria
> (PNG ou SVG). O vermelho do site é ajustado a partir dele.

---

## Grupo V · A vitrine (a pizza que se monta no scroll) · PRIORIDADE 1

Mesmo chat, nesta ordem. Formato **quadrado (1:1)**.

### V1 · `v1-bola.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Square 1:1 image. A single ball of fresh raw pizza dough, smooth and satiny, lightly dusted with flour, sitting in the exact centre of the frame. The ball is about 30% of the image width. A loose dusting of white flour on the red backdrop around the ball, inside the central half of the frame. The outer quarter of the frame on every side is completely empty red backdrop.
```

### V2 · `v2-massa.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Square 1:1 image. The same dough, now stretched by hand into a raw round pizza base: pale cream, matte, a slightly thicker hand-pressed rim, a few small air bubbles, a light dusting of flour, a softly irregular handmade outline. The base is perfectly centred and its outer edge spans exactly 80% of the image width, leaving an even band of empty red backdrop on all four sides. No sauce, no cheese, no toppings.
```

### V3 · `v3-molho.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Edit the previous image. Keep everything identical: same camera, same framing, the dough base at the exact same size, position and outline, same rim, same light and shadows, same red backdrop. Only change: deep red tomato sauce has been spread with a ladle in a gentle spiral over the base, stopping about 2 cm before the rim, so a pale ring of raw dough stays visible all around. The sauce is glossy and slightly chunky, with a few specks of herbs and black pepper.
```

### V4 · `v4-queijo.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Edit the previous image. Keep everything identical: same camera, same framing, same dough at the same size and position, same sauce, same rim, same light, same backdrop. Only change: a generous amount of freshly grated mozzarella (long white shreds, raw and unmelted) has been scattered evenly over the sauce, covering about 80% of it, with red sauce still peeking between the shreds. The rim stays clean and pale. Nothing is baked yet.
```

### V4b (opcional, deixa o "derreter" mais suave) · `v4b-derretendo.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Edit the previous image. Keep the same camera, framing, pizza size, position and outline, same light, same backdrop. Only change: the pizza is halfway through baking. The grated mozzarella is just starting to melt: the shreds have softened, slumped and begun to merge, turning glossy, but they can still be told apart. The rim has started to puff and turn light golden. No browning yet, no toppings.
```

### V5 · `v5-assada.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Edit the previous image. Keep the same camera, framing, pizza size, position and outline, same light, same backdrop. Only change: the pizza has just come out of a very hot oven. The mozzarella has melted into a glossy, bubbling blanket with golden-brown blisters and a few darker toasted spots, a little orange oil glistening, red sauce visible in small gaps near the edge. The rim has puffed up and baked golden brown, with a few charred leopard spots and a little flour on it. No toppings.
```

### V6 · `v6-completa.png` (a foto principal: o "uau" do site)

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Edit the previous image. Keep the same camera, framing, pizza size and position, the same crust and the same melted cheese underneath, same light, same backdrop. Only change: Brazilian calabresa pizza toppings now sit on top of the melted cheese, generous all the way to the edge: about 18 round slices of Brazilian smoked calabresa sausage (linguiça calabresa defumada, each about 4 cm wide, pinkish red with tiny white fat specks and a thin darker casing, edges slightly curled and browned by the oven, glistening with orange oil), 6 to 8 thin rings of white onion, 8 whole black olives, and a light sprinkle of dried oregano. The pieces are spread evenly with small gaps between them, so each one reads clearly. Mouth-watering, steaming hot, glossy.
```

---

## Grupo M · Cardápio · PRIORIDADE 2

Um chat novo. Formato **quadrado (1:1)**. Cada bloco gera uma pizza. Mesmo
preâmbulo em todos, só muda a última frase (a cobertura).

### M1 · `m-mussarela.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings: tomato sauce and plenty of melted mozzarella covering the whole pizza, 6 slices of ripe tomato, 10 whole black olives, a sprinkle of dried oregano.
```

### M2 · `m-calabresa.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings: tomato sauce, mozzarella, about 18 round slices of Brazilian smoked calabresa sausage (pinkish red with tiny white fat specks, edges slightly curled and browned, glistening with orange oil), thin rings of white onion, 8 whole black olives, a sprinkle of dried oregano.
```

### M3 · `m-marguerita.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings: tomato sauce, mozzarella, 8 slices of ripe red tomato, about 10 whole fresh basil leaves added after baking (bright green and glossy), a light sprinkle of dried oregano.
```

### M4 · `m-portuguesa.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, Brazilian "portuguesa" style: tomato sauce, mozzarella, pieces of pink cooked ham, slices of hard-boiled egg (white with a yellow yolk), thin rings of white onion, green peas, whole black olives.
```

### M5 · `m-frango-catupiry.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings: tomato sauce, mozzarella, a generous layer of seasoned shredded chicken (golden and juicy), with swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges).
```

### M6 · `m-quatro-queijos.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings: four cheeses, with mozzarella, patches of golden melted provolone, grated parmesan dusted on top, and dollops of creamy white Catupiry; lots of golden-brown blisters.
```

### M7 · `m-pepperoni.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings: tomato sauce, mozzarella, about 30 slices of pepperoni, cupped and crisp at the edges, with little pools of orange oil.
```

### M8 · `m-bacon.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings: tomato sauce, mozzarella, plenty of crispy bacon pieces, thin rings of white onion.
```

### M9 · `m-chocolate-morango.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet dessert pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce and no cheese: the base is spread with glossy milk chocolate, topped with about 12 fresh strawberry halves (cut side up, red with pale centres) and chocolate sprinkles.
```

### M10 · `m-romeu-julieta.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce: glossy melted mozzarella topped with about 20 cubes of soft Brazilian guava paste (goiabada), deep ruby red and glossy, just starting to melt.
```

### M11 · `m-banana-canela.png`

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce: glossy melted mozzarella topped with about 18 rounds of banana, lightly caramelised, drizzled with condensed milk and dusted with ground cinnamon.
```

---

## Grupo P · Ingredientes ao redor da pizza (profundidade da vitrine) · PRIORIDADE 3

Um chat novo. Formato **quadrado (1:1)**. Peça **fundo transparente**. Se o
ChatGPT entregar um xadrez desenhado ou um fundo, refaça com:
`Same image on a plain light grey seamless backdrop (#E6E6E6) instead.`
(Eu removo o fundo cinza depois.)

### P1 · `p1-tomates.png`

```text
Overhead food photography, camera pointing straight down (90-degree top-down), 50mm lens. One hard warm key light from the upper left at about 35 degrees, soft fill. Colour grade: saturated natural colour, true to life. Texture: real food detail, crisp highlights, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no hands, no utensils, no plate, no board. The object is isolated on a fully transparent background: a real alpha-channel PNG, no checkerboard pattern, no backdrop, no shadow on the background.

Square 1:1. Three fresh ripe cherry tomatoes still on a short green vine, glossy, grouped together in the centre of the frame, filling about 60% of the image, with empty transparent space all around.
```

### P2 · `p2-manjericao.png`

```text
Overhead food photography, camera pointing straight down (90-degree top-down), 50mm lens. One hard warm key light from the upper left at about 35 degrees, soft fill. Colour grade: saturated natural colour, true to life. Texture: real food detail, crisp highlights, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no hands, no utensils, no plate, no board. The object is isolated on a fully transparent background: a real alpha-channel PNG, no checkerboard pattern, no backdrop, no shadow on the background.

Square 1:1. A small sprig of fresh basil, five glossy bright green leaves fanning out from one short stem, centred, filling about 60% of the image, with empty transparent space all around.
```

### P3 · `p3-azeitonas.png`

```text
Overhead food photography, camera pointing straight down (90-degree top-down), 50mm lens. One hard warm key light from the upper left at about 35 degrees, soft fill. Colour grade: saturated natural colour, true to life. Texture: real food detail, crisp highlights, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no hands, no utensils, no plate, no board. The object is isolated on a fully transparent background: a real alpha-channel PNG, no checkerboard pattern, no backdrop, no shadow on the background.

Square 1:1. Four whole black olives, very glossy, in a small loose group in the centre of the frame, filling about 50% of the image, with empty transparent space all around.
```

### P4 · `p4-calabresa.png`

```text
Overhead food photography, camera pointing straight down (90-degree top-down), 50mm lens. One hard warm key light from the upper left at about 35 degrees, soft fill. Colour grade: saturated natural colour, true to life. Texture: real food detail, crisp highlights, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no hands, no utensils, no plate, no board. The object is isolated on a fully transparent background: a real alpha-channel PNG, no checkerboard pattern, no backdrop, no shadow on the background.

Square 1:1. One whole Brazilian smoked calabresa sausage link, gently curved, glossy dark reddish-brown casing, with two freshly cut round slices lying beside it showing the pinkish-red interior with tiny white fat specks. Centred, filling about 70% of the image, with empty transparent space all around.
```

### P5 · `p5-farinha.png`

Este vai no **fundo vermelho**, igual à vitrine (farinha branca não recorta bem).

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Square 1:1. Only a loose dusting of white flour on the red backdrop, as if sprinkled by hand: a soft, irregular cloud, densest in the centre and fading out, filling about 70% of the image. No dough, no other objects.
```

---

## Grupo S · Imagem de compartilhamento (WhatsApp, Instagram, Google) · PRIORIDADE 4

Formato **paisagem (3:2)**.

### S1 · `s1-compartilhar.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Landscape 3:2. A whole freshly baked Brazilian calabresa pizza (smoked calabresa slices, white onion rings, black olives, oregano, glossy melted mozzarella, golden crust) sits on the right side of the frame, its centre at about 68% of the image width, the whole pizza visible with its crust spanning about 80% of the image height. A few cherry tomatoes, basil leaves and black olives lie on the red backdrop near it. The left 45% of the frame is empty red backdrop.
```

---

## Conferência rápida antes de enviar

- [ ] V1 a V6 com a pizza **no mesmo lugar e do mesmo tamanho** (abra uma em
      cima da outra no celular e passe rápido: não pode "pular").
- [ ] Nenhuma imagem com borda da pizza cortada.
- [ ] Nomes exatamente como acima, em `.png`.
- [ ] O logo original da pizzaria junto, se tiver.
