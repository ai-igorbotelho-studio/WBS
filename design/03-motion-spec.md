# Motion spec — WBS one-page site

One line: the site moves like a well-run job site — steady, deliberate, nothing rushed, nothing wasted. Every entry below earns its place by stating what it communicates that a static state cannot. Tokens live in `design/prototype/motion-tokens.css`.

## Movement table

| What | Trigger | Duration | Easing | Distance | Why motion, not static |
|---|---|---|---|---|---|
| Hero headline/lead/CTA reveal | Page load, in view immediately | `--motion-base` (500ms), `--stagger-step` (80ms) between the 3 elements | `--ease-steady` | `--reveal-distance` (16px) | A brief, ordered rise tells a first-time visitor "headline, then promise, then action" in reading order, before they've scrolled at all — content order made physical for half a second, then gone. |
| Services card reveal | Scroll into view (IntersectionObserver) | `--motion-base` | `--ease-steady` | 16px | Confirms the card just entered relevance; a page that snaps every element in at once reads as unloaded, not calm. |
| Card hover (surface swap only, no shadow) | Pointer hover, desktop only | `--motion-fast` (150ms) | `--ease-firm` | none (colour only) | Confirms interactivity without inventing a shadow the design system forbids on web cards; fast because it's feedback, not narrative. |
| Process steps reveal | Scroll into view, staggered by step index | `--motion-base`, `--stagger-step` × index | `--ease-steady` | 16px | The 4-step sequence *is* the content; staggered arrival reads as "step 1 then step 2" without a progress bar or scroll-jack — motion carries sequence a static grid can't. |
| About reverse-forest band | None — static on load | 0 | — | 0 | Deliberately no transition on the colour reverse itself; it is a fixed section boundary, not an event. Listed here to record the "no" explicitly. |
| Recent work — before/after slider (once photo pairs exist) | Drag or click-to-toggle, keyboard-operable | `--motion-fast` for the wipe position | `--ease-firm` | slider-driven, not token-driven | The one signature moment: a wipe communicates transformation over time, which a single photo or a static side-by-side cannot. Everywhere else stays quiet so this reads as intentional. |
| Recent work tiles (placeholder state, no photo pairs yet) | Scroll into view | `--motion-base` | `--ease-steady` | 16px | Same plain reveal as Services — no signature treatment until real before/after pairs ship; faking it with a slider on mismatched placeholders would be a lie about craft. |
| Header compact on scroll | Scroll position past threshold | `--motion-slow` (700ms) | `--ease-firm` | padding/shadow only, no transform | Slow and firm on purpose: a header that snaps compact feels twitchy; 700ms reads as the header settling, matching "deliberate," not "reactive." |
| CTA bar (mobile sticky) entrance | First scroll past hero, one-time | `--motion-slow` | `--ease-steady` | translateY 100% → 0 | Announces a persistent action is now available; rises once and stays — no repeated hide/show on scroll direction, which would read as nervous, not steady. |
| FAQ disclosure (`<details>`) | Click/tap | `--motion-instant` (native, 0ms) | — | 0 | Native accordion is already free, accessible, instant; adding a tween would slow down something the browser gives for free with no comprehension gain. |
| Contact field validation | Form submit | `--motion-instant` | — | 0 | A trades client wants confirmation the form worked, not a watched animation; state changes are instant. |

## Choreography rules

1. **Order of entry, top to bottom:** hero → services → process → about (static) → recent work → FAQ (static) → contact (static). Each section's reveal only fires once its own elements enter the viewport; sections never pre-animate off-screen.
2. **One movement per viewport, plus stagger.** At any scroll position, only one reveal group (a section's own elements) may be animating at once; a stagger group counts as one movement, not many. Header compact and CTA bar entrance are position-triggered, not scroll-continuous, so they never overlap a section reveal in practice — but if a coincidence is possible (e.g. header compacting mid-hero-reveal), the header transition is deferred until the in-progress reveal group finishes.
3. **Stagger caps at 6 items** (`--stagger-step-max`); beyond that, remaining siblings share the maximum delay rather than accumulating a longer wait (see Recent work's 6 tiles).
4. **Hover is feedback, not narrative** — always `--motion-fast`, never travels (no transform), never competes with a scroll-triggered reveal for attention.
5. **`prefers-reduced-motion: reduce` zeroes every duration and distance token globally** — not a per-component opt-out. Content is always visible without motion; this is a requirement, verified in `motion-tokens.css`, not a stretch goal.

## Rejected

- **Parallax on hero photo** — costs paint/GPU on 4G Android for zero comprehension gain; a static photo already is the credibility statement (see `02-experience-vision.md`).
- **Scroll-linked progress bar for Process** — would need a continuous scroll listener; the 4-step stagger already tells the sequence story statically-cheap.
- **Ken-burns/zoom on About portrait** — the colour reverse is the intended signal ("this is Pablo speaking"); a moving portrait would compete with it and read as stock-video, not honest.
- **Animated success screen on Contact submit** — a trades client wants a fact (it worked), not a delight moment; instant state change only.
- **Repeated hide/show of CTA bar on scroll direction** — considered and rejected: reads as nervous/twitchy, works against "steady, deliberate"; bar rises once and stays.
- **Custom cursor / hover trails / any Lusion-style pointer motion** — out of scope per `02-experience-vision.md` Section 3; no comprehension gain, adds JS weight and input latency.
