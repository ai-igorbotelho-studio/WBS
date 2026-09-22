# UI Spec v2 — WBS one-page

Builds on `01-creative-direction-v2.md`, `02-experience-vision.md`, `03-ux-architecture-v2.md` and `design-system/tokens.json`. All values reference existing tokens unless flagged §7 "new."

## 1. Responsive grid

| Breakpoint | Columns | Gutter | Side margin | Container max-width | Hero | Contact |
|---|---|---|---|---|---|---|
| 320 | 4 | space-4 (16px) | space-4 (16px) | fluid | stacked: copy → CTAs → stats → photo below fold | stacked: eyebrow/title/lead/contact-list → form |
| 390 | 4 | space-4 (16px) | space-4 (16px) | fluid | same as 320, `.display-l` size | same, sticky bottom bar appears (§5 states) |
| 768 | 8 | space-6 (24px) | space-6 (24px) | fluid | still stacked (hero-grid activates ≥1000) | still stacked (contact-grid activates ≥900) |
| 1024 | 12 | space-6 (24px) | space-8 (40px) | fluid | 7fr/5fr split (photo right, 4:5) | 5fr/7fr split |
| 1280 | 12 | space-6 (24px) | space-11 (80px) | 1280px | 7fr/5fr split, gap space-9 | 5fr/7fr split, gap space-9 |
| 1440 | 12 | space-6 (24px) | space-11 (80px) | 1280px (content pinned, extra margin absorbed) | same as 1280 | same as 1280 |
| 1920 | 12 | space-6 (24px) | space-11 (80px), min 1fr flex | 1280px | same as 1280, background/photo may bleed full-width behind container | same as 1280 |

Container is a single `.wrap` (`max-width:1280px`) per breakpoint above 1280 — do not widen content past 1280 even at 1920; only surface colour and photo crops may bleed edge-to-edge.

## 2. Fluid type scale (px per breakpoint, existing styles only)

| Style | 320–389 | 390–767 | 768–1023 | 1024–1279 | 1280+ |
|---|---|---|---|---|---|
| display-xl | — (use display-l) | — | 72 (existing `.display` md step) | 88 | 88 |
| display-l | 44 | 52 | 56 | — | — |
| h1 | 32 | 32 | 40 | 40 | 40 |
| h2 | 24 | 24 | 28 | 28 | 28 |
| h3 | 18 | 18 | 20 | 20 | 20 |
| body-l | 16 | 18 | 18 | 18 | 18 |
| body | 15 | 16 | 16 | 16 | 16 |
| small | 13 | 14 | 14 | 14 | 14 |
| eyebrow | 11 | 11 | 11 | 11 | 11 |
| mono | 14 | 16 | 16 | 16 | 16 |

Hero headline: display-l 320–767 (per current `.display` mobile behaviour), steps to display-xl (72px) at 768, full 88px only at 1280+ — matches v1's existing clamp points, keep as-is, no new step. Section h1 stays fixed at 32/40 across breakpoints (two-step, not fluid) to avoid mid-viewport jitter.

## 3. Vertical spacing (tokens only)

| Context | 320–767 | 768–1023 | 1024+ |
|---|---|---|---|
| Section padding (top/bottom) | space-9 (48px) | space-12 (120px) | space-12 (120px) |
| Eyebrow → title | space-4 (16px) | space-4 | space-4 |
| Title → lead/content | space-7 (32px) | space-7 | space-7 |
| Content → CTA row | space-7 (32px) | space-7 | space-7 |
| Grid gap (cards/steps/tiles) | space-6 (24px) | space-6 | space-6, space-9 (48px) between hero/about/contact columns |
| Card padding | space-6 (24px) | space-8 (40px) | space-8 |
| Card internal stack (title→desc→bullets) | space-4 | space-4 | space-4 |
| Stat strip top border gap | space-6 | space-6 | space-6 |

Second Forest reversal (§4) uses the same section padding as any other section — do not compress it into a "band" shorter than space-9/space-12, per creative-direction's caution against a thin decorative strip.

## 4. Colour per section

| Section | Surface | Text | Notes |
|---|---|---|---|
| Header | surface (paper), 94% opacity + blur, or flat fallback | ink | sticky |
| Hero | surface | ink | photo duotone Forest×Timber per creative-direction §3 |
| Services | surface-alt (bone) | ink | cards on surface-raised |
| Process | surface | ink | hairline ridgeline divider between steps (§6) |
| About | forest (reverse) | bone / ink-muted(dark) | existing, keep |
| **Closing statement band (new, between #work and #faq)** | forest (reverse), narrow — section padding space-9 mobile / space-12 desktop, no extra height | bone | second reversal per creative-direction §6; one short line + optional CTA repeat, not a full sub-page; contrast 10.6:1 (bone-on-forest, verified in tokens.json) |
| Recent work | surface | ink | tiles on surface-alt |
| FAQ | surface-alt | ink | |
| Contact | surface | ink | form on surface-raised |
| Footer | forest (reverse) | bone | existing |

All pairings above reuse tokens.json-verified contrast ratios (10.6:1–11.2:1 ink/forest combinations); no new colour pairing introduced.

## 5. Component states

**Button (primary/ghost)**
- Default: primary = accent fill, on-accent text, radius-md; ghost = transparent, 1px line border, ink text.
- Hover: primary → accent-hover fill; ghost → surface-raised fill, border unchanged.
- Focus: 2px solid focus (timber), 2px offset; on bone add 1px inset forest box-shadow per README.
- Active: primary → accent-hover, 1px inset scale via `translateY(1px)` (no shadow).
- Disabled: 40% opacity, no hover/active, `cursor:not-allowed`, aria-disabled.
- Loading (form submit only): `aria-busy="true"`, label "Sending…", spinner-free — use animated ellipsis or opacity pulse, never the mark as spinner (creative-direction §5).

**Service card**
- Default: surface-raised, 1px line border, no shadow.
- Hover (pointer, desktop only): border stays, background steps to a defined `card-hover` tone (§7 new token needed — current surface-raised has no distinct hover step); no lift/shadow, per guide.
- Expanded on touch (mobile, tap): reveals the 3×6-word bullet list if collapsed by default below 600px — collapsed state saves vertical space on small screens; tap toggles `aria-expanded`, icon rotates 90°. Above 600px bullets always visible, no toggle.

**Recent work tile**
- Placeholder: `.ph` diagonal hatch, title + location text, caption "Photos of finished work are added with each client's permission" — keep as designed-empty state.
- Photo (once real): full-colour, straight vertical, radius-md, no filter.
- Hover (desktop): caption/location overlay fades in at bottom (info disclosure per experience-vision, not animation); reduced-motion: overlay always visible, no fade.

**Field**
- Default: surface-raised fill, 1px line border, radius-sm, body-size label above.
- Focus: border → focus (timber) 2px, plus 1px inset forest box-shadow on bone.
- Error: border → danger, hint text → danger, `data-invalid="true"`.
- Disabled: 50% opacity, `cursor:not-allowed`, no border colour change.

**FAQ**
- Closed: `+` marker, ink text, no background change.
- Open: `–` marker, native `<details>` disclosure, no accordion exclusivity (per UX arch §6).

**Sticky mobile bar (<900px, new)**
- Hidden: not rendered above 900px viewport.
- Visible: fixed bottom, `cta-bar-height` (§7 new token), safe-area-inset-bottom padding, Call / WhatsApp / Get a quote.
- Hidden while #contact in viewport: opacity/visibility toggled by the same IntersectionObserver watching #contact, per UX arch §5 — avoids stacking CTA on CTA.

**Header**
- Top of page: full height (`header-height`, §7 new token), transparent-over-hero or surface per section beneath.
- Compact (scrolled >80px): height reduces (target ~52px), blur/opacity increases for legibility, nav-cta stays visible; no logo resize below `mark-nav` (40px is the floor per logo tokens).

**Form**
- Sending: submit button `aria-busy="true"`, disabled, label "Sending…".
- Success: status line `data-ok="true"`, success token colour, "Thanks — Pablo will reply within one working day."; `/thanks.html` redirect as no-JS fallback.
- Endpoint-down: status line danger token, "Something went wrong sending this. Call or WhatsApp us directly," with restated phone/WhatsApp links inline.

## 6. Ridgeline mark as structural divider

- Section divider (between Process steps, and above the closing Forest band): a single-stroke horizontal line tracing a shallow two-peak ridgeline silhouette, not the full mark — height 12px, full content-width (`.wrap` width), stroke 1.5px in `line` token (or `bone` at 30% opacity on forest), replacing the plain `border-top:1px solid var(--line)` in those two locations only. Do not apply to every hairline on the page — Services/FAQ/Contact keep the plain straight hairline; the ridgeline motif is reserved for the two locations named in creative-direction §5 to avoid becoming a repeated watermark.
- Hero photo composition: horizon/roofline sits in upper third of the `.ridge` frame (4:5 desktop, 4:3 mobile), workable ground in lower two-thirds, subject off-axis — art-direction note for whoever crops/selects the photo, not a CSS rule.

## 7. New tokens needed (for design-system-engineer)

| Proposed name | Purpose | Suggested value |
|---|---|---|
| `header-height` | Sticky header height at top-of-page | 72px desktop / 64px mobile |
| `header-height-compact` | Sticky header height once scrolled | 52px |
| `cta-bar-height` | Mobile sticky bottom bar height | 56px + safe-area-inset-bottom |
| `card-hover` | Distinct hover fill for service cards, one step warmer than surface-raised, both themes | Bone: `#f5f0e6`-range; Forest: `#33594a`-range (to verify contrast) |
| `divider-ridgeline` | SVG/stroke asset reference for the two-location ridgeline divider (§6) | asset token, not colour |
| `tile-overlay` | Recent-work hover caption overlay background | `rgba(forest, 0.72)` on photo, bone text |

## 8. Accessibility notes and trade-offs

- Focus ring: 2px solid `focus` (timber) + 2px offset everywhere; bone surfaces add the 1px inset forest box-shadow per README — applies to buttons, fields, sticky-bar links, FAQ summary.
- Tap targets: all buttons, sticky-bar items, FAQ summary rows, and card touch-toggle icons ≥44×44px, including the compact header's nav-cta.
- Contrast: all ink/surface pairs reuse tokens.json-verified ratios (≥4.5:1 body, ≥3:1 large text); `card-hover` and `tile-overlay` (§7, new) must be verified by design-system-engineer before shipping — not yet contrast-checked here.
- Trade-off — card-hover token vs. "no new colour" discipline: creative-direction crit flags flat hierarchy; a hover-only tone step is the minimal new surface needed to satisfy "hover confirms interactivity" (experience-vision) without inventing a shadow language the tokens forbid. Scoped to hover state only, never a resting-state colour.
- Trade-off — ridgeline divider vs. build cost: reserving the motif to two locations (process, closing band) keeps it distinctive without turning every hairline into custom SVG work, balancing creative-direction's "make the mark structural" against implementation cost named in creative-direction §7.
- Trade-off — mobile card bullet collapse vs. content parity: hiding bullets by default below 600px trades initial scan completeness for vertical space; content is never removed, only deferred behind a tap, and remains in the DOM for AT/no-JS users (always expanded without JS).


---

## Head decisions after design audit (2026-09-22)

Resolved by the Head; these override any conflicting line above.

1. **Closing Forest band height**: padding `space-8` (40px) top and bottom on desktop, `space-7` (32px) on phones. It is a band, not a section: one line of `h2` plus one CTA, no cards. Creative direction and UI spec now agree on this number.
2. **`tile-overlay`**: not a uniform translucent overlay. Text sits on a solid-to-transparent gradient `linear-gradient(to top, rgba(31,58,46,.88) 0, rgba(31,58,46,.55) 40%, transparent 70%)`; the bottom 40% is opaque enough that `bone` on it reads ≥ 7:1 whatever the photo. This is what v1 already ships in `.tile--photo::after`.
3. **`card-hover`**: fixed at `#33594a` (Forest theme only; Bone theme keeps `surface-raised`). `bone` on it reads 7.8:1. No further verification needed.
4. **Primary button label**: minimum 18px at weight 600 so `on-accent` on `accent` (3.8:1) qualifies as large text. Ghost and brand buttons may stay at 16px.
5. **Sticky mobile bar**: hidden state uses `visibility:hidden` and `aria-hidden="true"`, not opacity alone; the bar is `display:none` while any `#quote` field has focus (`focusin`/`focusout`), and when `#contact` is in view.
6. **Compact header**: the nav CTA keeps a 44px minimum height inside the 52px header (4px padding top and bottom).
7. **Copy**: headline stays "Backyards built with care."; CTAs stay "Get a quote" / "See recent work". The alternatives in creative direction §4 go to a later A/B once analytics exist.
8. **Service card touch target**: the whole card header (icon + title) toggles the list; minimum 44px tall.
9. **Process step imagery** (user request, 2026-09-22): each of the four steps carries a 4:3 photo above its number, `radius-md`, `line` border, `loading="lazy"`, exported at 800×600 WebP + JPEG. Assignments: Step 01 Site visit = tape measure at the door frame; Step 02 Written quote = clipboard, pencil and tools on the bench; Step 03 The build = drill fixing a hinge; Step 04 Handover = to be supplied. Recent work tile 1 = horizontal timber slat screen. Files pending from the client as attachments; until then the step keeps the text-only layout.
