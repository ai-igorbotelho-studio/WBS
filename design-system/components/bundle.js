/* @ds-bundle: {"format":4,"namespace":"WBS","components":[{"name":"Button"},{"name":"Card"},{"name":"Field"},{"name":"Eyebrow"},{"name":"Stat"},{"name":"Nav"},{"name":"Chip"},{"name":"RidgelineDivider"},{"name":"Quote"}]} */
(function () {
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function Button(o) {
    o = o || {}; var b = el(o.href ? 'a' : 'button', 'wbs-btn wbs-btn--' + (o.variant || 'primary'), o.label || 'Get a quote');
    if (o.href) b.href = o.href; else b.type = o.type || 'button';
    if (o.onClick) b.addEventListener('click', o.onClick);
    return b;
  }
  function Card(o) {
    o = o || {}; var c = el('article', 'wbs-card' + (o.raised ? ' wbs-card--raised' : ''));
    if (o.eyebrow) c.appendChild(Eyebrow({ text: o.eyebrow }));
    if (o.title) c.appendChild(el('h3', 'wbs-card__title', o.title));
    if (o.body) c.appendChild(el('p', 'wbs-card__body', o.body));
    if (o.items && o.items.length) { var ul = el('ul', 'wbs-card__list'); o.items.forEach(function (t) { ul.appendChild(el('li', null, t)); }); c.appendChild(ul); }
    return c;
  }
  var fid = 0;
  function Field(o) {
    o = o || {}; var id = o.id || ('wbs-f' + (++fid));
    var w = el('div', 'wbs-field' + (o.error ? ' wbs-field--error' : ''));
    var l = el('label', 'wbs-field__label', o.label || 'Label'); l.htmlFor = id; w.appendChild(l);
    var i = el(o.multiline ? 'textarea' : 'input', 'wbs-field__input'); i.id = id; i.name = o.name || id;
    if (!o.multiline) i.type = o.type || 'text'; else i.rows = o.rows || 4;
    if (o.placeholder) i.placeholder = o.placeholder; if (o.value) i.value = o.value; if (o.required) i.required = true;
    w.appendChild(i);
    if (o.hint || o.error) { var h = el('div', 'wbs-field__hint', o.error || o.hint); h.id = id + '-hint'; i.setAttribute('aria-describedby', h.id); if (o.error) i.setAttribute('aria-invalid', 'true'); w.appendChild(h); }
    return w;
  }
  function Eyebrow(o) { o = o || {}; return el('span', 'wbs-eyebrow' + (o.muted ? ' wbs-eyebrow--muted' : ''), o.text || 'LANDSCAPE · CARPENTRY · BUILD'); }
  function Stat(o) { o = o || {}; var s = el('div', 'wbs-stat'); s.appendChild(el('div', 'wbs-stat__value', o.value || '—')); s.appendChild(el('div', 'wbs-stat__label', o.label || '')); return s; }

  function Chip(o) {
    o = o || {};
    var active = !!o.active;
    var b = el('button', 'chip', o.label || '');
    b.type = 'button';
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
    b.addEventListener('click', function () {
      active = !active;
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (o.onToggle) o.onToggle(active);
    });
    return b;
  }

  function Quote(o) {
    o = o || {};
    var text = (o.text || '').trim();
    if (!text) return null;
    var q = el('blockquote', 'quote');
    q.appendChild(el('p', 'quote__text', text));
    if (o.attribution) q.appendChild(el('cite', 'quote__attribution', o.attribution));
    return q;
  }

  function RidgelineDivider(o) {
    o = o || {};
    var lit = o.lit || [false, false, false];
    var wrap = el('div', 'wbs-ridgeline');
    wrap.setAttribute('aria-hidden', 'true');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 240 40');
    svg.setAttribute('class', 'wbs-ridgeline__svg');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0 30 L60 12 L120 26 L180 8 L240 22');
    path.setAttribute('class', 'wbs-ridgeline__path');
    svg.appendChild(path);
    var positions = [60, 120, 180];
    var ys = [12, 26, 8];
    for (var i = 0; i < 3; i++) {
      var isLit = !!lit[i];
      var tick = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      tick.setAttribute('cx', positions[i]);
      tick.setAttribute('cy', ys[i]);
      tick.setAttribute('r', 2);
      tick.setAttribute('class', 'wbs-ridgeline__tick' + (isLit ? ' wbs-ridgeline__tick--lit bone-outline' : ''));
      svg.appendChild(tick);
    }
    wrap.appendChild(svg);
    return wrap;
  }

  function Nav(o) {
    o = o || {};
    var links = o.links || [];
    var cta = o.cta || {};
    var whatsapp = o.whatsapp || {};
    var lastFocused = null;
    var openState = false;

    var trigger = el('button', 'wbs-nav-trigger', o.label || 'Menu');
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'wbs-drawer');

    var scrim = el('div', 'wbs-scrim');
    var drawer = el('div', 'wbs-drawer');
    drawer.id = 'wbs-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Main menu');
    drawer.hidden = true;

    var closeBtn = el('button', 'wbs-drawer__close', 'Close');
    closeBtn.type = 'button';
    drawer.appendChild(closeBtn);

    var list = el('ul', 'wbs-drawer__list');
    var linkEls = links.map(function (l) {
      var li = el('li', 'wbs-drawer__item' + (l.current ? ' wbs-drawer__item--current' : ''));
      var a = el('a', 'wbs-drawer__link', l.label);
      a.href = l.href;
      if (l.current) a.setAttribute('aria-current', 'true');
      li.appendChild(a);
      list.appendChild(li);
      return { li: li, a: a, href: l.href };
    });
    drawer.appendChild(list);

    var actions = el('div', 'wbs-drawer__actions');
    var ctaLink = el('a', 'wbs-btn wbs-btn--primary', cta.label || 'Get a quote');
    ctaLink.href = cta.href || '#contact';
    actions.appendChild(ctaLink);
    if (whatsapp.label) {
      var waLink = el('a', 'wbs-drawer__whatsapp', whatsapp.label);
      waLink.href = whatsapp.href || '#';
      actions.appendChild(waLink);
    }
    drawer.appendChild(actions);

    var focusables = function () {
      return [closeBtn].concat(linkEls.map(function (x) { return x.a; })).concat(
        [ctaLink].concat(whatsapp.label ? [drawer.querySelector('.wbs-drawer__whatsapp')] : [])
      ).filter(Boolean);
    };

    var savedScrollY = 0;
    function lockScroll() {
      savedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + savedScrollY + 'px';
      document.body.style.width = '100%';
    }
    function unlockScroll() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScrollY);
    }

    function setInert(on) {
      var bg = o.background || Array.prototype.filter.call(document.body.children, function (n) {
        return n !== drawer && n !== scrim && n !== trigger && !trigger.contains(n) && !n.contains(trigger);
      });
      bg.forEach(function (n) { if (on) n.setAttribute('inert', ''); else n.removeAttribute('inert'); });
    }

    function onKeydown(e) {
      if (!openState) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    function open() {
      if (openState) return;
      openState = true;
      lastFocused = document.activeElement;
      drawer.hidden = false;
      scrim.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('data-open', 'true');
      scrim.setAttribute('data-open', 'true');
      setInert(true);
      lockScroll();
      document.addEventListener('keydown', onKeydown, true);
      var f = focusables(); if (f.length) f[0].focus();
    }

    function close() {
      if (!openState) return;
      openState = false;
      drawer.hidden = true;
      scrim.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      drawer.removeAttribute('data-open');
      scrim.removeAttribute('data-open');
      setInert(false);
      unlockScroll();
      document.removeEventListener('keydown', onKeydown, true);
      (lastFocused || trigger).focus();
    }

    trigger.addEventListener('click', function () { openState ? close() : open(); });
    closeBtn.addEventListener('click', close);
    scrim.addEventListener('click', close);
    linkEls.forEach(function (x) { x.a.addEventListener('click', close); });
    ctaLink.addEventListener('click', close);

    function setCurrent(href) {
      linkEls.forEach(function (x) {
        var isCurrent = x.href === href;
        x.li.classList.toggle('wbs-drawer__item--current', isCurrent);
        if (isCurrent) x.a.setAttribute('aria-current', 'true'); else x.a.removeAttribute('aria-current');
      });
    }

    drawer.hidden = true;
    scrim.hidden = true;

    return { trigger: trigger, drawer: drawer, scrim: scrim, setCurrent: setCurrent, open: open, close: close };
  }

  window.WBS = { Button: Button, Card: Card, Field: Field, Eyebrow: Eyebrow, Stat: Stat, Nav: Nav, Chip: Chip, RidgelineDivider: RidgelineDivider, Quote: Quote };
})();
