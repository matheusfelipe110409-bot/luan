/* ============================================================================
   Planeta Pizza: page behaviour. The engine (scrollcraft.js) is untouched;
   this file reads the progress it publishes and owns what is bespoke:
   the falling toppings, the self-printing comanda, the open sign, the order.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phoneMQ = matchMedia('(max-width: 860px)');
  var vit = document.getElementById('topo');
  var vt = vit.querySelector('.vt');

  // ------------------------------------------------------------ data ----
  // Placeholder hours and prices for the demo. One place to change them.
  var HOURS = { open: 18 * 60, close: 23 * 60 + 30, label: '23h30', opensLabel: '18h' };
  var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var money = function (v) { return BRL.format(v); };

  // ------------------------------------------- art-direct the vitrine ----
  // Phones get a shorter film; reduced motion gets the shortest, because the
  // layers only cross-fade there and a long pin would be scroll with no reward.
  if (reduce) vit.setAttribute('data-sc-span', '2.2');
  else if (phoneMQ.matches) vit.setAttribute('data-sc-span', '3.0');

  // ------------------------------------------------ falling toppings ----
  (function buildDrops() {
    var host = vt.querySelector('[data-drops]');
    var src = document.getElementById('drops-layout');
    if (!host || !src) return;
    var layout;
    try { layout = JSON.parse(src.textContent); } catch (e) { return; }
    if (!layout.sprites || !layout.sprites.length) return;
    var AW = layout.atlas[0], AH = layout.atlas[1];
    var list = layout.sprites;
    var A0 = 0.615, A1 = 0.722, D = 0.045;
    var pct = function (v) { return (v * 100).toFixed(3) + '%'; };
    var frag = document.createDocumentFragment();
    list.forEach(function (s, i) {
      var a = A0 + (A1 - A0) * (i / Math.max(list.length - 1, 1));
      // boxes are w x h fractions of the pizza frame (older layouts: one size)
      var w = s.w || s.size, h = s.h || s.size;
      var left = s.x - w / 2, top = s.y - h / 2;
      var core = Math.min(w, h) * 0.82;
      var spin = (i % 2 ? 1 : -1) * (14 + (i * 37) % 28);

      var sh = document.createElement('span');
      sh.className = 'drop__shadow';
      sh.style.cssText = '--a:' + a.toFixed(4) + ';--d:' + D + ';left:' + pct(s.x - core / 2) +
        ';top:' + pct(s.y - core / 2) + ';width:' + pct(core) + ';height:' + pct(core);

      var el = document.createElement('span');
      el.className = 'drop';
      // scale about the pizza centre: a camera above sees a nearer piece
      // larger and further out from the middle
      el.style.cssText = '--a:' + a.toFixed(4) + ';--d:' + D + ';--spin:' + spin + 'deg;left:' + pct(left) +
        ';top:' + pct(top) + ';width:' + pct(w) + ';height:' + pct(h) +
        ';transform-origin:' + ((0.5 - left) / w * 100).toFixed(2) + '% ' + ((0.5 - top) / h * 100).toFixed(2) + '%';
      var inner = document.createElement('span');
      inner.className = 'drop__i';
      var b = s.box;
      inner.style.backgroundSize = (AW / b[2] * 100).toFixed(3) + '% ' + (AH / b[3] * 100).toFixed(3) + '%';
      inner.style.backgroundPosition = (b[0] / Math.max(AW - b[2], 1) * 100).toFixed(3) + '% ' +
        (b[1] / Math.max(AH - b[3], 1) * 100).toFixed(3) + '%';
      el.appendChild(inner);
      frag.appendChild(sh);
      frag.appendChild(el);
    });
    host.appendChild(frag);
    host.setAttribute('data-pieces', list.length);
  })();

  // ------------------------------------------------------------ engine ----
  var api = window.ScrollCraft ? ScrollCraft.mount(document.body) : null;

  // --------------------------------------------- the comanda that prints ----
  var ticket = vt.querySelector('[data-ticket]');
  var paper = ticket.querySelector('.ticket__paper');
  var lines = Array.prototype.slice.call(ticket.querySelectorAll('[data-line]'));
  // act progress at which each line prints: massa, molho, mussarela, recheio, total
  var PRINT = [0.135, 0.330, 0.478, 0.705, 0.800];
  var STAMP = 0.842;
  var feed = [];
  function measureFeed() {
    // printed height after n lines, in px from the top of the paper
    var top = paper.getBoundingClientRect().top;
    var head = ticket.querySelector('.ticket__head').getBoundingClientRect().bottom - top + 6;
    feed = [head];
    lines.forEach(function (l) { feed.push(l.getBoundingClientRect().bottom - top + 8); });
    feed[feed.length - 1] = paper.scrollHeight + 2;   // with the total, the whole ticket
  }

  var layerSel = ['.L-ball', '.L-dough', '.L-sauce', '.L-c1', '.L-c2', '.L-c3', '.L-melt', '.L-baked', '.L-final'];
  var layers = layerSel.map(function (s) { return vt.querySelector(s); });
  var st = { n: -1, stamped: null, steam: null, phase: '' };

  function update() {
    var p = parseFloat(vit.style.getPropertyValue('--sc-p')) || 0;
    var n = 0;
    while (n < PRINT.length && p >= PRINT[n]) n++;
    if (n !== st.n) {
      lines.forEach(function (l, i) { l.classList.toggle('is-printed', i < n); });
      if (feed.length) paper.style.setProperty('--printed', feed[Math.min(n, feed.length - 1)] + 'px');
      st.n = n;
    }
    var stamped = p >= STAMP;
    if (stamped !== st.stamped) { ticket.classList.toggle('is-stamped', stamped); st.stamped = stamped; }

    // layers fully covered by an opaque one stop compositing
    var phase = p < 0.62 ? 'a' : (p < 0.80 ? 'b' : 'c');
    if (phase !== st.phase) { vt.setAttribute('data-phase', phase); st.phase = phase; }

    var r = vit.getBoundingClientRect();
    var steam = !reduce && p >= 0.775 && r.bottom > 0;
    if (steam !== st.steam) { vt.classList.toggle('is-steaming', steam); st.steam = steam; }

    // What actually paints, for the verification harness: layer opacities,
    // lines printed, stamp. Not raw progress.
    var sig = layers.map(function (el) {
      return el ? Math.round(parseFloat(getComputedStyle(el).opacity) * 20) : 0;
    }).join('') + '|' + n + (stamped ? 's' : '');
    vt.setAttribute('data-sc-verify-state', sig);
    vt.setAttribute('data-sc-verify-hold', p >= 0.9 && p < 1 ? 'true' : 'false');
  }

  var ticking = false;
  addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    // queued after the engine's own frame, so --sc-p is already current
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  function relayout() { measureFeed(); update(); }
  addEventListener('resize', relayout, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  addEventListener('load', relayout);
  relayout();

  // A control inside a pinned act holds one screen position for the whole
  // act, so the browser's own scroll-into-view parks it where its cue is
  // still dark. Park the act at the progress where the payoff is lit.
  var payoffCta = vt.querySelector('[data-payoff-cta]');
  if (payoffCta) {
    payoffCta.addEventListener('focus', function () {
      var cue = payoffCta.closest('[data-sc-cue]');
      if (cue && parseFloat(getComputedStyle(cue).opacity) > 0.85) return;
      var top = vit.getBoundingClientRect().top + scrollY;
      var travel = Math.max(vit.offsetHeight - innerHeight, 1);
      scrollTo({ top: top + travel * 0.93, behavior: 'instant' });
    });
  }

  // ------------------------------------------------------- open sign ----
  var status = document.querySelector('[data-status]');
  var statusText = document.querySelector('[data-status-text]');
  function minutesInSaoPaulo() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (x) { if (x.type === 'hour') h = +x.value; if (x.type === 'minute') m = +x.value; });
      return h * 60 + m;
    } catch (e) {
      var d = new Date(); return d.getHours() * 60 + d.getMinutes();
    }
  }
  function paintStatus() {
    var t = minutesInSaoPaulo();
    var open = t >= HOURS.open && t < HOURS.close;
    status.classList.toggle('is-open', open);
    statusText.textContent = open ? 'Aberto agora · até ' + HOURS.label
      : (t < HOURS.open ? 'Fechado · abre às ' + HOURS.opensLabel : 'Fechado · abre amanhã às ' + HOURS.opensLabel);
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  // ----------------------------------------------------------- order ----
  // The cart and checkout are the next step of the project. Here the order
  // buttons only have to feel right: they fill the comanda, nothing is sent.
  var cart = [];
  var linesHost = document.querySelector('[data-order-lines]');
  var emptyBox = document.querySelector('[data-order-empty]');
  var totalEl = document.querySelector('[data-total]');
  var countEls = document.querySelectorAll('[data-count]');
  var sumEls = document.querySelectorAll('[data-sum]');
  var orderLinks = document.querySelectorAll('[data-order]');
  var toastEl = document.querySelector('[data-toast]');
  var toastTimer = 0;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3200);
  }
  function totals() {
    var qty = 0, sum = 0;
    cart.forEach(function (it) { qty += it.qty; sum += it.qty * it.price; });
    return { qty: qty, sum: sum };
  }
  function itemsLabel(q) { return q === 1 ? '1 item' : q + ' itens'; }

  function render() {
    var t = totals();
    countEls.forEach(function (el) {
      el.hidden = t.qty === 0;
      if (el.textContent !== String(t.qty)) {
        el.textContent = t.qty;
        el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump');
      }
    });
    sumEls.forEach(function (el) { el.hidden = t.qty === 0; el.textContent = itemsLabel(t.qty) + ', ' + money(t.sum); });
    orderLinks.forEach(function (a) { a.setAttribute('href', t.qty ? '#comanda' : '#cardapio'); });
    totalEl.textContent = money(t.sum);
    emptyBox.hidden = t.qty > 0;

    linesHost.textContent = '';
    cart.forEach(function (it) {
      var li = document.createElement('li');
      li.innerHTML =
        '<span>' + it.qty + 'x</span>' +
        '<span class="ticket__line-name"></span>' +
        '<span class="ticket__line-price">' + money(it.qty * it.price) + '</span>' +
        '<span class="qty">' +
          '<button type="button" data-dec aria-label="Tirar uma ' + it.name + '"><svg class="ico" aria-hidden="true"><use href="#i-minus"/></svg></button>' +
          '<button type="button" data-inc aria-label="Mais uma ' + it.name + '"><svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg></button>' +
        '</span>';
      li.querySelector('.ticket__line-name').textContent = it.name;
      li.querySelector('[data-dec]').addEventListener('click', function () { change(it.id, -1); });
      li.querySelector('[data-inc]').addEventListener('click', function () { change(it.id, +1); });
      linesHost.appendChild(li);
    });
  }

  function change(id, delta) {
    var it = cart.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter(function (x) { return x.id !== id; });
    render();
    var t = totals();
    toast(t.qty ? 'Comanda: ' + itemsLabel(t.qty) + ', ' + money(t.sum) + '.' : 'Comanda vazia.');
  }

  function add(btn) {
    var id = btn.getAttribute('data-id');
    var name = btn.getAttribute('data-name');
    var price = parseFloat(btn.getAttribute('data-price'));
    var it = cart.filter(function (x) { return x.id === id; })[0];
    if (it) it.qty += 1; else cart.push({ id: id, name: name, price: price, qty: 1 });
    render();
    var t = totals();
    toast(name + ' na comanda. ' + itemsLabel(t.qty) + ', ' + money(t.sum) + '.');
    btn.classList.add('is-added');
    var label = btn.querySelector('span:not(.sr)');
    var use = btn.querySelector('use');
    if (label && !label.__orig) label.__orig = label.textContent;
    if (label) label.textContent = 'Adicionado';
    if (use) use.setAttribute('href', '#i-check');
    clearTimeout(btn.__t);
    btn.__t = setTimeout(function () {
      btn.classList.remove('is-added');
      if (label) label.textContent = label.__orig;
      if (use) use.setAttribute('href', '#i-plus');
    }, 1400);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-add]');
    if (btn) { add(btn); return; }
    var co = e.target.closest && e.target.closest('[data-checkout]');
    if (co) {
      var t = totals();
      if (!t.qty) {
        toast('Escolha sua pizza no cardápio primeiro.');
        document.getElementById('cardapio').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      } else {
        toast('Demonstração: o pedido online entra na próxima etapa. Sua comanda: ' + itemsLabel(t.qty) + ', ' + money(t.sum) + '.');
      }
    }
  });
  render();

  // ------------------------------------------------------- tab spy -----
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var track = document.querySelector('.tabs__track');
  function setTab(id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('href') === '#' + id;
      if (on) {
        t.setAttribute('aria-current', 'true');
        var l = t.offsetLeft - 16, r = t.offsetLeft + t.offsetWidth + 16;
        if (l < track.scrollLeft) track.scrollTo({ left: l, behavior: reduce ? 'auto' : 'smooth' });
        else if (r > track.scrollLeft + track.clientWidth) track.scrollTo({ left: r - track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      } else t.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setTab(en.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('.cat').forEach(function (c) { io.observe(c); });
  }
})();
