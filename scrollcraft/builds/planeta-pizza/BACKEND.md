# Prompt: sistema de pedidos próprio da Planeta Pizza (backend completo)

> **Como usar este arquivo:** entregue este documento inteiro à IA que vai
> construir o sistema (por exemplo: "Leia `scrollcraft/builds/planeta-pizza/BACKEND.md`
> e construa tudo o que ele pede, na ordem dos marcos"). Ele é a especificação
> fechada: as decisões já estão tomadas. A IA não deve trocar a pilha, inventar
> dados ou pular os critérios de aceite.

---

## 0. Seu papel e o resultado esperado

Sua tarefa é construir, testar e documentar o **sistema de pedidos próprio da
Planeta Pizza** (Araguari, MG), dentro deste repositório, sobre o site que já
existe.

**Resultado:** um sistema completo e funcionando em **modo de teste**, em que
só falta colar as chaves de produção para ligar:

1. **Pagamento online** (Mercado Pago: Pix e cartão). Construído e testado com
   as credenciais de teste.
2. **Número do WhatsApp automático** (WhatsApp Cloud API, da Meta). Construído e
   testado com o número de teste gratuito da Meta.

Todo o resto fica 100% pronto e funcionando com o banco de dados real:
- pedidos pelo site;
- painel de pedidos da cozinha;
- painel de gestão para o dono editar cardápio, preços, fotos, horários e taxas;
- página de acompanhamento do pedido;
- relatórios, clientes, LGPD e monitoramento.

Quem configura depois é o desenvolvedor (dono deste repositório) junto com o
cliente (a pizzaria), seguindo o `CONFIGURAR.md` que você vai escrever (seção 16).

---

## 1. Regras que não se negociam

1. **Segredos nunca no código nem no chat.**
   - Toda chave secreta é variável de ambiente na Vercel (e no ambiente de
     desenvolvimento). O cliente cola as dele direto na Vercel.
   - Nunca peça senha ou chave secreta a ninguém na conversa.
   - Mantenha um `.env.example` só com os **nomes** das variáveis.
2. **Não invente dados.** Nenhum produto, preço, avaliação, número de pedidos,
   depoimento ou contato inventado.
   - O cardápio inicial vem de `dados/cardapio.json`, que é o da loja na Anotaí.
   - Texto que dependa de informação que você não tem fica como campo
     editável no painel, vazio ou com aviso, nunca preenchido com chute.
3. **O motoboy só sai com pedido recebido de verdade.**
   - A animação de entrega (`PlanetaPizza.pedidoRecebido`) só toca quando o
     servidor confirma o pedido gravado:
     - pagamento na entrega ou na retirada: o pedido foi salvo;
     - Pix ou cartão: o pagamento foi aprovado.
   - Nunca toca antes disso.
4. **A Anotaí continua funcionando em paralelo** até a pizzaria decidir
   desligar.
   - Não acesse nem imite a API privada da Anotaí, e não tente contornar
     bloqueios (Cloudflare) de site nenhum.
   - O sistema precisa de um interruptor que volte o site para o modo da Fase 1
     (pedido pronto pelo WhatsApp de pedidos).
5. **O site atual não pode piorar.**
   - O motor do ScrollCraft (`scrollcraft.js` e `scrollcraft.css`) não se mexe.
   - O visual, os efeitos de scroll, a acessibilidade e o desempenho continuam
     iguais ou melhores.
   - Os testes atuais (`tests/e2e/`) continuam passando, adaptados só onde o
     comportamento mudou de propósito.
6. **O servidor é a fonte da verdade do preço.**
   - O navegador manda **o que** o cliente escolheu, nunca quanto custa.
   - O servidor recalcula tudo, em **centavos inteiros**.
7. **Português do Brasil simples** em toda tela, mensagem e erro voltado para
   cliente ou para a pizzaria. Nada de jargão técnico na tela.
8. **Contas no nome certo** (para a documentação):
   - Mercado Pago, Meta/WhatsApp e domínio: no nome e no CNPJ da pizzaria;
   - Vercel e Supabase: do desenvolvedor, com acesso por convite.
9. **Vercel:**
   - o projeto deste site é `planeta-pizza-cardapio`;
   - **não toque** no projeto `planeta-pizza-araguari`;
   - não faça push em `main`. Trabalhe em um branch e abra PR.

---

## 2. Contexto: o que já existe

Pasta do site: `scrollcraft/builds/planeta-pizza/`. **Leia antes de começar:**

| Arquivo | O que é |
|---|---|
| `CHECKOUT.md` | Especificação da finalização do pedido (Fase 1, pronta). Define o objeto `pedido`, os ganchos e os critérios de aceite. |
| `README.md` | Estrutura do site, configuração e **regras do cardápio da Anotaí** (seção "Cardápio"). |
| `BRIEF.md` | Decisões de design e histórico do projeto. |
| `index.html` | Página única. Cardápio gerado entre os comentários `<!-- destaques:inicio -->`, `<!-- cardapio:inicio -->` e `<!-- opcoes:inicio -->`, mais `<script id="planeta-config">` (WhatsApp, taxa, tempos, retirada, `pagamentoOnline`). |
| `site.js` | Toda a lógica do site: cardápio, janela do item (sheet), carrinho, comanda, finalização numa tela só, envio, "Pedir de novo" e animação de entrega. |
| `site.css` | Estilos e **tokens de design** (cores, fontes, raios). |
| `tools/cardapio.py` | Gera o HTML do cardápio a partir de `dados/anotai-menu.txt` e grava `dados/cardapio.json`. |
| `dados/cardapio.json` | Cardápio legível: `secoes[]` (salgadas, doces, esfihas, cone, bebidas → `itens[]` com `id`, `nome`, `desc`, `preco`) e `opcoes` (bordas, acréscimos, molhos). |
| `assets/menu/<id>.webp` | Fotos e ilustrações dos produtos, por `id`. |
| `tests/e2e/cardapio.mjs`, `tests/e2e/checkout.mjs` | Testes de navegador atuais (Playwright). Veja `tests/README.md`. |

**Como o site funciona hoje (Fase 1):**
- O cliente monta o pedido no painel "Sua comanda": itens, "Peça também",
  entrega ou retirada, pagamento na entrega, nome e celular.
- O pedido vai pronto para o WhatsApp de pedidos, (34) 98837-1707.
- O site já tem os ganchos para o backend em `site.js`:
  - `window.PlanetaPizza.integracao.enviarPedido(pedido)` → promessa de
    `{ recebido, numero, previsao }`. Se existir, o site usa isso em vez do
    WhatsApp e, com `recebido: true`, toca o motoboy.
  - `window.PlanetaPizza.integracao.abrirCheckout(pedido)` → chamado quando a
    forma de pagamento é online (`quando: 'agora'`).
  - `window.PlanetaPizza.pedidoRecebido({ numero, previsao })` → toca a
    animação e mostra "Pedido recebido!".
- Os campos de pagamento online (Pix e cartão) já existem escondidos em
  `[data-co-online]` e aparecem quando a configuração diz `pagamentoOnline: true`.

**Dados reais da loja** (vieram da Anotaí, confirmados com o cliente):

| Campo | Valor |
|---|---|
| Nome | Planeta Pizza |
| Razão social | Andrade e Zanon Alimentação e Comércio |
| CNPJ | 33.363.935/0001-91 |
| Endereço | Rua Padre Anchieta, 154, Loja A, Jardim Regina, Araguari - MG, 38440-132 |
| Horário | Todos os dias, 17h45 às 23h (America/Sao_Paulo) |
| Entrega | 45 a 60 min, taxa única de R$ 10 |
| Retirada | 20 a 25 min, sem taxa |
| WhatsApp de pedidos (atendimento humano) | (34) 98837-1707 |
| WhatsApp das mensagens automáticas | Ainda não definido: um chip novo, só para a API. **Não use** o (34) 98408-9429, que é o do robô da Anotaí. |
| Pagamento hoje | Na entrega: dinheiro (com troco) e cartão na maquininha |
| Instagram | @planetapizzaaraguari |

---

## 3. Pilha (decidida, não troque)

| Peça | Escolha | Por quê |
|---|---|---|
| Hospedagem e funções | **Vercel** (projeto `planeta-pizza-cardapio`). Funções Node 22 em `api/`, ESM. | Já hospeda o site. Uso comercial pede o plano Pro. |
| Banco, login, tempo real e arquivos | **Supabase**: Postgres + Auth + Realtime + Storage | Plano grátis no começo, tempo real para a cozinha, RLS. |
| Pagamento | **Mercado Pago, Checkout API via Orders** (`/v1/orders`): Pix com QR na tela e cartão com o **Card Payment Brick** | Tudo dentro do site, e o número do cartão nunca passa pelo servidor. |
| WhatsApp automático | **WhatsApp Cloud API**, direto com a Meta (sem intermediária) | Sem mensalidade de plataforma; paga só por mensagem. |
| CEP | ViaCEP (já usado no site) | Grátis, sem cadastro. |
| Front dos painéis e da página de acompanhamento | **HTML + CSS + JavaScript puro em ES modules**, sem framework e sem etapa de build. `@supabase/supabase-js` por CDN, com versão fixada. | Mesmo jeito do site; deploy simples; manutenção fácil. |
| Dependências do servidor | Só `@supabase/supabase-js`. Mercado Pago e Meta via `fetch`. | Menos peças para quebrar. |
| Testes | `node --test` (unitários) e Playwright (`playwright-core`, Chromium do sistema) | Já usados no projeto. |

**Antes de codar as integrações**, leia a documentação oficial atual e siga os
nomes de campo exatos de lá. Os detalhes abaixo foram conferidos em outubro de
2026, mas a documentação oficial manda:
- **Mercado Pago:**
  - Pix via Orders: https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-integration/pix
  - Notificações (webhooks): https://www.mercadopago.com/developers/en/docs/your-integrations/notifications/webhooks
  - Cartões de teste: https://www.mercadopago.com.br/developers/en/docs/checkout-api-orders/resources/test-cards
  - Card Payment Brick: na documentação de Checkout Bricks, em
    https://www.mercadopago.com.br/developers/pt/docs
- **WhatsApp Cloud API:**
  - Visão geral: https://developers.facebook.com/docs/whatsapp/cloud-api
  - Preços: https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing

---

## 4. Estrutura de pastas

Tudo dentro de `scrollcraft/builds/planeta-pizza/`:

```
api/                          funções da Vercel (cada arquivo é um endpoint)
  _lib/                       só do servidor (o "_" impede virar endpoint)
    supabase.mjs              cliente com a service role
    auth.mjs                  confere o login da equipe e o papel
    mercadopago.mjs           adaptador do Mercado Pago (fetch injetável)
    whatsapp.mjs              adaptador da Meta (fetch injetável)
    assinatura.mjs            HMAC dos webhooks
    limites.mjs               limite de tentativas
    http.mjs                  respostas JSON, erros, corpo bruto
    log.mjs                   alertas e logs estruturados
  loja.js                     GET público: estado da loja e configuração do site
  cardapio.js                 GET público: cardápio
  pedidos/index.js            POST público: cria o pedido
  pedidos/status.js           GET público: ?t=TOKEN
  pedidos/pagar.js            POST público: nova tentativa de pagamento do mesmo pedido
  pedidos/avaliar.js          POST público (marco 7)
  pagamentos/webhook.js       POST Mercado Pago
  whatsapp/webhook.js         GET verificação e POST mensagens da Meta
  painel/*.js                 endpoints autenticados da equipe (seção 9)
  cron/manutencao.js          a cada 5 min (Vercel Cron)
  cron/backup.js              diário
  dev/simular-pagamento.js    só com DEV_TOOLS=1 (seção 7.6)
  saude.js                    GET: o que está configurado e o que responde
shared/                       módulos puros usados no servidor E no navegador
  preco.mjs                   motor de preço (seção 6)
  status.mjs                  máquina de estados do pedido (seção 5.3)
  horario.mjs                 loja aberta ou fechada, fuso America/Sao_Paulo
  dinheiro.mjs                centavos ↔ "R$ 1.234,56"
  telefone.mjs                normalização BR
  mensagens.mjs               textos do WhatsApp com variáveis
painel/                       painel da pizzaria (PWA)
  index.html                  login
  pedidos.html                cozinha
  gestao.html                 escritório: loja, cardápio, equipe, mensagens, integrações
  relatorios.html             relatórios e clientes
  painel.css                  usa os tokens de ../site.css
  *.js                        um módulo por tela
  manifest.webmanifest, sw.js
pedido/index.html             acompanhamento público (rota /p/:token)
privacidade/index.html        política de privacidade
supabase/migrations/          SQL numerado: tabelas, RLS, funções, publicação realtime
supabase/seed.sql             loja e horários
scripts/
  seed-cardapio.mjs           importa dados/cardapio.json para o banco
  criar-dono.mjs              cria o primeiro login de dono
  snapshot-cardapio.mjs       regrava o HTML do cardápio no index.html a partir do banco
tests/unit/*.test.mjs
tests/e2e/*.mjs
build.sh                      monta dist/ (público) para a Vercel
vercel.json                   rewrites, headers, crons
package.json, .env.example
CONFIGURAR.md                 passo a passo para ligar tudo (seção 16)
```

**Publicação na Vercel:**
- Projeto com **Root Directory = `scrollcraft/builds/planeta-pizza`**, de
  preferência ligado ao GitHub. Sem integração Git, use `vercel deploy` dessa
  pasta.
- `buildCommand: bash build.sh`, `outputDirectory: dist`. As funções em `api/`
  são detectadas na raiz.
- `build.sh` copia para `dist/` só o que é público: o site, `shared/`,
  `painel/`, `pedido/`, `privacidade/`, `assets/` e `fonts/`. **Nunca** copia
  `BRIEF.md`, `PROMPTS-CHATGPT.md`, `dados/`, `tools/`, `scripts/`,
  `supabase/` ou `tests/`.
- Enquanto `NOINDEX=1`, o build injeta `<meta name="robots" content="noindex">`
  e o `vercel.json` manda `X-Robots-Tag: noindex`. É o comportamento de hoje;
  sai quando o domínio próprio entrar.
- Rewrites:
  - `/p/:token` → `/pedido/index.html`;
  - `/painel` → `/painel/index.html`.

---

## 5. Banco de dados (Supabase / Postgres)

Escreva migrações SQL numeradas e idempotentes. Regras gerais:
- Dinheiro em `integer` (centavos).
- Datas em `timestamptz`; regra de negócio sempre no fuso `America/Sao_Paulo`.
- `id uuid default gen_random_uuid()` onde não houver id natural.
- **RLS ligado em todas as tabelas**, negando tudo por padrão.

### 5.1 Tabelas

**Loja e regras**
- `loja`: **uma linha só** (`id = 1` com check).
  - Contato e textos: `nome`, `razao_social`, `cnpj`, `endereco` (jsonb),
    `whatsapp_pedidos` (dígitos), `aviso_site` (texto opcional, faixa no topo).
  - Tempos e taxas: `tempo_entrega_min`, `tempo_entrega_max`,
    `tempo_retirada_min`, `tempo_retirada_max`, `taxa_entrega` (centavos),
    `taxa_por_bairro` (bool), `pedido_minimo` (centavos).
  - Funcionamento: `retirada_ativa`, `aceitar_automatico` (bool),
    `estado_manual` (`'auto' | 'aberta' | 'fechada'`), `pausada_ate`
    (timestamptz; "pausar pedidos por X min").
  - Pagamentos: `pagamentos` (jsonb `{dinheiro, cartao_entrega, pix_online,
    cartao_online}`, cada um bool) e `pix_expira_min` (padrão 30; o mínimo do
    Mercado Pago na API de Orders é 30 min).
  - Interruptores do sistema:
    - `receber_pelo_sistema` (bool): desligado, o site volta à Fase 1 (pedido
      pelo WhatsApp);
    - `whatsapp_acompanhamento` (bool);
    - `whatsapp_aviso_pago` (bool, padrão **false**; ver seção 8.4).
  - `atualizado_em`.
- `horarios`: `dia_semana` (0 = domingo), `abre` (time), `fecha` (time).
  - Vários intervalos por dia.
  - `fecha` menor que `abre` significa que fecha depois da meia-noite.
- `excecoes_horario`: `data`, `fechado` (bool), `abre`, `fecha`, `motivo`
  (feriados e folgas).
- `bairros`: `nome`, `taxa` (centavos), `ativo`. Só valem com
  `loja.taxa_por_bairro`.

**Cardápio**
- `categorias`:
  - `id` (texto: `salgadas`, `doces`, `esfihas`, `cone`, `bebidas`), `nome`;
  - `tipo` (`'salgada' | 'doce' | 'esfiha' | 'cone' | 'bebida'`, igual ao
    `data-kind` do site);
  - `ordem`, `ativa`.
- `produtos`:
  - `id` (texto, o mesmo slug de hoje, como `calabresa` ou `coca-cola-2-l`),
    `categoria_id`, `nome`, `descricao`, `preco` (centavos);
  - `foto_url` (vazia = usa `assets/menu/<id>.webp` se existir);
  - `disponivel` (bool; pausado = false), `destaque` (bool), `ordem`;
  - `escolhas` (text[]; opção única obrigatória, como o "sabor" de uma
    bebida; hoje nenhum produto usa, mas o site suporta);
  - `rotulo_escolha`, `criado_em`, `atualizado_em`.
- `bordas`: `lista` (`'pizza' | 'doce'`), `nome`, `preco`, `ordem`, `ativa`.
- `acrescimos`: `lista` (`'pizza' | 'cone'`), `nome`, `preco`, `ordem`, `ativo`.
- `molhos_cone`: `nome`, `ordem`, `ativo`.
- `cardapio_versao`: um contador, incrementado por trigger a cada mudança no
  cardápio. Serve de cache.

**Clientes e pedidos**
- `clientes`:
  - `id`, `telefone` (E.164 sem `+`, único), `nome`, `email` (opcional, só do
    pagamento online);
  - `wa_id` (o id que a Meta manda; pode diferir do telefone, ver seção 8.6);
  - `opt_in_whatsapp` (bool), `criado_em`;
  - `ultimo_pedido_em`, `total_pedidos`, `total_gasto`;
  - `anonimizado_em`.
- `enderecos`: `cliente_id`, `cep`, `rua`, `numero`, `bairro`, `complemento`,
  `referencia`, `usado_em`.
- `pedidos`:
  - Identificação:
    - `id` (uuid);
    - `numero` (int, sequencial **por dia** de operação: a função
      `proximo_numero(data)` com lock, zerando a cada dia de São Paulo);
    - `data_ref` (date);
    - `token` (texto aleatório de 24 caracteres base62, único: a chave da
      página pública);
    - `codigo` (4 caracteres do alfabeto `23456789ABCDEFGHJKMNPQRSTUVWXYZ`,
      único entre os pedidos abertos: liga a conversa do WhatsApp ao pedido);
    - `idempotency_key` (único: evita pedido duplicado por duplo toque).
  - Cliente: `cliente_id`, `nome`, `telefone`, `email`.
  - Entrega:
    - `tipo` (`'entrega' | 'retirada'`);
    - `endereco` (jsonb snapshot: cep, rua, numero, bairro, complemento,
      referencia, cidade, uf);
    - `itens` (jsonb snapshot exatamente como impresso);
    - `observacao_geral` (opcional).
  - Valores: `subtotal`, `taxa_entrega`, `desconto`, `total` (centavos),
    `cupom_codigo`.
  - Pagamento:
    - `pagamento_forma` (`'dinheiro' | 'cartao_entrega' | 'pix' | 'cartao_online'`);
    - `pagamento_quando` (`'entrega' | 'agora'`);
    - `troco_para` (centavos ou null);
    - `pagamento_status` (`'na_entrega' | 'pendente' | 'aprovado' | 'recusado' | 'expirado' | 'estornado'`);
    - `mp_order_id`, `mp_payment_id`.
  - Andamento: `status` (seção 5.3), `motivo_cancelamento`, `previsao_de`,
    `previsao_ate`, `agendado_para` (marco 7).
  - Linha do tempo: `criado_em`, `pago_em`, `aceito_em`, `pronto_em`,
    `saiu_em`, `concluido_em`, `cancelado_em`.
  - WhatsApp: `opt_in_whatsapp`, `wa_vinculado_em`, `wa_ultima_entrada_em`
    (abre a janela de 24 h).
  - Outros: `origem` (`'site'`), `ip_hash`, `user_agent`.
- `pedido_itens`: `pedido_id`, `produto_id`, `nome`, `meia_id`, `borda`,
  `escolha`, `acrescimos` (text[]), `obs`, `quantidade`, `unitario`, `total`.
  Base dos relatórios de mais vendidos.
- `pedido_eventos`: `pedido_id`, `de`, `para`, `por_usuario`, `origem`
  (`'site' | 'painel' | 'webhook_mp' | 'cron' | 'whatsapp'`), `detalhe`, `em`.
  É a auditoria completa.
- `pagamentos`: `pedido_id`, `provedor` (`'mercadopago'`), `externo_id`,
  `metodo`, `status`, `status_detalhe`, `valor`, `expira_em`, `qr_code`,
  `qr_code_base64`, `bruto` (jsonb), `criado_em`, `atualizado_em`.
- `estornos`: `pagamento_id`, `valor`, `motivo`, `externo_id`, `status`,
  `por_usuario`, `em`.

**WhatsApp, equipe e infraestrutura**
- `whatsapp_mensagens`: `direcao` (`'entrada' | 'saida'`), `wa_id`,
  `pedido_id`, `tipo` (`'texto' | 'template'`), `template`, `corpo`,
  `meta_message_id`, `status` (`'enviada' | 'entregue' | 'lida' | 'falhou'`),
  `erro`, `cobravel` (bool), `em`.
- `textos_whatsapp`: `chave`, `corpo` (com variáveis), `ativo`. Editável no
  painel; seed com os textos da seção 8.3.
- `equipe`: `user_id` (auth.users), `nome`, `papel` (`'dono' | 'atendente'`),
  `ativo`.
- `webhooks_recebidos`: `provedor`, `evento_id` (único), `recebido_em`,
  `processado_em`, `erro`. Garante a idempotência.
- `alertas`: `nivel` (`'info' | 'aviso' | 'erro'`), `origem`, `mensagem`,
  `contexto` (jsonb), `visto_em`, `em`.
- `limites`: `chave`, `janela_inicio`, `contagem`. Limite de tentativas por IP
  ou telefone.
- Do marco 7:
  - `cupons`: `codigo` (único, maiúsculo), `tipo` (`'percentual' | 'valor' | 'frete'`),
    `valor`, `minimo`, `inicio`, `fim`, `limite_total`, `limite_por_cliente`,
    `ativo`, `usos`;
  - `avaliacoes`: `pedido_id` (único), `nota` (1 a 5), `comentario`, `em`.

### 5.2 Segurança no banco (RLS)

- **`anon`** (público): nenhuma tabela.
  - Tudo que é público passa pelas funções em `api/`, que usam a service role.
  - Exceção: o bucket público `cardapio` no Storage, que é só leitura.
- **`authenticated`**, com papel lido de `equipe`:
  - **atendente**: SELECT em `pedidos`, `pedido_itens`, `pedido_eventos` e
    `loja`. Atualiza status só pela API.
  - **dono**: SELECT em tudo; escrita no cardápio, na `loja`, em `horarios` e
    nas tabelas de configuração.
- Pedidos e pagamentos **só mudam pela API** (service role). Assim todo efeito
  colateral (WhatsApp, estorno, auditoria) passa por um lugar só.
- Coloque `pedidos` na publicação `supabase_realtime` para a cozinha receber
  INSERT e UPDATE ao vivo.
- Storage:
  - bucket `cardapio` (público, só imagens, até 2 MB) para fotos de produto;
  - bucket privado `backups`.
- **Desligue o cadastro público** no Supabase Auth. Quem cria login é o dono,
  pelo painel, ou o script `criar-dono.mjs`.

### 5.3 Estados do pedido (`shared/status.mjs`)

```
aguardando_pagamento ──(pago)──▶ novo ──▶ em_preparo ──▶ pronto ──▶ saiu ──▶ concluido
        │                          │           │            │         │
        └──(expirou/recusado)──▶ cancelado ◀───┴────────────┴─────────┘
```

- **`aguardando_pagamento`**: só para Pix e cartão online. **Não aparece na
  cozinha.** Expira com o Pix (cron).
- **`novo`**: chegou na loja.
  - Toca o alarme e espera o "Aceitar".
  - Com `aceitar_automatico`, vai direto para `em_preparo` e a cozinha só é
    avisada.
- **`em_preparo`**: aceito. Grava `aceito_em` e a previsão (`previsao_de` e
  `previsao_ate` = agora + tempos do tipo).
- **`pronto`**:
  - na retirada: é o aviso "pode vir buscar";
  - na entrega: etapa opcional, que dá para pular direto para `saiu`.
- **`saiu`**: só na entrega. Na página do cliente, toca o motoboy.
- **`concluido`**: entregue ou retirado.
- **`cancelado`**: exige motivo. Se o pagamento foi online e aprovado, o
  servidor **estorna sozinho** pelo Mercado Pago e registra em `estornos`.

As transições permitidas ficam numa tabela em `shared/status.mjs`, testada.
Qualquer outra transição dá erro 409. Toda transição grava `pedido_eventos` e
dispara as mensagens da seção 8.

---

## 6. Motor de preço (`shared/preco.mjs`): o coração

É uma função pura, sem rede:

```
calcularPedido(cardapio, loja, carrinho, opcoes) → { itens, subtotal, taxa, desconto, total, erros }
```

- Tudo em **centavos**.
- O mesmo módulo roda no servidor e nos painéis.
- O site (`site.js`, script clássico) mantém a conta dele para mostrar na
  tela, mas um **teste de paridade** garante que dá o mesmo valor em todas as
  combinações (seção 14).

**O carrinho que o site manda** (troque o envio de preços por escolhas):

```js
{ itens: [ {
    produto_id: 'calabresa',
    meia_id: 'planeta-pizza' | null,       // só pizzas
    borda: 'Catupiry' | null,               // nome da borda, da lista que vale para essa pizza
    escolha: null,                          // produtos com `escolhas`
    molho: null,                            // cone: obrigatório
    acrescimos: ['Bacon'],                  // nomes, da lista que vale
    obs: 'sem cebola',                      // até 140 caracteres
    quantidade: 2                           // 1 a 20
} ] }
```

**Regras** (as mesmas da Anotaí que o site já segue; veja `README.md` →
"Cardápio" e `site.js` → `pizzaLists` e `unitPrice`):

1. **Pizza** é qualquer produto de categoria `salgada` ou `doce` (8 fatias).
2. **Meio a meio:**
   - qualquer outra pizza disponível, salgada ou doce;
   - preço base = **o maior** dos dois sabores;
   - nome impresso: `Meia {A} / meia {B}`.
3. **Listas que valem para a pizza:**
   - pizza **doce inteira**: bordas da lista `doce` e **nenhum acréscimo**;
   - qualquer outra pizza (salgada, ou qualquer meio a meio, inclusive
     doce/doce): bordas da lista `pizza` e acréscimos da lista `pizza`.
4. **Borda:** zero ou uma, da lista que vale. Soma o preço dela.
5. **Acréscimos:** zero ou mais, sem repetir, da lista que vale. Soma cada um.
6. **Planeta Cone:** exatamente 1 molho de `molhos_cone` (sem custo), mais
   acréscimos opcionais da lista `cone`.
7. **Esfihas e bebidas:** sem opções. O que tiver `escolhas` exige uma delas.
8. **Unitário** = base + borda + acréscimos. **Total da linha** = unitário ×
   quantidade.
9. **Taxa de entrega:**
   - só se `tipo = 'entrega'`;
   - `taxa_entrega` única, ou a do bairro se `taxa_por_bairro`;
   - bairro desconhecido com taxa por bairro ligada dá erro claro.
10. **Pedido mínimo:** se o subtotal for menor que `pedido_minimo`, dá erro
    com a mensagem "Pedido mínimo de R$ X".
11. **Cupom** (marco 7): aplicado depois do subtotal, nunca negativo.
    - Frete grátis zera a taxa.
12. **Validações** (cada erro com mensagem em português e o campo):
    - produto inexistente ou indisponível ("A Calabresa acabou de acabar.
      Tire da comanda para continuar.");
    - meia inválida, borda ou acréscimo fora da lista, molho faltando,
      quantidade fora do limite, obs longa demais.
13. **Detalhes impressos**, na ordem do site: escolha ou molho, `Borda de X`,
    `Acréscimos: A, B`, `Obs.: ...`.
    - É exatamente o formato de `site.js` (`details`), porque a cozinha e o
      WhatsApp usam o mesmo texto.

Se o total que o site mostrou for diferente do recalculado (preço mudou no
meio do caminho), a API responde **409** com o carrinho corrigido. O site
mostra "Os preços foram atualizados" e o novo total antes de o cliente
confirmar de novo. Nunca cobra um valor diferente do que o cliente viu.

---

## 7. API pública e pagamentos

Regras para toda função:
- Só responde a JSON; corpo até 32 KB.
- Erros no formato `{ erro: 'codigo', mensagem: 'texto para o cliente', campo? }`.
- Sem stack trace na resposta. O erro completo vai para o log e para
  `alertas` quando for grave.
- Cabeçalhos de segurança no `vercel.json`, com CSP que libere só:
  - o próprio domínio;
  - `*.supabase.co`;
  - `sdk.mercadopago.com` e os domínios que o SDK pedir;
  - `viacep.com.br`;
  - a CDN fixada do supabase-js;
  - Google Fonts, se usado.

### 7.1 `GET /api/loja`

Público, com cache de 30 s (`s-maxage=30, stale-while-revalidate=60`).
Devolve tudo que o site precisa para não ter nada fixo no HTML:

```js
{ aberta: true, motivo_fechada: null, abre_em: '17:45', fecha_em: '23:00', texto_status: 'Aberto agora · até 23h',
  horarios_texto: 'Todos os dias, 17h45 às 23h', aviso_site: null,
  entrega: { ativa: true, taxa: 1000, por_bairro: false, tempo: '45 a 60 min' },
  retirada: { ativa: true, tempo: '20 a 25 min', endereco: 'Rua Padre Anchieta, 154, Jardim Regina, Araguari - MG' },
  pedido_minimo: 0, a_partir_de: 3200,
  pagamentos: { dinheiro: true, cartao_entrega: true, pix_online: false, cartao_online: false },
  sistema: { receber_pelo_sistema: true, mp_public_key: 'APP_USR-...' | null, whatsapp_acompanhamento: false, whatsapp_numero: null },
  whatsapp_pedidos: '5534988371707', cardapio_versao: 42 }
```

**Regras:**
- `aberta` combina, nessa ordem de prioridade: `estado_manual`, `pausada_ate`,
  `excecoes_horario` e `horarios` (fuso de São Paulo, cruzando meia-noite).
- `a_partir_de` = menor preço entre as pizzas disponíveis.
- Pix e cartão online só saem `true` se o Mercado Pago estiver configurado
  (variáveis presentes) **e** ligados no painel.
- `whatsapp_acompanhamento` segue a mesma regra, com a Meta.

### 7.2 `GET /api/cardapio`

Público, com cache de 30 s, `ETag = cardapio_versao`. Devolve categorias,
produtos (com `foto` já resolvida), bordas, acréscimos e molhos, no formato que
o site precisa para desenhar a lista e a janela do item.

### 7.3 `POST /api/pedidos`: criar pedido

**Entrada:**

```js
{ idempotency_key: 'uuid-v4 gerado no navegador',
  cliente: { nome, telefone, email? },
  tipo: 'entrega' | 'retirada',
  endereco: { cep, rua, numero, bairro, complemento, referencia } | null,
  carrinho: { itens: [...] },          // seção 6
  total_visto: 14700,                  // o que o cliente viu, em centavos
  pagamento: { forma: 'dinheiro' | 'cartao_entrega' | 'pix' | 'cartao_online', troco_para?: 20000,
               cartao?: { token, payment_method_id, issuer_id, installments: 1, payer: { email, identification: { type, number } } } },
  opt_in_whatsapp: true | false,
  cupom?: 'CODIGO',
  agendado_para?: null,                // marco 7
  site: 'hp' }                         // honeypot: tem que vir vazio
```

**Passos, nesta ordem:**

1. **Barreiras:**
   - honeypot preenchido → 400 silencioso;
   - limite de **5 pedidos a cada 10 min por IP** (hash com sal) e **3 por
     telefone** → 429 com "Muitas tentativas. Espere alguns minutos.";
   - `idempotency_key` repetido → devolve o mesmo pedido já criado.
2. **Loja aberta** (`shared/horario.mjs`) e `receber_pelo_sistema` ligado;
   senão, 409 com o texto de fechada.
3. **Validação dos dados:**
   - nome com 2 a 60 caracteres;
   - telefone BR válido (`shared/telefone.mjs`: DDD e 8 ou 9 dígitos,
     normalizado para `55DDXXXXXXXXX`);
   - endereço completo na entrega;
   - retirada só se estiver ativa;
   - forma de pagamento ligada;
   - troco maior que o total;
   - e-mail obrigatório só para Pix e cartão online (o Mercado Pago pede).
4. **Preço:** `calcularPedido`. Diferença para `total_visto` → 409 com o
   carrinho corrigido (seção 6).
5. **Gravação**, numa transação SQL (uma função `criar_pedido` em plpgsql,
   chamada por RPC com a service role):
   - faz o upsert do cliente pelo telefone e guarda o endereço;
   - pega o próximo número do dia;
   - gera o token e o código únicos;
   - grava `pedidos` e `pedido_itens`, e o evento `criado`.
6. **Pagamento:**
   - **Na entrega ou na retirada:**
     - `status = 'novo'` (ou `em_preparo` com aceite automático);
     - `pagamento_status = 'na_entrega'`;
     - resposta: `{ recebido: true, ... }`.
   - **Pix:**
     - `status = 'aguardando_pagamento'`;
     - cria a order no Mercado Pago (7.5);
     - grava em `pagamentos`;
     - resposta com `pix: { qr_code, qr_code_base64, expira_em }` e
       `recebido: false`.
   - **Cartão online:**
     - cria a order com o token do Brick;
     - **aprovado** → `novo`, `pago_em`, `recebido: true`;
     - **em análise** → fica `aguardando_pagamento`, `recebido: false`,
       `pagamento: 'em_analise'`;
     - **recusado** → o pedido fica `aguardando_pagamento` (para uma nova
       tentativa em `/api/pedidos/pagar`) e a resposta traz a mensagem
       amigável do `status_detail` (7.5).
7. **Efeitos**, sem bloquear a resposta (com tratamento de erro e alerta):
   - WhatsApp do dono, se configurado (8.5).

**Resposta:**

```js
{ recebido: true, id, numero: 17, token, codigo: 'K7P2',
  previsao: '45 a 60 min', link: 'https://.../p/TOKEN',
  whatsapp_link: 'https://wa.me/55XXXXXXXXXXX?text=...' | null,  // 8.2
  total: 14700, pix?: {...}, pagamento?: 'em_analise' | 'recusado', mensagem? }
```

### 7.4 `GET /api/pedidos/status?t=TOKEN`

Público, sem cache. Devolve só o necessário:
- número, status, linha do tempo, previsão, tipo;
- itens (os textos impressos), totais e forma de pagamento;
- dados do Pix enquanto pendente;
- motivo do cancelamento e se houve estorno;
- `whatsapp_link`.

**Nunca devolve** o telefone completo nem o endereço completo: mostra só a rua
e o número. Token inválido → 404.

### 7.5 Mercado Pago (`api/_lib/mercadopago.mjs`)

**Configuração:**
- variáveis `MP_ACCESS_TOKEN` (secreta), `MP_PUBLIC_KEY` (pública) e
  `MP_WEBHOOK_SECRET` (secreta);
- sem elas, o pagamento online fica desligado e escondido no site.

**Criar Pix:**
- `POST /v1/orders` com `type: 'online'`, `processing_mode: 'automatic'`,
  `external_reference = pedido.id`, `total_amount` em reais com 2 casas a
  partir dos centavos, o pagador (`email`, nome) e a transação de pagamento
  com o método Pix e `expiration_time` (ISO 8601, `PT30M` por padrão,
  configurável, mínimo 30 min).
- Cabeçalho **`X-Idempotency-Key`** obrigatório. Use `pedido.id + ':' + tentativa`.
- Da resposta, guarde o id da order, o id da transação, o código "copia e cola"
  e o QR em base64.

**Cartão:**
- **Card Payment Brick** no site (seção 10.3), com `maxInstallments: 1`
  (pizza não se parcela).
- O Brick devolve token, `payment_method_id`, `issuer_id` e os dados do
  pagador. O servidor cria a order com esses dados.
- O número do cartão nunca passa pelo nosso servidor.

**Mensagens de recusa** (`status_detail` → texto para o cliente), no mínimo:

| `status_detail` | Mensagem |
|---|---|
| sem saldo ou limite | "Cartão sem limite suficiente. Tente outro cartão ou o Pix." |
| código de segurança | "Confira o código de segurança do cartão." |
| data de validade | "Confira a validade do cartão." |
| ligar para autorizar | "O banco pediu autorização. Ligue para o seu banco ou use o Pix." |
| recusa genérica | "O pagamento não foi aprovado. Tente outro cartão ou o Pix." |

Mapeie os nomes exatos da documentação atual.

**Webhook (`api/pagamentos/webhook.js`):**
1. Leia o **corpo bruto**.
2. Valide `x-signature`:
   - o cabeçalho vem como `ts=...,v1=...`;
   - monte o manifesto `id:{data.id};request-id:{x-request-id};ts:{ts};`,
     removendo as partes que não vierem; `data.id` vem da query string e,
     se for alfanumérico, em minúsculas;
   - calcule o HMAC-SHA256 em hex com `MP_WEBHOOK_SECRET` e compare com
     `v1` em tempo constante;
   - rejeite com 401 se não bater, e com tolerância de **10 min** no `ts`.
3. Idempotência por `webhooks_recebidos` (provedor + id do evento + ação).
4. **Nunca confie no corpo.** Busque a order ou o pagamento direto na API do
   Mercado Pago pelo id e decida pelo status de lá:
   - **pago** → pedido `aguardando_pagamento` → `novo` (ou `em_preparo`),
     `pago_em`, `pagamento_status = 'aprovado'`, evento, efeitos;
   - **expirado, cancelado ou recusado** → `pagamento_status` e, se for Pix
     expirado, pedido `cancelado` com o motivo "Pix não pago a tempo";
   - **pago depois de o pedido ser cancelado** (raro) → estorno automático e
     alerta de nível `erro` para o dono.
5. Responda 200 rápido. Erros internos viram `alertas` e 500, para o Mercado
   Pago reenviar.

**Estorno:**
- `refund` total pela API, com `X-Idempotency-Key`.
- É chamado ao cancelar um pedido pago e pelo botão "Estornar" do painel (só
  dono, com confirmação).
- Grava em `estornos`. O texto para o cliente é "O valor volta pela mesma
  forma de pagamento.", sem prometer prazo em dias.

**Modo de teste:**
- Credenciais de teste do Mercado Pago.
- Cartões de teste da documentação oficial. Hoje são Mastercard
  `5031 4332 1540 6351`, CVV 123, validade 11/30, e o nome do titular decide o
  resultado:
  - `APRO`: aprovado;
  - `OTHE`: recusado;
  - `CONT`: pendente;
  - e outros da documentação.
- Use o CPF de teste da documentação.

### 7.6 Simulador de Pix, só no modo de teste

Um Pix de teste gera o QR, mas **não dá para pagar**. Por isso:
- `POST /api/dev/simular-pagamento`:
  - existe **só** com `DEV_TOOLS=1` (nunca em produção; o build falha se
    `DEV_TOOLS=1` e `VERCEL_ENV=production`);
  - exige `Authorization: Bearer CRON_SECRET`;
  - executa o mesmo caminho do webhook "pago" para um pedido.
- Os testes e2e usam esse simulador. A prova real de Pix é feita na ligação
  (seção 16): um Pix de R$ 1 em produção, depois estornado.

### 7.7 `POST /api/pedidos/pagar`

Nova tentativa do mesmo pedido (cartão recusado, Pix expirado ou troca de Pix
para cartão):
- Entrada: `token` e os dados do pagamento.
- Só vale para `aguardando_pagamento` ou para um cancelamento por Pix expirado
  há menos de 30 min. Nesse último caso, o pedido reabre se a loja continuar
  aberta e os preços forem os mesmos.
- Também permite mudar para "pagar na entrega".

---

## 8. WhatsApp automático (Cloud API)

### 8.1 Princípio: o cliente chama primeiro

**Como funciona:**
- O sistema **não** sai mandando mensagem para o cliente.
- Depois do pedido, o site mostra o botão **"Acompanhar pelo WhatsApp"**. Ele
  abre o WhatsApp no número automático com a mensagem pronta:
  `Quero acompanhar meu pedido nº 17 (código K7P2)`.
- O cliente só aperta enviar. Isso:
  - abre a **janela de atendimento de 24 h**, em que o sistema pode mandar
    texto comum sem modelo aprovado;
  - vale como aceite do cliente.

**Custo:** as regras de preço da Meta mudaram em 1º/10/2026.
- As mensagens dentro da janela ("de serviço") passaram a ser cobradas no
  valor de utilidade do país.
- Cada número tem **1.000 mensagens de serviço grátis por mês**.
- Os modelos de utilidade dentro da janela também passaram a ser cobrados.
- **Mantenha poucas mensagens por pedido:** o padrão é 2 a 3.
- Mostre no painel o contador do mês (seção 9.6).
- Confira a página oficial de preços na hora de configurar.

### 8.2 O link "Acompanhar pelo WhatsApp"

- Formato: `https://wa.me/{WHATSAPP_NUMERO}?text=` + o texto codificado em URL.
- Só aparece se a integração estiver configurada e ligada.
- Aparece na confirmação do site e na página de acompanhamento.

### 8.3 Mensagens (texto comum, dentro da janela)

São editáveis em `textos_whatsapp`, com variáveis entre chaves e o padrão
abaixo. Cada mensagem tem liga e desliga no painel.

| Chave | Quando | Texto padrão | Padrão |
|---|---|---|---|
| `vinculo` | O cliente mandou o código | Oi, {nome}! Aqui é a Planeta Pizza 🍕 Seu pedido nº {numero} está *{status_texto}*. Vou te avisar por aqui. Se preferir, acompanhe também: {link} | ligada |
| `aceito` | `em_preparo` | Seu pedido nº {numero} foi aceito e já está sendo preparado! Previsão: {previsao}. | ligada |
| `pronto_retirada` | `pronto` + retirada | Seu pedido nº {numero} está pronto! Pode vir buscar na {endereco_loja}. | ligada |
| `saiu` | `saiu` | Seu pedido nº {numero} saiu para entrega! 🛵 | ligada |
| `concluido` | `concluido` | Pedido entregue. Bom apetite! 🍕 | **desligada** |
| `cancelado` | `cancelado` | Seu pedido nº {numero} foi cancelado: {motivo}. {texto_estorno} | ligada |
| `auto_resposta` | Qualquer outra mensagem | Este número só envia o andamento dos pedidos. Para falar com a gente, chame no WhatsApp (34) 98837-1707: https://wa.me/5534988371707 | ligada |
| `sem_pedido` | Código não encontrado | Não encontrei esse pedido. Confira o código na tela do pedido ou fale com a gente: https://wa.me/5534988371707 | ligada |

**Detalhes das variáveis:**
- `{previsao}` sai como "entre 20h45 e 21h";
- `{link}` é a página `/p/:token`;
- o número e o link do atendimento humano vêm de `loja.whatsapp_pedidos`,
  nunca fixos no código.

### 8.4 Fora da janela (modelos pagos, opcional)

- Se o cliente **não** abriu a conversa, ele acompanha pela página (grátis) e
  o sistema não manda nada.
- Com `whatsapp_aviso_pago` ligado e `opt_in_whatsapp` marcado no checkout
  (caixa "Quero receber o andamento do pedido pelo WhatsApp", desmarcada por
  padrão), o sistema manda **só** o modelo `pedido_saiu` ou
  `pedido_pronto_retirada`.

Deixe os textos dos modelos prontos em `CONFIGURAR.md`, para o
desenvolvedor submeter na Meta (categoria Utilidade, idioma `pt_BR`):

- `pedido_saiu`: "Seu pedido nº {{1}} da Planeta Pizza saiu para entrega. Acompanhe: {{2}}"
- `pedido_pronto_retirada`: "Seu pedido nº {{1}} da Planeta Pizza está pronto para retirada na {{2}}."
- `novo_pedido_dono`: "Novo pedido nº {{1}}: {{2}}, total {{3}}. Abra o painel: {{4}}"

Os nomes dos modelos aprovados ficam em variáveis de ambiente ou na `loja`.
Sem nome configurado, o sistema não manda.

### 8.5 Avisos para o dono (opcional)

- **O alarme do painel é o aviso principal.**
- Opcionalmente, telefones de dono cadastrados no painel recebem
  "🔔 Novo pedido nº {numero} · {tipo} · {total} · {pagamento}".
- Só vai se o dono abriu a janela naquele dia (ele manda `abrir` para o
  número no começo do expediente), ou pelo modelo `novo_pedido_dono` se
  configurado.
- A resposta a `abrir` é "Pronto! Você vai receber os pedidos de hoje por
  aqui."

### 8.6 Webhook da Meta (`api/whatsapp/webhook.js`)

**Verificação (GET):**
- confira `hub.mode === 'subscribe'` e `hub.verify_token === WHATSAPP_VERIFY_TOKEN`;
- responda `hub.challenge` em texto puro; senão, 403.

**Mensagens (POST):**
1. Valide `X-Hub-Signature-256`:
   - é `sha256=<hex>`, um HMAC-SHA256 do **corpo bruto** com
     `WHATSAPP_APP_SECRET`;
   - compare em tempo constante;
   - não reserialize o JSON antes de validar.
2. Idempotência pelo id da mensagem (`webhooks_recebidos`).
3. **Para cada mensagem recebida:**
   - grave em `whatsapp_mensagens`;
   - procure o código no texto: de preferência depois da palavra "código";
     se não houver, qualquer palavra de 4 caracteres do alfabeto do código
     (`/\b([2-9A-HJKMNP-Z]{4})\b/gi`, em maiúsculas). Só vale se bater com um
     pedido **aberto**;
   - **achou um pedido aberto com esse código:**
     - ligue o `wa_id` ao pedido e ao cliente;
     - grave `wa_ultima_entrada_em`;
     - responda `vinculo`;
   - **remetente é dono:** trate os comandos `abrir` e `pedidos`. O segundo
     responde um resumo dos pedidos abertos.
   - **qualquer outra mensagem:** se o `wa_id` tem pedido aberto, atualize
     `wa_ultima_entrada_em` e mande `auto_resposta`. Mande no máximo 1
     auto-resposta por `wa_id` a cada 6 h, para não gastar.
4. Status das mensagens enviadas (entregue, lida, falhou): atualize
   `whatsapp_mensagens`. Falha vira alerta.

**Atenção aos números brasileiros:** o `wa_id` que a Meta manda pode vir
**sem o 9** depois do DDD (12 dígitos). Por isso:
- a ligação com o pedido é pelo **código**, não pelo telefone;
- para responder, use sempre o `wa_id` recebido, não o telefone digitado.

### 8.7 Envio (`api/_lib/whatsapp.mjs`)

**Chamada:**
- `POST https://graph.facebook.com/{GRAPH_API_VERSION}/{WHATSAPP_PHONE_NUMBER_ID}/messages`
  com `Authorization: Bearer {WHATSAPP_TOKEN}`;
- texto: `{ messaging_product: 'whatsapp', to: wa_id, type: 'text', text: { body } }`;
- modelo: `type: 'template'`.

**Antes de mandar texto comum:**
- confira se a janela está aberta: `wa_ultima_entrada_em` há menos de 23 h e
  50 min;
- fora dela, só modelo (8.4), ou nada.

**Falhas:**
- erro 5xx ou de limite → nova tentativa pelo cron (até 3, só dentro da janela);
- erro 4xx → alerta, sem nova tentativa.

**Regras gerais:**
- Nunca bloqueie o fluxo do pedido por causa do WhatsApp.
- Sem as variáveis da Meta, o módulo não faz nada e o botão do site some.

**Modo de teste:**
- o número de teste gratuito da Meta (no app do Meta for Developers, em
  WhatsApp → API Setup) manda só para os números de destino cadastrados lá;
- o token temporário dura 24 h;
- na ligação de verdade, use um **token permanente** de um usuário do sistema
  no portfólio empresarial da pizzaria.

---

## 9. Painel da pizzaria (`/painel`)

É um PWA instalável ("Adicionar à tela inicial"), feito primeiro para tablet
e celular e que também funciona no computador.

**Visual:**
- mesma identidade do site: tokens de `site.css`, vermelho da casa,
  Bricolage nos títulos e o papel térmico da comanda nos cartões de pedido;
- **mais funcional que decorativo**: alto contraste, alvos de toque de 48 px,
  números grandes e nada que atrase a cozinha;
- sem animação de scroll nos painéis; só transições curtas;
- respeita `prefers-reduced-motion`.

### 9.1 Login e papéis

- E-mail e senha (Supabase Auth). A sessão fica lembrada no aparelho.
- "Esqueci a senha" pelo e-mail do Supabase.
- **Atendente:** vê e mexe só em Pedidos.
- **Dono:** vê tudo.
- O dono cria e desativa logins em Gestão → Equipe. A criação passa por um
  endpoint com service role e só aceita dono.

### 9.2 Pedidos (a cozinha): `painel/pedidos.html`

**Ao abrir:**
- tela cheia escura com o botão grande **"Ativar alarme e começar"**, porque o
  navegador só toca som depois de um toque;
- liga o **Wake Lock** (tela sempre acesa), com fallback de aviso
  "Deixe a tela ligada".

**Topo:**
- estado da loja (**Aberta** ou **Fechada**), com botões:
  - "Fechar agora" e "Abrir agora";
  - "Pausar 15, 30 ou 60 min";
- relógio;
- conexão (verde: ao vivo; amarelo: reconectando);
- contadores do dia.

**Colunas** (no celular, abas):
1. **Novos**
2. **Em preparo**
3. **Prontos / Saíram**
4. **Concluídos hoje** (recolhida)

**Cartão de pedido** (papel térmico):
- número grande, hora e **tempo desde que chegou** (fica laranja ao passar do
  tempo mínimo e vermelho ao passar do máximo);
- tipo (ENTREGA ou RETIRADA), nome, telefone com botão de ligar e botão de
  WhatsApp para o atendimento;
- endereço completo com "Abrir no mapa";
- itens com detalhes (o mesmo texto da comanda) e observações em destaque;
- pagamento:
  - "PAGO ONLINE (Pix)" em verde;
  - "Dinheiro, troco para R$ 100" em amarelo;
  - "Cartão na maquininha";
- total.

**Botões por estado:**
- **Novos:** **Aceitar** (grande) e **Recusar**.
  - Recusar exige motivo, com rápidos ("Acabou um ingrediente", "Fora da área
    de entrega", "Loja fechando") e um campo livre.
  - Pedido pago com Pix ou cartão é estornado automaticamente, com aviso
    antes de confirmar.
- **Em preparo:** **Pronto** (retirada) ou **Saiu para entrega** (entrega,
  com a opção de marcar Pronto antes).
- **Pronto ou Saiu:** **Entregue** ou **Retirado**.
- **Sempre:**
  - **Imprimir**;
  - **Mandar para o entregador**: abre `wa.me/?text=` sem número, com
    endereço, link do mapa, nome, telefone, valor a cobrar e troco. É grátis;
    o atendente escolhe o contato do motoboy;
  - **Cancelar**, com motivo e estorno automático se pago.

**Alarme:**
- som alto gerado com WebAudio (sem arquivo de áudio de terceiros), em ciclo
  enquanto houver pedido em **Novos**;
- vibração, título da aba piscando "(2) NOVO PEDIDO" e notificação do sistema
  se permitida;
- para só quando todos os novos forem aceitos ou recusados.

**Tempo real:**
- Supabase Realtime no INSERT e no UPDATE de `pedidos`;
- **mais** uma conferência a cada 20 s (se o tempo real cair, nada se perde);
- ao reconectar, recarrega a lista do dia.

**Impressão:**
- CSS `@media print` para bobina de **80 mm** (padrão) ou **58 mm**,
  escolhido em Gestão;
- fonte mono, número enorme, data e hora;
- tipo, cliente, telefone, endereço, itens e detalhes, obs, totais, pagamento
  e troco;
- "Impressão automática ao aceitar" é uma opção. Documente em
  `CONFIGURAR.md` que impressão sem toque exige Chrome em modo
  `--kiosk-printing` num computador, ou um app de impressão térmica no
  Android. Não construa driver.

**Histórico:**
- busca por número, nome ou telefone;
- filtro por dia;
- reimprimir;
- ver a linha do tempo (`pedido_eventos`).

### 9.3 Gestão → Loja (só dono)

- Abrir ou fechar manual, pausar, `aviso_site` (faixa no topo do site, com
  prévia).
- Horários por dia da semana (vários intervalos) e exceções (feriados).
- Tempos de entrega e retirada.
- Taxa única ou tabela de bairros.
- Pedido mínimo.
- Liga e desliga: retirada, aceite automático e cada forma de pagamento.
  - Pix e cartão online ficam travados com o aviso "Configure o Mercado Pago"
    enquanto as chaves não existirem.
- **"Receber pedidos do site por este painel"** (`receber_pelo_sistema`).
  Desligado, o site volta a mandar o pedido pelo WhatsApp de pedidos (Fase 1).
- Dados legais: razão social, CNPJ e endereço. Alimentam o rodapé e a
  política de privacidade.

### 9.4 Gestão → Cardápio (só dono)

**Categorias:** renomear, reordenar arrastando e ativar ou desativar.

**Produtos:**
- busca;
- **botão "Disponível" ou "Esgotado" na própria lista, num toque**: é a ação
  mais usada;
- editar nome, descrição e preço (com máscara de R$), destaque, ordem e
  categoria;
- **foto:** envio do celular, recortada em 4:3 e redimensionada no navegador
  para WebP de até 1200 px e 300 KB, que vai para o bucket `cardapio`;
- criar e duplicar produto;
- arquivar em vez de apagar, se já tiver pedido.

**Bordas, acréscimos e molhos:** as listas `pizza`, `doce` e `cone`, com
nome, preço, ordem e ativo. A tela explica em português simples quando cada
lista vale, com as regras da seção 6.

**Reajuste em lote:** "+ X% nas pizzas salgadas", com prévia antes e depois e
confirmação. Arredonda para R$ 0,50 ou R$ 1,00, à escolha.

Toda mudança incrementa `cardapio_versao`. O site mostra a novidade em até
1 minuto.

### 9.5 Gestão → Equipe e Mensagens (só dono)

- **Equipe:** criar login (nome, e-mail, papel), redefinir senha, desativar.
- **Telefones do dono** para os avisos (8.5).
- **Mensagens do WhatsApp:**
  - edita os textos da seção 8.3, com as variáveis listadas e prévia;
  - liga e desliga cada mensagem;
  - liga e desliga o aviso pago fora da janela;
  - nomes dos modelos aprovados.

### 9.6 Gestão → Integrações (só dono)

Uma página de estado, **sem nunca mostrar segredo**:

| Integração | Estado | Ações |
|---|---|---|
| Banco (Supabase) | ✅ | — |
| Mercado Pago | ❌ não configurado · 🧪 teste · ✅ produção | "Criar Pix de teste de R$ 1" (só no teste) |
| WhatsApp | ❌ · 🧪 número de teste · ✅ | "Mandar mensagem de teste para…" (um número cadastrado) |

- O modo vem do prefixo da chave: credencial de teste ou de produção.
- **WhatsApp:**
  - mensagens enviadas no mês e quanto falta para as 1.000 grátis;
  - estimativa de custo acima disso, com o valor por mensagem editável;
  - última entrada no webhook.
- **Alertas:** lista de `alertas` não vistos, com "marcar como visto". Um
  selo no menu quando houver erro.

### 9.7 Relatórios e clientes: `painel/relatorios.html` (só dono)

**Períodos:** hoje, ontem, 7 dias, mês atual, mês anterior e personalizado.

**Números:**
- faturamento (pedidos concluídos), número de pedidos e ticket médio;
- entrega × retirada;
- por forma de pagamento;
- cancelados (com os motivos);
- taxas de entrega arrecadadas.

**Gráficos:**
- pedidos por hora do dia (pico);
- por dia da semana;
- top 10 produtos e top sabores de meio a meio;
- tempo médio de aceite (`aceito_em − criado_em`), de preparo
  (`pronto_em − aceito_em`, ou `saiu_em`) e de entrega
  (`concluido_em − saiu_em`).

**Exportar CSV** de pedidos e de itens do período.

**Clientes:**
- lista com busca: nome, telefone, nº de pedidos, último pedido, total gasto;
- detalhe com os pedidos do cliente;
- **"Apagar dados deste cliente" (LGPD):** anonimiza nome, telefone, e-mail e
  endereços. Os pedidos ficam para os relatórios, sem dado pessoal.

Use funções SQL (views ou RPC) para as somas. Não some no navegador milhares
de linhas.

---

## 10. Mudanças no site (`index.html` e `site.js`)

Mexa o mínimo e preserve o comportamento e os testes atuais.

### 10.1 Dados vivos

- Crie `integracao.js`, um script clássico carregado depois de `site.js`.
- Ele busca `/api/loja` e `/api/cardapio` ao carregar e aplica os dados.
- **Se a API falhar ou não existir,** o site fica exatamente como hoje,
  com o HTML estático e a Fase 1.
- **Troque por dados vivos todo valor fixo da loja.** Hoje estão fixos:
  - `HOURS` em `site.js`;
  - `<span data-status-text>` e `loja__info` ("Todos os dias, 17h45 às 23h",
    "45 a 60 min · Entrega R$ 10,00", "Pizzas a partir de R$ 32");
  - "Pizzas a partir de" do payoff;
  - a lista `facts` da seção Comanda;
  - "Começar pela Calabresa, R$ 36,00";
  - a taxa da comanda;
  - o `#planeta-config`.
- Use atributos `data-bind="..."` e mantenha o texto atual como valor
  inicial. Para achar todos, procure no código por "R$", "17h45", "45 a 60",
  "Só" e "Entrega".
- **Cardápio:**
  - se `cardapio_versao` for diferente da versão embutida no HTML, redesenhe
    as seções com **a mesma marcação** que `tools/cardapio.py` gera (leia o
    script e reproduza classes e atributos `data-*`);
  - atualize o objeto `rows` e as `OPC` do `site.js` (exponha uma função
    `PlanetaPizza.recarregarCardapio(dados)` em vez de duplicar a lógica);
  - produto esgotado some da lista;
  - se estiver no carrinho, a linha fica marcada como "esgotado: remova para
    continuar".
- `scripts/snapshot-cardapio.mjs` regrava o HTML estático a partir do banco,
  entre os mesmos marcadores, no build, se as variáveis existirem. O HTML
  servido já nasce atualizado e o cardápio continua indexável.

### 10.2 Envio do pedido

- `integracao.js` registra `PlanetaPizza.integracao.enviarPedido(pedido)` e
  `abrirCheckout(pedido)` **somente quando** `/api/loja` disser
  `receber_pelo_sistema: true`.
- **O carrinho do `site.js` passa a guardar a escolha estruturada** de cada
  linha (seção 6): `produto_id`, `meia_id`, `borda`, `escolha`, `molho`,
  `acrescimos`, `obs`, `quantidade`.
  - Hoje isso está só na `key`.
  - O "Pedir de novo" guarda esse formato também. Linhas antigas sem ele são
    descartadas sem erro.
- Gere o `idempotency_key` quando o cliente toca em "Fazer pedido". Repita
  o mesmo se a requisição precisar ser reenviada (falha de rede). Um novo toque
  depois de corrigir algo gera outro.
- **Resposta 409 de preço:** mostre "Os preços foram atualizados", atualize o
  carrinho e o total, e peça um novo toque em "Fazer pedido".
- **Resposta 409 de loja fechada:** o aviso de fechada que já existe.
- **Sucesso com `recebido: true`:**
  1. guarde o último pedido;
  2. limpe a comanda;
  3. `pedidoRecebido({ numero, previsao })` (o motoboy);
  4. no cartão final da animação, mostre dois botões novos:
     - **"Acompanhar pedido"**, que vai para `/p/:token`;
     - **"Acompanhar pelo WhatsApp"**, só se `whatsapp_link` vier.
  5. Guarde `token` em `localStorage` (`planeta-pedidos-abertos`).
- Ao abrir o site com um pedido aberto, mostre um cartão discreto no topo da
  loja: "Pedido nº 17 · Em preparo · Acompanhar".

### 10.3 Pagamento online no site

Com `pix_online` ou `cartao_online` ligados, a seção `[data-co-online]`
aparece com as opções "Pix" e "Cartão de crédito" ("pagar agora, pelo site").
Ao escolher qualquer uma, aparece o campo **E-mail** ("para o comprovante do
Mercado Pago"), lembrado no aparelho.

**Pix:** "Fazer pedido" cria o pedido e mostra, no próprio painel da comanda,
a tela de Pix:
- QR Code grande;
- botão **"Copiar código Pix"**, com o retorno "Copiado!";
- contador regressivo de 30 min;
- o texto "Assim que o pagamento cair, seu pedido vai para a cozinha.";
- conferência do status a cada 3 s (pare quando a aba estiver oculta e confira
  de novo ao voltar);
- **aprovado** → motoboy;
- **expirou** → "O Pix expirou." com "Gerar novo Pix" e "Pagar na entrega"
  (`/api/pedidos/pagar`);
- **fechou a tela no meio** → o pedido aberto aparece no cartão do topo da
  loja e na página de acompanhamento, com o Pix de novo.

**Cartão:**
- renderize o **Card Payment Brick** (SDK `https://sdk.mercadopago.com/js/v2`,
  carregado só quando necessário) dentro da comanda;
- personalize com as cores do site (`customization.visual.style` com os
  tokens);
- `maxInstallments: 1`;
- no envio do Brick, mande o pedido junto (`POST /api/pedidos`);
- **aprovado** → motoboy;
- **recusado** → mensagem amigável e o Brick continua para outra tentativa;
- **em análise** → "Pagamento em análise. Avisamos aqui assim que for
  aprovado." e conferência do status.

**Acessibilidade e celular:** foco visível, leitura de tela nos estados
("Pix copiado", "Pagamento aprovado") e nada escondido atrás do teclado.

### 10.4 Rodapé e política de privacidade

- O rodapé já tem razão social, CNPJ e endereço. Acrescente o link
  "Política de privacidade".
- `privacidade/index.html`, no visual do site:
  - quem controla os dados: a razão social e o CNPJ da `loja`;
  - o que coleta: nome, celular, endereço, e-mail (só no pagamento online) e
    o pedido;
  - para quê: preparar, entregar e cobrar o pedido, e mandar o andamento;
  - com quem compartilha: Supabase (banco), Vercel (hospedagem), Mercado Pago
    (pagamento) e Meta/WhatsApp (avisos, só se o cliente pedir);
  - por quanto tempo;
  - como pedir para apagar (WhatsApp de pedidos);
  - o que fica no aparelho (`localStorage`: dados para preencher de novo e o
    último pedido) e como limpar.
- Deixe o prazo de guarda dos pedidos como campo editável, com o aviso
  "definir com o contador". Não invente prazo legal.

---

## 11. Página de acompanhamento (`/p/:token`)

Página pública, leve, no visual do site (papel térmico, vermelho da casa).

**Conteúdo:**
- "Pedido nº 17", hora do pedido e previsão;
- **linha do tempo** com as etapas do tipo:
  - entrega: Recebido → Em preparo → Saiu para entrega → Entregue;
  - retirada: Recebido → Em preparo → Pronto para retirar → Retirado;
  - etapa atual destacada, com hora de cada uma;
- **aguardando pagamento:** a tela de Pix de novo (QR, copiar e contador) ou o
  aviso de cartão em análise;
- **saiu:** toca a **mesma cena do motoboy** do site, uma vez, e depois mostra
  "Saiu para entrega!";
  - reaproveite os assets `assets/scene/*` e a coreografia do filme de
    `site.js`, sem duplicar arquivos de imagem;
- **cancelado:** o motivo e, se houve estorno, "O valor volta pela mesma forma
  de pagamento.";
- a comanda (itens e totais), a forma de pagamento e o troco;
- endereço da loja e "Falar com a pizzaria" (WhatsApp de pedidos);
- "Acompanhar pelo WhatsApp", se disponível.

**Atualização:**
- confere `/api/pedidos/status` a cada 10 s com a aba visível, e a cada 3 s
  enquanto aguarda Pix;
- para ao concluir ou cancelar.

**Avaliação** (marco 7): ao concluir, mostra "Como foi?", com 1 a 5 estrelas
e um comentário opcional. Uma por pedido.

---

## 12. Rotinas (Vercel Cron, autenticadas por `CRON_SECRET`)

A cada 5 minutos exige o plano Pro da Vercel. No plano grátis, o cron só roda
uma vez por dia. Nesse caso, a expiração do Pix também precisa ser conferida
na hora em que o pedido é consultado, o que você deve fazer de qualquer jeito.

**`/api/cron/manutencao`, a cada 5 min:**
- cancela pedidos `aguardando_pagamento` com Pix vencido. Antes de cancelar,
  confere no Mercado Pago se não foi pago;
- novas tentativas de WhatsApp que falharam (só dentro da janela);
- alerta "Pedido nº X esperando aceite há 10 min" e, se configurado,
  WhatsApp para o dono;
- limpa a tabela `limites` antiga.

**`/api/cron/backup`, diário às 4h de São Paulo:**
- exporta para o bucket privado `backups` um JSON por tabela de negócio
  (loja, cardápio, clientes e pedidos dos últimos 2 dias), com 30 dias de
  retenção;
- vale como reserva barata. No plano pago, o Supabase também tem backup
  diário próprio; documente isso.

O cron também evita que um projeto grátis do Supabase fique parado por falta
de uso.

---

## 13. Segurança, privacidade e qualidade

**Segurança:**
- **Webhooks:** assinatura obrigatória, corpo bruto e idempotência (MP e
  Meta).
- **Limites:** criação de pedido (7.3), login do painel (o do Supabase) e
  auto-resposta do WhatsApp (8.6).
- **Entradas:** tamanho máximo em todo campo e textos limpos de controle.
  Escape de HTML **sempre** no painel e na página pública (nome e obs vêm do
  cliente).
- **Painel:**
  - toda rota de `api/painel/*` confere o JWT do Supabase e o papel em
    `equipe`;
  - ações de dono (estorno, equipe, cardápio, loja) recusam atendente com 403.
- **Ninguém vê dado demais:**
  - a página pública mostra só o primeiro nome e a rua com o número;
  - os logs não gravam telefone completo, e-mail nem dados do pagamento.
- **Dinheiro:**
  - nunca confie em valores do navegador;
  - nunca libere pedido para a cozinha por causa do retorno do navegador.
    Só o servidor, consultando o Mercado Pago, aprova.

**Qualidade:**
- **Erros:** todo `catch` relevante grava em `alertas` com contexto (sem dado
  pessoal).
- **`/api/saude`:** responde
  `{ banco: true, mercadopago: 'teste'|'producao'|false, whatsapp: 'teste'|'producao'|false, versao }`,
  sem nenhum segredo.
- **Desempenho:** o site continua carregando o mesmo que hoje antes da
  interação. O SDK do Mercado Pago e o supabase-js só carregam quando
  necessário. A página `/p/` fica abaixo de 150 KB, sem as imagens da cena.

---

## 14. Testes (obrigatórios em cada marco)

**Unitários** (`tests/unit`, `node --test`, sem rede):

- **`preco`:**
  - todas as regras da seção 6;
  - **paridade com o `site.js`:** um teste de navegador
    (`tests/e2e/paridade.mjs`) abre o site e, para uma amostra ampla, abre a
    janela do item, marca as opções e lê o total. A amostra cobre:
    - todas as pizzas, inteiras;
    - meio a meio com uma meia mais cara, uma mais barata e uma doce;
    - cada borda da lista que vale;
    - 0, 1 e 2 acréscimos;
    - os cones.

    Compare o total com `calcularPedido`. Nenhuma diferença é aceita;
  - cones com e sem molho;
  - quantidade e limites;
  - centavos sem erro de arredondamento.
- **`status`:** todas as transições válidas e as inválidas.
- **`horario`:** fuso de São Paulo, depois da meia-noite, exceções, pausa e
  fechamento manual.
- **`telefone`:** formatos, com e sem 9, com e sem DDI.
- **Assinaturas:** HMAC do Mercado Pago e da Meta, com amostras fixas
  (válida, adulterada, `ts` velho).
- **`mensagens`:** variáveis, textos padrão e escape.
- **Adaptadores do Mercado Pago e da Meta:** com `fetch` falso. Confira o
  corpo enviado, os cabeçalhos (idempotência) e o tratamento de cada status.

**De navegador** (`tests/e2e`, Playwright, com o Chromium do sistema e
`page.clock` fixando 21h de São Paulo):

- **Os atuais** `cardapio.mjs` e `checkout.mjs` continuam passando.
  - Com o sistema desligado, o checkout é a Fase 1, idêntica.
- **`pedido-na-entrega.mjs`:**
  1. monta o pedido e envia;
  2. o motoboy toca, com número e previsão;
  3. no painel (outro contexto logado), o pedido chega em até 3 s, com o
     alarme ativo;
  4. Aceitar → a página `/p/` mostra Em preparo;
  5. Saiu → a página toca o motoboy;
  6. Entregue → concluído;
  7. o relatório do dia conta o pedido.
- **`pix.mjs`:**
  1. Pix → QR e "copiar";
  2. o simulador aprova → a comanda toca o motoboy;
  3. o painel recebe;
  4. depois, um Pix que expira (com o relógio adiantado + cron) → cancelado.
- **`cartao.mjs`** (credenciais de teste, quando existirem): `APRO`
  aprovado, `OTHE` recusado com mensagem e nova tentativa aprovada.
  - Sem credenciais, o teste é pulado com aviso, nunca falha em silêncio.
- **`gestao.mjs`:**
  - o dono muda o preço da Calabresa → o site mostra o novo preço após
    recarregar;
  - marca a Calabresa como esgotada → some do site, e o pedido com ela é
    recusado pelo servidor com a mensagem certa;
  - fecha a loja → o site mostra fechado.
- **`seguranca.mjs`:**
  - pedido com preço adulterado → 409;
  - item inexistente → 400;
  - 6 pedidos seguidos → 429;
  - webhook sem assinatura → 401;
  - atendente tentando estornar → 403;
  - `/api/pedidos/status` sem token → 404.
- **`whatsapp.mjs`** (com servidor falso da Meta):
  - mensagem com o código → vínculo e resposta;
  - mudança de status → texto enviado;
  - fora da janela → nada enviado (ou o modelo, se ligado);
  - texto aleatório → auto-resposta, e só 1 a cada 6 h.

**Em toda tela nova** (painel, `/p/`, privacidade):
- sem rolagem lateral em 360×640, 390×844 e 1440×900;
- sem erro no console;
- foco visível navegando por teclado;
- contraste AA.

**Ambiente de teste:**
- Um **projeto Supabase de teste** separado do de produção. As variáveis
  entram como variáveis do ambiente de desenvolvimento, nunca no chat.
- Se não houver Supabase de teste no ambiente, rode os unitários, diga
  claramente quais testes de navegador ficaram pendentes e por quê, e não
  finja que passaram.

---

## 15. Ordem de construção (marcos)

Cada marco termina com:
- testes passando;
- commit com mensagem clara, em português;
- push no branch;
- uma nota curta no PR: o que foi feito e o que ficou pendente.

| Marco | Entrega | Pronto quando |
|---|---|---|
| **M0. Base** | Estrutura de pastas, `package.json`, `.env.example`, `build.sh`, `vercel.json`, migrações e RLS, seed da loja, `scripts/seed-cardapio.mjs` (importa `dados/cardapio.json` e as opções, com preços em centavos e fotos atuais), `shared/*` com testes. | Migrações rodam do zero; o seed bate com o cardápio do site (mesma contagem: 31 salgadas, 5 doces, 25 esfihas, 9 cones e 9 bebidas, e os mesmos preços); unitários verdes. |
| **M1. Pedido real** | `/api/loja`, `/api/cardapio`, `/api/pedidos` (pagamento na entrega), `/api/pedidos/status`, `integracao.js`, o carrinho estruturado no `site.js`, a página `/p/:token` e o rodapé com privacidade. | `pedido-na-entrega.mjs` até o passo 2, mais `/p/` mostrando "Recebido"; testes antigos verdes; com o sistema desligado, o site fica idêntico à Fase 1. |
| **M2. Cozinha** | Login, papéis, `pedidos.html` com tempo real, alarme, wake lock, ações, recusa e cancelamento, impressão 80/58 mm, "mandar para o entregador" e histórico. | `pedido-na-entrega.mjs` completo, exceto relatório. |
| **M3. Gestão** | Loja, horários, exceções, bairros, cardápio (CRUD, fotos, esgotado num toque, opções, reajuste), equipe e alertas. O site lê tudo do banco; snapshot no build. | `gestao.mjs` verde. |
| **M4. Pagamento** | Mercado Pago com Pix e cartão em modo de teste, webhook validado, estorno, `/api/pedidos/pagar`, telas de Pix e cartão no site e em `/p/`, simulador, cron de expiração e a página Integrações. | `pix.mjs` verde; `cartao.mjs` verde (ou pulado com aviso, sem credenciais); `seguranca.mjs` verde. |
| **M5. WhatsApp** | Webhook com verificação e assinatura, vínculo por código, mensagens de status, auto-resposta, dono, modelos opcionais, contador mensal e mensagem de teste. | `whatsapp.mjs` verde com o servidor falso; com o número de teste da Meta configurado, o fluxo real ponta a ponta funciona num celular cadastrado. |
| **M6. Relatórios e cuidado** | Relatórios, clientes, LGPD (apagar cliente), `/api/saude`, backups e alertas completos. | `pedido-na-entrega.mjs` com o passo do relatório; o backup aparece no bucket. |
| **M7. Extras** | Cupons (no checkout, validados no servidor, com limite por cliente), pedido agendado ("Para agora" ou "Agendar para hoje às…", em faixas de 15 min dentro do horário; a cozinha recebe na hora, mas o alarme toca 40 min antes) e avaliação pós-entrega. | Testes próprios verdes. |
| **M8. Entrega** | `CONFIGURAR.md` (seção 16), `README.md` atualizado e uma revisão final de segurança. | Uma pessoa que não participou consegue ligar tudo só lendo o `CONFIGURAR.md`. |

**Fora do escopo** (não construa):
- nota fiscal (a pizzaria continua emitindo como hoje);
- integração com iFood ou Anotaí;
- app de entregador;
- robô de conversa com IA;
- programa de cashback com saldo. Um cupom automático de fidelidade, como
  "a cada 10 pedidos", pode entrar no M7 usando os cupons.

---

## 16. `CONFIGURAR.md`: o que você deve escrever para a ligação

Um passo a passo **em português simples**, com caminho de menu e o que copiar
para onde. **Sempre que houver segredo:** "cole na Vercel, em Settings →
Environment Variables. Não mande para ninguém."

**1. Supabase (desenvolvedor):**
- criar o projeto de produção, região São Paulo;
- rodar as migrações;
- desligar o cadastro público;
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` na Vercel;
- `scripts/seed-cardapio.mjs` e `scripts/criar-dono.mjs`.

**2. Vercel:**
- plano Pro (uso comercial);
- Root Directory;
- variáveis `SITE_URL`, `CRON_SECRET` (aleatório) e `IP_HASH_SALT`
  (aleatório);
- `NOINDEX=1` até o domínio próprio;
- `DEV_TOOLS` **nunca** em produção.

**3. Mercado Pago (cliente, no CNPJ):**

> ⚠️ **Antes de tudo:** o CNPJ 33.363.935/0001-91 consta como **inapto** na
> Receita (omissão de declarações, desde 28/05/2026). Ele precisa estar
> regularizado com o contador, ou a conta e a verificação podem ser
> recusadas.

1. Conta no CNPJ com **chave Pix cadastrada**.
2. Mercado Pago Developers → Suas integrações → Criar aplicação (pagamentos
   online, Checkout API).
3. **Teste:**
   - credenciais de teste nas variáveis;
   - cartões `APRO` e `OTHE`;
   - simulador de Pix.
4. **Produção:**
   - credenciais de produção (`MP_PUBLIC_KEY` e `MP_ACCESS_TOKEN`);
   - Webhooks → URL `https://SEU-DOMINIO/api/pagamentos/webhook`, eventos de
     Order e pagamentos;
   - copiar a assinatura secreta para `MP_WEBHOOK_SECRET`.
5. Painel → Integrações deve mostrar "✅ produção".
6. Ligar Pix e Cartão em Gestão → Loja.
7. **Prova real:** um Pix de R$ 1,00 num pedido de teste, conferir se chegou
   na cozinha e **estornar** pelo painel.

**4. WhatsApp (cliente, com o desenvolvedor):**
1. Portfólio empresarial da pizzaria na Meta (business.facebook.com).
   - Verificação da empresa com o CNPJ regularizado, comprovante de endereço
     e o site no domínio próprio com razão social, CNPJ e endereço no rodapé
     (já estão).
2. **Chip novo**, só para a API:
   - não instalar WhatsApp nele;
   - manter recarga para a operadora não cancelar;
   - nunca usar o (34) 98408-9429 da Anotaí nem o (34) 98837-1707 do
     atendimento.
3. Meta for Developers → criar app → produto WhatsApp.
   - **Teste:** número de teste, cadastrar o celular do desenvolvedor como
     destino e token temporário.
4. **Produção:**
   - adicionar o número do chip (código por SMS ou ligação);
   - nome de exibição "Planeta Pizza";
   - **forma de pagamento cadastrada** (sem ela, a Meta não entrega as
     mensagens cobradas);
   - usuário do sistema com **token permanente**.
5. Webhook:
   - URL `https://SEU-DOMINIO/api/whatsapp/webhook`;
   - token de verificação igual a `WHATSAPP_VERIFY_TOKEN`;
   - assinar o campo `messages`.
6. Variáveis:
   - `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WABA_ID`;
   - `WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`;
   - `WHATSAPP_NUMERO` (os dígitos do chip, para o link);
   - `GRAPH_API_VERSION`.
7. Opcional: submeter os modelos da seção 8.4 e colocar os nomes no painel.
8. **Prova:** fazer um pedido, tocar em "Acompanhar pelo WhatsApp", enviar e
   ver as mensagens chegarem a cada etapa.

**5. Domínio:**
- registrar no Registro.br, no CNPJ;
- apontar para a Vercel;
- atualizar `SITE_URL`;
- tirar `NOINDEX`.

**6. Loja:**
- tablet na cozinha: abrir `/painel`, "Adicionar à tela inicial", entrar,
  "Ativar alarme", deixar carregando e com o volume alto;
- impressora (seção 9.2).

**7. Virada:**
1. **Em paralelo com a Anotaí:** liga "Receber pedidos do site por este
   painel"; o site recebe por aqui e a Anotaí segue no ar.
2. **Quando a equipe estiver confortável:** divulgar o site (bio do
   Instagram, Google, QR Code na caixa).
3. **Desligar a Anotaí** só depois. Conferir antes no contrato se há
   fidelidade ou multa.

**Custos de referência**, para o desenvolvedor explicar ao cliente (confira as
tabelas oficiais antes de fechar):

| Item | Valor de referência |
|---|---|
| Vercel Pro | ~US$ 20/mês |
| Supabase | grátis no começo; US$ 25/mês se crescer |
| Domínio | ~R$ 40/ano |
| Pix (Mercado Pago) | ~0,99% |
| Cartão online (Mercado Pago) | ~3,98% a 4,98%, conforme o prazo |
| WhatsApp | 1.000 mensagens de serviço grátis por mês por número; acima disso, o valor de utilidade do Brasil, ~R$ 0,04 a R$ 0,05 cada |

---

## 17. Checklist final da IA (antes de dizer "pronto")

- [ ] Todos os marcos M0 a M8 entregues, com os critérios de aceite cumpridos
  e **comprovados por teste**.
- [ ] Com o sistema **desligado**, o site é idêntico à Fase 1 e os testes
  antigos passam.
- [ ] Sem Mercado Pago e sem WhatsApp configurados, nada quebra: as opções
  somem e a Integrações mostra "não configurado".
- [ ] Nenhum segredo no repositório (procure por `APP_USR`, `TEST-`, `EAA`,
  `service_role` e `sk_`).
- [ ] `build.sh` não publica arquivos internos (confira a lista do `dist/`).
- [ ] O motoboy toca só depois de `recebido: true` ou do status `saiu` na
  página de acompanhamento.
- [ ] Preço recalculado no servidor, com teste de adulteração.
- [ ] Webhooks com assinatura e idempotência, com testes.
- [ ] `CONFIGURAR.md` completo, com os textos dos modelos do WhatsApp e o
  aviso do CNPJ.
- [ ] No relatório final, diga com franqueza:
  - o que foi testado de ponta a ponta;
  - o que só foi testado com servidor falso;
  - o que depende das chaves de produção para ser provado.
