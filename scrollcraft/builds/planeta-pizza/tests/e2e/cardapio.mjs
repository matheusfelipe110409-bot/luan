// Cardápio, janela do item, preços, busca e WhatsApp (o fluxo até a comanda).
import { chromium } from 'playwright-core';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
// Uso: node tests/e2e/cardapio.mjs URL PREFIXO_DAS_CAPTURAS LARGURA ALTURA
const [,, url, out, w, h] = process.argv;
const mobile = +w < 800;
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile });
const errs = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => errs.push(String(e)));
await page.goto(url, { waitUntil: 'load' });
await page.waitForSelector('html.sc-ready');
const log = (...a) => console.log(...a);
const ok = (c, m) => { log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
const nb = s => (s || '').replace(/ /g, ' ');
const total = async () => nb(await page.textContent('[data-sheet-total]'));
const visible = () => page.evaluate(() => [...document.querySelectorAll('[data-item]')].filter(li => !li.hidden && !li.closest('[hidden]')).map(li => li.dataset.item));

// the official WhatsApp, from the Anotaí store
const wa = await page.evaluate(m => { const a = document.querySelector(m ? '.hero__wa' : '.bar__wa'); return [a.href, a.target]; }, mobile);
ok(wa[0].startsWith('https://wa.me/5534988371707?text=') && wa[1] === '_blank', 'WhatsApp button opens the official number: ' + wa[0].slice(0, 40));
ok(await page.evaluate(() => !document.body.textContent.includes('Demonstração') && !document.body.textContent.includes('Prévia')), 'no demo or preview text on the page');
ok(await page.evaluate(() => [...document.querySelectorAll('.brand__mark, .loja__logo img, .rd__stamp img')].every(i => i.getAttribute('src') === 'assets/logo.jpg')), 'every logo slot shows the official file');
ok(await page.evaluate(() => !document.querySelector('[href="#i-mark"], symbol#i-mark')), 'the provisional mark is gone');
ok(await page.evaluate(() => /17h45 às 23h/.test(document.querySelector('.loja__info').textContent) && /R\$ 32/.test(document.querySelector('.info--price').textContent)), 'store card: real hours and "a partir de R$ 32"');

// order action with an empty comanda goes to the menu
await page.click(mobile ? '.orderbar__btn' : '.bar__cta');
await page.waitForTimeout(700);
const top = await page.evaluate(() => document.getElementById('cardapio').getBoundingClientRect().top);
ok(Math.abs(top) < 120, 'Fazer pedido jumps to the store (top=' + Math.round(top) + ')');

// the menu, counted
const count = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-cat]')].map(c => [c.id, c.querySelectorAll('[data-item]').length])));
ok(JSON.stringify(count) === '{"salgadas":31,"doces":5,"esfihas":25,"cone":9,"bebidas":9}', 'menu sections ' + JSON.stringify(count));
const ids = await page.evaluate(() => [...document.querySelectorAll('[data-item]')].map(li => li.dataset.item));
ok(new Set(ids).size === ids.length, 'no duplicate products');

// search
await page.fill('[data-search]', 'strogonoff');
let vis = await visible();
ok(vis.join(',') === 'strogonoff', 'search "strogonoff": ' + vis.join(','));
ok(await page.evaluate(() => getComputedStyle(document.querySelector('[data-destaques]')).display === 'none'), 'highlights hide while searching');
await page.fill('[data-search]', 'brocolis');
vis = await visible();
ok(vis.join(',') === 'brocolis', 'accent-free search "brocolis": ' + vis.join(','));
await page.fill('[data-search]', 'xyzw');
ok(await page.evaluate(() => !document.querySelector('[data-search-empty]').hidden), 'empty search shows the message');
await page.fill('[data-search]', '');

// a salgada: meio a meio, borda, acréscimo, obs, qty
await page.click('[data-item="calabresa"] .item__open');
await page.waitForTimeout(400);
ok(await page.evaluate(() => document.getElementById('sheet').open), 'row opens the sheet');
ok((await total()).includes('36,00'), 'calabresa starts at R$ 36,00');
ok(nb(await page.textContent('[data-sheet-meta]')) === '8 fatias', 'sheet says 8 fatias, no invented size');
const halves = await page.$$eval('[data-grp="meia"] .opt', l => l.length);
ok(halves === 36, 'meio a meio offers the other 35 flavours plus "inteira": ' + halves);
await page.screenshot({ path: out + '-sheet.png' });
await page.click('[data-grp="meia"] label.opt:has-text("Meia Planeta Pizza")');
ok((await total()).includes('45,00'), 'half Planeta Pizza takes the higher price: ' + await total());
await page.click('[data-grp="borda"] label.opt:has-text("Borda de Catupiry")');
ok((await total()).includes('53,00'), 'borda de catupiry adds R$ 8: ' + await total());
await page.click('[data-grp="acrescimo"] label.opt:has-text("Bacon")');
await page.click('[data-grp="acrescimo"] label.opt:has-text("Milho")');
ok((await total()).includes('67,00'), 'acréscimos bacon + milho add R$ 14: ' + await total());
await page.click('[data-grp="acrescimo"] label.opt:has-text("Milho")');
ok((await total()).includes('61,00'), 'unticking milho takes R$ 6 back: ' + await total());
await page.fill('[data-obs]', 'sem cebola');
await page.click('[data-step="1"]');
ok((await total()).includes('122,00'), 'qty 2 doubles: ' + await total());
await page.screenshot({ path: out + '-sheet2.png' });
await page.click('[data-sheet-add]');
await page.waitForTimeout(400);
ok(await page.evaluate(() => !document.getElementById('sheet').open), 'add closes the sheet');
const line = nb(await page.evaluate(() => document.querySelector('#comanda [data-order-lines] li')?.textContent));
ok(/2x.*Meia Calabresa \/ meia Planeta Pizza.*Borda de Catupiry.*Acréscimos: Bacon.*Obs\.: sem cebola.*122,00/.test(line), 'line printed: ' + line);
ok(await page.evaluate(() => document.activeElement && document.activeElement.matches('[data-item="calabresa"] .item__open')), 'focus returns to the row');

// a doce: its own bordas, no acréscimos; meio a meio switches to the pizza lists
await page.click('[data-item="banana"] .item__open');
await page.waitForTimeout(300);
ok((await total()).includes('45,00') && !(await page.$('[data-grp="acrescimo"]')), 'banana R$ 45, no acréscimos while whole');
await page.click('[data-grp="borda"] label.opt:has-text("Borda de Cream cheese")');
ok((await total()).includes('53,00'), 'doce: borda cream cheese is R$ 8: ' + await total());
await page.click('[data-grp="meia"] label.opt:has-text("Meia Calabresa")');
await page.waitForTimeout(100);
ok((await total()).includes('57,00') && !!(await page.$('[data-grp="acrescimo"]')), 'meio a meio: cream cheese becomes R$ 12 and acréscimos appear: ' + await total());
await page.screenshot({ path: out + '-doce.png' });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// a cone: the sauce is required
await page.click('[data-item="batata-palito-no-cone"] .item__open');
await page.waitForTimeout(300);
await page.click('[data-sheet-add]');
await page.waitForTimeout(300);
ok(await page.evaluate(() => document.querySelector('[data-grp="molho"]').classList.contains('is-missing') && document.getElementById('sheet').open), 'cone without a sauce is held with the group flagged');
await page.screenshot({ path: out + '-required.png' });
await page.click('[data-grp="molho"] label.opt:has-text("Molho de alho")');
await page.click('[data-grp="acrescimo"] label.opt:has-text("Calabresa")');
ok((await total()).includes('9,00'), 'cone R$ 7 + calabresa R$ 2: ' + await total());
await page.click('[data-sheet-add]');
await page.waitForTimeout(300);

// esfiha and drink: straight in
await page.click('[data-item="esfiha-calabresa"] .item__open');
await page.waitForTimeout(250);
ok(!(await page.$('[data-sheet-groups] .grp')), 'esfiha has no option groups');
await page.click('[data-sheet-add]');
await page.waitForTimeout(250);
await page.click('[data-item="coca-cola-2-l"] .item__open');
await page.waitForTimeout(250);
await page.click('[data-sheet-add]');
await page.waitForTimeout(250);

// highlights card opens the sheet too
await page.evaluate(() => document.getElementById('cardapio').scrollIntoView());
await page.click('.card[data-open="mucarela"]');
await page.waitForTimeout(300);
ok(await page.evaluate(() => document.querySelector('[data-sheet-name]').textContent === 'Muçarela'), 'highlight card opens its sheet');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
ok(await page.evaluate(() => !document.getElementById('sheet').open), 'Esc closes the sheet');

// totals: items in the bar, the fee on the ticket
const sum = nb(await page.evaluate(() => document.querySelector('[data-sum]').textContent));
ok(sum === '5 itens, R$ 150,00', 'order bar sum: ' + sum);
const fee = await page.evaluate(() => { const f = document.querySelector('#comanda [data-fee]'); return [f.hidden, f.textContent]; });
ok(!fee[0] && nb(fee[1]).includes('10,00'), 'ticket shows the R$ 10 delivery fee');
ok(nb(await page.textContent('#comanda [data-total]')) === 'R$ 160,00', 'ticket total includes the fee: ' + nb(await page.textContent('#comanda [data-total]')));

const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
ok(sw[0] === sw[1], 'no horizontal overflow ' + sw);
log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console errors');
if (errs.length) process.exitCode = 1;
await browser.close();
