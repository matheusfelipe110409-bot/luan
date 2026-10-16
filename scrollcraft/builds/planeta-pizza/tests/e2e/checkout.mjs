// The customer's path to the order, one-page checkout (CHECKOUT.md criteria).
import { chromium } from 'playwright-core';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
// Uso: node tests/e2e/checkout.mjs URL PREFIXO_DAS_CAPTURAS LARGURA ALTURA
const [,, url, out, w, h] = process.argv;
const mobile = +w < 800;
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile });
const page = await ctx.newPage();
const OPEN = new Date('2026-10-15T21:00:00-03:00');
const CLOSED = new Date('2026-10-15T15:00:00-03:00');
await page.clock.setFixedTime(OPEN);
// ViaCEP stub: 38440-xxx is Araguari, 38400-xxx is Uberlândia
await page.route('https://viacep.com.br/**', r => {
  const cep = r.request().url().match(/ws\/(\d{8})/)[1];
  const body = cep.startsWith('38440')
    ? { cep, logradouro: 'Rua Doutor Afrânio', bairro: 'Centro', localidade: 'Araguari', uf: 'MG' }
    : { cep, logradouro: 'Avenida Rondon Pacheco', bairro: 'Tabajaras', localidade: 'Uberlândia', uf: 'MG' };
  r.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
});
const errs = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector('html.sc-ready');
await page.evaluate(() => localStorage.clear());
await page.evaluate(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return null; }; });

const log = (...a) => console.log(...a);
const ok = (c, m) => { log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
const nb = s => (s || '').replace(/ /g, ' ');
const txt = async s => nb(await page.textContent(s));
const isOpen = id => page.evaluate(i => document.getElementById(i).open, id);
const hidden = s => page.evaluate(q => { const e = document.querySelector(q); return !e || e.hidden || !!e.closest('[hidden]'); }, s);
const opened = () => page.evaluate(() => window.__opened.slice());
const submit = async () => { await page.click('#drawer [data-co-submit]'); await page.waitForTimeout(450); };
const active = () => page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.name));
const shot = async (name, scrollTo) => {
  if (scrollTo) await page.evaluate(q => document.querySelector(q).scrollIntoView({ block: 'start', behavior: 'instant' }), scrollTo);
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '-' + name + '.png' });
};

// ---- build an order: a half-and-half pizza with extras, and a drink
await page.click('[data-item="calabresa"] .item__open');
await page.waitForTimeout(350);
await page.click('[data-grp="meia"] label.opt:has-text("Meia Planeta Pizza")');
await page.click('[data-grp="borda"] label.opt:has-text("Borda de Catupiry")');
await page.click('[data-grp="acrescimo"] label.opt:has-text("Bacon")');
await page.click('[data-step="1"]');
await page.click('[data-sheet-add]');
await page.waitForTimeout(350);
await page.click('[data-item="coca-cola-2-l"] .item__open');
await page.waitForTimeout(300);
await page.click('[data-sheet-add]');
await page.waitForTimeout(350);

// 1. the order bar and the comanda button open the panel
await page.click(mobile ? '.orderbar__btn' : '.bar__cta');
await page.waitForTimeout(500);
ok(await isOpen('drawer'), '1 order bar opens the comanda panel');
ok(await hidden('#drawer [data-co-closed]'), '  open hours: no closed banner');
ok(await page.$$eval('#drawer [data-order-lines] li', l => l.length) === 2, '  panel lists the 2 lines');
ok(await txt('#drawer [data-subtotal]') === 'R$ 134,00', '  subtotal R$ 134,00: ' + await txt('#drawer [data-subtotal]'));
ok(await txt('#drawer [data-co-total]') === 'R$ 144,00', '  button total starts with delivery, R$ 144,00: ' + await txt('#drawer [data-co-total]'));
await shot('co-top');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
ok(!(await isOpen('drawer')), '  Esc closes the panel');
ok(await page.evaluate(m => document.activeElement && document.activeElement.matches(m ? '.orderbar__btn' : '.bar__cta'), mobile), '  focus returns to the order bar');
await page.evaluate(() => document.getElementById('comanda').scrollIntoView({ behavior: 'instant' }));
await page.click('#comanda [data-checkout]');
await page.waitForTimeout(500);
ok(await isOpen('drawer'), '  "Fazer pedido" in the comanda section opens the panel too');

// 5. peça também
const rail = await page.$$eval('#drawer [data-up]', l => l.map(b => b.dataset.up));
ok(rail.length > 0 && !rail.includes('coca-cola-2-l'), '5 peça também lists drinks not in the comanda: ' + rail.join(','));
await shot('co-upsell', '#drawer [data-co-sec="upsell"]');
await page.click('#drawer [data-up="' + rail[0] + '"]');
await page.waitForTimeout(300);
const lines3 = await page.$$eval('#drawer [data-order-lines] li', l => l.length);
const rail2 = await page.$$eval('#drawer [data-up]', l => l.map(b => b.dataset.up));
const sub2 = await txt('#drawer [data-subtotal]');
ok(lines3 === 3 && !rail2.includes(rail[0]) && sub2 !== 'R$ 134,00', '  one tap adds ' + rail[0] + ', leaves the rail, subtotal ' + sub2);
const subN = +sub2.replace(/[^\d,]/g, '').replace(',', '.');

// 2. validation stops at the first problem
await submit();
ok((await opened()).length === 0, '2 empty form is not sent');
ok(await page.evaluate(() => document.querySelector('[data-grp="tipo"]').classList.contains('is-missing')), '  delivery/pickup group flagged first');
ok(['co-tipo-entrega', 'tipo'].includes(await active()), '  focus taken to the delivery choice: ' + await active());
ok(await txt('[data-toast]') === 'Escolha entrega ou retirada.' && await txt('#err-tipo') === 'Escolha entrega ou retirada.', '  the first problem is the one said: ' + await txt('[data-toast]'));
ok(await page.evaluate(() => document.querySelector('.field.is-err #co-nome') && document.querySelector('.field.is-err #co-fone')), '  name and phone are flagged too');
await shot('co-err1');

// 3. entrega adds the fee, retirada removes it and shows the store
await page.click('#drawer label.co__card:has(#co-tipo-entrega)');
await page.waitForTimeout(200);
ok(!(await hidden('#drawer [data-co-addr]')) && (await hidden('#drawer [data-co-pickup]')), '3 entrega opens the address');
ok(await txt('#err-tipo') === '' && !(await page.evaluate(() => document.querySelector('[data-grp="tipo"]').classList.contains('is-missing'))), '  choosing clears the group error');
ok(!(await hidden('#drawer [data-co-fee-line]')) && await txt('#drawer [data-co-sum]') === nb(await page.evaluate(n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n), subN + 10)), '  fee line shown, total = subtotal + R$ 10: ' + await txt('#drawer [data-co-sum]'));
ok(/45 a 60 min · R\$ 10,00/.test(await txt('#drawer [data-co-info-entrega]')), '  entrega card says time and fee: ' + await txt('#drawer [data-co-info-entrega]'));
await submit();
ok(await active() === 'co-rua', '  missing street: focus on the street');
ok(/Escreva a rua/.test(await txt('#err-rua')) && /número/.test(await txt('#err-numero')) && /bairro/.test(await txt('#err-bairro')), '  street, number and neighbourhood explained');
ok(await page.evaluate(() => document.getElementById('co-rua').getAttribute('aria-describedby') === 'err-rua'), '  error is tied to the field');
await shot('co-err2', '#drawer [data-co-sec="entrega"]');
// cep of another city
await page.fill('#co-cep', '38400100');
await page.waitForTimeout(400);
ok(await page.inputValue('#co-cep') === '38400-100', '  CEP masked: ' + await page.inputValue('#co-cep'));
await submit();
ok(/Uberlândia.*Araguari/.test(await txt('#err-cep')) && await active() === 'co-cep', '  CEP from Uberlândia refused: ' + await txt('#err-cep'));
await page.fill('#co-rua', '');
await page.fill('#co-bairro', '');
await page.fill('#co-cep', '38440240');
await page.waitForTimeout(400);
ok(await page.inputValue('#co-rua') === 'Rua Doutor Afrânio' && await page.inputValue('#co-bairro') === 'Centro', '  Araguari CEP fills street and neighbourhood');
await page.fill('#co-num', '100');
await page.fill('#co-comp', 'casa 2');
await page.fill('#co-ref', 'perto da praça');
// retirada
await page.click('#drawer label.co__card:has(#co-tipo-retirada)');
await page.waitForTimeout(250);
ok((await hidden('#drawer [data-co-addr]')) && !(await hidden('#drawer [data-co-pickup]')), '  retirada hides the address and shows the store');
ok(/Rua Padre Anchieta, 154/.test(await txt('#drawer [data-co-pickup-text]')) && /20 a 25 min/.test(await txt('#drawer [data-co-pickup-text]')), '  pickup text: ' + await txt('#drawer [data-co-pickup-text]'));
ok((await page.getAttribute('#drawer [data-co-map]', 'href')).startsWith('https://www.google.com/maps/search/'), '  map link set');
ok((await hidden('#drawer [data-co-fee-line]')) && await txt('#drawer [data-co-sum]') === sub2 && await txt('#drawer [data-co-total]') === sub2, '  no fee: total = subtotal ' + await txt('#drawer [data-co-total]'));
ok(await txt('#drawer [data-co-pag-title]') === 'Pagamento na retirada', '  payment title follows: ' + await txt('#drawer [data-co-pag-title]'));
await shot('co-retirada', '#drawer [data-co-sec="entrega"]');
await page.click('#drawer label.co__card:has(#co-tipo-entrega)');
await page.waitForTimeout(250);
ok(await page.inputValue('#co-num') === '100', '  back to entrega, the address is still there');

// 4. troco
await page.click('#drawer label.opt:has(#co-pag-dinheiro)');
await page.waitForTimeout(200);
ok(!(await hidden('#drawer [data-co-troco]')) && (await hidden('#drawer [data-co-troco-valor]')), '4 dinheiro asks about change');
await page.click('#drawer .co__seg label:has(#co-troco-sim)');
await page.waitForTimeout(200);
ok(!(await hidden('#drawer [data-co-troco-valor]')), '  "sim" asks for how much');
await page.fill('#co-troco', '50');
await page.fill('#co-nome', 'Maria');
ok(await txt('#err-nome') === '' && !(await page.evaluate(() => document.getElementById('co-nome').closest('.field').classList.contains('is-err'))), '  typing the name clears its error');
await page.click('#co-fone');
await page.keyboard.type('34999998888');
ok(await page.inputValue('#co-fone') === '(34) 99999-8888', '  phone masked: ' + await page.inputValue('#co-fone'));
await submit();
ok((await opened()).length === 0 && /maior que o total/.test(await txt('#err-troco')) && await active() === 'co-troco', '  change below the total refused: ' + await txt('#err-troco'));
await shot('co-troco', '#drawer [data-co-sec="pagamento"]');
await page.fill('#co-troco', '200');
await page.waitForTimeout(150);
ok(!(await hidden('#drawer [data-co-troco-line]')) && await txt('#drawer [data-co-troco-val]') === 'R$ 200,00', '  summary shows "troco para R$ 200,00"');
await shot('co-resumo', '#drawer [data-co-sec="resumo"]');

// 7. closed: the order stays, nothing is sent
await page.clock.setFixedTime(CLOSED);
await submit();
ok((await opened()).length === 0, '7 closed: not sent');
ok(!(await hidden('#drawer [data-co-closed]')) && /Abre hoje às 17h45/.test(await txt('#drawer [data-co-closed]')), '  closed banner: ' + await txt('#drawer [data-co-closed]'));
ok(await page.$$eval('#drawer [data-order-lines] li', l => l.length) === 3 && await page.inputValue('#co-nome') === 'Maria', '  order and data kept');
await shot('co-closed');
await page.clock.setFixedTime(OPEN);

// 6. the message
await submit();
const o = await opened();
ok(o.length === 1 && o[0].startsWith('https://wa.me/5534988371707?text='), '6 sent to the official WhatsApp');
const msg = o[0] ? nb(decodeURIComponent(o[0].split('?text=')[1])) : '';
const order = ['*Cliente:* Maria', '*Celular:* (34) 99999-8888', '*Entrega:* Rua Doutor Afrânio, 100, Centro, Araguari - MG', 'Complemento: casa 2', 'Referência: perto da praça', '*Itens:*',
  '2x Meia Calabresa / meia Planeta Pizza: R$ 122,00', '   - Borda de Catupiry', '   - Acréscimos: Bacon', '1x Coca-Cola 2 L: R$ 12,00', 'Subtotal: ' + sub2, 'Taxa de entrega: R$ 10,00', '*Total: ', '*Pagamento:* Dinheiro, na entrega, troco para R$ 200,00'];
const pos = order.map(s => msg.indexOf(s));
ok(pos.every((p, i) => p >= 0 && (i === 0 || p > pos[i - 1])), '  message has everything, in comanda order');
log(msg.split('\n').map(l => '    | ' + l).join('\n'));
ok(!(await isOpen('drawer')) && await isOpen('pedido-whats'), '  panel closes, "Seu pedido está no WhatsApp" opens');
ok(await isOpen('pedido-recebido') === false, '  the delivery film does NOT play');
ok((await page.getAttribute('[data-pw-again]', 'href')) === o[0], '  "Abrir de novo" carries the same message');
await shot('co-whats');
await page.click('[data-pw-close]');
await page.waitForTimeout(400);
ok(await isOpen('drawer') && await page.inputValue('#co-num') === '100' && await page.$$eval('#drawer [data-order-lines] li', l => l.length) === 3, '  "Voltar à comanda" reopens it intact');
await submit();
await page.click('[data-pw-sent]');
await page.waitForTimeout(400);
ok(!(await isOpen('pedido-whats')) && await page.evaluate(() => document.querySelectorAll('#comanda [data-order-lines] li').length) === 0, '  "Já enviei" clears the comanda');

// 8. remembered: data and the last order
ok(!(await hidden('[data-repeat]')), '8 "Pedir de novo" appears: ' + await txt('[data-repeat-sum]'));
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('html.sc-ready');
await page.evaluate(() => { window.__opened = []; window.open = u => { window.__opened.push(u); return null; }; });
ok(!(await hidden('[data-repeat]')), '  still there after a reload');
await page.evaluate(() => document.querySelector('[data-repeat]').scrollIntoView({ block: 'center', behavior: 'instant' }));
await shot('repeat');
await page.click('[data-repeat-add]');
await page.waitForTimeout(300);
ok(nb(await page.evaluate(() => document.querySelector('[data-sum]').textContent)) === '4 itens, ' + sub2, '  one tap puts the last order back: ' + nb(await page.evaluate(() => document.querySelector('[data-sum]').textContent)));
ok(await hidden('[data-repeat]'), '  the card hides while the comanda has items');
await page.click(mobile ? '.orderbar__btn' : '.bar__cta');
await page.waitForTimeout(500);
const f = await page.evaluate(() => ['co-nome', 'co-fone', 'co-rua', 'co-num', 'co-bairro', 'co-comp', 'co-ref'].map(i => document.getElementById(i).value).concat(document.getElementById('co-tipo-entrega').checked));
ok(f.join('|') === 'Maria|(34) 99999-8888|Rua Doutor Afrânio|100|Centro|casa 2|perto da praça|true', '  name, phone and address come back: ' + f.join('|'));
ok(await page.evaluate(() => !document.querySelector('input[name="pag"]:checked')), '  payment is asked again each time');

// sections reveal as the panel scrolls, and all end up visible
for (let i = 0; i < 12; i++) { await page.evaluate(() => document.querySelector('[data-co-scroll]').scrollBy({ top: 260, behavior: 'instant' })); await page.waitForTimeout(120); }
await page.waitForTimeout(900);
ok(await page.evaluate(() => [...document.querySelectorAll('#drawer .co__sec')].filter(s => !s.hidden).every(s => !s.classList.contains('is-out') && getComputedStyle(s).opacity === '1')), 'sections reveal on scroll and end fully visible');
await shot('co-bottom');

// 9. no sideways scroll
const sw = await page.evaluate(() => {
  const s = document.querySelector('[data-co-scroll]');
  return [document.documentElement.scrollWidth, innerWidth, s.scrollWidth, s.clientWidth];
});
ok(sw[0] === sw[1] && sw[2] <= sw[3], '9 no horizontal overflow (page and panel) ' + sw);
const foot = await page.evaluate(() => { const b = document.querySelector('[data-co-submit]').getBoundingClientRect(); return [Math.round(b.bottom), innerHeight, Math.round(b.height)]; });
ok(foot[0] <= foot[1] && foot[2] >= 44, '  footer button on screen and ≥ 44px: ' + foot);
const small = await page.evaluate(() => [...document.querySelectorAll('#drawer input:not([type=radio])')].filter(i => parseFloat(getComputedStyle(i).fontSize) < 16).map(i => i.id));
ok(small.length === 0, '  inputs at 16px or more (no iPhone zoom) ' + small);
log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console errors');
if (errs.length) process.exitCode = 1;
await browser.close();
