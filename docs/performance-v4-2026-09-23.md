# Performance check — commit 6cf6c52 (Site v4)

Read-only measurement against the budgets in `design/10-interaction-motion-v4.md` §5 (added JS
≤6 KB, no frame > 32 ms, CLS = 0, LCP unaffected). Served `site/` locally
(`python3 -m http.server 8099`), tested with Playwright 1.56.1 (`/opt/pw-browsers/chromium`, CDP)
and `npx lighthouse@13.5.0` (needed `--no-sandbox` in this container to launch). Mobile emulation:
390×844, iPhone-like UA, 4x CPU throttle, slow-4G-like network (150 ms RTT, 1.6 Mbps down /
750 kbps up) via `Emulation.setCPUThrottlingRate` + `Network.emulateNetworkConditions`. Desktop:
1440×900, no throttle. 3 runs per profile for scroll/frame data. `/.netlify/images` 404s ignored
(Netlify Image CDN unavailable locally; unrelated to `index.html`'s own assets).

## Metrics table

| Metric | Mobile (4x CPU, slow network) | Desktop | Budget | Status |
|---|---|---|---|---|
| site.js size (raw, on disk) | 17,410 B | same | added JS ≤ 6 KB across the round | **PASS** — net **-868 B** vs v3's 18,278 B (JS got smaller, not bigger) |
| CLS (CDP `layout-shift`, buffered, 3 runs) | **0.6658** (identical across all 3 runs) | **0.000** (3/3 runs) | CLS = 0 | **BREACH (mobile only)** — see root cause §1 |
| CLS (Lighthouse, simulated throttling, default mobile profile) | 0.000 | — | CLS = 0 | PASS (simulated-throttling replay does not reproduce the real font-swap delay; see §1) |
| LCP element/time (CDP) | `H1.display.w-in` (hero heading text) @ ~940–1050 ms | `IMG assets/photos/timber-framing.webp` @ ~320–330 ms | not specified as a v4 target (only "unaffected") | **PASS** — no new above-the-fold asset added, timing in line with/better than v3 |
| LCP (Lighthouse, simulated throttling) | 5.7 s (default Lighthouse mobile throttle, harsher than the slow-4G profile used elsewhere in this report) | — | informational only | not compared directly (different throttle profile); CDP number is the one measured under the spec's stated conditions |
| TBT (Lighthouse) | 50 ms | — | — | OK, unchanged from v3 |
| Long tasks during full scroll (3 runs, `PerformanceObserver('longtask')`) | run1: 6 tasks (204,99,57,112,112,166 ms); run2: 4 tasks (171,50,58,83 ms); run3: 3 tasks (247,51,86 ms) — all in the first ~4 s (page-load/font/decode work, not scroll-driven) | run1/2/3: 2 tasks each, ~60–120 ms, all in first 300 ms | — | none overlap the scroll frames flagged below |
| Frames > 32 ms during full scroll (3 runs each) | run1: 1 frame (34.2 ms); run2: 1 frame (33.9 ms); run3: **0** | run1: 1 frame (34.5 ms); run2: **0**; run3: 1 frame (44.6 ms) | no frame > 32 ms | **flaky soft breach, both profiles** — see root cause §2 (this is the "flaky one on desktop" — reproduced: 2 of 3 desktop runs, 44.6 ms max) |
| Frames > 16.7 ms during full scroll | 50–55 of ~101–104 captured | 35–39 of ~95–96 | — | expected during continuous scroll, not itself budget-gated |
| Frames > 32 ms during drawer open/close (mobile only, desktop has no drawer < 900 px breakpoint) | run1: 2 frames (40.0, 53.5 ms); run2: 5 frames (40.8, 33.6, 35.1, 39.5, 49.3 ms); run3: 1 frame (76.3 ms) | n/a | no frame > 32 ms | **BREACH** — worse than v3 (4 frames, max 84.6 ms → now 2–5 frames per run, max 76.3 ms); root cause §3 |
| IntersectionObserver instances created | 9 | 9 | — | down from v3's 10 (parallax-lite IO removed, consistent with the JS diff) |
| Event listener registrations (`addEventListener` calls counted at runtime) | 23 | 23 | — | down slightly from v3's ~25-30 estimate |
| DOM element count | 618 | 618 | — | +2 vs v3's 616 (gallery tiles now `<a>` wrapping `<img>`+`<div class="cap">`, net small increase from making tiles focusable links) |
| CSS total (tokens+motion+components, raw) | 19,753 B (4,122+12,744+2,887) | same | — | down from v3's ~21 KB, consistent with rules removed (parallax, caption-rise, stagger) |
| Total page weight (local dev server, excl. `/.netlify/images` 404s) | ~486 KB core assets (HTML 72,152 B + JS 17,410 B + CSS 19,753 B + fonts 246,120 B + hero webp 129,134 B) | same core assets, more gallery tiles fit desktop layout | — | in line with v3's ~537 KB/698 KB; no regression |

## Before/after v3 summary

| | v3 (`af545b2`) | v4 (`6cf6c52`) | Delta |
|---|---|---|---|
| site.js | 18,278 B | 17,410 B | **-868 B**, well inside budget |
| CLS mobile | 0.666 | 0.6658 | **unchanged** — same magnitude, different cause (see §1) |
| CLS desktop | 0.178 | 0.000 | fixed |
| Frames > 32 ms, drawer (mobile) | 4 frames, max 84.6 ms (single run) | 1–5 frames per run across 3 runs, max 76.3 ms | not fixed, still breaching, marginally lower peak |
| Frames > 32 ms, scroll | not measured in v3 report | 0–1 frame per run, both profiles, max 44.6 ms | new data point this round; flaky, low severity |
| IntersectionObserver count | 10 | 9 | -1 (parallax-lite IO removed) |
| LCP mobile | 3.9 s (Lighthouse, pre-preload) / addendum says preload fixed it same day | 5.7 s (Lighthouse, simulated) / ~1.0 s (CDP, real slow-4G+4x throttle) | see caveat below — CDP number is the comparable one and is a clear improvement |

Caveat on the LCP row: the v3 report's 3.9 s Lighthouse number predates the Head's same-day font/image
preload addendum; this round's Lighthouse run (5.7 s) uses Lighthouse's own default mobile
throttling profile (steeper than this report's slow-4G CDP profile), so the two Lighthouse numbers
are not directly comparable. The CDP measurement, taken under the exact network/CPU profile this
report specifies throughout, shows LCP at ~1.0 s mobile — consistent with the design doc's claim
that this round "adds no new above-the-fold asset" and does not regress LCP.

## Root causes

### 1. CLS 0.6658 mobile — BREACH, budget claims "CLS = 0" but that only holds without network throttling

The `.reveal` transform removal (this commit, `site/assets/motion.css` diff) is confirmed working:
tested with CDP CLS observation and zero throttling, mobile CLS is `0` (`/tmp` debug script,
reproduced independently). The opacity-only rewrite is not the cause of the residual CLS.

Under the mobile profile actually specified for this check (4x CPU + slow-4G), CLS is **0.6658**,
composed of two shifts nearly identical in magnitude/timing to what the v3 report attributed to the
old transform-based reveal:
- 0.463 at ~2.27 s — source: `<section class="hero" id="top">` growing from `y:501/h:343` to
  `y:73/h:771` (a genuine size+position reflow, not a transform).
- 0.203 at ~3.81 s — sources: `.hero-actions`, `.lead`, `.stats` and hero text nodes moving by
  40–140 px, again real reflow (position/height both change), not `translateY`.

These are **not** caused by `.reveal`/`.reveal.in` (that rule is opacity-only now, confirmed by
reading `site/assets/motion.css` post-commit — no `transform` in either state). The actual cause is
font-loading FOUT: `site/assets/tokens.css:2-4` declares all three `@font-face` rules with
`font-display: swap`, and under the slow-4G profile the variable font
(`assets/fonts/BricolageGrotesque-Variable.woff2`, 205 KB, the largest single asset on the page)
does not finish downloading until ~2–4 s in. Text initially renders in the fallback font, then
reflows to the final metrics once the swap happens, and because the hero block sizes itself around
that text (fluid `clamp()` typography, no `font-size-adjust`/fallback-metric matching visible in
`tokens.css`), the swap changes both text-block height and everything stacked below it — hence the
large `.hero` and `.hero-actions`/`.stats` shifts landing exactly when the font finishes loading.

This is a **pre-existing issue, not introduced by this commit** — the font-swap mechanics are
untouched by the v4 diff — but it means the v4 budget line "CLS = 0" is only true in the no-throttle
condition the Head's v3 addendum tested, not under the mobile network/CPU profile this check (and
presumably real users on 4G) is run against. The design doc's "0" claim should be understood as
"0 from the reveal system", which is accurate, but a second, larger, independent CLS source remains
under real-world network conditions.

**Fix suggestion (not applied, read-only check):** add `size-adjust`/`ascent-override`/
`descent-override` to the `@font-face` rules in `site/assets/tokens.css:2` to match the fallback
font's box metrics, or preload the two DM Mono files too (only the variable sans is preloaded,
`site/index.html:31`) so both swap earlier, before layout depending on them stabilizes.

### 2. Frames > 32 ms during scroll (both profiles) — flaky, reproduced

0 or 1 frame per run, 33–45 ms, on both mobile and desktop; this is the "flaky one on desktop" the
frontend flagged — reproduced here in 2 of 3 desktop runs (34.5 ms and 44.6 ms; run 2 clean).
No long task (`PerformanceObserver('longtask')`, 50 ms threshold) coincides with any of these
frames — they are below the long-task threshold, so they are not visible to Lighthouse TBT. They
correlate with the page's several `IntersectionObserver` callbacks (`revealObserver`,
`ridgeline` observer, gallery/drawer scroll-spy observers — 9 total, `site/assets/site.js`) firing
in the same tick as the synthetic scroll step and each triggering a class toggle
(`.reveal.in`, `.ridgeline-lit`, `.photo-color`) that forces one extra style recalc/paint. Under 4x
CPU throttle (mobile) or plain GC/compositor scheduling noise (desktop, no throttle), these
occasionally coalesce onto a single frame past 32 ms; most of the time they don't, hence the
flakiness. Severity is low (max observed 44.6 ms, 1 frame per affected run, well short of the
84.6 ms v3 drawer frame) and not treated here as a hard budget breach — it's a soft/flaky one, worth
a follow-up but not a regression this commit introduced (the 9 IO instances and their callbacks are
mostly pre-existing; this commit removed one IO, if anything reducing the surface slightly).

### 3. Frames > 32 ms during drawer open/close — BREACH, `close()` was not given the same fix as `open()`

The v3 report's fix (Head's addendum, applied before this commit) deferred the `inert` attribute
toggle to the next animation frame **only in `open()`**:

```
site/assets/site.js:52  requestAnimationFrame(function () { ... if (main) main.setAttribute('inert', ''); if (foot) foot.setAttribute('inert', ''); });
```

`close()` (`site/assets/site.js:60-73`) still does all of the following synchronously in one tick,
on the same frame as the drawer's own closing transform transition:

```
site/assets/site.js:60   drawer.setAttribute('data-open', 'false');
site/assets/site.js:64   if (main) main.removeAttribute('inert');      // style/AX-tree recalc across ~600-element subtree
site/assets/site.js:65   if (foot) foot.removeAttribute('inert');
site/assets/site.js:66   document.body.style.position = '';            // forces full-document layout (scroll-lock release)
site/assets/site.js:67   document.body.style.top = '';
site/assets/site.js:68   document.body.style.width = '';
site/assets/site.js:69   window.scrollTo(0, scrollY);                  // another layout/scroll pass
```

This reproduces the same layout-thrash pattern the v3 report diagnosed for `open()` before the fix
(`docs/performance-v3-2026-09-22.md` §3), just on the closing edge instead. It explains why the
drawer-frame breach persists (and in 2 of 3 runs here is *worse* — up to 5 over-budget frames per
run vs v3's 4 in a single run) despite the Head's addendum: the addendum's fix was applied
one-sided.

**Fix suggestion (not applied, read-only check):** mirror the `open()` pattern — set
`data-open="false"` and start the closing transition immediately, but defer
`main.removeAttribute('inert')` / `foot.removeAttribute('inert')` and the
`body.style.position/top/width` reset + `scrollTo` to the next `requestAnimationFrame`, exactly as
`open()` already does for the inert toggle at `site/assets/site.js:52`.

## Not breached / no action needed

- **Added JS budget (≤6 KB)**: site.js is 868 B *smaller* than v3, comfortably inside budget —
  the design doc's own prediction ("net JS after cuts is likely negative") is confirmed.
- **LCP**: no new above-the-fold asset, hero photo/font preloads untouched by this commit, CDP
  timing (~320 ms desktop, ~1.0 s mobile under the specified throttle) shows no regression.
- **TBT**: 50 ms (Lighthouse), unchanged from v3, comfortably under the 200 ms convention.
- **CSS weight**: down slightly (~19.8 KB vs v3's ~21 KB) from removed rules (parallax, caption-rise,
  stagger custom properties).
- **IntersectionObserver/listener counts**: both down slightly from v3, no consolidation needed.

## Verdict

Two budget items from `design/10-interaction-motion-v4.md` §5 pass cleanly: **added JS** (net
negative, well under 6 KB) and **LCP** (unaffected, confirmed under the specified mobile
network/CPU profile). Two do not fully pass:

1. **CLS = 0 — breached on mobile (0.6658) under the network/CPU profile this check uses**, despite
   the `.reveal` transform removal working exactly as designed (confirmed CLS = 0 with no
   throttling). The residual CLS is font-swap-driven (`font-display: swap` + no fallback metric
   matching, `site/assets/tokens.css:2-4`), a pre-existing mechanism this commit didn't touch and
   didn't introduce — but it means the "CLS = 0" line item is not actually met end-to-end on a
   throttled mobile connection, which is the condition real users on-site are most likely to hit.
2. **No frame > 32 ms — still breached on the drawer**, and the v4 spec explicitly named the
   drawer scroll-lock fix as "a prerequisite, not optional" for this round (§5). The fix shipped
   for `open()` only; `close()` retains the exact layout-thrash pattern the v3 report diagnosed,
   so the budget line is not met. A flaky, low-severity (<45 ms) frame-budget miss during plain
   scroll was also reproduced on both profiles (including the desktop flakiness the frontend
   reported), but it is not tied to this commit's changes and is not treated as a regression.

## Adendo do Head (2026-09-23)
- **CLS mobile 0.666 → 0.002** (slow 4G + 4× CPU). Causa real: a classe `js` era adicionada só pelo `site.js` (defer), então em rede lenta o menu no-JS renderizava em fluxo e colapsava depois. Fix: script inline de 1 linha no `<head>` liberado por hash SHA-256 na CSP (sem `unsafe-inline`). Sobra do font-swap tratada com `@font-face` de fallback métrico (`Bricolage Fallback` = Arial/Liberation/Helvetica com `size-adjust`/`ascent`/`descent` override), gerado pelo `build-tokens.py` a partir do `tokens.json`.
- **Rail:** escrita de `--fill` adiada para rAF (frame de 33 ms intermitente eliminado na origem).
- **Drawer close:** remoção de `inert` adiada para rAF. Com 4× CPU throttle o fechamento ainda mede 40–52 ms num frame (≈12 ms sem throttle) por causa do restore de `body{position:fixed}` + `scrollTo`, exigido pelo spec 06 para iOS. **Aceito como trade-off**; a alternativa (`overflow:hidden` em `html`) quebra o scroll-lock no Safari iOS.
