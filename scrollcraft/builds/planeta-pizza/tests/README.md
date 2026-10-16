# Testes

## De navegador (`tests/e2e/`)

Rodam no Chromium com o `playwright-core`, contra o site servido localmente.

```bash
npm i -D playwright-core            # uma vez
npx serve -l 4500 .                 # ou qualquer servidor estático nesta pasta
node tests/e2e/cardapio.mjs http://localhost:4500/ /tmp/cap 390 844
node tests/e2e/checkout.mjs http://localhost:4500/ /tmp/cap 390 844
```

- Os dois últimos números são a largura e a altura da tela. Rode também em
  `360 640` e `1440 900`.
- O segundo argumento é o começo do nome das capturas de tela.
- `CHROME_PATH` aponta para o Chromium, se não estiver em
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
- Cada verificação imprime `PASS` ou `FAIL`. O processo sai com erro se alguma
  falhar ou se houver erro no console.

| Arquivo | Cobre |
|---|---|
| `cardapio.mjs` | WhatsApp oficial, logo, cartão da loja, contagem do cardápio, busca sem acento, janela do item (meio a meio, bordas, acréscimos, quantidade), pizza doce, molho obrigatório do cone, destaques e totais da comanda. |
| `checkout.mjs` | Os 9 critérios de aceite do `CHECKOUT.md`: o painel "Sua comanda", "Peça também", entrega e retirada, CEP (ViaCEP simulado), troco, validação, loja fechada (relógio fixado às 15h), mensagem do WhatsApp na ordem de comanda, "Pedir de novo" e dados lembrados. |

O `checkout.mjs` fixa o relógio às 21h de São Paulo com `page.clock`, para a
loja estar aberta.
