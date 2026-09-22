# UI spec v3 — navigation states, coherence pass, cuts

Status: **for approval (Igor)**. Builds on `06-navigation-spec.md` (behaviour, approved pattern), `07-creative-direction-v3.md` and `08-experience-v3.md` (crit + cuts), Head decisions in `04-ui-spec-v2.md`. Visual states only; behaviour/ARIA stay as specified in 06. Consumers: `design-system-engineer` (tokens), `frontend-multistack` (drawer/header markup).

## 1. Header & drawer states

**Header, ≥1100px (comfortable)** — height `header-height` 72px → `header-height-compact` 52px past 80px scroll. Logo mark 40px fixed (floor, never shrinks). Link row: gap `space-6` (24px), `body` size (16px), underline draw on hover/focus only (`--motion-fast`, unchanged). `current` link (scroll-spy): 2px solid `accent` underline, permanent, no hover needed to see it. CTA `nav-cta`: `wbs-btn--primary`, fixed 44px min-height even inside the 52px compact bar (Head decision §6, 4px v-padding).

**Header, 900–1099 (condensed)** — same states, tighter numbers only: link gap `space-4` (16px), link font-size steps to 15px (new, see §5), logo lockup drops to mark-only + no wordmark spacing gap change (mark stays 40px, `space-5` gap → `space-4`). No hamburger. If a 6th link is ever added, this row must be re-audited before shipping (per 06 §2).

**Trigger (`#burger`), <900px** — 44×44px hit area (unchanged), icon 20px, 3 bars (already 3 `<path>`, retarget as 3 elements, stroke 2px, 4px gutter).
| State | Visual |
|---|---|
| default | `surface-raised` fill, 1px `line` border, `ink` bars |
| hover (pointer:fine) | border → `accent`, no fill change |
| active/pressed | bars → `accent` for the press duration |
| focus-visible | 2px `focus` ring, 2px offset (+1px inset forest line on bone, per README) |
| open (`aria-expanded="true"`) | bars morph to X: top bar rotate 45°/translate to (10px,10px), middle bar opacity→0 scale-x 0, bottom bar rotate -45°/translate to (10px,-10px) — all in `--motion-fast`; `reduce`: 80ms opacity crossfade, no rotation |

**Drawer (`#mobilemenu` → overlay, `role="dialog"`)** — width `min(86vw, 360px)` (new token `drawer-width`), right-anchored, full height, `surface` background (paper/Bone — matches page ground, not surface-alt, so it reads as an extension of the page not a card). Padding: `max(16px, env(safe-area-inset-top))` top, `max(16px, env(safe-area-inset-bottom))` bottom, `24px` (space-6) + `env(safe-area-inset-right)` on the trailing (right) edge, `24px` leading. Close button top-right, 44×44px, same icon as X-state burger.

Drawer rows, one state table for links, CTA, WhatsApp:
| State | Link row | CTA button | WhatsApp |
|---|---|---|---|
| default | `ink` text, no border shown until scrolled list, min-height 48px (space-6+space-6) | `wbs-btn--primary` full width | text link, `ink-muted`, icon 20px |
| hover (fine pointer) | background `surface-alt` full-row | `accent-hover` fill | `ink` (darken from muted) |
| active | background one step darker (`surface-alt` mixed 8% `forest`) | `accent-hover` + 1px inset shadow-inset-line | underline |
| focus-visible | 2px `focus` ring inset (row), standard ring (buttons) | standard ring | standard ring |
| current (scroll-spy match) | left border 3px solid `accent` + text weight 600 (matches "current" marker asked for in 06 §"current-section indicator") | n/a | n/a |
| open (drawer itself) | scrim visible behind, `#ctaBar` `inert`+`aria-hidden` per 06 coexistence rule | — | — |

**Scrim**: `rgba(31,58,46,0.45)` (`forest` at 45% — new token `scrim`, see §5), covers viewport outside drawer, tap-to-close, fades in/out over `--motion-fast`, `reduce`: instant.

**Divider inside drawer**: 1px `line` rule between nav-link block and CTA/WhatsApp block (space-6 above/below), matching the ASCII wireframe in 06 §5.

**Mobile landscape short viewport (≤480px height)**: header row of drawer (wordmark + close) `position:sticky` top:0 inside drawer, link list becomes the scrollable region (`overflow-y:auto`), CTA/WhatsApp block stays pinned via the same sticky mechanism at the bottom (`position:sticky; bottom:0`) so both remain reachable without body scroll.

## 2. Coherence — typography, consolidated

Per creative-direction §4, one job per level, step-h3 folded into card-h3:

| Level | Token | Size | Use |
|---|---|---|---|
| display | `display-l`/`display-xl` | 56/88 | hero headline only, one `em` in `timber-text`, never reused elsewhere |
| h1 | `h1` | 32/40 (fixed, no fluid) | every section heading, no exceptions |
| **h2 (was h3 for cards, now also process steps)** | `h2` | 28/32 | service card titles, process step titles, FAQ question, form legend — **one "unit" family**; step number stays separate (mono eyebrow), do not reintroduce a smaller step-h3 |
| eyebrow/mono | `eyebrow` (11) / `mono` (16) / `mono-l` (28) | — | labels, step numbers, stats, contact links, legal line only — never migrates into body copy |
| body/lead | `body-l`/`body` | 18/16 | one paragraph per card/step, no `.lead` inside a card (cut if reintroduced) |

Net effect: process step markup drops its own `h3` class in favour of the same class card titles use (`.h2` or equivalent existing utility) — a rename/reuse, not a new style.

## 3. Colour by section (60/30/10, tightened)

| Section | Surface token | Notes |
|---|---|---|
| Hero, Services, Process, Work, FAQ | `surface` / `surface-alt` alternating (Bone/Bone-alt, 60%) | unchanged pattern |
| About, closing band, footer | `surface` dark theme (Forest, 30%) | three reversals only, do not add a fourth |
| **Contact** | `surface-alt` **+ paper-stock treatment** (new, §5): 1px hairline top rule in `line`, same stroke weight as the ridgeline SVG (2px), full section width, positioned at the section's top edge | Marks `#contact` as the one "write on this page" surface without a new colour — per creative-direction §5 Add-3 |
| Eyebrows, step numbers, one hero `em`, CTA fill, focus ring | `timber` / `timber-text` / `accent` (10%) | never a fill larger than a button/icon chip; ridgeline stroke stays `line`/`bone`-on-forest, never timber |

**Hero duotone**: `.ridge img` (hero photo) gets the same Forest×Timber duotone filter as `.tile--duo` in the gallery (reuse the existing SVG `feColorMatrix`/CSS filter recipe already shipping there — do not invent a second duotone recipe). This closes the open item named in creative-direction §6 ("duotone hero vs. real photo strong on its own").

**`#d8b08c` caption colour** (currently `.reverse .eyebrow`, `.tile--photo span`, `.tile--duo span`): re-map to the existing `timber-text` token (`dark` value is literally `#d8b08c` already — these three rules are on Forest-theme/dark surfaces, i.e. gallery captions and reverse eyebrows). **Recommendation: substitute the raw hex with `var(--timber-text)`** rather than mint a new token — it is the same value, already contrast-checked at 6.2:1 on forest. No new token needed here, just remove the hardcoded hex (component-css instruction, not a design-token addition).

## 4. Remove from CSS/markup

1. Both `.marquee` blocks (lines ~325, ~374 `index.html`) — delete markup + `.marquee`/`.marquee__track` rules and any `animation: … infinite` keyframe tied to it. Per creative-direction/experience v3, zero marquees survive (v3 experience doc goes further than the "keep one" hedge in creative-direction — resolve in favour of the later, more decisive experience-v3 read: cut both, the ridgeline 3-point motif replaces the "connective tissue" job).
2. Tilt-on-hover (service cards) — remove JS hook + CSS transform rule.
3. Magnetic-button drag — remove JS listener + associated transform.
4. Ripple JS (pointer listener + pseudo-element) — replace with CSS-only `:active{ background: accent-hover }` (or equivalent per-component active state already defined for buttons); delete the JS module and any generated ripple element/keyframe.
5. Stat counters — remove the count-up JS/IO trigger; keep the static markup (`<span class="cnt" data-count="30">30</span>` renders its literal text), delete `data-count` attribute and the script that reads it since it now serves no purpose.
6. `.quote`/`.quotes` CSS: **do not delete** — ship the one real testimonial (creative-direction §5 Add-2). Insert one `<blockquote class="quote">` between Process and About with a single Pablo-attributed line (copy TBD from Pablo, placeholder text must not ship to production; flag to content owner before merge). If no real quote is available by ship date, delete the dead rule block rather than ship a placeholder quote.

## 5. Component states that change (new/updated only)

- **Chips (gallery filter)**: no change — keep as spec'd in prior docs; FLIP mechanism stays, filter itself flagged for review only past ~9 photos (experience-v3 §1, no action now).
- **Form fields, button loading/success, FAQ disclosure**: no visual change — already correct per experience-v3 §1 ("no complaint"). Do not touch.
- **Ridgeline dividers** (2 existing placements, process→about + about→work per current markup; add a 3rd at services→process to complete the 3-point motif per experience-v3 §2): each divider gets 3 small tick markers along the path, `data-lit="true"` cumulative state — unlit tick = `line` at 40% opacity, lit tick = `accent` (timber) fill, 4px diameter. Fully-lit static state under `prefers-reduced-motion`/no-JS (existing pattern, unchanged).

## 6. New/changed tokens for design-system-engineer

| Token | Value | Usage | Contrast |
|---|---|---|---|
| `drawer-width` | `min(86vw, 360px)` | mobile/tablet drawer panel width | n/a (layout) |
| `scrim` | `rgba(31,58,46,0.45)` (forest @ 45%) | drawer backdrop | n/a (non-text overlay); underlying page content is `inert`, not read through scrim |
| `header-height-compact` | `52px` | already proposed in 04-ui-spec-v2 §7 — **confirm as shipped**, no change | n/a |
| `paper-stock-rule` | `2px` stroke, color `line` (#d8d3c9 light / #3f5c4f dark) | `#contact` top hairline, matches ridgeline stroke weight | decorative, no contrast requirement |
| `ridgeline-lit` | = `accent` (`#b8845a` timber) | tick markers, lit state | 3.8:1 on forest / 2.8:1 on bone — same ceiling as existing timber-on-surface use; ticks are ≥4px marks, not text, so AA large-graphic threshold (3:1) applies and is met on forest only — **on bone, pair tick with a 1px `forest` outline** (mirrors the focus-ring doubling technique already in tokens.json) so it clears 3:1 there too. |
| `timber-text` (existing) | `#8a5e3a` light / `#d8b08c` dark | **re-use, do not duplicate**: replace hardcoded `#d8b08c` in `components.css` (`.reverse .eyebrow`, `.tile--photo span`, `.tile--duo span`) with `var(--timber-text)` | 4.8:1 bone / 6.2:1 forest (already verified in tokens.json) |
| `nav-condensed-gap` | `16px` (=`space-4`) | 900–1099 header link gap | n/a |
| `nav-condensed-fontsize` | `15px` | 900–1099 header link size (down from 16px `body`) | 10.6:1 ink/surface unaffected (size-only change) |
| `drawer-current-marker` | `3px` solid `accent` | left border on active drawer row | marker only, not text; adjacent text stays `ink` (10.6:1) |

Hero/gallery duotone filter values are **not new tokens** — same recipe, reused, no design-token entry needed (a build-time filter, not a colour token).

## 7. Accessibility & trade-offs

- Drawer `role="dialog"`, focus trap, `inert` on `#main`/`.foot`, focus restoration to `#burger`, scroll-lock-without-losing-position: all per 06 §3, unchanged, no new a11y surface introduced by this visual pass.
- **Scrim contrast trade-off**: 45% forest scrim is a visual/legibility choice, not an AA-checked pair (scrim never carries text) — chose 45% over lower opacity because 06 requires the scrim be "visibly present as a landmark that this is an overlay" at 320px; if the Head prefers a lighter overlay, 35% is the floor before it reads as absent.
- **Ridgeline tick on bone needs an outline** to hit 3:1 — a second render pass per tick (small cost, no new token), named because two other places (focus ring, timber-text) already needed the same "double it on bone" fix; this is now a repeating pattern the design-system-engineer should treat as one utility, not three one-offs.
- **Cutting both marquees vs. creative-direction's "keep one" hedge**: this spec resolves in favor of experience-v3's fuller cut (zero) because the ridgeline 3-point motif now does the "connective tissue" job the marquee was awkwardly sharing; flagging the disagreement between the two v3 docs explicitly for the Head to confirm before merge.
- **Testimonial copy dependency**: §4.6 blocks on real copy from Pablo; recommend shipping without it (delete `.quote` CSS) rather than slip a placeholder, if copy isn't ready by the design gate.
