/*! WBS site.js — vanilla, single file, ≤25KB. Progressive enhancement only:
 * if this fails to load, html never gets the "js" class, so all html.js-gated
 * CSS never applies and content stays visible/usable without JS. */
document.documentElement.classList.add('js');
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------------- Off-canvas nav drawer ---------------- */
  (function initDrawer() {
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('mobilemenu');
    var scrim = document.getElementById('drawerScrim');
    var main = document.getElementById('main');
    var foot = document.querySelector('.foot') ? document.querySelector('.foot').closest('footer') : null;
    var ctaBarEl = document.getElementById('ctaBar');
    if (!burger || !drawer) return;
    var scrollY = 0;
    var lastFocus = null;

    function focusables() {
      return Array.prototype.slice.call(
        drawer.querySelectorAll('a[href], button:not([disabled])')
      ).filter(function (el) { return el.offsetParent !== null; });
    }

    function trap(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function setDrawerOpen(open) { window.wbsDrawerOpen = open; if (typeof applyCtaBar === 'function') applyCtaBar(); }

    function open() {
      lastFocus = document.activeElement;
      scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = (-scrollY) + 'px';
      document.body.style.width = '100%';
      drawer.setAttribute('data-open', 'true');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      if (scrim) scrim.setAttribute('data-open', 'true');
      // inert on the next frame so style recalc does not share the scroll-lock layout frame
      requestAnimationFrame(function () { if (drawer.getAttribute('data-open') !== 'true') return; if (main) main.setAttribute('inert', ''); if (foot) foot.setAttribute('inert', ''); });
      setDrawerOpen(true);
      document.addEventListener('keydown', trap, true);
      var f = focusables();
      (drawer.querySelector('.drawer-close') || (f[0] || burger)).focus();
    }

    function close() {
      drawer.setAttribute('data-open', 'false');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      if (scrim) scrim.setAttribute('data-open', 'false');
      if (main) main.removeAttribute('inert');
      if (foot) foot.removeAttribute('inert');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
      setDrawerOpen(false);
      document.removeEventListener('keydown', trap, true);
      (lastFocus || burger).focus();
    }

    burger.addEventListener('click', function () {
      var isOpen = drawer.getAttribute('data-open') === 'true';
      if (isOpen) close(); else open();
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    var closeBtn = drawer.querySelector('.drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (scrim) scrim.addEventListener('click', close);

    /* Scroll-spy also drives the drawer's current-section marker */
    var drawerLinks = drawer.querySelectorAll('a[href^="#"]');
    var drawerSpyPairs = [];
    drawerLinks.forEach(function (a) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) drawerSpyPairs.push([target, a]);
    });
    if (hasIO && drawerSpyPairs.length) {
      var drawerSpyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            drawerLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
            drawerSpyPairs.forEach(function (pair) {
              if (pair[0] === entry.target) pair[1].setAttribute('aria-current', 'true');
            });
          }
        });
      }, { rootMargin: '-30% 0px -50% 0px' });
      drawerSpyPairs.forEach(function (pair) { drawerSpyObserver.observe(pair[0]); });
    }
  })();

  /* ---------------- Reveal + stagger ---------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !hasIO) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var idx = parseInt(el.getAttribute('data-stagger') || '0', 10) || 0;
          el.style.setProperty('--i', idx);
          el.classList.add('in');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------- Scroll-spy ---------------- */
  var navLinks = document.querySelectorAll('#navlinks a');
  var spyPairs = [];
  navLinks.forEach(function (a) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) spyPairs.push([target, a]);
  });
  if (hasIO && spyPairs.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
          spyPairs.forEach(function (pair) {
            if (pair[0] === entry.target) pair[1].setAttribute('aria-current', 'true');
          });
        }
      });
    }, { rootMargin: '-30% 0px -50% 0px' });
    spyPairs.forEach(function (pair) { spyObserver.observe(pair[0]); });
  }

  /* ---------------- Header compact ---------------- */
  var header = document.getElementById('siteHeader');
  if (hasIO && header) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden';
    document.body.appendChild(sentinel);
    var headerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (!window.wbsDrawerOpen) header.setAttribute('data-shrunk', String(!entry.isIntersecting)); });
    });
    headerObserver.observe(sentinel);
  }

  /* ---------------- Mobile CTA bar ---------------- */
  var hero = document.getElementById('top');
  var ctaBar = document.getElementById('ctaBar');
  var inContact = false, fieldFocused = false;
  function applyCtaBar() {
    if (!ctaBar) return;
    var hide = inContact || fieldFocused || !!window.wbsDrawerOpen;
    ctaBar.classList.toggle('cta-bar--suppressed', hide);
    ctaBar.toggleAttribute('inert', hide || ctaBar.getAttribute('data-visible') !== 'true');
    if (hide) {
      ctaBar.setAttribute('aria-hidden', 'true');
      ctaBar.style.visibility = 'hidden';
    } else {
      ctaBar.style.visibility = '';
      ctaBar.setAttribute('aria-hidden', ctaBar.getAttribute('data-visible') === 'true' ? 'false' : 'true');
    }
  }
  if (hasIO && hero && ctaBar) {
    var ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var visible = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        ctaBar.setAttribute('data-visible', String(visible));
        ctaBar.toggleAttribute('inert', !visible);
        applyCtaBar();
      });
    }, { threshold: 0 });
    ctaObserver.observe(hero);
  }
  var contactSection = document.getElementById('contact');
  var quoteForm = document.getElementById('quote');
  if (contactSection && hasIO) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { inContact = e.isIntersecting; applyCtaBar(); });
    }, { threshold: 0.05 }).observe(contactSection);
  }
  if (quoteForm) {
    quoteForm.addEventListener('focusin', function () { fieldFocused = true; applyCtaBar(); });
    quoteForm.addEventListener('focusout', function () {
      window.setTimeout(function () { fieldFocused = quoteForm.contains(document.activeElement); applyCtaBar(); }, 0);
    });
  }

  /* ---------------- Hero word-reveal (once on load) ---------------- */
  var display = document.querySelector('.hero .display');
  if (display) {
    var words = display.querySelectorAll('.w');
    words.forEach(function (w, i) { w.style.setProperty('--i', Math.min(i, 6)); });
    // reveal on first paint after parse, never gated on window load (LCP text)
    requestAnimationFrame(function () { requestAnimationFrame(function () { display.classList.add('w-in'); }); });
  }

  /* ---------------- Hero photo parallax-lite ---------------- */
  var ridge = document.querySelector('.ridge');
  var ridgeImg = ridge ? ridge.querySelector('img') : null;
  if (ridge && ridgeImg && hasIO && !reduce) {
    var rafId = null;
    function tick() {
      var rect = ridge.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var progress = (vh / 2 - (rect.top + rect.height / 2)) / vh; // -0.5..0.5 roughly
      var max = 12;
      var y = Math.max(-max, Math.min(max, progress * max * 2));
      ridgeImg.style.setProperty('--parallax-y', y.toFixed(2) + 'px');
      rafId = requestAnimationFrame(tick);
    }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (rafId === null) rafId = requestAnimationFrame(tick);
        } else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0 }).observe(ridge);
  }

  /* ---------------- Ridgeline motif — cumulative lit ticks ---------------- */
  (function initRidgeline() {
    var dividers = Array.prototype.slice.call(document.querySelectorAll('.ridgeline'));
    if (!dividers.length) return;
    if (!hasIO || reduce) return; // no-JS/reduced-motion: markup already ships fully lit
    var lit = dividers.map(function () { return false; });
    dividers.forEach(function (svg) {
      svg.querySelectorAll('.tick').forEach(function (t) { t.classList.remove('ridgeline-lit'); });
    });
    function paint() {
      dividers.forEach(function (svg) {
        svg.querySelectorAll('.tick').forEach(function (t) {
          var i = parseInt(t.getAttribute('data-i'), 10) || 0;
          t.classList.toggle('ridgeline-lit', !!lit[i]);
        });
      });
    }
    var dividerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = dividers.indexOf(entry.target);
        if (idx === -1) return;
        if (entry.boundingClientRect.top < (window.innerHeight || 0)) lit[idx] = true;
        paint();
      });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    dividers.forEach(function (svg) { dividerObserver.observe(svg); });
  })();

  /* ---------------- Process — connecting progress rail ---------------- */
  var stepsEl = document.querySelector('.steps');
  var railFill = document.querySelector('.rail__fill');
  if (stepsEl && railFill && hasIO) {
    var stepNodes = Array.prototype.slice.call(stepsEl.querySelectorAll('.step'));
    var maxIdx = -1;
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = stepNodes.indexOf(entry.target);
          if (idx > maxIdx) {
            maxIdx = idx;
            railFill.style.setProperty('--fill', String((maxIdx + 1) / stepNodes.length));
          }
        }
      });
    }, { threshold: 0.4 });
    stepNodes.forEach(function (el) { stepObserver.observe(el); });
  }

  /* ---------------- About — portrait wipe + avatar ring (one beat) ---------------- */
  var aboutGrid = document.querySelector('.about-grid');
  if (aboutGrid && hasIO) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          aboutGrid.classList.add('about-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 }).observe(aboutGrid);
  } else if (aboutGrid) {
    aboutGrid.classList.add('about-in');
  }

  /* ---------------- Recent work — category filter with FLIP ---------------- */
  (function initFilter() {
    var chips = document.querySelectorAll('.filters .chip');
    var gallery = document.querySelector('.gallery');
    if (!chips.length || !gallery) return;
    var tiles = Array.prototype.slice.call(gallery.querySelectorAll('.tile'));

    function applyFilter(cat) {
      var firstRects = reduce ? null : tiles.map(function (t) { return t.getBoundingClientRect(); });
      tiles.forEach(function (t) {
        var match = cat === 'All' || t.getAttribute('data-cat') === cat;
        t.classList.toggle('is-hidden', !match);
        t.toggleAttribute('inert', !match);
      });
      if (reduce) return;
      requestAnimationFrame(function () {
        tiles.forEach(function (t, i) {
          if (t.classList.contains('is-hidden')) return;
          var last = t.getBoundingClientRect();
          var first = firstRects[i];
          var dx = first.left - last.left, dy = first.top - last.top;
          if (dx || dy) {
            t.style.transition = 'none';
            t.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
            requestAnimationFrame(function () {
              t.style.transition = '';
              t.style.transform = '';
            });
          }
        });
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        applyFilter(chip.getAttribute('data-filter'));
      });
    });
  })();

  /* ---------------- FAQ — enhance <details> into animated button/panel ---------------- */
  (function initFaq() {
    document.querySelectorAll('.faq details').forEach(function (d, i) {
      var summary = d.querySelector('summary');
      var body = d.querySelector('p');
      if (!summary || !body) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q-btn';
      btn.textContent = summary.textContent;
      var panelId = 'faq-panel-' + i;
      btn.id = 'faq-btn-' + i;
      btn.setAttribute('aria-expanded', String(d.open));
      btn.setAttribute('aria-controls', panelId);

      var panel = document.createElement('div');
      panel.className = 'panel';
      panel.id = panelId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', btn.id);
      panel.setAttribute('data-open', String(d.open));
      var inner = document.createElement('div');
      inner.appendChild(body.cloneNode(true));
      panel.appendChild(inner);

      var wrap = document.createElement('div');
      wrap.appendChild(btn);
      wrap.appendChild(panel);
      d.replaceWith(wrap);

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.setAttribute('data-open', String(!open));
      });
    });
  })();

  /* ---------------- Contact form: validation + loading/success state ---------------- */
  var form = document.getElementById('quote'), status = document.getElementById('status');
  var dial = document.getElementById('dial'), phoneHint = document.getElementById('phone-hint');
  if (dial && phoneHint) {
    dial.addEventListener('change', function () {
      var o = dial.options[dial.selectedIndex];
      phoneHint.textContent = o.getAttribute('data-hint') || '';
      var v = document.querySelector('.dial__val'); if (v) v.textContent = o.getAttribute('data-cc') + ' ' + o.getAttribute('data-code');
      var ph = document.getElementById('phone'); if (ph) ph.focus();
    });
  }
  if (form && status) {
    form.addEventListener('submit', function (ev) {
      var ok = true;
      form.querySelectorAll('.wbs-field').forEach(function (f) {
        var i = f.querySelector('input,textarea,select');
        if (!i) return;
        var bad = i.required && !i.value.trim();
        if (i.type === 'tel' && i.value) { var digits = i.value.replace(/\D/g, ''); if (digits.length < 6 || digits.length > 13) bad = true; }
        f.setAttribute('data-invalid', String(bad));
        if (bad) ok = false;
      });
      var c = form.querySelector('input[name=consent]');
      if (!c.checked) ok = false;
      var btn = form.querySelector('button[type="submit"]');
      if (!ok) {
        ev.preventDefault();
        status.removeAttribute('data-ok');
        status.textContent = 'Please fill in your name, phone, the job details and tick the consent box.';
        return;
      }
      if (btn) {
        var label = btn.textContent;
        btn.setAttribute('data-state', 'loading');
        btn.setAttribute('aria-busy', 'true');
        window.setTimeout(function () {
          btn.setAttribute('data-state', 'success');
          btn.removeAttribute('aria-busy');
          window.setTimeout(function () {
            btn.removeAttribute('data-state');
            btn.textContent = label;
          }, 2200);
        }, 700);
      }
      if (location.protocol === 'file:' || /localhost|127\.0\.0\.1/.test(location.host)) {
        ev.preventDefault();
        status.setAttribute('data-ok', 'true');
        status.textContent = 'Thanks. Form submission is handled by the host in production; this local preview does not send.';
      }
      // Valid submission on a real host: no preventDefault, Netlify Forms handles it natively.
    });
  }

})();
