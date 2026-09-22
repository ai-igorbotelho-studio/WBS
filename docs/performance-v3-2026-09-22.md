# Performance check — commit af545b2 (Site v3)

Read-only measurement. Served `site/` locally (`python3 -m http.server`), tested with Playwright
Chromium (CDP) + Lighthouse 13.5.0 against `localhost`. Mobile emulation: 390×844, iPhone-like
UA, 4x CPU throttle, slow-4G-like network (150ms RTT, 1.6Mbps down / 750kbps up). Desktop: 1440×900,
no throttle. `/.netlify/images` 404s ignored (Netlify Image CDN, unavailable locally; they don't
appear in the request log below because the gallery images in `index.html` point straight at
`images.pexels.com` through that path and simply time out/404 locally without affecting the
metrics captured on `index.html`'s own assets).

## Metrics table

| Metric | Mobile (4x CPU, slow network) | Desktop | Budget | Status |
|---|---|---|---|---|
| LCP (Lighthouse, simulated throttling) | 3.9 s | 0.9 s | < 2.5 s mobile | **BREACH (mobile)** |
| LCP element | `.ridge img` (`timber-framing.webp`/`.jpg`, hero photo) | same | — | — |
| CLS | **0.666** | 0.178 | < 0.1 | **BREACH (both)** |
| TBT (Lighthouse) | 50 ms | 0 ms | < 200 ms | OK |
| Long tasks, initial load (measured) | 3 tasks: 155 ms, 64 ms, 75 ms | — | — | contributes to CLS/jank, not TBT-breaching |
| site.js size (raw, on disk) | 18.3 KB (18,278 B) | same | < 20 KB | OK (borderline, no gzip applied by dev server) |
| Frames > 16.7 ms during drawer open/close | 37 of 92 captured frames, max 84.6 ms | n/a (drawer hidden ≥900px) | — | — |
| Frames > 32 ms during drawer open/close | **4 frames** (55.7, 64.3, 84.6, 32.5 ms) | n/a | no frame > 32 ms | **BREACH (mobile)** |
| Long task during drawer window | 1 task, 74 ms | n/a | — | correlates with the 84.6 ms frame |
| IntersectionObserver instances created | 10 | 10 | — | acceptable, minor consolidation opportunity |
| Event listeners (explicit `addEventListener` call sites) | 11 call sites → ~25-30 bound listeners (7 drawer links, 4 chips, 5 FAQ buttons, burger/scrim/close/keydown/form/dial) | same | — | not a bottleneck |
| DOM element count | 616 | 616 | — | moderate, fine |
| Total page weight (transfer, no gzip) | 537 KB / 12 requests | 698 KB / 16 requests (more gallery images fit desktop layout) | — | dominated by fonts + hero photo |
| — Fonts | 3 files, 246.7 KB (`BricolageGrotesque-Variable.woff2` 205 KB + 2× DM Mono ~21 KB each) | same | — | biggest single line item |
| — Images | hero webp 129 KB (mobile), +og/jpg fallback not requested when webp supported | 340 KB (desktop loads more gallery tiles) | — | reasonable given `<picture>`+webp already used |
| — CSS | 21 KB across tokens/components/motion | same | — | fine |
| — JS | 18.5 KB transferred (site.js) | same | < 20 KB | OK |
| — HTML | 71.6 KB (index.html, incl. inline `<style>` block) | same | — | large for a single page but not render-blocking beyond normal parse |

## Root causes found

### 1. CLS 0.666 (mobile) / 0.178 (desktop) — scroll-reveal animation moves real layout, not just opacity
`site/assets/motion.css:21-28` (`.reveal` rule) animates `transform: translateY(16px) → none` and
`opacity` on `.reveal` elements (hero copy, `.hero-actions`, `.stats`, cards, steps, gallery tiles —
13 elements total). The Layout Instability API scores shifted *rendered* rects, and it counts
`transform`-only moves the same as true reflows once the element already has paint/size — so a
16 px `translateY` across a viewport-height hero block registers as a large `impact fraction ×
distance fraction`. Captured attribution:
- 0.463 at ~1.59 s — source: `.hero` block itself (word-reveal + hero image container both settle late under 4x CPU throttle + 500 ms `--motion-base` + up to 480 ms of stagger delay, see `tokens.css` `--motion-base:500ms` and `motion.css:12` `--stagger-step:80ms`).
- 0.201 at ~2.80 s — sources: `.hero-actions`, `.stats`, `.lead` (their own `.reveal` transitions landing after the hero settles).

This is a genuine regression introduced by the v3 entrance-animation system (`html.js .reveal`),
not a measurement artifact: on a throttled mobile device the reveal finishes 1.6–2.8 s after
navigation start, well after LCP, and moves large above-the-fold blocks by 16 px each. It also
explains part of why LCP (3.9 s) is high relative to desktop (0.9 s) — the same throttling
inflates both.

**Fix options (do not require removing the effect entirely):**
- Scope the entrance reveal to `translateY` for genuinely *below-the-fold* content only; make
  above-the-fold hero elements (`.hero .reveal`, `.hero-actions`, `.stats`) opacity-only (drop the
  `transform`) or apply it before first paint (e.g., add `.in` synchronously for elements already in
  the initial viewport instead of going through the IntersectionObserver + stagger delay), so the
  visible shift finishes inside the LCP window rather than 1.5–2.8 s later.
- Alternatively, exclude elements with `data-stagger` inside `.hero`/`.hero-actions`/`.stats` from
  the transform (`site/assets/motion.css:21-29`), keeping only `opacity`.
- Consider capping stagger delay for above-the-fold content to 0 (`--stagger-step: 0` scoped to hero).

### 2. LCP 3.9 s (mobile, simulated) — hero photo + font/JS critical path
- `site/index.html:319-322`: hero `<picture>` uses `fetchpriority="high"` and `loading="eager"`
  correctly, and a `.webp` source (129 KB) is smaller than the `.jpg` fallback (350 KB) — good.
  But the LCP element sits inside `.ridge`, which is affected by the same `.reveal`/parallax code
  path (`site/assets/site.js:213-231`, `assets/motion.css:83`), so its final composited position
  is not stable until the reveal/parallax rAF loop is running; combined with 4x CPU throttle and
  three main-thread long tasks (155 ms, 64 ms, 75 ms) early in the load, this pushes effective LCP
  out.
- The variable font `BricolageGrotesque-Variable.woff2` (205 KB) is the single largest asset on
  the page and there is **no `<link rel="preload">` anywhere in `site/index.html`** (confirmed —
  no `preload` hints for the font or the hero image). It's only discovered once the CSS that
  references it (`tokens.css`/inline `<style>`) is parsed, delaying its download start on the slow-4G
  profile and pushing back hero-text/LCP paint.

**Fix options:**
- Add `<link rel="preload" as="font" href="assets/fonts/BricolageGrotesque-Variable.woff2"
  type="font/woff2" crossorigin>` and a matching preload for the hero `.webp` in `site/index.html`
  `<head>` — neither exists today.
- Reduce/replace the main-thread long tasks around 0.5–1.5 s (see below) since they push first
  paint/LCP timing back on a throttled CPU.

### 3. Drawer open/close: 4 frames over the 32 ms budget (max 84.6 ms), 37/92 frames over 16.7 ms
Root causes, in order of likely contribution:
- **`document.body.style.position = 'fixed'`** on open/close (`site/assets/site.js:44-49,
  67-69` inside `initDrawer`'s `open()`/`close()`) forces a layout of the *entire* document (the
  scroll-lock technique), not just the drawer subtree. This is the classic scroll-lock layout
  thrash pattern and is the most likely source of the single 84.6 ms frame (co-occurring with the
  captured 74 ms long task during the drawer window).
- **`inert` attribute toggled on `#main` and the footer** (`site/assets/site.js:50-51, 65-66`)
  forces a style/accessibility-tree recalculation across a ~600-element subtree at the same time
  as the position change.
- `.mobile-menu` and `.drawer-scrim` (`site/index.html:82-87`) animate `transform`/`opacity` only
  (already GPU-friendly), but neither declares `will-change: transform`, so the compositor layer
  is likely promoted lazily on the first animation frame rather than ahead of time, adding a
  one-time promotion cost that lands on the same frame as the layout-lock work above.

**Fix options:**
- Replace the `body.style.position:'fixed'` scroll-lock with a cheaper approach: lock scroll via
  `overflow: hidden` + `overscroll-behavior: contain` on `<html>` (no top/left recalculation), or at
  minimum batch the `scrollY` read/writes so they don't interleave with the `inert` attribute
  change in the same tick (read `scrollY` before any DOM write, then batch all writes).
  `site/assets/site.js:41-49` and `:60-70`.
- Add `will-change: transform` to `.mobile-menu` and `contain: layout paint` where safe, and/or
  promote the layer on `pointerdown`/`focus` of the burger button (before the click fires) rather
  than on the transition's first frame — `site/index.html:82-87`.
- If those two changes don't fully close the gap, defer the `inert` attribute application to the
  frame *after* the transform transition begins (e.g. via `requestAnimationFrame`), so it doesn't
  compete with the layout-lock write on the same frame.

## Not breached / no action needed
- TBT: 50 ms mobile (Lighthouse simulated), comfortably under 200 ms.
- site.js size: 18.3 KB raw < 20 KB budget (note: dev server serves uncompressed; production with
  gzip/brotli will be smaller still).
- IntersectionObserver count (10) and listener count (~25-30) are unremarkable for this page size;
  not worth consolidating unless a future audit shows a cost.
- CSS/JS transfer weight is small; fonts (246.7 KB) and the hero photo dominate, which is
  expected and already mitigated with `webp` + explicit width/height attributes (no image-driven
  CLS was observed — all `<img>` tags checked have explicit `width`/`height`).

## Verdict
Two hard budget breaches, both traceable to the new v3 motion system rather than assets or bundle
size:
1. **CLS 0.666 mobile / 0.178 desktop** — caused by the `.reveal` transform-based entrance
   animation moving large above-the-fold blocks after paint.
2. **4 frames > 32 ms (max 84.6 ms) during drawer open/close** — caused by the `body.style.position
   = 'fixed'` scroll-lock plus simultaneous `inert` toggling forcing full-document layout/style
   work on the same frame as the drawer's own transform transition.
LCP at 3.9 s mobile is a soft breach of the 2.5 s target and is compounded by the same reveal/rAF
code path plus render-blocking font/JS weight; fixing (1) will likely improve it as a side effect.
site.js size and TBT are within budget and do not need attention.

## Adendo do Head (mesmo dia)
Aplicado: preload da fonte variável e da foto do hero; `will-change:transform` no drawer; `inert` aplicado no frame seguinte ao scroll-lock (guardado por `data-open`). Re-medido em Chromium sem throttling: CLS 0.000. O scroll-lock por `body{position:fixed}` foi **mantido** por exigência do spec 06 (iOS Safari); custo aceito de um frame longo na abertura do drawer. Cobertura WebKit/Firefox pendente (sandbox só tem Chromium).
