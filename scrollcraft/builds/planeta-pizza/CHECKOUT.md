# Trajeto do cliente até o pedido · especificação (Fase 1)

Este documento é o "prompt" do trajeto: o que o cliente vê, em que ordem, o que
o site valida e o que sai no fim. Serve para construir, revisar e testar.

## Objetivo

O cliente monta o pedido inteiro no site, sem cadastro, e sai com ele pronto
para a pizzaria: itens com as opções, entrega ou retirada, endereço, forma de
pagamento, troco e contato. Na Fase 1 o pedido segue pelo WhatsApp da
pizzaria (onde a loja já atende). As fases seguintes trocam só o destino:
banco de dados e painel da cozinha (Fase 2), pagamento online pelo Mercado
Pago (Fase 3) e avisos automáticos pela API do WhatsApp (Fase 4).

## O que as plataformas fazem, e o que o site copia

Base: iFood, Rappi, Uber Eats e a própria Anotaí (o fluxo que os clientes da
Planeta Pizza já conhecem), mais a pesquisa de usabilidade da Baymard sobre
delivery.

| Padrão das plataformas | No site |
|---|---|
| Barra fixa "Ver sacola · itens · total" em todo o cardápio | A barra "Ver comanda" que já existe |
| Uma tela só para sacola e finalização, rolando de cima para baixo | O painel "Sua comanda" vira a finalização inteira, sem etapas escondidas |
| Itens editáveis na sacola, com "Adicionar mais itens" | A comanda impressa, com + e −, e o link de volta para o cardápio |
| "Peça também" (bebidas) antes de pagar | Uma faixa de bebidas com um toque para adicionar |
| Entrega ou retirada no alto, com prazo e taxa à vista | Um seletor com o prazo e a taxa de cada um |
| Endereço com CEP e campos claros; retirada mostra o endereço da loja | CEP preenche rua e bairro; retirada mostra o endereço e o tempo de preparo |
| "Pagar na entrega" e "Pagar pelo app", cada loja com as suas formas | Pagar na entrega (ou na retirada): dinheiro com troco, cartão na maquininha. Pagar pelo site (Pix e cartão) entra com o Mercado Pago |
| Troco: "precisa de troco? para quanto?" | Sim ou não; o valor precisa ser maior que o total |
| Identificação leve (nome e celular), lembrada na próxima vez | Nome e celular com máscara, guardados no aparelho |
| Resumo de valores antes do botão final | Subtotal, taxa de entrega e total; o total também no botão |
| Loja fechada não aceita pedido | O pedido fica montado, mas o envio só abre no horário |
| "Pedir de novo" | O último pedido enviado volta com um toque |

Problemas que a Baymard encontrou em todas as plataformas e que o site evita:
prazo de entrega vago (aqui o prazo aparece na escolha e no resumo) e falta
de caminho de volta (aqui o cardápio está sempre a um toque, e nada do que o
cliente preencheu se perde ao voltar).

## A tela: "Sua comanda" (um painel, uma rolagem)

Abre pela barra "Ver comanda", pelo botão "Fazer pedido" da comanda da página
e pelo botão da barra superior. No celular ocupa quase a tela toda; no
computador, uma coluna à direita.

1. **Aviso de loja fechada** (só quando fechada): "Fechado agora. Abre hoje
   às 17h45." O resto continua usável.
2. **Itens**: a comanda impressa (o papel térmico do site), uma linha por
   item, com as opções escolhidas, + e −, e "Adicionar mais itens".
3. **Peça também**: bebidas que ainda não estão na comanda. Um toque adiciona
   uma unidade.
4. **Entrega ou retirada**: dois botões grandes.
   - Entrega: "45 a 60 min · R$ 10,00". Abre o endereço: CEP (opcional, com
     preenchimento automático), rua, número, bairro, complemento, ponto de
     referência. Aviso "Entregamos em Araguari, MG". CEP de outra cidade é
     recusado.
   - Retirada: "20 a 25 min · sem taxa", com o endereço da pizzaria e um link
     para o mapa.
   - Prazos e endereço vêm da loja na Anotaí (`time_delivery` 45–60,
     `time_take` 20–25). Se a pizzaria não fizer retirada, `"retirada": null`
     no `#planeta-config` tira a opção e a entrega já vem escolhida.
5. **Pagamento**: o título acompanha a escolha acima ("Pagar na entrega" ou
   "Pagar na retirada").
   - Dinheiro → "Vai precisar de troco?" Não / Sim → "Troco para quanto?"
   - Cartão de crédito na maquininha.
   - Pagar pelo site (Pix, cartão): só aparece quando `pagamentoOnline` estiver
     ligado no `#planeta-config` (Fase 3).
6. **Seus dados**: nome e celular com DDD ("para a pizzaria falar com você
   sobre o pedido").
7. **Resumo**: subtotal, taxa de entrega (só na entrega), total e, se houver,
   "troco para".
8. **Rodapé fixo**: total e o botão "Fazer pedido". Abaixo, uma linha
   honesta: "Você confirma o envio no WhatsApp da pizzaria."

### Validação

Ao tocar em "Fazer pedido", o site confere na ordem da tela e para no
primeiro problema: rola até a seção, marca o campo ou o grupo e diz o que
falta, em português simples ("Escolha entrega ou retirada", "Escreva o
número"). Nada é apagado.

### Envio (Fase 1)

1. Abre o WhatsApp da pizzaria com a mensagem completa (formato abaixo).
2. Mostra "Seu pedido está pronto no WhatsApp": toque em enviar e a
   pizzaria confirma por lá. Botões: "Abrir o WhatsApp de novo" e "Já enviei"
   (limpa a comanda e guarda o pedido para o "Pedir de novo").
3. A animação do motoboy **não** toca aqui: ela fica para a confirmação real
   (Fases 2 e 3).

### Mensagem para a pizzaria (ordem de comanda)

```
Olá, Planeta Pizza! Quero fazer este pedido pelo site:

*Cliente:* Maria
*Celular:* (34) 99999-8888

*Entrega:* Rua Tal, 100, Centro, Araguari - MG
Complemento: casa 2
Referência: perto da praça

*Itens:*
2x Meia Calabresa / meia Planeta Pizza: R$ 122,00
   - Borda de Catupiry
   - Acréscimos: Bacon
1x Coca-Cola 2 L: R$ 12,00

Subtotal: R$ 134,00
Taxa de entrega: R$ 10,00
*Total: R$ 144,00*

*Pagamento:* Dinheiro, na entrega, troco para R$ 200,00
```

## O pedido como dado (o mesmo objeto nas próximas fases)

```js
{
  cliente: { nome, telefone },
  tipo: 'entrega' | 'retirada',
  endereco: { cep, rua, numero, bairro, complemento, referencia, cidade, estado } | null,
  retirada: { endereco, tempo } | null,
  itens: [{ id, nome, detalhes: [], quantidade, unitario }],
  subtotal, entrega, total,
  pagamento: { forma, nome, quando: 'entrega' | 'agora', trocoPara }
}
```

Ganchos já previstos em `site.js`:
- `PlanetaPizza.integracao.enviarPedido(pedido)` → Fase 2: grava o pedido e
  devolve `{ recebido, numero, previsao }`; só então toca o motoboy.
- `PlanetaPizza.integracao.abrirCheckout(pedido)` → Fase 3: pagamento
  online.

## Design

- A identidade do site: vermelho da casa, Bricolage nos títulos, o papel
  térmico da comanda, botões e opções iguais aos da janela do item.
- Movimento com propósito: as seções entram suavemente conforme o cliente rola
  o painel; o total do rodapé acompanha as mudanças. Com movimento reduzido,
  tudo aparece parado.
- Celular primeiro: alvos de toque de 44 px ou mais, campos de 16 px (o
  iPhone não dá zoom), teclado numérico onde faz sentido, rodapé fixo acima
  da área segura.
- Acessível: cada grupo com título, erros ligados ao campo, foco visível,
  Esc fecha, o foco volta para quem abriu.

## Critérios de aceite (o teste automático confere)

1. A barra e os botões de pedido abrem o painel com a comanda.
2. Faltando dados, o envio para no primeiro problema e explica.
3. Entrega soma a taxa; retirada tira a taxa e mostra o endereço da loja.
4. Troco menor que o total é recusado.
5. "Peça também" adiciona uma bebida e atualiza o total.
6. A mensagem do WhatsApp tem tudo, na ordem de comanda.
7. Loja fechada: o pedido fica montado, mas não é enviado.
8. Nome, celular e endereço voltam preenchidos; "Pedir de novo" repõe o
   último pedido enviado.
9. Sem rolagem lateral e sem erro no console, no celular e no computador.

Fontes da pesquisa: [Baymard, delivery e retirada 2026](https://baymard.com/blog/food-delivery-and-takeout-ux-benchmark-2026),
[Canaltech, formas de pagamento no iFood](https://canaltech.com.br/apps/como-trocar-forma-pagamento-ifood/),
[Tecnoblog, Pix no iFood](https://tecnoblog.net/442832/ifood-libera-pix-como-forma-de-pagamento-em-todo-o-brasil/).
