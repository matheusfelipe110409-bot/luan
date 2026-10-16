# Prompts para o ChatGPT · Planeta Pizza

Agora são três frentes: a **fachada da pizzaria à noite** (o fundo de onde sai o motoboy), a
**caixa de pizza real** (o efeito de abrir e fechar) e as **fotos do cardápio**: 34 pizzas, com os sabores e os ingredientes exatamente
como estão na loja da Planeta Pizza na Anotaí. O método é o mesmo das outras: **o mesmo
preâmbulo de estilo, palavra por palavra, em todos os prompts** (é isso que faz fotos geradas
separadamente parecerem uma única sessão de fotos), o espaço vazio sempre nomeado e nenhum
texto dentro da imagem. Cada prompt lista só os ingredientes da descrição do sabor e termina
em "and nothing else", para o ChatGPT não inventar cobertura.

As fotos da vitrine, da caixa, do motoboy, da rua e da capa já estão no site. Os prompts delas
continuam no histórico do repositório.

## Como fazer (5 minutos de leitura, depois é só colar)

1. **Um chat novo para as pizzas.** Se o chat ficar lento ou o estilo começar a mudar, abra
   outro e continue de onde parou: o preâmbulo igual mantém as fotos combinando.
2. **Uma imagem por mensagem.** Cole o bloco inteiro, do jeito que está.
3. **Reprove e refaça** se vier: borda da pizza cortada, pizza fora do centro, sombra preta,
   cara de 3D/plástico, texto, mãos, prato ou tábua, ou um ingrediente que não está no prompt.
4. **Baixe em PNG** e salve com o **nome exato** indicado em cada bloco.
5. **Envie os arquivos** de um destes jeitos:
   - no GitHub, no repositório `luan`, branch `main`: *Add file → Upload files*, selecione as
     imagens e confirme em *Commit changes* (podem ficar na raiz, com os nomes exatos); ou
   - anexando aqui na conversa.
6. **Pode mandar aos poucos.** Cada foto que chega já entra no cardápio. Sabor sem foto continua
   sem foto, sem nada inventado no lugar.

Eu rodo `python3 tools/ingest.py --so-cardapio` (recorta a pizza no fundo claro e gera a versão
leve) e `python3 tools/cardapio.py` (liga cada foto ao sabor dela no cardápio).

> A **Calabresa** já tem foto: é a pizza da vitrine. A **Calabresa Barbecue** ficou de fora porque
> na Anotaí ela está com a mesma descrição da Calabresa Cheese (com cream cheese, sem barbecue).
> Quando a pizzaria confirmar os ingredientes dela, eu faço o prompt.

---

## Grupo F · Fachada à noite (o fundo de onde sai o motoboy) · PRIORIDADE 1

Um chat novo. **Anexe as duas fotos da fachada** (a de dia, com a loja fechada, e a de noite,
com a loja aberta) na mesma mensagem do prompt.

O prompt pede uma **edição da foto de dia**, não uma foto nova: o ChatGPT mantém o prédio, a placa,
as luminárias e os azulejos como são, e muda só a luz, abre a loja e tira fios, carros, caixas e
pessoas. O enquadramento continua o da foto original; eu recorto a imagem para o site.

### F1 · Fachada à noite · `e4-fachada.png`

Anexe as duas fotos da fachada nesta mesma mensagem.

```text
Edit the attached daytime photo of the Planeta Pizza storefront so it looks like a real photo of the same place taken at night, with the pizzeria open. This is a real building: it must stay exactly the same.

Keep exactly as in the daytime photo, without redrawing or improving anything: the camera angle and perspective, the shape and proportions of the buildings, both signs with their logos, letters, colours and small contact text, the lamps on the arms above the signs, the yellow tiles, the doors, the roll-up shutters, the sidewalk, the curb and the street. Do not add anything that is not in the photo: no new lights, signs, awnings, plants, decorations, windows or details.

Change only these four things:
1. Night: a dark blue night sky. The only lights are the ones that already exist in the photo: the lamps on the arms above the signs are on and light the signs from above.
2. Open the pizzeria: the metal roll-up shutter of the Planeta Pizza storefront is raised, and through the opening you see the lit interior as in the attached night photo: the service counter and warm ceiling lights. No people. Ignore the text stickers and emojis on the night photo; use it only to see the interior.
3. Remove the clutter: the overhead power lines and cables, the parked cars, the cardboard boxes on the sidewalk and any people. Fill those areas with what is really behind them: the same walls, sidewalk and street that are already in the photo.
4. Frame: landscape 3:2. To fill it, extend only the dark night sky above the buildings and the empty asphalt street below the sidewalk. Do not move, resize, crop or redraw the buildings.

The neighbouring shops stay exactly as in the photo, closed, with their lights off. Photographic realism: it must look like a real night photo of this street, with natural light and real textures. NOT illustration, NOT 3D render, NOT CGI, no plastic look, no watermark.
```

Se o ChatGPT mexer na placa ou na fachada, responda: `The facade must be exactly the one in the daytime photo: same sign, same logo, same letters and colours, same lamps, same yellow tiles, same proportions. Do not invent or change anything on the facade. Change only the light, keep the shop open and remove the wires, cars, boxes and people.`

---

## Grupo C · A caixa real (o efeito de abrir e fechar) · PRIORIDADE 2

Um chat novo, **C1 e depois C2 no mesmo chat**, nesta ordem: a caixa fechada precisa ficar no mesmo
lugar e do mesmo tamanho da aberta. Formato **retrato (2:3)**. No C1, **anexe duas imagens**: a
caixa aberta que está hoje no site (`caixa-aberta-atual.png`) e a foto da caixa de verdade.

### C1 · Caixa aberta · `e1-caixa-aberta.png`

Anexe a caixa aberta atual e a foto da caixa de verdade nesta mesma mensagem.

```text
Edit the first attached image (a pizza inside an open red box, seen from directly above). Keep the pizza exactly identical: same size, position, toppings, the lifted slice with the cheese pull, the light and the red backdrop. Keep the camera pointing straight down and the same portrait framing.

Change only the box: replace the plain red box with the real pizza box from the second attached photo. It is an octagonal (eight-sided) box of natural brown kraft corrugated cardboard. Here it is open and we see only its base from above: eight low brown cardboard walls forming an octagon around the pizza, the inside plain unprinted kraft. No lid in the frame. The box is centred, spans about 94% of the image width, and the red backdrop stays visible above and below it.

Do not add anything that is not in the photos. Photographic realism, real cardboard texture and natural light. NOT illustration, NOT 3D render, NOT CGI, no plastic look, no watermark.
```

### C2 · Caixa fechada · `e2-caixa-fechada.png`

No mesmo chat, logo depois do C1. Anexe de novo a foto da caixa de verdade.

```text
Edit the previous image. Keep the camera, framing, light and red backdrop exactly the same, and the box at exactly the same size and position. Only change: the box is now closed, and we see the top of its lid from directly above, exactly like the lid of the real box in the attached photo:
- the same octagonal shape, in natural brown kraft corrugated cardboard;
- the far half of the lid (toward the top of the image) printed solid red, with the word "Pizza" in big black brush script and a curved black swoosh under it;
- a straight black band across the lid where the red ends;
- on the near half, the bare kraft with a row of small black line icons along the band, the word "Delivery" in big black script with a white outline, and the round black seal with a leaf on the right.

Copy the print exactly as in the photo of the real box: do not redesign it and do not add any other text, logo or decoration. Photographic realism, real cardboard texture and natural light. NOT illustration, NOT 3D render, NOT CGI, no plastic look, no watermark.
```

Se a pizza mudar, responda: `Keep the pizza exactly identical to the first image.` Se a estampa da
tampa vier diferente, responda: `Copy the lid print exactly as in the photo of the real box.`

---

## Grupo M · Fotos do cardápio · PRIORIDADE 3

Formato **quadrado (1:1)**. Cada bloco gera uma pizza. O preâmbulo é o mesmo em todos; só muda
a última parte (a cobertura de cada sabor).

Comece pelas 5 primeiras: hoje elas aparecem no site como ilustração provisória, inclusive nos
destaques.

### M1 · Muçarela · `m-mucarela.png`

Na Anotaí: Muçarela, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, plenty of melted mozzarella covering the whole pizza, 6 slices of ripe red tomato, 10 whole black olives, a sprinkle of dried oregano.
```

### M2 · Marguerita · `m-marguerita.png`

Na Anotaí: Muçarela, tomate, azeitona, manjericão e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, 8 slices of ripe red tomato, 8 whole black olives, about 10 whole fresh basil leaves added after baking (bright green and glossy).
```

### M3 · Frango Catupiry · `m-frango-catupiry.png`

Na Anotaí: Frango, catupiry, muçarela, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, a generous layer of seasoned shredded chicken (golden and juicy), swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), 8 whole black olives, a sprinkle of dried oregano.
```

### M4 · 4 Queijos · `m-4-queijos.png`

Na Anotaí: Muçarela, catupiry, provolone, parmesão, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, four cheeses: melted mozzarella, patches of golden melted provolone, grated parmesan dusted on top, dollops of creamy white Brazilian Catupiry, 8 whole black olives, a sprinkle of dried oregano.
```

### M5 · Banana · `m-banana.png`

Na Anotaí: Banana, muçarela, leite condensado e canela.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce. Toppings, and nothing else: melted mozzarella, about 18 rounds of banana, lightly caramelised, a drizzle of condensed milk, a dusting of ground cinnamon.
```

Daqui em diante, os sabores que hoje aparecem sem foto, na ordem do cardápio.

### M6 · Lombo Canadense · `m-lombo-canadense.png`

Na Anotaí: Lombo canadense, muçarela, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 16 thin round slices of Brazilian lombo canadense (cured smoked pork loin, rosy pink with a thin darker rim), 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M7 · Napolitana · `m-napolitana.png`

Na Anotaí: Presunto, muçarela, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of folded pieces of pink cooked ham, 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M8 · Alho · `m-alho.png`

Na Anotaí: Muçarela, parmesão, alho, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, grated parmesan dusted on top, plenty of thin golden toasted garlic slices, 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M9 · Franbacon · `m-franbacon.png`

Na Anotaí: Frango, bacon, muçarela, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, seasoned shredded chicken (golden and juicy), plenty of crispy bacon pieces, 8 whole black olives, a sprinkle of dried oregano.
```

### M10 · Calabresa Catupiry · `m-calabresa-catupiry.png`

Na Anotaí: Calabresa, catupiry, muçarela, cebola, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 18 round slices of Brazilian smoked calabresa sausage (pinkish red with tiny white fat specks, edges slightly curled and browned, glistening with orange oil), swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), thin rings of white onion, 8 whole black olives, a sprinkle of dried oregano.
```

### M11 · Lombo Catupiry · `m-lombo-catupiry.png`

Na Anotaí: Lombo canadense, catupiry, muçarela, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 16 thin round slices of Brazilian lombo canadense (cured smoked pork loin, rosy pink with a thin darker rim), swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M12 · Napolitana Catupiry · `m-napolitana-catupiry.png`

Na Anotaí: Presunto, muçarela, catupiry, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of folded pieces of pink cooked ham, swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M13 · Toscana · `m-toscana.png`

Na Anotaí: Calabresa, presunto, muçarela, cebola, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 18 round slices of Brazilian smoked calabresa sausage (pinkish red with tiny white fat specks, edges slightly curled and browned, glistening with orange oil), folded pieces of pink cooked ham, thin rings of white onion, 8 whole black olives, a sprinkle of dried oregano.
```

### M14 · Bacon Catupiry · `m-bacon-catupiry.png`

Na Anotaí: Bacon, muçarela, catupiry, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of crispy bacon pieces, swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), 8 whole black olives, a sprinkle of dried oregano.
```

### M15 · Bacon Cheddar · `m-bacon-cheddar.png`

Na Anotaí: Bacon, muçarela, cheddar, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of crispy bacon pieces, swirls of creamy melted orange cheddar, 8 whole black olives, a sprinkle of dried oregano.
```

### M16 · Calabacon · `m-calabacon.png`

Na Anotaí: Calabresa, bacon, muçarela, cebola, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 18 round slices of Brazilian smoked calabresa sausage (pinkish red with tiny white fat specks, edges slightly curled and browned, glistening with orange oil), plenty of crispy bacon pieces, thin rings of white onion, 8 whole black olives, a sprinkle of dried oregano.
```

### M17 · Palmito · `m-palmito.png`

Na Anotaí: Palmito, muçarela, catupiry, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of round slices of hearts of palm (pale ivory, tender), swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M18 · Vegetariana · `m-vegetariana.png`

Na Anotaí: Muçarela, palmito, milho, pimentão, cebola, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, round slices of hearts of palm (pale ivory, tender), sweet corn kernels, thin strips of green bell pepper, thin rings of white onion, 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M19 · Atum · `m-atum.png`

Na Anotaí: Atum, muçarela, tomate, cebola, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of flakes of tuna (pale pinkish beige), 6 slices of ripe red tomato, thin rings of white onion, 8 whole black olives, a sprinkle of dried oregano.
```

### M20 · Planeta Pizza · `m-planeta-pizza.png`

Na Anotaí: Muçarela, calabresa, frango, bacon, cupim, milho, catupiry, cebola, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, a loaded mix of about 18 round slices of Brazilian smoked calabresa sausage (pinkish red with tiny white fat specks, edges slightly curled and browned, glistening with orange oil), seasoned shredded chicken, crispy bacon pieces, Brazilian cupim desfiado (slow-cooked shredded beef hump, dark brown), sweet corn kernels, swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), thin rings of white onion, 8 whole black olives, a sprinkle of dried oregano.
```

### M21 · Mineira · `m-mineira.png`

Na Anotaí: Muçarela, calabresa, presunto, bacon, cebola, catupiry, azeitona, milho, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 18 round slices of Brazilian smoked calabresa sausage (pinkish red with tiny white fat specks, edges slightly curled and browned, glistening with orange oil), folded pieces of pink cooked ham, crispy bacon pieces, thin rings of white onion, swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), 8 whole black olives, sweet corn kernels, a sprinkle of dried oregano.
```

### M22 · 5 Queijos · `m-5-queijos.png`

Na Anotaí: Muçarela, catupiry, provolone, parmesão, cheddar, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, five cheeses: melted mozzarella, patches of golden melted provolone, grated parmesan dusted on top, dollops of creamy white Brazilian Catupiry, swirls of creamy melted orange cheddar, 8 whole black olives, a sprinkle of dried oregano.
```

### M23 · Cupim · `m-cupim.png`

Na Anotaí: Cupim desfiado, muçarela, catupiry, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, a generous layer of Brazilian cupim desfiado (slow-cooked shredded beef hump, dark brown, juicy strands), swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), 8 whole black olives, a sprinkle of dried oregano.
```

### M24 · Strogonoff · `m-strogonoff.png`

Na Anotaí: Frango, muçarela, catupiry, milho, batata palha, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, a generous layer of seasoned shredded chicken (golden and juicy), swirls and dollops of creamy Brazilian Catupiry cheese (smooth, glossy white, lightly golden at the edges), sweet corn kernels, a handful of crispy golden shoestring potato sticks (Brazilian batata palha) scattered on top after baking, 8 whole black olives, a sprinkle of dried oregano.
```

### M25 · Lombanana · `m-lombanana.png`

Na Anotaí: Lombo canadense, banana, bacon, muçarela, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 16 thin round slices of Brazilian lombo canadense (cured smoked pork loin, rosy pink with a thin darker rim), about 18 rounds of banana, lightly caramelised, crispy bacon pieces, 8 whole black olives, a sprinkle of dried oregano.
```

### M26 · Frango Cream Cheese · `m-frango-cream-cheese.png`

Na Anotaí: Frango, muçarela, cream cheese, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, a generous layer of seasoned shredded chicken (golden and juicy), dollops of thick white cream cheese, 8 whole black olives, a sprinkle of dried oregano.
```

### M27 · Cupim Cream Cheese · `m-cupim-cream-cheese.png`

Na Anotaí: Cupim desfiado, muçarela, cream cheese, alho frito, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, a generous layer of Brazilian cupim desfiado (slow-cooked shredded beef hump, dark brown, juicy strands), dollops of thick white cream cheese, crispy golden fried garlic bits, 8 whole black olives, a sprinkle of dried oregano.
```

### M28 · Bacon Cream Cheese · `m-bacon-cream-cheese.png`

Na Anotaí: Bacon, muçarela, cream cheese, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of crispy bacon pieces, dollops of thick white cream cheese, 8 whole black olives, a sprinkle of dried oregano.
```

### M29 · Brócolis · `m-brocolis.png`

Na Anotaí: Muçarela, brócolis, bacon, cream cheese, alho, cebola, tomate, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, plenty of small bright green broccoli florets, crispy bacon pieces, dollops of thick white cream cheese, thin golden toasted garlic slices, thin rings of white onion, 6 slices of ripe red tomato, 8 whole black olives, a sprinkle of dried oregano.
```

### M30 · Calabresa Cheese · `m-calabresa-cheese.png`

Na Anotaí: Calabresa, muçarela, cream cheese, alho, cebola, azeitona, orégano e molho de tomate.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Freshly baked: golden-brown puffy rim with a few charred spots, glossy melted mozzarella with golden blisters. Toppings, and nothing else: tomato sauce, melted mozzarella, about 18 round slices of Brazilian smoked calabresa sausage (pinkish red with tiny white fat specks, edges slightly curled and browned, glistening with orange oil), dollops of thick white cream cheese, thin golden toasted garlic slices, thin rings of white onion, 8 whole black olives, a sprinkle of dried oregano.
```

### M31 · Banana Chocolate · `m-banana-chocolate.png`

Na Anotaí: Banana, muçarela, chocolate e leite condensado.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce. Toppings, and nothing else: melted mozzarella, about 18 rounds of banana, lightly caramelised, glossy melted milk chocolate spread over the cheese, a drizzle of condensed milk.
```

### M32 · Prestígio · `m-prestigio.png`

Na Anotaí: Chocolate, muçarela, coco ralado e leite condensado.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce. Toppings, and nothing else: melted mozzarella, glossy melted milk chocolate spread over the cheese, a generous layer of white shredded coconut, a drizzle of condensed milk.
```

### M33 · Brigadeiro · `m-brigadeiro.png`

Na Anotaí: Chocolate, muçarela, granulado e leite condensado.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce. Toppings, and nothing else: melted mozzarella, glossy melted milk chocolate spread over the cheese, plenty of chocolate sprinkles, a drizzle of condensed milk.
```

### M34 · Confete · `m-confete.png`

Na Anotaí: Chocolate, muçarela e confete.

```text
Overhead food photography for a pizzeria menu. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in warm off-white (#FFF8F1), flat and evenly lit, no texture, no props. One hard warm key light from the upper left at about 35 degrees, a crisp short shadow toward the lower right, soft fill. Colour grade: saturated natural colour, golden-brown crust, true to life. Texture: real food detail, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no text, no logo, no hands, no utensils, no plate, no board, no box.

Square 1:1. One whole large sweet pizza, perfectly centred, its outer crust spanning exactly 82% of the image width, with an even band of empty off-white backdrop on all four sides. Golden-brown puffy rim. No tomato sauce. Toppings, and nothing else: melted mozzarella, glossy melted milk chocolate spread over the cheese, about 40 small colourful sugar-coated chocolate buttons (Brazilian confete) scattered on top.
```

---

## Grupo S · Imagem de compartilhamento (WhatsApp, Instagram, Google) · PRIORIDADE 4

Formato **paisagem (3:2)**. É a imagem que aparece quando alguém manda o link do site.

### S1 · `s1-compartilhar.png` (opcional)

```text
Overhead food photography for a premium pizza campaign. Camera pointing straight down, a perfect 90-degree top-down flat lay, 50mm lens, no perspective tilt. Seamless matte backdrop in deep tomato red (#B8141B), flat and evenly lit from edge to edge, no gradient, no vignette, no texture. One hard warm key light from the upper left at about 35 degrees, casting crisp short shadows toward the lower right; a soft fill keeps every shadow a rich dark red, never black. Colour grade: saturated tomato red, creamy mozzarella white, golden-brown crust, natural true-to-life colour. Texture: real food detail, visible flour dust, glistening oil, fine film grain. Photographic realism. NOT illustration, NOT 3D render, NOT CGI, no plastic sheen, no text, no logo, no hands, no utensils, no plate, no board, no tablecloth.

Landscape 3:2. A whole freshly baked Brazilian calabresa pizza (smoked calabresa slices, white onion rings, black olives, oregano, glossy melted mozzarella, golden crust) sits on the right side of the frame, its centre at about 68% of the image width, the whole pizza visible with its crust spanning about 80% of the image height. Nothing else on the backdrop except a light dusting of flour. The left 45% of the frame is empty red backdrop.
```

---

## Conferência rápida antes de enviar

- [ ] Fachada: a placa igual à de verdade, à noite, sem fios, carros, pessoas nem outras lojas, e
      a rua vazia embaixo.
- [ ] Caixa: a mesma pizza da caixa aberta atual; a fechada no mesmo lugar e tamanho, com a
      estampa igual à da caixa de verdade.
- [ ] Nenhuma pizza com a borda cortada, todas centralizadas e do mesmo tamanho.
- [ ] Só os ingredientes do prompt: nada a mais em cima da pizza.
- [ ] Fundo claro liso, sem prato, tábua, mãos ou texto.
- [ ] Nomes exatamente como acima, em `.png`.
