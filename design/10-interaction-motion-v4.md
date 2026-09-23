# Interaction & Motion v4 — a round of restraint, not addition

Prerequisite for build: `motion-designer`, `micro-interaction`, `scroll-motion` implement this
spec as three separate prototype pages in `design/prototype/` reusing shipped `tokens.css` +
`motion.css`. Nothing here touches `site/` until the Head approves the prototype.

## 1. Honest read of v3

**Working, keep exercising:** the ridgeline 3-point motif (`08 §2`) is the one idea on the page —
it is the only motion that accumulates meaning across scroll rather than repeating a trick. Duotone
hover on gallery tiles, process rail fill, and scroll-spy header state all read instantly and cost
nothing extra. Floating labels and FAQ grid-rows disclosure are correct utility motion — invisible
when working, which is the point.

**Already dead or going dead:** reveal/stagger on 13 elements is now visually identical to every
other 2024-template site — a fade+16px rise on every card is no longer differentiating, it is
wallpaper, and per `docs/performance-v3-2026-09-22.md` it is actively **costing CLS 0.666 on
mobile**. About wipe and avatar ring are a single beat, fine, but nobody will remember them. The
FLIP gallery filter is mechanically sound but, per `08 §1`, the filter concept itself is thin for
9 photos — the motion is doing more work than the content justifies.

**Generic and worth killing outright:** stat counters (already flagged "keep only if free" — it is
no longer free once IO + `data-count` are weighed against the CLS budget below; cut). Caption rise
on gallery hover — 4px is already minimal, no further job for it; fold into the duotone crossfade,
remove as a separate transform.

## 2. The interaction concept, one sentence

**Every motion on this page either tracks the visitor's progress through Waiheke's build story
(ridgeline, rail, spy) or confirms an action they just took (buttons, fields, disclosure) — nothing
moves to prove the site is modern.**

## 3. Per-section interaction table

| Section | Interaction | Communicates (vs. static) | Owner | Reduced-motion | Keyboard/SR | Cost |
|---|---|---|---|---|---|---|
| Header | scroll-spy current underline + compact height | where you are in the page without looking down | scroll-motion | instant state change, no transition | `aria-current="true"` on active link, unaffected | 0 KB (already CSS class swap) |
| Hero | word-reveal, one shot, opacity-only (drop `translateY`) | reinforces the one line meant to be read first | motion-designer | renders final state instantly | no live element, decorative only, `aria-hidden` not needed (real text) | ~0 (CSS transition, already shipped, minus the transform that causes CLS) |
| Hero photo | duotone→colour crossfade tied to first ridgeline handoff (already spec'd `08 §2`), no independent parallax | photo's horizon visually becomes the drawn ridgeline — landscape framing the whole story | scroll-motion | fully composited final frame, no animation | decorative image, `alt` unaffected | 0 new; reuses existing filter |
| Ridgeline dividers (×3) | cumulative lit ticks, IO-gated, one-shot per divider | tracks landscape → carpentry → build as a silent through-line | scroll-motion | fully-lit static SVG (unchanged rule) | `aria-hidden`, no keyboard path (unchanged) | ~0.3 KB (already largely shipped) |
| Services | plain hover surface-swap only | affordance that the card is inert text, nothing else | micro-interaction | no-op, hover state is instant | focus-visible = same swap | 0 |
| Process | rail fill on scroll position, no stagger on step text | literal progress bar for "how the job happens" | scroll-motion | rail renders at resting width matching scroll position, no animated fill | rail is decorative; step order is in DOM/reading order already | ~0.2 KB (already shipped) |
| About | portrait wipe + avatar ring, single beat, opacity+clip only (no translate) | one credibility beat (person behind the brand), not a habit | motion-designer | final state instantly, no transition | decorative, text unaffected | 0 new |
| Recent work | duotone→colour hover only (drop separate caption-rise transform); FLIP kept only while filter is on-screen | before/after read: raw job vs. finished job | micro-interaction (hover) + scroll-motion (FLIP reflow) | hover crossfade only via `:hover`/`:focus-visible`, no motion added for `prefers-reduced-motion` beyond instant swap; FLIP becomes an instant reflow (skip the animate step) | tiles reachable via tab, `:focus-visible` gets same crossfade as hover; filter buttons already have `aria-pressed` | 0 new (removes JS: counters + caption-rise ≈ −0.6 KB) |
| FAQ | grid-rows disclosure | question stays anchored while answer opens, no jump | micro-interaction | `grid-template-rows` transition → instant flip under reduced-motion (existing pattern) | native `<button aria-expanded>` disclosure, unaffected | 0 (already shipped) |
| Contact | floating labels, button loading/success | confirms field is filled / submission is in flight, without a page reload feel | micro-interaction | instant label position for prefilled fields (no change needed, CSS `:not(:placeholder-shown)` is not animation-dependent); loading spinner respects reduced-motion (opacity pulse only, no spin if `prefers-reduced-motion`) | labels are real `<label for>`, status text is `aria-live="polite"` (unchanged) | 0 (already shipped) |
| Global reveal (below-fold only) | opacity-only fade-in, IO-gated, no `translateY`, no stagger delay above the fold | signals new content has entered view without moving already-settled layout | motion-designer | disabled entirely under `prefers-reduced-motion` (opacity jumps to 1) | no interactive semantics, doesn't affect focus order | removes the CLS-causing transform; net JS unchanged, net paint cost lower |

Cut from v3 in this pass: stat count-up (JS+IO), gallery caption-rise (separate transform),
above-the-fold `translateY` in reveal (CLS cause), FLIP's animate step under reduced motion.

## 4. Explicit refusals — not doing these, and why

- **Custom cursor** — adds JS+paint for a "look" with zero comprehension gain on a trade-services
  site; refused.
- **Scroll-jacking** (locked/pinned sections, hijacked scroll speed) — actively fights a
  find-a-tradesperson intent; visitors need normal scroll to scan fast. Refused.
- **WebGL/3D** — the product is landscaping, carpentry, build; nothing in the content needs a
  third dimension, and it would blow the JS and TBT budget for a marginal "impressive" read.
  Explicitly: **no**, the product does not need it.
- **Sound** — no interaction on this page benefits from audio feedback; unsolicited sound on a
  service site reads as broken/spam. Explicitly: **no**.
- **Video loops (hero/background)** — heavier than the still duotone photo for the same
  storytelling job the ridgeline already does better; refused unless a client-supplied
  install-in-progress clip is specifically requested later, and even then it should be a
  poster-first `<video>` the visitor opts into, not autoplay-loop wallpaper.

## 5. Budget

- **Added JS across all three specialists, combined: ≤ 6 KB** (target split: scroll-motion ~3 KB
  for the reveal-opacity-only rewrite + FLIP instant-under-reduced-motion branch, micro-interaction
  ~2 KB for hover/disclosure/loading refinements, motion-designer ~1 KB for the hero/about
  one-shot tweaks — most of this is edits to existing modules, not new files).
- **Net JS after cuts (counters, caption-rise, parallax listener) is likely negative** against v3's
  18.3 KB, giving headroom under the 20 KB ceiling rather than spending it.
- **No frame > 32 ms**: requires the drawer scroll-lock fix already identified in
  `docs/performance-v3-2026-09-22.md` (§3) to ship alongside this round — it is a prerequisite, not
  optional, since drawer-open is the only remaining place a long task was measured.
- **CLS = 0**: achieved by dropping `translateY` from all above-the-fold `.reveal` targets (hero,
  `.hero-actions`, `.stats`) and from every below-fold target as well (opacity-only everywhere;
  the 16px rise was never load-bearing information, it was decoration that happened to break the
  budget).
- **LCP unaffected**: hero photo and font preloads already applied per the Head's addendum in
  `docs/performance-v3-2026-09-22.md`; this round adds no new above-the-fold asset and removes the
  reveal/rAF coupling on the LCP element (`.ridge img`) named as a contributing cause there.

## 6. Prototype plan (`design/prototype/`)

Each specialist ships one static HTML file, no build step, linking the real
`site/assets/tokens.css` and `site/assets/motion.css` by relative path so visual language matches
production exactly. No `site/` file is touched.

- `design/prototype/motion-designer.html` — hero word-reveal (opacity-only) + about wipe/avatar
  ring, both toggle-able via a `prefers-reduced-motion` emulation checkbox in the page itself.
- `design/prototype/scroll-motion.html` — ridgeline 3-point cumulative-lit sequence, process rail
  fill, opacity-only reveal on a stand-in card grid, FLIP gallery filter with instant-vs-animated
  toggle.
- `design/prototype/micro-interaction.html` — service card hover, gallery duotone hover, FAQ
  grid-rows disclosure, floating labels + button loading/success states, all as isolated
  interactive components with keyboard-only walkthrough instructions inline.

Each file includes a visible reduced-motion toggle and a keyboard-nav test checklist at the top, so
the Head can review without devtools. Once approved, the three specialists port the approved
markup/JS into `site/` in the same PRs that also fix the drawer scroll-lock and CLS items from the
performance doc.

## 7. Trade-offs for the Head

- **Cutting stat counters and caption-rise removes two items stakeholders may still expect** as
  "modern site" signals after the marquee/tilt/magnetic cuts in v3 — this round goes further in the
  same direction; if a felt need for more visible polish remains after this ships, the ridgeline
  motif is the only lever left to make more prominent (it currently under-promises deliberately).
- **Opacity-only reveal is less "premium-feeling" than the rise-in v3 shipped**, in isolated
  before/after comparison — trading a widely-templated effect for a CLS-safe one; recommended, but
  flagging it will read as slightly plainer to anyone comparing screenshots rather than live
  scrolling.
- **FLIP's reduced-motion path (instant reflow) means gallery filtering feels like a hard cut**
  rather than smoothly regrouping for that subset of visitors — accepted, since it matches the
  existing site-wide reduced-motion contract rather than inventing a softer exception for one
  component.
- **No 3D/sound/cursor/video** closes the door on several award-portfolio tropes referenced in the
  original inspiration set (rive, lusion, uncommon) — deliberate: those sites sell interactive
  craft as the product; Waiheke Backyards Solutions sells landscaping/carpentry/build, and the
  interaction budget here is spent entirely on communicating that, not on demonstrating technique.
