/* ============================================================================
   Planeta Pizza: page behaviour. The engine (scrollcraft.js) is untouched;
   this file reads the progress it publishes and owns what is bespoke:
   the falling toppings, the self-printing comanda, the box-to-bag match
   cut, the open sign, the item sheet and the order.
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
  // Each span is the film plus one viewport: the hand-over to the menu.
  if (reduce) vit.setAttribute('data-sc-span', '3.2');
  else if (phoneMQ.matches) vit.setAttribute('data-sc-span', '4.0');

  // ------------------------------------------ hand-over to the menu ----
  // The film is authored on a 0..1 timeline. It now runs on [0, K] of the
  // act and the last viewport of scroll ([K, 1]) belongs to the hand-over:
  // the stage dissolves in place while the store, which overlaps that last
  // viewport (site.css), slides up underneath. Cues keep their shape.
  var SPAN = parseFloat(vit.getAttribute('data-sc-span')) || 4.3;
  var K = (SPAN - 2) / (SPAN - 1);
  vit.style.setProperty('--k', K.toFixed(4));
  Array.prototype.forEach.call(vit.querySelectorAll('[data-sc-cue]'), function (c) {
    var n = c.getAttribute('data-sc-cue').trim().split(/\s+/).map(parseFloat);
    var from = n[0] || 0, to = n.length > 1 ? n[1] : 1;
    var rIn = n.length > 2 ? n[2] : 0.3, rOut = n.length > 3 ? n[3] : 0.3;
    if (to >= 1) {
      // a cue that held to the end now leaves with the film, in the first
      // beat of the hand-over, keeping the fade-in length it had
      var f = from * K, t = K + 0.42 * (1 - K), w = t - f;
      c.setAttribute('data-sc-cue', [f, t, Math.min(rIn * (to - from) * K / w, 1), (t - K) / w].map(function (v) { return +v.toFixed(4); }).join(' '));
    } else {
      c.setAttribute('data-sc-cue', [from * K, to * K, rIn, rOut].map(function (v) { return +v.toFixed(4); }).join(' '));
    }
  });
  var filmP = function (raw) { return Math.min(raw / K, 1); };
  // A hidden line must not take taps meant for a visible one (the payoff sits
  // over the hero on phones). The engine only sets pointer-events after a
  // cue's first change, so start every line inert; it turns a line back on
  // as it appears.
  Array.prototype.forEach.call(vit.querySelectorAll('[data-sc-cue]'), function (c) { c.style.pointerEvents = 'none'; });
  // the ride after the menu
  var spans = { entrega: reduce ? '1.9' : (phoneMQ.matches ? '2.6' : null) };
  Object.keys(spans).forEach(function (id) {
    var n = document.getElementById(id);
    if (n && spans[id]) n.setAttribute('data-sc-span', spans[id]);
  });

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

  // While the vitrine dissolves, the store (which scrolls up under its last
  // viewport) is held where the visitor will land, so what the red opens on
  // is the menu screen itself, not a moving edge.
  var loja = document.getElementById('cardapio');
  var lojaShift = 0;
  var handing = false;
  function handOver(tx) {
    if (!loja) return;
    var on = tx > 0 && tx < 1;
    if (on) {
      var top = loja.getBoundingClientRect().top + lojaShift;   // where flow puts it
      lojaShift = Math.max(top, 0);
      loja.style.transform = 'translate3d(0,' + (-lojaShift).toFixed(1) + 'px,0)';
      var e = tx * tx * (3 - 2 * tx);
      var capaEl = loja.querySelector('.loja__capa');
      if (capaEl && !reduce) capaEl.style.setProperty('--cz', (1.08 - 0.08 * e).toFixed(4));
    } else if (handing) {
      lojaShift = 0;
      loja.style.transform = '';
    }
    handing = on;
    document.documentElement.classList.toggle('is-handing', on);
  }

  var layerSel = ['.L-ball', '.L-dough', '.L-sauce', '.L-c1', '.L-c2', '.L-c3', '.L-melt', '.L-baked', '.L-final'];
  var layers = layerSel.map(function (s) { return vt.querySelector(s); });
  var st = { n: -1, stamped: null, steam: null, phase: '' };

  function update() {
    var raw = parseFloat(vit.style.getPropertyValue('--sc-p')) || 0;
    var p = filmP(raw);
    var tx = Math.min(Math.max((raw - K) / (1 - K), 0), 1);
    var leaving = tx > 0.4;
    if (leaving !== st.leaving) { vt.classList.toggle('is-leaving', leaving); st.leaving = leaving; }
    handOver(tx);
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
    var away = p > 0.03;
    if (away !== st.away) { vt.classList.toggle('is-scrolled', away); st.away = away; }
    var steam = !reduce && p >= 0.775 && r.bottom > 0;
    if (steam !== st.steam) { vt.classList.toggle('is-steaming', steam); st.steam = steam; }

    // What actually paints, for the verification harness: layer opacities,
    // lines printed, stamp. Not raw progress.
    var sig = layers.map(function (el) {
      return el ? Math.round(parseFloat(getComputedStyle(el).opacity) * 20) : 0;
    }).join('') + '|' + n + (stamped ? 's' : '');
    vt.setAttribute('data-sc-verify-state', sig);
    vt.setAttribute('data-sc-verify-hold', raw >= 0.9 * K && raw < K ? 'true' : 'false');
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
      scrollTo({ top: top + travel * 0.93 * K, behavior: 'instant' });
    });
  }

  // ---------------------------------------------------------- entrega ----
  // The match cut: the closed box shrinks into the rider's bag. CSS does the
  // motion from --sc-p; this measures where the bag sits (fractions of the
  // rider photo, from tools/scenes.py) and how far the box has to travel.
  var ride = document.getElementById('entrega');
  var rdBox = ride && ride.querySelector('[data-rd-box]');
  var rdRider = ride && ride.querySelector('[data-rd-rider]');
  var BOX = { x0: 0.0186, y0: 0.1198, x1: 0.9814, y1: 0.8203 };   // the box inside its photo
  var BAG = { x0: 0.035, y0: 0.253, x1: 0.256, y1: 0.49 };         // the bag inside the rider photo
  function measureMatch(box, rider) {
    if (!box || !rider) return;
    var bw = box.offsetWidth, bh = box.offsetHeight;
    var rw = rider.offsetWidth, rh = rider.offsetHeight;
    if (!bw || !rw) return;
    var boxCx = box.offsetLeft + bw * (BOX.x0 + BOX.x1) / 2;
    var boxCy = box.offsetTop + bh * (BOX.y0 + BOX.y1) / 2;
    var bagCx = rider.offsetLeft + rw * (BAG.x0 + BAG.x1) / 2;
    var bagCy = rider.offsetTop + rh * (BAG.y0 + BAG.y1) / 2;
    var s = (rw * (BAG.x1 - BAG.x0)) / (bw * (BOX.x1 - BOX.x0));
    box.style.setProperty('--mx', (bagCx - boxCx).toFixed(1) + 'px');
    box.style.setProperty('--my', (bagCy - boxCy).toFixed(1) + 'px');
    box.style.setProperty('--ms', s.toFixed(4));
  }
  function measureRide() { measureMatch(rdBox, rdRider); }
  var acts = { boxStamped: null };
  function updateActs() {
    if (ride) {
      var p = parseFloat(ride.style.getPropertyValue('--sc-p')) || 0;
      var stamped = p >= 0.33;
      if (stamped !== acts.boxStamped) { rdBox.classList.toggle('is-stamped', stamped); acts.boxStamped = stamped; }
      var stage = ride.querySelector('.rd');
      var q = function (v) { return Math.round(Math.min(Math.max(v, 0), 1) * 20); };
      stage.setAttribute('data-sc-verify-state', [q((p - 0.10) / 0.20), q((p - 0.42) / 0.14), q((p - 0.58) / 0.38), stamped ? 's' : ''].join('.'));
    }
  }
  var actTick = false;
  addEventListener('scroll', function () {
    if (actTick) return;
    actTick = true;
    requestAnimationFrame(function () { actTick = false; updateActs(); });
  }, { passive: true });
  addEventListener('resize', function () { measureRide(); updateActs(); }, { passive: true });
  addEventListener('load', function () { measureRide(); updateActs(); });
  measureRide();
  updateActs();

  // ------------------------------------------------------------ cover ----
  // The cover photo settles from a slight zoom as it rises out of the
  // vitrine's red. Tied to the scroll, so it never pops in.
  var capa = document.querySelector('.loja__capa');
  function paintCover() {
    if (!capa || reduce || document.documentElement.classList.contains('is-handing')) return;
    var r = capa.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    var t = Math.min(Math.max((innerHeight - r.top) / (innerHeight * 0.9), 0), 1);
    capa.style.setProperty('--cz', (1.1 - 0.1 * t * (2 - t)).toFixed(4));
  }
  var coverTick = false;
  addEventListener('scroll', function () {
    if (coverTick) return;
    coverTick = true;
    requestAnimationFrame(function () { coverTick = false; paintCover(); });
  }, { passive: true });
  addEventListener('resize', paintCover, { passive: true });
  paintCover();

  // ------------------------------------------------------- open sign ----
  var statusEls = document.querySelectorAll('[data-status]');
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
    var label = open ? 'Aberto agora · até ' + HOURS.label
      : (t < HOURS.open ? 'Fechado · abre às ' + HOURS.opensLabel : 'Fechado · abre amanhã às ' + HOURS.opensLabel);
    statusEls.forEach(function (el) {
      el.classList.toggle('is-open', open);
      var txt = el.querySelector('[data-status-text]');
      if (txt) txt.textContent = label;
    });
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  // ------------------------------------------------------------ toast ----
  // Painted in the top layer so it shows over an open sheet or drawer;
  // announced through a live region that never leaves the tree.
  var toastEl = document.querySelector('[data-toast]');
  var liveEl = document.createElement('p');
  liveEl.className = 'sr';
  liveEl.setAttribute('role', 'status');
  liveEl.setAttribute('aria-live', 'polite');
  document.body.appendChild(liveEl);
  toastEl.removeAttribute('role');
  toastEl.removeAttribute('aria-live');
  toastEl.setAttribute('aria-hidden', 'true');
  var canPop = typeof toastEl.showPopover === 'function';
  if (canPop) toastEl.setAttribute('popover', 'manual');
  var toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    liveEl.textContent = msg;
    if (canPop) {
      try { if (toastEl.matches(':popover-open')) toastEl.hidePopover(); toastEl.showPopover(); } catch (e) {}
    }
    requestAnimationFrame(function () { toastEl.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-on');
      setTimeout(function () {
        if (canPop && !toastEl.classList.contains('is-on')) { try { toastEl.hidePopover(); } catch (e) {} }
      }, 220);
    }, 3200);
  }

  // ------------------------------------------------------------- menu ----
  // Every row carries its own data. The cart and checkout are a later step
  // of the project: here the order only has to feel right, nothing is sent.
  var rows = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-item]'), function (li) {
    rows[li.getAttribute('data-item')] = {
      id: li.getAttribute('data-item'),
      name: li.getAttribute('data-name'),
      price: parseFloat(li.getAttribute('data-price')),
      kind: li.getAttribute('data-kind'),
      img: li.getAttribute('data-img'),
      alt: (li.querySelector('.item__img') || {}).alt || '',
      desc: li.querySelector('.item__desc').textContent,
      choiceLabel: li.getAttribute('data-choice-label'),
      choices: li.getAttribute('data-choices') ? li.getAttribute('data-choices').split('|') : null
    };
  });
  var BORDAS = {
    salgada: [['Catupiry', 8], ['Cheddar', 8]],
    doce: [['Chocolate', 8]]
  };

  // ------------------------------------------------------------ sheet ----
  var sheet = document.getElementById('sheet');
  var sheetForm = sheet.querySelector('[data-sheet-form]');
  var sheetGroups = sheet.querySelector('[data-sheet-groups]');
  var sheetImg = sheet.querySelector('[data-sheet-img]');
  var sheetMedia = sheet.querySelector('[data-sheet-media]');
  var obs = sheet.querySelector('[data-obs]');
  var obsCount = sheet.querySelector('[data-obs-count]');
  var qtyOut = sheet.querySelector('[data-qty]');
  var addBtn = sheet.querySelector('[data-sheet-add]');
  var addTotal = sheet.querySelector('[data-sheet-total]');
  var decBtn = sheet.querySelector('[data-step="-1"]');
  var cur = null, qty = 1, opener = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function group(name, title, hint, required, options) {
    // options: [{value, label, extra, checked}]
    var g = el('div', 'grp');
    g.setAttribute('role', 'radiogroup');
    g.setAttribute('data-grp', name);
    if (required) g.setAttribute('data-required', '');
    var head = el('div', 'grp__head');
    var t = el('div');
    var tt = el('p', 'grp__title', title);
    tt.id = 'grp-' + name;
    t.appendChild(tt);
    if (hint) t.appendChild(el('p', 'grp__hint', hint));
    head.appendChild(t);
    head.appendChild(el('span', 'grp__badge' + (required ? ' grp__badge--req' : ''), required ? 'Obrigatório' : 'Opcional'));
    g.setAttribute('aria-labelledby', tt.id);
    g.appendChild(head);
    options.forEach(function (o, i) {
      var lab = el('label', 'opt');
      var inp = document.createElement('input');
      inp.type = 'radio';
      inp.name = name;
      inp.value = o.value;
      inp.checked = !!o.checked;
      inp.id = 'opt-' + name + '-' + i;
      var txt = el('span', 'opt__txt');
      txt.appendChild(el('span', 'opt__name', o.label));
      if (o.extra) txt.appendChild(el('span', 'opt__extra', o.extra));
      lab.appendChild(txt);
      lab.appendChild(inp);
      g.appendChild(lab);
    });
    return g;
  }
  function picked(name) {
    var c = sheetForm.querySelector('input[name="' + name + '"]:checked');
    return c ? c.value : '';
  }
  function unitPrice() {
    if (!cur) return 0;
    var p = cur.price;
    var half = picked('meia');
    if (half && rows[half]) p = Math.max(p, rows[half].price);
    var b = picked('borda');
    (BORDAS[cur.kind] || []).forEach(function (x) { if (x[0] === b) p += x[1]; });
    return p;
  }
  function paintSheet() {
    var u = unitPrice();
    addTotal.textContent = money(u * qty);
    qtyOut.textContent = qty;
    decBtn.disabled = qty <= 1;
    obsCount.textContent = obs.value.length + '/140';
  }
  function openSheet(id, from) {
    var it = rows[id];
    if (!it) return;
    cur = it; qty = 1; opener = from || null;
    sheet.querySelector('[data-sheet-name]').textContent = it.name;
    sheet.querySelector('[data-sheet-desc]').textContent = it.desc;
    sheet.querySelector('[data-sheet-meta]').textContent = it.kind === 'bebida' ? '' : 'Grande · 8 fatias';
    sheet.querySelector('[data-sheet-price]').textContent = money(it.price);
    if (it.img) { sheetImg.src = it.img; sheetImg.alt = it.alt; }
    else { sheetImg.removeAttribute('src'); sheetImg.alt = ''; }
    sheetMedia.classList.toggle('is-empty', !it.img);
    sheet.classList.toggle('is-plain', !it.img);
    sheetGroups.textContent = '';
    if (it.kind === 'bebida' && it.choices) {
      sheetGroups.appendChild(group('opcao', it.choiceLabel || 'Escolha', 'Escolha 1 opção', true,
        it.choices.map(function (c) { return { value: c, label: c }; })));
    } else {
      var halves = [{ value: '', label: 'Não, pizza inteira', checked: true }];
      Object.keys(rows).forEach(function (k) {
        var r = rows[k];
        if (r.kind === it.kind && r.id !== it.id) halves.push({ value: r.id, label: 'Meia ' + r.name, extra: money(r.price) });
      });
      sheetGroups.appendChild(group('meia', 'Quer meio a meio?', 'Vale o preço do sabor mais caro', false, halves));
      var bordas = [{ value: '', label: 'Sem borda recheada', checked: true }];
      (BORDAS[it.kind] || []).forEach(function (b) { bordas.push({ value: b[0], label: 'Borda de ' + b[0], extra: '+ ' + money(b[1]) }); });
      sheetGroups.appendChild(group('borda', 'Borda recheada', null, false, bordas));
    }
    obs.value = '';
    sheetForm.querySelector('.sheet__body').scrollTop = 0;
    sheetForm.scrollTop = 0;
    paintSheet();
    if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
  }
  function closeSheet() {
    if (sheet.open) { if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open'); }
  }
  sheet.addEventListener('close', function () {
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    opener = null;
  });
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet) closeSheet();          // a tap on the backdrop
  });
  sheetForm.addEventListener('submit', function (e) {
    // only the close button closes the sheet; Enter on an option does not
    if (!e.submitter || e.submitter.value !== 'cancel') e.preventDefault();
  });
  sheetForm.addEventListener('change', function (e) {
    var g = e.target.closest('[data-grp]');
    if (g) g.classList.remove('is-missing');
    paintSheet();
  });
  obs.addEventListener('input', paintSheet);
  sheet.querySelectorAll('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      qty = Math.min(20, Math.max(1, qty + parseInt(b.getAttribute('data-step'), 10)));
      paintSheet();
    });
  });
  addBtn.addEventListener('click', function () {
    var missing = null;
    sheetGroups.querySelectorAll('[data-required]').forEach(function (g) {
      if (!missing && !g.querySelector('input:checked')) missing = g;
    });
    if (missing) {
      missing.classList.add('is-missing');
      missing.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      var first = missing.querySelector('input');
      if (first) first.focus({ preventScroll: true });
      toast('Escolha uma opção em “' + missing.querySelector('.grp__title').textContent + '”.');
      return;
    }
    var half = picked('meia'), borda = picked('borda'), opt = picked('opcao'), note = obs.value.trim();
    var name = half && rows[half] ? 'Meia ' + cur.name + ' / meia ' + rows[half].name : cur.name;
    var details = [];
    if (opt) details.push(opt);
    if (borda) details.push('Borda de ' + borda);
    if (note) details.push('Obs.: ' + note);
    addToCart({
      key: [cur.id, half, borda, opt, note].join('|'),
      id: cur.id, name: name, details: details, unit: unitPrice()
    }, qty);
    closeSheet();
  });

  // --------------------------------------------------------------- cart ----
  var cart = [];
  var linesHosts = document.querySelectorAll('[data-order-lines]');
  var emptyBox = document.querySelector('[data-order-empty]');
  var totalEls = document.querySelectorAll('[data-total]');
  var countEls = document.querySelectorAll('[data-count]');
  var sumEls = document.querySelectorAll('[data-sum]');
  var orderLabels = document.querySelectorAll('[data-order-label]');
  var orderLinks = document.querySelectorAll('[data-order]');
  var drawer = document.getElementById('drawer');
  var drawerOpener = null;

  function totals() {
    var q = 0, sum = 0;
    cart.forEach(function (it) { q += it.qty; sum += it.qty * it.unit; });
    return { qty: q, sum: sum };
  }
  function itemsLabel(q) { return q === 1 ? '1 item' : q + ' itens'; }

  function lineEl(it) {
    var li = document.createElement('li');
    li.appendChild(el('span', null, it.qty + 'x'));
    var nm = el('span', 'ticket__line-name', it.name);
    if (it.details.length) nm.appendChild(el('small', null, it.details.join(' · ')));
    li.appendChild(nm);
    li.appendChild(el('span', 'ticket__line-price', money(it.qty * it.unit)));
    var q = el('span', 'qty');
    var dec = el('button');
    dec.type = 'button';
    dec.setAttribute('aria-label', 'Tirar uma ' + it.name);
    dec.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-minus"/></svg>';
    dec.addEventListener('click', function () { change(it.key, -1); });
    var inc = el('button');
    inc.type = 'button';
    inc.setAttribute('aria-label', 'Mais uma ' + it.name);
    inc.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-plus"/></svg>';
    inc.addEventListener('click', function () { change(it.key, +1); });
    q.appendChild(dec); q.appendChild(inc);
    li.appendChild(q);
    return li;
  }

  function render() {
    var t = totals();
    countEls.forEach(function (n) {
      n.hidden = t.qty === 0;
      if (n.textContent !== String(t.qty)) {
        n.textContent = t.qty;
        n.classList.remove('is-bump'); void n.offsetWidth; n.classList.add('is-bump');
      }
    });
    sumEls.forEach(function (n) { n.hidden = t.qty === 0; n.textContent = itemsLabel(t.qty) + ', ' + money(t.sum); });
    orderLabels.forEach(function (n) { n.textContent = t.qty ? 'Ver comanda' : 'Fazer pedido'; });
    orderLinks.forEach(function (a) { a.setAttribute('href', t.qty ? '#comanda' : '#cardapio'); });
    totalEls.forEach(function (n) { n.textContent = money(t.sum); });
    emptyBox.hidden = t.qty > 0;
    linesHosts.forEach(function (host) {
      host.textContent = '';
      cart.forEach(function (it) { host.appendChild(lineEl(it)); });
    });
  }

  function addToCart(line, n) {
    var it = cart.filter(function (x) { return x.key === line.key; })[0];
    if (it) it.qty += n; else { line.qty = n; cart.push(line); }
    render();
    var t = totals();
    toast((n > 1 ? n + 'x ' : '') + line.name + ' na comanda. ' + itemsLabel(t.qty) + ', ' + money(t.sum) + '.');
  }

  function change(key, delta) {
    var it = cart.filter(function (x) { return x.key === key; })[0];
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter(function (x) { return x.key !== key; });
    render();
    var t = totals();
    toast(t.qty ? 'Comanda: ' + itemsLabel(t.qty) + ', ' + money(t.sum) + '.' : 'Comanda vazia.');
    if (!t.qty && drawer.open) closeDrawer();
  }

  function openDrawer(from) {
    drawerOpener = from || null;
    if (typeof drawer.showModal === 'function') drawer.showModal(); else drawer.setAttribute('open', '');
  }
  function closeDrawer() {
    if (drawer.open) { if (typeof drawer.close === 'function') drawer.close(); else drawer.removeAttribute('open'); }
  }
  drawer.addEventListener('close', function () {
    if (drawerOpener && document.contains(drawerOpener)) drawerOpener.focus({ preventScroll: true });
    drawerOpener = null;
  });
  drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;
    var op = t.closest('[data-open]');
    if (op) { e.preventDefault(); openSheet(op.getAttribute('data-open'), op); return; }
    var ord = t.closest('[data-order]');
    if (ord && totals().qty) { e.preventDefault(); openDrawer(ord); return; }
    if (t.closest('[data-drawer-close]')) { closeDrawer(); return; }
    if (t.closest('[data-more]')) {
      drawerOpener = null;
      closeDrawer();
      document.getElementById('cardapio').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    if (t.closest('[data-checkout]')) {
      var tt = totals();
      if (!tt.qty) {
        toast('Escolha sua pizza no cardápio primeiro.');
        document.getElementById('cardapio').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      } else {
        finalizar(t.closest('[data-checkout]'));
      }
    }
  });
  render();

  // --------------------------------------------------------- whatsapp ----
  // The official number lives in #planeta-config. Until it is filled in the
  // buttons stay where they are and say so; no contact is ever made up.
  var CONFIG = {};
  try { CONFIG = JSON.parse(document.getElementById('planeta-config').textContent) || {}; } catch (e) { CONFIG = {}; }
  var waNumber = String(CONFIG.whatsapp || '').replace(/\D/g, '');
  function waLink(text) { return 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text); }
  document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
    if (waNumber) {
      a.href = waLink('Olá, Planeta Pizza! Quero fazer um pedido.');
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        toast('O WhatsApp da pizzaria ainda não foi informado. Use o botão Fazer pedido.');
      });
    }
  });

  // ---------------------------------------------------- finish the order ----
  // The order system (Anotaí) is a separate step. When it exists it registers
  //   PlanetaPizza.integracao = { enviarPedido: function (pedido) { ... } }
  // returning a promise of { recebido: true, numero?, previsao? }. Only a
  // confirmed order plays the delivery film; nothing here pretends to send.
  function comandaTexto() {
    var linhas = cart.map(function (it) {
      return it.qty + 'x ' + it.name + (it.details.length ? ' (' + it.details.join(', ') + ')' : '') + ': ' + money(it.qty * it.unit);
    });
    return 'Olá, Planeta Pizza! Quero fazer este pedido:\n' + linhas.join('\n') + '\nTotal: ' + money(totals().sum);
  }
  var sending = false;
  function finalizar(btn) {
    var api = window.PlanetaPizza && window.PlanetaPizza.integracao;
    if (api && typeof api.enviarPedido === 'function') {
      if (sending) return;
      sending = true;
      if (btn) btn.setAttribute('aria-busy', 'true');
      toast('Enviando o seu pedido...');
      var pedido = {
        itens: cart.map(function (it) { return { id: it.id, nome: it.name, detalhes: it.details.slice(), quantidade: it.qty, unitario: it.unit }; }),
        total: totals().sum
      };
      Promise.resolve(api.enviarPedido(pedido)).then(function (res) {
        if (res && res.recebido) {
          cart = [];
          render();
          closeDrawer();
          pedidoRecebido(res);
        } else {
          toast('Não conseguimos confirmar o pedido. Tente de novo.');
        }
      }, function () {
        toast('Não conseguimos enviar o pedido. Tente de novo.');
      }).then(function () {
        sending = false;
        if (btn) btn.removeAttribute('aria-busy');
      });
    } else if (waNumber) {
      window.open(waLink(comandaTexto()), '_blank', 'noopener');
      toast('Abrindo o WhatsApp com a sua comanda.');
    } else {
      toast('O envio do pedido pelo site ainda não está ativo.');
    }
  }

  // ------------------------------------------------- delivery film ----
  // The Entrega act, played by itself like a short film once an order is
  // confirmed, then the confirmation card. Same images, same choreography:
  // only the clock is time instead of scroll.
  var film = document.getElementById('pedido-recebido');
  var filmStage = film && film.querySelector('[data-auto-ride]');
  var filmBox = film && film.querySelector('[data-rd-box]');
  var filmRider = film && film.querySelector('[data-rd-rider]');
  var filmCard = film && film.querySelector('[data-entrega-card]');
  var filmMeta = film && film.querySelector('[data-entrega-meta]');
  var FILM_MS = 7200;
  var filmRaf = 0, filmT0 = 0, filmOpener = null;
  function filmFrame(p) {
    filmStage.style.setProperty('--sc-p', p.toFixed(4));
    filmBox.classList.toggle('is-stamped', p >= 0.33);
  }
  function filmEnd() {
    cancelAnimationFrame(filmRaf);
    filmFrame(1);
    film.classList.add('is-done');
    filmCard.hidden = false;
    var close = filmCard.querySelector('[data-entrega-close]');
    if (close) close.focus({ preventScroll: true });
  }
  function pedidoRecebido(info) {
    if (!film) return;
    info = info || {};
    var meta = [];
    if (info.numero) meta.push('Pedido nº ' + info.numero);
    if (info.previsao) meta.push('Previsão de entrega: ' + info.previsao);
    filmMeta.textContent = meta.join(' · ');
    filmMeta.hidden = !meta.length;
    filmCard.hidden = true;
    film.classList.remove('is-done');
    filmOpener = document.activeElement;
    filmFrame(0);
    if (typeof film.showModal === 'function') film.showModal(); else film.setAttribute('open', '');
    measureMatch(filmBox, filmRider);
    if (reduce) { filmEnd(); return; }
    // give the photos a moment to be ready, then roll
    var imgs = Array.prototype.slice.call(film.querySelectorAll('img'));
    Promise.race([
      Promise.all(imgs.map(function (i) { return i.decode ? i.decode().catch(function () {}) : null; })),
      new Promise(function (r) { setTimeout(r, 1500); })
    ]).then(function () {
      measureMatch(filmBox, filmRider);
      filmT0 = performance.now();
      (function tick(now) {
        var p = Math.min((now - filmT0) / FILM_MS, 1);
        filmFrame(p);
        if (p < 1) filmRaf = requestAnimationFrame(tick); else filmEnd();
      })(filmT0);
    });
  }
  if (film) {
    film.querySelector('[data-entrega-skip]').addEventListener('click', filmEnd);
    film.querySelector('[data-entrega-close]').addEventListener('click', function () { film.close(); });
    film.addEventListener('cancel', function (e) {
      // Esc skips to the confirmation first, then closes
      if (!film.classList.contains('is-done')) { e.preventDefault(); filmEnd(); }
    });
    film.addEventListener('close', function () {
      cancelAnimationFrame(filmRaf);
      if (filmOpener && document.contains(filmOpener)) filmOpener.focus({ preventScroll: true });
    });
    addEventListener('resize', function () { if (film.open) measureMatch(filmBox, filmRider); }, { passive: true });
  }

  // The hooks the order integration uses. pedidoRecebido is for a confirmed
  // order only.
  window.PlanetaPizza = window.PlanetaPizza || {};
  window.PlanetaPizza.pedidoRecebido = pedidoRecebido;

  // ----------------------------------------------------------- search ----
  var search = document.querySelector('[data-search]');
  var loja = document.getElementById('cardapio');
  var emptyMsg = document.querySelector('[data-search-empty]');
  var termEl = document.querySelector('[data-search-term]');
  var fold = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var haystack = {};
  Object.keys(rows).forEach(function (k) { haystack[k] = fold(rows[k].name + ' ' + rows[k].desc); });
  function filter() {
    var q = fold(search.value.trim());
    var any = false;
    loja.classList.toggle('is-filtering', !!q);
    document.querySelectorAll('[data-cat]').forEach(function (cat) {
      var shown = 0;
      cat.querySelectorAll('[data-item]').forEach(function (li) {
        var hit = !q || haystack[li.getAttribute('data-item')].indexOf(q) > -1;
        li.hidden = !hit;
        if (hit) shown++;
      });
      cat.hidden = !shown;
      if (shown) any = true;
    });
    emptyMsg.hidden = any;
    termEl.textContent = search.value.trim();
  }
  search.addEventListener('input', filter);

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
    document.querySelectorAll('[data-cat]').forEach(function (c) { io.observe(c); });
  }
})();
