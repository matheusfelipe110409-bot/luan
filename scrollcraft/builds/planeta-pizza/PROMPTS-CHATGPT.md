# Prompts para o ChatGPT · Planeta Pizza

Todas as imagens do site vêm daqui. São 34 imagens em 8 grupos, pela ordem de
prioridade. Os grupos Q, E, L e B são novos: puxar o queijo, a pizza indo até
a sua porta, a capa da loja e as bebidas. Os prompts seguem o método do ScrollCraft: **o mesmo preâmbulo de
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
   - no GitHub, no repositório `luan`, branch `main`: *Add file → Upload files*,
     selecione as imagens e confirme em *Commit changes* (podem ficar na raiz,
     com os nomes exatos). Por esse caminho o site da Vercel consegue buscar as
     imagens sozinho; ou
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

## Grupo Q · Puxando o queijo (nova cena de scroll) · PRIORIDADE 3

Um chat novo, nesta ordem: Q2 e Q3 são *edições da imagem anterior*. Formato
**retrato (2:3)**. No site, o scroll levanta a fatia e os fios de queijo esticam.

### Q1 · `q1-fatia.png`

```text
Close-up food photography for a premium pizza campaign. Low three-quarter angle, the camera just above the rim of the pizza looking slightly down, 85mm macro lens, shallow depth of field: the front slice and the cheese strands are razor sharp, the far side of the pizza falls softly out of focus. Seamless matte backdrop in deep tomato red (#B8141B) behind the pizza, smooth and out of focus. One hard warm key light from the upper left, a warm back light that makes the melted cheese glow, a soft fill so every shadow stays a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella, golden-brown crust, true-to-life colour. Texture: real food detail, glistening oil, a little steam, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no plate, no board, no tablecloth.

Portrait 2:3. A whole freshly baked Brazilian calabresa pizza (smoked calabresa slices, white onion rings, black olives, oregano, glossy melted mozzarella with golden blisters, puffy golden crust) fills the lower half of the frame, seen from the low three-quarter angle. One slice at the front centre has been cut and still rests in place. The upper half of the frame is empty red backdrop.
```

### Q2 · `q2-puxando.png`

```text
Close-up food photography for a premium pizza campaign. Low three-quarter angle, the camera just above the rim of the pizza looking slightly down, 85mm macro lens, shallow depth of field: the front slice and the cheese strands are razor sharp, the far side of the pizza falls softly out of focus. Seamless matte backdrop in deep tomato red (#B8141B) behind the pizza, smooth and out of focus. One hard warm key light from the upper left, a warm back light that makes the melted cheese glow, a soft fill so every shadow stays a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella, golden-brown crust, true-to-life colour. Texture: real food detail, glistening oil, a little steam, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no plate, no board, no tablecloth.

Edit the previous image. Keep everything identical: same camera, same framing, the same pizza and toppings at the same size and position, same light, same backdrop. Only change: the front slice is lifted straight up by a plain stainless steel pizza server whose handle leaves the frame at the top edge. The tip of the slice is now a little above the pizza, and thick strands of melted mozzarella stretch from the slice down to the pizza.
```

### Q3 · `q3-fio.png`

```text
Close-up food photography for a premium pizza campaign. Low three-quarter angle, the camera just above the rim of the pizza looking slightly down, 85mm macro lens, shallow depth of field: the front slice and the cheese strands are razor sharp, the far side of the pizza falls softly out of focus. Seamless matte backdrop in deep tomato red (#B8141B) behind the pizza, smooth and out of focus. One hard warm key light from the upper left, a warm back light that makes the melted cheese glow, a soft fill so every shadow stays a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella, golden-brown crust, true-to-life colour. Texture: real food detail, glistening oil, a little steam, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no plate, no board, no tablecloth.

Edit the previous image. Keep everything identical: same camera, same framing, the same pizza and toppings, same light, same backdrop, the same pizza server. Only change: the slice is lifted much higher, its tip about one third from the top of the frame, and the melted mozzarella stretches into long, glossy, thin strands all the way down to the pizza, a few strands thinning out and about to break. A little steam rises from the pizza.
```

---

## Grupo E · A caminho (nova cena de scroll: da caixa até a sua porta) · PRIORIDADE 4

**E1 e E2 vão no mesmo chat da sequência V, logo depois do V6**: a pizza
precisa ser a mesma. Formato **quadrado (1:1)**. No site, a tampa fecha sobre
a pizza e o logo da pizzaria é carimbado nela (o logo entra pelo site, nunca
pela imagem).

### E1 · `e1-caixa-aberta.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Edit the previous image. Keep the pizza exactly identical: same size, position, outline, toppings, light and backdrop. Only change: the pizza now sits inside the base of an open square pizza box seen from directly above. The box is plain matte dark red corrugated cardboard (#7E0E13), only a little larger than the pizza, its four low walls visible as a thin frame around it, with a couple of faint grease marks. No lid in the frame. No print, no text, no logo on the box. The red backdrop stays visible beyond the box.
```

### E2 · `e2-caixa-fechada.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Edit the previous image. Keep the same camera, framing, light and backdrop, and the box at exactly the same size and position. Only change: the box is now closed. We see the top of its lid: plain matte dark red corrugated cardboard (#7E0E13) with a fine texture, slightly rounded corners and a small folded vent at the front edge, with a thin wisp of steam escaping at one corner. The lid is completely blank: no print, no text, no logo.
```

**E3 e E4: um chat novo**, nesta ordem. Formato **paisagem (3:2)**. No site,
o motoboy atravessa a rua à noite enquanto você rola. Se o E3 vier com fundo
desenhado ou xadrez, refaça com:
`Same image on a plain light grey seamless backdrop (#E6E6E6) instead.`

### E3 · `e3-motoboy.png`

```text
Cinematic night photography for a pizza delivery campaign in a small city in the interior of Minas Gerais, Brazil. Eye-level side view, 35mm lens, the camera parallel to the street. Warm sodium streetlights and the glow of house windows, a deep blue night sky, a little haze in the air. Colour grade: warm amber light against deep blue shadows, with one strong red accent. Texture: real photographic detail, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no readable signs, no logos, no brand names, no licence plates.

Landscape 3:2. A pizza delivery rider on a small red motorcycle, seen exactly from the side, riding from left to right, the whole bike and rider in frame and centred, about 70% of the image width. The rider wears a dark jacket and a plain red helmet with the visor down, and carries a plain red square delivery box on the back of the bike, with no print and no logo. Warm streetlight from the upper left, a cool blue fill from the right. The rider and bike are isolated on a fully transparent background: a real alpha-channel PNG, no checkerboard pattern, no backdrop, no ground, no shadow.
```

### E4 · `e4-rua.png`

```text
Cinematic night photography for a pizza delivery campaign in a small city in the interior of Minas Gerais, Brazil. Eye-level side view, 35mm lens, the camera parallel to the street. Warm sodium streetlights and the glow of house windows, a deep blue night sky, a little haze in the air. Colour grade: warm amber light against deep blue shadows, with one strong red accent. Texture: real photographic detail, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no readable signs, no logos, no brand names, no licence plates.

Landscape 3:2. An empty residential street at night: low one- and two-storey houses with tiled roofs, painted walls and a few lit windows, a small corner shop with its metal shutter half down, a few trees, two parked cars far away. The asphalt runs horizontally across the lower third of the frame and is completely empty, with a sidewalk and a low wall along the very bottom edge. The upper half is calm: night sky and rooftops. No people, no moving vehicles.
```

---

## Grupo L · Capa da loja (topo do cardápio, como nos apps de delivery) · PRIORIDADE 5

Um chat novo. Formato **paisagem (3:2)**. O site corta numa faixa larga, e o
canto de baixo à esquerda fica sob o logo.

### L1 · `l1-capa.png`

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Landscape 3:2. Three whole freshly baked pizzas (a Brazilian calabresa, a mussarela with tomato slices, and a marguerita with basil) partly cut off by the edges of the frame, arranged diagonally across the image, with cherry tomatoes on the vine, basil leaves, black olives and a light dusting of flour on the red backdrop between them. The lower-left quarter of the frame stays calm: plain red backdrop only.
```

---

## Grupo B · Bebidas (fotos do cardápio) · PRIORIDADE 6

Um chat novo. Formato **quadrado (1:1)**. Garrafa e lata lisas, sem marca e
sem rótulo escrito.

### B1 · `b1-refri-2l.png`

```text
Product photography for a pizzeria menu. Front view at eye level, 85mm lens, no perspective distortion. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow on the ground toward the lower right, soft fill. Colour grade: natural and true to life, the drink fresh and cold with condensation droplets. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no brand names, no printed labels, no hands.

Square 1:1. One 2-litre clear plastic soda bottle full of dark cola, with a plain red cap and a plain red label band with nothing printed on it, standing upright in the centre of the frame, about 75% of the image height, with empty off-white space all around.
```

### B2 · `b2-refri-lata.png`

```text
Product photography for a pizzeria menu. Front view at eye level, 85mm lens, no perspective distortion. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow on the ground toward the lower right, soft fill. Colour grade: natural and true to life, the drink fresh and cold with condensation droplets. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no brand names, no printed labels, no hands.

Square 1:1. One 350 ml aluminium soda can, plain brushed silver with a plain red band and nothing printed on it, standing upright in the centre of the frame, about 60% of the image height, with empty off-white space all around.
```

### B3 · `b3-agua.png`

```text
Product photography for a pizzeria menu. Front view at eye level, 85mm lens, no perspective distortion. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow on the ground toward the lower right, soft fill. Colour grade: natural and true to life, the drink fresh and cold with condensation droplets. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no brand names, no printed labels, no hands.

Square 1:1. One 500 ml clear plastic bottle of still mineral water with a plain blue cap and no label, standing upright in the centre of the frame, about 70% of the image height, with empty off-white space all around.
```

---

## Grupo P · Ingredientes ao redor da pizza (profundidade da vitrine) · PRIORIDADE 7

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

## Grupo S · Imagem de compartilhamento (WhatsApp, Instagram, Google) · PRIORIDADE 8

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
- [ ] Q1 a Q3 com a pizza parada no mesmo lugar: só a fatia sobe.
- [ ] E1 e E2 feitas no chat da V, logo depois do V6, com a caixa no mesmo
      lugar nas duas.
- [ ] E3 com fundo transparente (ou cinza liso).
- [ ] Nenhuma imagem com marca, rótulo escrito ou texto (bebidas, caixa,
      capacete, placas).
- [ ] Nomes exatamente como acima, em `.png`.
- [ ] O logo original da pizzaria junto, se tiver (`logo.png` ou `logo.svg`).
