/* @ds-bundle: {"format":4,"namespace":"WBS","components":[{"name":"Button"},{"name":"Card"},{"name":"Field"},{"name":"Eyebrow"},{"name":"Stat"}]} */
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
  window.WBS = { Button: Button, Card: Card, Field: Field, Eyebrow: Eyebrow, Stat: Stat };
})();
