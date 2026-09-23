/* motion-designer.js — prototype-only wiring for:
   1. Hero word-reveal (opacity-only, one shot)
   2. About portrait wipe + avatar ring (opacity+clip only, one shot)
   3. Global below-fold reveal (opacity-only, IO-gated, no stagger delay above the fold)
   4. A visible checkbox emulating prefers-reduced-motion by toggling html.reduced-motion-emu,
      which the CSS treats identically to the @media (prefers-reduced-motion: reduce) rules.
   This file has no relation to site/assets/site.js beyond mirroring its logic 1:1 for review. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var hasIO = 'IntersectionObserver' in window;

  function reducedRequested() {
    return document.documentElement.classList.contains('reduced-motion-emu') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------------- Hero word-reveal (once on load, opacity-only) ---------------- */
  function runHeroReveal() {
    var display = document.querySelector('.proto-hero .display');
    if (!display) return;
    display.classList.remove('w-in');
    if (reducedRequested()) {
      // Final state instantly, no transition.
      display.classList.add('w-in');
      return;
    }
    // Force reflow so the removal above is committed before re-adding the class,
    // letting the checkbox re-trigger the one-shot animation for review purposes.
    void display.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { display.classList.add('w-in'); });
    });
  }

  /* ---------------- About portrait wipe + avatar ring (opacity+clip only) ---------------- */
  function runAboutBeat() {
    var about = document.querySelector('.proto-about');
    if (!about) return;
    about.classList.remove('about-in');
    if (reducedRequested()) {
      about.classList.add('about-in');
      return;
    }
    void about.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { about.classList.add('about-in'); });
    });
  }

  /* ---------------- Global below-fold reveal (opacity-only, IO-gated, no stagger) ---------------- */
  var revealObserver = null;
  function setUpReveal() {
    var reveals = document.querySelectorAll('.reveal');
    reveals.forEach(function (el) { el.classList.remove('in'); });
    if (reducedRequested() || !hasIO) {
      reveals.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  function runAll() {
    runHeroReveal();
    runAboutBeat();
    setUpReveal();
  }

  var toggle = document.getElementById('reducedMotionEmu');
  if (toggle) {
    toggle.addEventListener('change', function () {
      document.documentElement.classList.toggle('reduced-motion-emu', toggle.checked);
      runAll();
    });
  }

  document.addEventListener('DOMContentLoaded', runAll);
  if (document.readyState !== 'loading') runAll();

  // Small affordance: replay button re-triggers the two one-shot beats without reloading,
  // useful for reviewing timing repeatedly. No effect on the reveal-on-scroll section.
  var replay = document.getElementById('replayBeats');
  if (replay) {
    replay.addEventListener('click', function () {
      runHeroReveal();
      runAboutBeat();
    });
  }
})();
