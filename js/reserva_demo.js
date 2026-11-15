/* Reserva online - DEMO embebida en la seccion de reservas.
 *
 * No hay modal ni boton flotante: el motor se monta dentro del contenedor
 * [data-rd-booking] (o #rd-booking) que ya existe en la plantilla. Calcula
 * noches, habitaciones y total en vivo, y el boton final abre WhatsApp con la
 * consulta armada. No cobra, no reserva y no envia datos: todo vive en el
 * navegador.
 *
 * Los colores se leen de las variables CSS del sitio en tiempo de ejecucion
 * (--gold / --accent / --color-orange, --ink / --color-dark, --card-bg,
 * --line, etc.), asi el formulario hereda la paleta clara u oscura.
 *
 * Config (window.RD_CONFIG): name, whatsapp, email, sellerWhatsapp,
 * currency, prices[3].
 */
(function () {
  'use strict';
  if (window.__rdLoaded) return;
  window.__rdLoaded = true;

  var CFG = window.RD_CONFIG || {};
  var NAME = CFG.name || 'el alojamiento';
  var PHONE = String(CFG.whatsapp || '').replace(/\D/g, '');
  var EMAIL = String(CFG.email || '').trim();
  var SELLER = String(CFG.sellerWhatsapp || '').replace(/\D/g, '');
  var CURRENCY = CFG.currency || 'USD';
  var PRICES = (CFG.prices && CFG.prices.length === 3) ? CFG.prices : [40, 55, 70];
  var MAX_NIGHTS = 60;
  var MAX_ROOMS = 6;

  var WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/>' +
    '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.34c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24z"/></svg>';

  var TXT = {
    es: {
      badge: 'Demo',
      lead: 'Vista previa del motor de reservas. No se cobra nada: el botón abre WhatsApp con tu consulta ya armada.',
      checkin: 'Llegada',
      checkout: 'Salida',
      adults: 'Adultos',
      children: 'Niños',
      rooms: 'Habitaciones',
      nights: 'Noches',
      roomsTitle: 'Elegí tu habitación',
      roomsHint: 'Precios de referencia por noche',
      cap: 'Hasta {n} personas',
      perNight: 'por noche',
      summary: 'Tu reserva',
      rowRoom: 'Habitación',
      rowGuests: 'Huéspedes',
      rowNights: 'Noches',
      total: 'Total estimado',
      night: ['noche', 'noches'],
      guest: ['huésped', 'huéspedes'],
      adult: ['adulto', 'adultos'],
      child: ['niño', 'niños'],
      cta: 'Consultar por WhatsApp',
      ctaMail: 'Consultar por email',
      note: 'Coordinás disponibilidad y precio final por WhatsApp. Sin pagos online.',
      noteNoContact: 'El alojamiento todavía no cargó un contacto para reservas.',
      priceNote: 'Tarifas de referencia. El precio final se confirma por WhatsApp.',
      seller: '¿Querés reservas online así en tu alojamiento?',
      errMissing: 'Elegí las fechas de llegada y salida.',
      errOrder: 'La salida tiene que ser posterior a la llegada.',
      errMax: 'Para esta consulta, elegí hasta ' + MAX_NIGHTS + ' noches.',
      errRooms: 'Sumá habitaciones para que entren todos los huéspedes.',
      waIntro: 'Hola {name}! Quiero consultar disponibilidad:',
      waCheckin: 'Llegada',
      waCheckout: 'Salida',
      waGuests: 'Huéspedes',
      waRoom: 'Habitación',
      waNights: 'Noches',
      waTotal: 'Total estimado',
      mailSubject: 'Consulta de reserva en {name}',
      sellerMsg: 'Hola! Vi la demo de reserva online de {name} y quiero algo así en mi alojamiento.'
    },
    en: {
      badge: 'Demo',
      lead: 'Booking engine preview. Nothing is charged: the button opens WhatsApp with your inquiry ready to send.',
      checkin: 'Check-in',
      checkout: 'Check-out',
      adults: 'Adults',
      children: 'Children',
      rooms: 'Rooms',
      nights: 'Nights',
      roomsTitle: 'Choose your room',
      roomsHint: 'Sample prices per night',
      cap: 'Up to {n} people',
      perNight: 'per night',
      summary: 'Your booking',
      rowRoom: 'Room',
      rowGuests: 'Guests',
      rowNights: 'Nights',
      total: 'Estimated total',
      night: ['night', 'nights'],
      guest: ['guest', 'guests'],
      adult: ['adult', 'adults'],
      child: ['child', 'children'],
      cta: 'Check on WhatsApp',
      ctaMail: 'Check by email',
      note: 'You confirm availability and the final price on WhatsApp. No online payment.',
      noteNoContact: 'This property has not set a booking contact yet.',
      priceNote: 'Sample rates. The final price is confirmed on WhatsApp.',
      seller: 'Want online booking like this for your property?',
      errMissing: 'Select check-in and check-out dates.',
      errOrder: 'Check-out must be after check-in.',
      errMax: 'For this inquiry, choose up to ' + MAX_NIGHTS + ' nights.',
      errRooms: 'Add rooms so all guests fit.',
      waIntro: 'Hi {name}! I would like to check availability:',
      waCheckin: 'Check-in',
      waCheckout: 'Check-out',
      waGuests: 'Guests',
      waRoom: 'Room',
      waNights: 'Nights',
      waTotal: 'Estimated total',
      mailSubject: 'Booking inquiry at {name}',
      sellerMsg: 'Hi! I saw the online booking demo for {name} and I want something like this for my property.'
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
    if (!a || !b) return 0;
    var pa = a.split('-').map(Number), pb = b.split('-').map(Number);
    return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
  }
  function fmtDate(iso) {
    if (!iso) return '—';
    var p = iso.split('-').map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2])).toLocaleDateString(
      lang() === 'en' ? 'en-US' : 'es-AR',
      { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }
  function money(n) {
    var loc = lang() === 'en' ? 'en-US' : 'es-AR';
    var s = Number(n).toLocaleString(loc, { maximumFractionDigits: 0 });
    return CURRENCY + ' ' + s;
  }
  function plural(n, words) { return n === 1 ? words[0] : words[1]; }
  function fill(tpl, key, val) { return tpl.replace('{' + key + '}', val); }

  /* ---------- color tomado del sitio ---------- */
  function parseColor(v) {
    v = (v || '').trim();
    if (!v || /^var\(/i.test(v)) return null;
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v);
    if (m) {
      var x = m[1].length === 3 ? m[1].replace(/(.)/g, '$1$1') : m[1];
      return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
    }
    m = /^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i.exec(v);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }
  function varColor(el, names) {
    if (!el || !window.getComputedStyle) return null;
    var cs = getComputedStyle(el);
    for (var i = 0; i < names.length; i++) {
      var rgb = parseColor(cs.getPropertyValue(names[i]));
      if (rgb) return rgb;
    }
    return null;
  }
  function rgbStr(rgb) { return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; }
  function luminance(rgb) {
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  }
  function mix(a, b, weight) {
    return [
      Math.round(a[0] * weight + b[0] * (1 - weight)),
      Math.round(a[1] * weight + b[1] * (1 - weight)),
      Math.round(a[2] * weight + b[2] * (1 - weight))
    ];
  }
  function relLum(rgb) {
    var v = rgb.map(function (c) {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function contrastRatio(a, b) {
    var la = relLum(a), lb = relLum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function onColor(rgb) {
    var dark = [20, 22, 26], white = [255, 255, 255];
    return contrastRatio(rgb, dark) >= contrastRatio(rgb, white) ? 'rgb(20,22,26)' : 'rgb(255,255,255)';
  }

  /* ---------- estado ---------- */
  var S = null;
  function freshState() {
    var t = todayISO();
    return {
      checkin: addDays(t, 14),
      checkout: addDays(t, 17),
      adults: 2,
      children: 0,
      rooms: 1,
      room: 0
    };
  }
  function guests() { return S.adults + S.children; }
  var ROOMS = [
    {
      cap: 2,
      es: ['Habitación doble', 'Cama matrimonial o dos individuales'],
      en: ['Double room', 'Double bed or two single beds']
    },
    {
      cap: 3,
      es: ['Habitación triple', 'Ideal para amigos o familias chicas'],
      en: ['Triple room', 'Great for friends or small families']
    },
    {
      cap: 4,
      es: ['Habitación familiar', 'Más espacio para toda la familia'],
      en: ['Family room', 'More space for the whole family']
    }
  ];
  function roomData(i) { return ROOMS[i][lang()]; }
  function minRooms(i) { return Math.max(1, Math.ceil(guests() / ROOMS[i].cap)); }
  function roomQty() { return Math.max(S.rooms, minRooms(S.room)); }
  function nights() { return nightsBetween(S.checkin, S.checkout); }
  function total() { return Math.max(0, nights()) * PRICES[S.room] * roomQty(); }
  function syncRooms() {
    S.rooms = Math.min(MAX_ROOMS, Math.max(S.rooms, minRooms(S.room)));
  }

  /* ---------- DOM ---------- */
  var mount, els = {}, lastLang = lang();

  function field(labelText, input) {
    var label = h('span', { class: 'rd-label', text: labelText });
    var wrap = h('label', { class: 'rd-field' }, [label, input]);
    return { wrap: wrap, label: label };
  }

  function build() {
    mount = document.querySelector('[data-rd-booking]') || document.getElementById('rd-booking');
    if (!mount) return;

    S = freshState();
    mount.textContent = '';
    mount.classList.add('rd-root');

    var badge = h('span', { class: 'rd-badge', text: T('badge') });
    var lead = h('p', { class: 'rd-disclaimer' });
    var top = h('div', { class: 'rd-top' }, [badge, lead]);

    var ci = h('input', { type: 'date', id: 'rd-ci', class: 'rd-input' });
    var co = h('input', { type: 'date', id: 'rd-co', class: 'rd-input' });
    var adults = h('select', { id: 'rd-adults', class: 'rd-input' });
    var children = h('select', { id: 'rd-children', class: 'rd-input' });
    var rooms = h('select', { id: 'rd-rooms', class: 'rd-input' });
    var nightsInput = h('input', { type: 'text', id: 'rd-nights', class: 'rd-input rd-ro', readonly: true, tabindex: '-1' });

    var i;
    for (i = 1; i <= 10; i++) adults.appendChild(h('option', { value: String(i), text: String(i) }));
    for (i = 0; i <= 6; i++) children.appendChild(h('option', { value: String(i), text: String(i) }));
    for (i = 1; i <= MAX_ROOMS; i++) rooms.appendChild(h('option', { value: String(i), text: String(i) }));

    var fCi = field('', ci), fCo = field('', co), fAd = field('', adults),
        fCh = field('', children), fRo = field('', rooms), fNi = field('', nightsInput);

    var grid = h('div', { class: 'rd-grid' }, [
      fCi.wrap, fCo.wrap, fAd.wrap, fCh.wrap, fRo.wrap, fNi.wrap
    ]);

    var roomsTitle = h('h3');
    var roomsHint = h('span');
    var roomsHead = h('div', { class: 'rd-rooms-head' }, [roomsTitle, roomsHint]);
    var roomsBox = h('div', { class: 'rd-rooms' });
    var error = h('p', { class: 'rd-error', role: 'alert', tabindex: '-1' });

    var main = h('div', { class: 'rd-main' }, [grid, roomsHead, roomsBox, error]);

    var summaryTitle = h('h3');
    function row(label) {
      var l = h('span', { text: label });
      var v = h('span', { text: '—' });
      return { el: h('div', { class: 'rd-row' }, [l, v]), label: l, value: v };
    }
    var rIn = row(''), rOut = row(''), rGuests = row(''), rRoom = row(''), rNights = row('');
    var totalLabel = h('span', { text: '' });
    var totalValue = h('strong', { text: '—' });
    var totalRow = h('div', { class: 'rd-total' }, [totalLabel, totalValue]);

    var ctaText = h('span');
    var cta = h('a', { class: 'rd-cta', href: '#', target: '_blank', rel: 'noopener', 'aria-disabled': 'true' });
    cta.innerHTML = WA_SVG;
    cta.appendChild(ctaText);
    var note = h('p', { class: 'rd-note' });

    var summary = h('div', { class: 'rd-summary' }, [
      summaryTitle, rIn.el, rOut.el, rGuests.el, rRoom.el, rNights.el, totalRow, cta, note
    ]);
    var side = h('div', { class: 'rd-side' }, [summary]);

    var footerNote = h('span');
    var sellerLink = h('a', { href: '#', target: '_blank', rel: 'noopener', hidden: true });
    var footer = h('div', { class: 'rd-footer' }, [footerNote, sellerLink]);

    var shell = h('div', { class: 'rd-shell' }, [
      top,
      h('div', { class: 'rd-layout' }, [main, side]),
      footer
    ]);
    mount.appendChild(shell);

    els = {
      lead: lead, ci: ci, co: co, adults: adults, children: children, rooms: rooms, nightsInput: nightsInput,
      fCi: fCi, fCo: fCo, fAd: fAd, fCh: fCh, fRo: fRo, fNi: fNi,
      roomsTitle: roomsTitle, roomsHint: roomsHint, roomsBox: roomsBox, error: error,
      summaryTitle: summaryTitle, rIn: rIn, rOut: rOut, rGuests: rGuests, rRoom: rRoom, rNights: rNights,
      totalLabel: totalLabel, totalValue: totalValue, cta: cta, ctaText: ctaText, note: note,
      footerNote: footerNote, sellerLink: sellerLink
    };

    ci.addEventListener('change', function () {
      S.checkin = ci.value;
      if (S.checkin && (!S.checkout || nightsBetween(S.checkin, S.checkout) < 1)) {
        S.checkout = addDays(S.checkin, 1);
      }
      update();
    });
    co.addEventListener('change', function () { S.checkout = co.value; update(); });
    adults.addEventListener('change', function () { S.adults = +adults.value; syncRooms(); update(); });
    children.addEventListener('change', function () { S.children = +children.value; syncRooms(); update(); });
    rooms.addEventListener('change', function () { S.rooms = +rooms.value; syncRooms(); update(); });

    cta.addEventListener('click', function (e) {
      if (cta.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        if (error.focus) error.focus();
        return;
      }
      // wa.me y mailto se abren normal: no se envia nada desde la pagina.
    });

    applyPalette();
    update();

    var observer = new MutationObserver(function () {
      applyPalette();
      if (lang() !== lastLang) {
        lastLang = lang();
        update();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'class', 'data-theme', 'style']
    });
  }

  function applyPalette() {
    if (!mount) return;
    var root = document.documentElement;
    var body = document.body;
    var scope = mount.parentElement || body;

    var accent = varColor(scope, ['--gold', '--accent', '--color-orange', '--primary', '--brand']) ||
      varColor(body, ['--gold', '--accent', '--color-orange', '--primary', '--brand']) ||
      varColor(root, ['--gold', '--accent', '--color-orange', '--primary', '--brand']) ||
      [184, 134, 59];
    var surface = varColor(scope, ['--card-bg', '--color-white', '--paper', '--surface']) ||
      varColor(body, ['--card-bg', '--color-white', '--paper', '--surface']) ||
      varColor(root, ['--card-bg', '--color-white', '--paper', '--surface']) ||
      [255, 255, 255];
    var text = varColor(scope, ['--ink', '--color-dark', '--text']) ||
      varColor(body, ['--ink', '--color-dark', '--text']) ||
      varColor(root, ['--ink', '--color-dark', '--text']) ||
      (luminance(surface) < 0.45 ? [245, 246, 247] : [29, 32, 37]);
    var muted = varColor(scope, ['--ink-soft', '--color-gray', '--muted']) ||
      varColor(body, ['--ink-soft', '--color-gray', '--muted']) ||
      mix(text, surface, 0.62);
    var line = varColor(scope, ['--line', '--border', '--color-border']) ||
      varColor(body, ['--line', '--border', '--color-border']);
    var dark = luminance(surface) < 0.45;

    mount.style.setProperty('--rd-accent', rgbStr(accent));
    mount.style.setProperty('--rd-on-accent', onColor(accent));
    mount.style.setProperty('--rd-text', rgbStr(text));
    mount.style.setProperty('--rd-muted', rgbStr(muted));
    mount.style.setProperty('--rd-surface', rgbStr(surface));
    mount.style.setProperty('--rd-soft', rgbStr(mix(text, surface, 0.06)));
    mount.style.setProperty('--rd-line', line ? rgbStr(line) : 'rgba(' + text[0] + ',' + text[1] + ',' + text[2] + ',0.18)');
    mount.style.setProperty('color-scheme', dark ? 'dark' : 'light');
  }

  function validate() {
    if (!S.checkin || !S.checkout) return T('errMissing');
    var n = nights();
    if (n < 1) return T('errOrder');
    if (n > MAX_NIGHTS) return T('errMax');
    if (S.rooms < minRooms(S.room)) return T('errRooms');
    return '';
  }

  function buildMessage() {
    var n = Math.max(0, nights());
    var data = roomData(S.room);
    var q = roomQty();
    var guestsLine = S.adults + ' ' + plural(S.adults, T('adult'));
    if (S.children > 0) guestsLine += ' · ' + S.children + ' ' + plural(S.children, T('child'));
    return [
      fill(T('waIntro'), 'name', NAME),
      '• ' + T('waCheckin') + ': ' + fmtDate(S.checkin),
      '• ' + T('waCheckout') + ': ' + fmtDate(S.checkout),
      '• ' + T('waGuests') + ': ' + guestsLine,
      '• ' + T('waRoom') + ': ' + data[0] + (q > 1 ? ' × ' + q : ''),
      '• ' + T('waNights') + ': ' + n + ' ' + plural(n, T('night')),
      '• ' + T('waTotal') + ': ' + money(total())
    ].join('\n');
  }

  function contactHref() {
    var msg = buildMessage();
    if (PHONE) return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    if (EMAIL) {
      return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(fill(T('mailSubject'), 'name', NAME)) +
        '&body=' + encodeURIComponent(msg);
    }
    return '';
  }

  function renderRooms() {
    els.roomsBox.textContent = '';
    ROOMS.forEach(function (room, i) {
      var data = roomData(i);
      var active = S.room === i;
      var qty = active ? roomQty() : minRooms(i);
      var btn = h('button', {
        type: 'button',
        class: 'rd-room',
        'aria-pressed': active ? 'true' : 'false',
        onclick: function () {
          S.room = i;
          syncRooms();
          update();
        }
      }, [
        h('span', { class: 'rd-room-check', 'aria-hidden': 'true', text: '✓' }),
        h('span', { class: 'rd-room-main' }, [
          h('strong', { text: data[0] + (active && qty > 1 ? ' × ' + qty : '') }),
          h('small', { text: data[1] + ' · ' + fill(T('cap'), 'n', room.cap) })
        ]),
        h('span', { class: 'rd-room-price' }, [
          h('strong', { text: money(PRICES[i]) }),
          h('small', { text: T('perNight') })
        ])
      ]);
      els.roomsBox.appendChild(btn);
    });
  }

  function update() {
    if (!mount || !S) return;
    syncRooms();

    var n = nights();
    var err = validate();
    var href = err ? '' : contactHref();
    var room = roomData(S.room);

    els.ci.value = S.checkin;
    els.co.value = S.checkout;
    els.ci.min = todayISO();
    els.co.min = addDays(S.checkin || todayISO(), 1);
    els.adults.value = String(S.adults);
    els.children.value = String(S.children);
    els.rooms.value = String(S.rooms);
    els.nightsInput.value = n > 0 ? n + ' ' + plural(n, T('night')) : '—';

    els.fCi.label.textContent = T('checkin');
    els.fCo.label.textContent = T('checkout');
    els.fAd.label.textContent = T('adults');
    els.fCh.label.textContent = T('children');
    els.fRo.label.textContent = T('rooms');
    els.fNi.label.textContent = T('nights');

    els.roomsTitle.textContent = T('roomsTitle');
    els.roomsHint.textContent = T('roomsHint');
    els.summaryTitle.textContent = T('summary');
    els.rIn.label.textContent = T('checkin');
    els.rOut.label.textContent = T('checkout');
    els.rGuests.label.textContent = T('rowGuests');
    els.rRoom.label.textContent = T('rowRoom');
    els.rNights.label.textContent = T('rowNights');
    els.totalLabel.textContent = T('total');
    els.lead.textContent = T('lead');

    els.rIn.value.textContent = fmtDate(S.checkin);
    els.rOut.value.textContent = fmtDate(S.checkout);
    els.rGuests.value.textContent = guests() + ' ' + plural(guests(), T('guest'));
    els.rRoom.value.textContent = room[0] + (roomQty() > 1 ? ' × ' + roomQty() : '');
    els.rNights.value.textContent = n > 0 ? n + ' ' + plural(n, T('night')) : '—';
    els.totalValue.textContent = n > 0 ? money(total()) : '—';

    renderRooms();

    els.error.textContent = err;
    els.ctaText.textContent = PHONE ? T('cta') : (EMAIL ? T('ctaMail') : T('cta'));
    els.cta.setAttribute('href', href || '#');
    els.cta.setAttribute('aria-disabled', href ? 'false' : 'true');
    els.note.textContent = err || (PHONE || EMAIL ? T('note') : T('noteNoContact'));
    els.footerNote.textContent = T('priceNote');

    if (SELLER) {
      els.sellerLink.hidden = false;
      els.sellerLink.textContent = T('seller');
      els.sellerLink.href = 'https://wa.me/' + SELLER + '?text=' +
        encodeURIComponent(fill(T('sellerMsg'), 'name', NAME));
    } else {
      els.sellerLink.hidden = true;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
