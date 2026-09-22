/*!
 * WBS prototype scroll.js — reveal, scroll-spy, header shrink, sticky CTA.
 * IntersectionObserver only, no scroll listeners, no scroll-jacking.
 * Respects prefers-reduced-motion. If this fails to run, html never gets
 * the "js" class, so html.js-gated CSS never applies and content stays visible.
 */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  doc.classList.add("js");

  var hasIO = "IntersectionObserver" in window;

  /* Mobile menu toggle */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobilemenu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!open));
      burger.setAttribute("aria-expanded", String(!open));
      burger.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.setAttribute("data-open", "false");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Scroll reveal, staggered by data-stagger -> CSS var --d.
     Skipped under prefers-reduced-motion (CSS already shows content). */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  } else if (hasIO) {
    var STEP_MS = 80; // stagger offset per moment map
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var idx = parseInt(el.getAttribute("data-stagger") || "0", 10) || 0;
            el.style.setProperty("--d", idx * STEP_MS + "ms");
            el.classList.add("in");
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* Scroll-spy: highlight the nav link for the section in view. */
  var navLinks = document.querySelectorAll("#navlinks a");
  var spyPairs = [];
  navLinks.forEach(function (a) {
    var target = document.querySelector(a.getAttribute("href"));
    if (target) spyPairs.push([target, a]);
  });
  if (hasIO && spyPairs.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) {
              a.removeAttribute("aria-current");
            });
            spyPairs.forEach(function (pair) {
              if (pair[0] === entry.target) {
                pair[1].setAttribute("aria-current", "true");
              }
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    spyPairs.forEach(function (pair) {
      spyObserver.observe(pair[0]);
    });
  }

  /* Header shrink after 80px scroll, via a sentinel + IntersectionObserver. */
  var header = document.getElementById("siteHeader");
  if (hasIO && header) {
    var headerSentinel = document.createElement("div");
    headerSentinel.setAttribute("aria-hidden", "true");
    headerSentinel.style.cssText =
      "position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden";
    document.body.appendChild(headerSentinel);

    var headerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        header.setAttribute("data-shrunk", String(!entry.isIntersecting));
      });
    });
    headerObserver.observe(headerSentinel);
  }

  /* Sticky mobile CTA bar: shown once the hero scrolls out of view.
     Hidden by CSS above 900px viewport (desktop keeps the header CTA). */
  var hero = document.getElementById("top");
  var ctaBar = document.getElementById("ctaBar");
  if (hasIO && hero && ctaBar) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var visible = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          ctaBar.setAttribute("data-visible", String(visible));
          ctaBar.setAttribute("aria-hidden", String(!visible));
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(hero);
  }
})();
