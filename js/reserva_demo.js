/* Reserva online - DEMOSTRACION (sin cobros ni reservas reales).
 *
 * Muestra el recorrido completo (fechas, habitacion, datos, pago, confirmacion)
 * para que el dueño vea como podria quedar. No hace ninguna llamada de red,
 * no guarda ni envia nada: todo vive en memoria del navegador.
 * Los datos de tarjeta son de prueba, de solo lectura, para que nadie escriba
 * una tarjeta real en una pagina que no cobra.
 *
 * Config (window.RD_CONFIG): name, sellerWhatsapp, currency, prices[3].
 */
(function () {
    'use strict';
    if (window.__rdLoaded) return;
    window.__rdLoaded = true;
  
    var CFG = window.RD_CONFIG || {};
    var NAME = CFG.name || 'el alojamiento';
    var SELLER = String(CFG.sellerWhatsapp || '').replace(/\D/g, '');
    var CURRENCY = CFG.currency || 'USD';
    var PRICES = (CFG.prices && CFG.prices.length === 3) ? CFG.prices : [40, 55, 70];
  
    var TXT = {
      es: {
        pill: 'Probar reserva online',
        banner: 'VISTA PREVIA \u00b7 Demostraci\u00f3n: no se procesan pagos ni reservas reales',
        title: 'Reserva online',
        steps: ['Fechas', 'Habitaci\u00f3n', 'Datos', 'Pago', 'Listo'],
        s1: 'Fechas y hu\u00e9spedes', checkin: 'Llegada', checkout: 'Salida',
        adults: 'Adultos', children: 'Ni\u00f1os',
        e_dates: 'La salida debe ser posterior a la llegada.',
        e_dates_max: 'La demo permite hasta 30 noches.',
        e_dates_req: 'Seleccionar las fechas de llegada y salida.',
        s2: 'Elegir habitaci\u00f3n', example: 'Habitaciones y precios de ejemplo',
        nightWord: ['noche', 'noches'], guestWord: ['hu\u00e9sped', 'hu\u00e9spedes'],
        perNight: 'por noche', roomsNeeded: 'habitaciones', total: 'Total',
        up: 'hasta', people: 'personas',
        s3: 'Datos del hu\u00e9sped', name: 'Nombre y apellido', email: 'Correo electr\u00f3nico',
        phone: 'Tel\u00e9fono (opcional)', notes: 'Comentarios (opcional)',
        e_name: 'Ingresar el nombre.', e_email: 'Ingresar un correo v\u00e1lido.',
        s4: 'Pago con tarjeta', testCard: 'Tarjeta de prueba: no se usan datos reales',
        cardNumber: 'N\u00famero de tarjeta', cardName: 'Titular', cardExp: 'Vence', cardCvc: 'CVC',
        summary: 'Resumen', pay: 'Pagar', processing: 'Procesando el pago\u2026',
        s5: 'Reserva de demostraci\u00f3n confirmada', code: 'C\u00f3digo',
        emailPrev: 'As\u00ed recibir\u00eda el hu\u00e9sped su confirmaci\u00f3n por correo',
        emailSubject: 'Reserva confirmada', emailTo: 'Para',
        emailBody: 'Tu reserva qued\u00f3 confirmada. Te esperamos.',
        notice: 'Esto es una demostraci\u00f3n: no se cre\u00f3 ninguna reserva ni se realiz\u00f3 ning\u00fan cobro. Los datos ingresados no se guardan ni se env\u00edan.',
        want: 'Quiero esto en mi alojamiento', wantMsg: 'Hola! Vi la demo de reserva online de ',
        back: 'Volver', next: 'Continuar', close: 'Cerrar', from: 'Del', to: 'al'
      },
      en: {
        pill: 'Try online booking',
        banner: 'PREVIEW \u00b7 Demo: no real payments or bookings are processed',
        title: 'Online booking',
        steps: ['Dates', 'Room', 'Details', 'Payment', 'Done'],
        s1: 'Dates and guests', checkin: 'Check-in', checkout: 'Check-out',
        adults: 'Adults', children: 'Children',
        e_dates: 'Check-out must be after check-in.',
        e_dates_max: 'The demo allows up to 30 nights.',
        e_dates_req: 'Select check-in and check-out dates.',
        s2: 'Choose a room', example: 'Sample rooms and prices',
        nightWord: ['night', 'nights'], guestWord: ['guest', 'guests'],
        perNight: 'per night', roomsNeeded: 'rooms', total: 'Total',
        up: 'up to', people: 'people',
        s3: 'Guest details', name: 'Full name', email: 'Email',
        phone: 'Phone (optional)', notes: 'Comments (optional)',
        e_name: 'Enter a name.', e_email: 'Enter a valid email.',
        s4: 'Card payment', testCard: 'Test card: no real data is used',
        cardNumber: 'Card number', cardName: 'Cardholder', cardExp: 'Expires', cardCvc: 'CVC',
        summary: 'Summary', pay: 'Pay', processing: 'Processing payment\u2026',
        s5: 'Demo booking confirmed', code: 'Code',
        emailPrev: 'This is how the guest would receive the email confirmation',
        emailSubject: 'Booking confirmed', emailTo: 'To',
        emailBody: 'Your booking is confirmed. We look forward to hosting you.',
        notice: 'This is a demo: no booking was created and no charge was made. Entered data is neither saved nor sent.',
        want: 'I want this for my property', wantMsg: 'Hi! I saw the online booking demo of ',
        back: 'Back', next: 'Continue', close: 'Close', from: 'From', to: 'to'
      }
    };
  
    function lang() {
      return /^en/i.test(document.documentElement.lang || '') ? 'en' : 'es';
    }
    function T(k) { return TXT[lang()][k]; }
  
    /* ---------- utilidades ---------- */
    function h(tag, attrs, kids) {
      var e = document.createElement(tag);
      if (attrs) Object.keys(attrs).forEach(function (k) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'text') e.textContent = attrs[k];
        else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] !== false && attrs[k] !== null) e.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
      });
      (kids || []).forEach(function (c) {
        if (c === null || c === undefined) return;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
      return e;
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function todayISO() {
      var d = new Date();
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }
    function addDays(iso, n) {
      var p = iso.split('-').map(Number);
      var d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n));
      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
    }
    function nightsBetween(a, b) {
      var pa = a.split('-').map(Number), pb = b.split('-').map(Number);
      return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
    }
    function fmtDate(iso) {
      var p = iso.split('-').map(Number);
      return new Date(Date.UTC(p[0], p[1] - 1, p[2])).toLocaleDateString(
        lang() === 'en' ? 'en-US' : 'es', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    }
    function money(n) {
      var loc = lang() === 'en' ? 'en-US' : 'es';
      var s = Number(n).toLocaleString(loc, { maximumFractionDigits: 0 });
      return (CURRENCY === 'USD' ? 'USD ' : CURRENCY + ' ') + s;
    }
    function plural(n, words) { return n === 1 ? words[0] : words[1]; }
  
    /* ---------- color de acento tomado del sitio ---------- */
    function parseColor(v) {
      v = (v || '').trim();
      var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
      if (m) {
        var x = m[1].length === 3 ? m[1].replace(/(.)/g, '$1$1') : m[1];
        return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
      }
      m = /^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i.exec(v);
      return m ? [+m[1], +m[2], +m[3]] : null;
    }
    function siteAccent() {
      var cs = getComputedStyle(document.documentElement);
      var names = ['--gold', '--accent', '--color-orange', '--primary', '--brand'];
      for (var i = 0; i < names.length; i++) {
        var v = cs.getPropertyValue(names[i]);
        if (parseColor(v)) return v.trim();
      }
      return '#b8863b';
    }
    function onAccent(rgb) {
      var l = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
      return l > 0.6 ? '#1a1a1a' : '#ffffff';
    }
  
    /* ---------- estado ---------- */
    var S = null;
    function freshState() {
      var t = todayISO();
      return { step: 1, checkin: addDays(t, 14), checkout: addDays(t, 17), adults: 2, children: 0,
               room: 0, name: '', email: '', phone: '', notes: '', code: '', error: '' };
    }
    function guests() { return S.adults + S.children; }
    var ROOMS = [
      { es: ['Habitaci\u00f3n doble', 'Cama matrimonial o dos individuales'], en: ['Double room', 'Double bed or two single beds'], cap: 2 },
      { es: ['Habitaci\u00f3n triple', 'Ideal para amigos o familias chicas'], en: ['Triple room', 'Great for friends or small families'], cap: 3 },
      { es: ['Habitaci\u00f3n familiar', 'M\u00e1s espacio para toda la familia'], en: ['Family room', 'More space for the whole family'], cap: 4 }
    ];
    function roomQty(i) { return Math.max(1, Math.ceil(guests() / ROOMS[i].cap)); }
    function roomTotal(i) { return PRICES[i] * nightsBetween(S.checkin, S.checkout) * roomQty(i); }
  
    /* ---------- DOM base ---------- */
    var root, overlay, dialog, body, banner, lastFocus, pill;
  
    function build() {
      var rgb = parseColor(siteAccent()) || [184, 134, 59];
      root = h('div', { class: 'rd-root', id: 'rd-root' });
      root.style.setProperty('--rd-accent', 'rgb(' + rgb.join(',') + ')');
      root.style.setProperty('--rd-on-accent', onAccent(rgb));
  
      pill = h('button', { class: 'rd-pill', type: 'button', onclick: open }, [
        h('span', { class: 'rd-pill-tag', text: 'DEMO' }), h('span', { class: 'rd-pill-text', text: T('pill') })
      ]);
  
      banner = h('div', { class: 'rd-banner' });
      body = h('div', { class: 'rd-body' });
      dialog = h('div', { class: 'rd-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'rd-title', tabindex: '-1' }, [
        h('button', { class: 'rd-x', type: 'button', 'aria-label': 'Cerrar', text: '\u00d7', onclick: close }),
        banner, body
      ]);
      overlay = h('div', { class: 'rd-overlay', hidden: true, onclick: function (e) { if (e.target === overlay) close(); } }, [dialog]);
      root.appendChild(pill);
      root.appendChild(overlay);
      document.body.appendChild(root);
  
      document.addEventListener('keydown', function (e) {
        if (!overlay.hidden && e.key === 'Escape') close();
      });
      new MutationObserver(function () {
        pill.querySelector('.rd-pill-text').textContent = T('pill');
        if (!overlay.hidden) render();
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  
    function open() {
      S = freshState();
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.documentElement.classList.add('rd-lock');
      render();
      dialog.focus();
    }
    function close() {
      overlay.hidden = true;
      document.documentElement.classList.remove('rd-lock');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  
    /* ---------- render por paso ---------- */
    function progress() {
      var names = T('steps');
      return h('ol', { class: 'rd-progress' }, names.map(function (n, i) {
        var st = (i + 1 < S.step) ? 'done' : (i + 1 === S.step ? 'now' : '');
        return h('li', { class: 'rd-pg ' + st }, [h('span', { class: 'rd-dot', text: String(i + 1) }), h('span', { class: 'rd-pgl', text: n })]);
      }));
    }
    function field(label, input) {
      return h('label', { class: 'rd-field' }, [h('span', { class: 'rd-label', text: label }), input]);
    }
    function nav(backFn, nextLabel, nextFn) {
      return h('div', { class: 'rd-nav' }, [
        backFn ? h('button', { class: 'rd-btn rd-btn-ghost', type: 'button', text: T('back'), onclick: backFn }) : h('span'),
        h('button', { class: 'rd-btn', type: 'button', text: nextLabel, onclick: nextFn })
      ]);
    }
    function errorBox() { return h('p', { class: 'rd-error', role: 'alert', text: S.error || '' }); }
    function selectNum(id, from, to, val) {
      var s = h('select', { id: id, class: 'rd-input' });
      for (var i = from; i <= to; i++) s.appendChild(h('option', { value: String(i), text: String(i), selected: i === val }));
      return s;
    }
    function summaryBar() {
      var n = nightsBetween(S.checkin, S.checkout), g = guests();
      return h('div', { class: 'rd-sumbar' }, [
        h('span', { text: fmtDate(S.checkin) + ' \u2192 ' + fmtDate(S.checkout) }),
        h('span', { text: n + ' ' + plural(n, T('nightWord')) + ' \u00b7 ' + g + ' ' + plural(g, T('guestWord')) })
      ]);
    }
  
    function render() {
      banner.textContent = T('banner');
      body.textContent = '';
      body.appendChild(h('h2', { class: 'rd-title', id: 'rd-title', text: NAME + ' \u00b7 ' + T('title') }));
      body.appendChild(progress());
      var views = [null, step1, step2, step3, step4, step5];
      body.appendChild(views[S.step]());
      body.scrollTop = 0;
    }
  
    function step1() {
      var ci = h('input', { type: 'date', id: 'rd-ci', class: 'rd-input', value: S.checkin, min: todayISO() });
      var co = h('input', { type: 'date', id: 'rd-co', class: 'rd-input', value: S.checkout, min: addDays(todayISO(), 1) });
      var ad = selectNum('rd-ad', 1, 10, S.adults), ch = selectNum('rd-ch', 0, 6, S.children);
      var err = errorBox();
      function go() {
        S.checkin = ci.value; S.checkout = co.value;
        S.adults = +ad.value; S.children = +ch.value;
        if (!S.checkin || !S.checkout) { S.error = T('e_dates_req'); err.textContent = S.error; return; }
        var n = nightsBetween(S.checkin, S.checkout);
        if (n < 1) { S.error = T('e_dates'); err.textContent = S.error; return; }
        if (n > 30) { S.error = T('e_dates_max'); err.textContent = S.error; return; }
        S.error = ''; S.step = 2; render();
      }
      return h('div', { class: 'rd-step' }, [
        h('h3', { text: T('s1') }),
        h('div', { class: 'rd-grid2' }, [field(T('checkin'), ci), field(T('checkout'), co)]),
        h('div', { class: 'rd-grid2' }, [field(T('adults'), ad), field(T('children'), ch)]),
        err, nav(null, T('next'), go)
      ]);
    }
  
    function step2() {
      var n = nightsBetween(S.checkin, S.checkout);
      var list = h('div', { class: 'rd-rooms' });
      ROOMS.forEach(function (r, i) {
        var q = roomQty(i), data = r[lang()];
        var card = h('button', { type: 'button', class: 'rd-room' + (S.room === i ? ' rd-sel' : ''),
          'aria-pressed': S.room === i ? 'true' : 'false',
          onclick: function () { S.room = i; render(); } }, [
          h('span', { class: 'rd-room-main' }, [
            h('strong', { text: data[0] + (q > 1 ? ' \u00d7 ' + q : '') }),
            h('small', { text: data[1] + ' \u00b7 ' + T('up') + ' ' + r.cap + ' ' + T('people') })
          ]),
          h('span', { class: 'rd-room-price' }, [
            h('strong', { text: money(PRICES[i]) }), h('small', { text: T('perNight') })
          ])
        ]);
        list.appendChild(card);
      });
      return h('div', { class: 'rd-step' }, [
        h('h3', { text: T('s2') }), summaryBar(),
        h('p', { class: 'rd-hint', text: T('example') }), list,
        h('div', { class: 'rd-total' }, [h('span', { text: T('total') + ' (' + n + ' ' + plural(n, T('nightWord')) + ')' }), h('strong', { text: money(roomTotal(S.room)) })]),
        nav(function () { S.step = 1; render(); }, T('next'), function () { S.step = 3; render(); })
      ]);
    }
  
    function step3() {
      var nm = h('input', { type: 'text', id: 'rd-name', class: 'rd-input', value: S.name, autocomplete: 'off', maxlength: '80' });
      var em = h('input', { type: 'email', id: 'rd-email', class: 'rd-input', value: S.email, autocomplete: 'off', maxlength: '120' });
      var ph = h('input', { type: 'tel', id: 'rd-phone', class: 'rd-input', value: S.phone, autocomplete: 'off', maxlength: '30' });
      var nt = h('textarea', { id: 'rd-notes', class: 'rd-input', rows: '2', maxlength: '200' });
      nt.value = S.notes;
      var err = errorBox();
      function keep() { S.name = nm.value.trim(); S.email = em.value.trim(); S.phone = ph.value.trim(); S.notes = nt.value.trim(); }
      function go() {
        keep();
        if (!S.name) { S.error = T('e_name'); err.textContent = S.error; nm.focus(); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(S.email)) { S.error = T('e_email'); err.textContent = S.error; em.focus(); return; }
        S.error = ''; S.step = 4; render();
      }
      return h('div', { class: 'rd-step' }, [
        h('h3', { text: T('s3') }), summaryBar(),
        field(T('name'), nm), field(T('email'), em), field(T('phone'), ph), field(T('notes'), nt),
        err, nav(function () { keep(); S.step = 2; render(); }, T('next'), go)
      ]);
    }
  
    function step4() {
      var n = nightsBetween(S.checkin, S.checkout), data = ROOMS[S.room][lang()], q = roomQty(S.room);
      var ro = function (id, label, val, cls) {
        return field(label, h('input', { type: 'text', id: id, class: 'rd-input rd-ro ' + (cls || ''), value: val, readonly: true, tabindex: '-1', autocomplete: 'off' }));
      };
      var btn = h('button', { class: 'rd-btn rd-pay', type: 'button', text: T('pay') + ' ' + money(roomTotal(S.room)) + ' (demo)' });
      btn.addEventListener('click', function () {
        btn.disabled = true; btn.textContent = T('processing');
        S.code = 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        setTimeout(function () { S.step = 5; render(); }, 1100);
      });
      return h('div', { class: 'rd-step' }, [
        h('h3', { text: T('s4') }),
        h('div', { class: 'rd-sum' }, [
          h('strong', { text: T('summary') }),
          h('div', { class: 'rd-row' }, [h('span', { text: data[0] + (q > 1 ? ' \u00d7 ' + q : '') + ' \u00b7 ' + n + ' ' + plural(n, T('nightWord'))}), h('span', { text: money(roomTotal(S.room)) })]),
          h('div', { class: 'rd-row rd-muted' }, [h('span', { text: fmtDate(S.checkin) + ' \u2192 ' + fmtDate(S.checkout) }), h('span', { text: guests() + ' ' + plural(guests(), T('guestWord')) })])
        ]),
        h('p', { class: 'rd-hint rd-testcard', text: T('testCard') }),
        ro('rd-cn', T('cardNumber'), '4242 4242 4242 4242'),
        ro('rd-cname', T('cardName'), S.name),
        h('div', { class: 'rd-grid2' }, [ro('rd-cexp', T('cardExp'), '12/30'), ro('rd-ccvc', T('cardCvc'), '123')]),
        h('div', { class: 'rd-nav' }, [
          h('button', { class: 'rd-btn rd-btn-ghost', type: 'button', text: T('back'), onclick: function () { S.step = 3; render(); } }), btn
        ])
      ]);
    }
  
    function step5() {
      var n = nightsBetween(S.checkin, S.checkout), data = ROOMS[S.room][lang()], q = roomQty(S.room);
      var mail = h('div', { class: 'rd-mail' }, [
        h('div', { class: 'rd-mail-h' }, [h('span', { text: T('emailTo') + ': ' + S.email }), h('strong', { text: T('emailSubject') + ' \u00b7 ' + NAME })]),
        h('p', { text: T('emailBody') }),
        h('p', { class: 'rd-muted', text: T('code') + ' ' + S.code + ' \u00b7 ' + data[0] + (q > 1 ? ' \u00d7 ' + q : '') + ' \u00b7 ' + fmtDate(S.checkin) + ' \u2192 ' + fmtDate(S.checkout) + ' \u00b7 ' + money(roomTotal(S.room)) })
      ]);
      var actions = [];
      if (SELLER) {
        actions.push(h('a', { class: 'rd-btn', target: '_blank', rel: 'noopener', text: T('want'),
          href: 'https://wa.me/' + SELLER + '?text=' + encodeURIComponent(T('wantMsg') + NAME) }));
      }
      actions.push(h('button', { class: 'rd-btn rd-btn-ghost', type: 'button', text: T('close'), onclick: close }));
      return h('div', { class: 'rd-step rd-done' }, [
        h('div', { class: 'rd-check', 'aria-hidden': 'true', text: '\u2713' }),
        h('h3', { text: T('s5') }),
        h('p', { class: 'rd-code', text: T('code') + ': ' + S.code }),
        summaryBar(),
        h('p', { class: 'rd-hint', text: T('emailPrev') }), mail,
        h('p', { class: 'rd-notice', text: T('notice') }),
        h('div', { class: 'rd-actions' }, actions)
      ]);
    }
  
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
    else build();
  })();