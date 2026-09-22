Waiheke Backyards Solutions (WBS) is Pablo Baldo's landscape, carpentry and build practice on Waiheke Island, New Zealand, established 2024. The identity was built to live across vehicles, workwear, paperwork and screens: a forest-green ridgeline mark with a timber sun, three equal-weight lines of Bricolage Grotesque, and DM Mono for anything utilitarian. Tagline: **landscape · carpentry · build**.

## Content fundamentals

Write in New Zealand English, first person plural or Pablo's own voice ("Cedar deck — day 3. On track for Friday."). Short, concrete, no exclamation marks, no emoji, no superlatives. Say what will happen and when: "Quotes are valid for 30 days", "A 30% deposit confirms the booking", "Workmanship is warranted for 12 months". Name the island and the weather honestly: outdoor work is weather- and ferry-dependent, and the copy says so before the client asks.

Casing: sentence case for headlines and body. The `eyebrow` and `mono` styles are always uppercase with a middle dot (`·`) as the separator: `LANDSCAPE · CARPENTRY · BUILD`, `WAIHEKE · EST 2024`. Facts not yet confirmed stay as bracketed placeholders like `[Suburb]`.

## Logo

Five lockups, all in `assets/Logos`, all drawn from the same ridgeline mark. Use them at these proportions and never redraw them:

- **Horizontal** (`wbs-horizontal-*.png`): the locked primary. Mark beside three lines "Waiheke / Backyards / Solutions" at 600 weight, tracking −2.5%, leading 0.95. Minimum `logo-min-digital` (200px) on screen, `logo-min-print` (40mm) in print.
- **Vertical**: the same stack centred under the mark, for square spaces.
- **All-type**: the three lines with no mark, for type-only contexts (a business card front).
- **Mark** (`wbs-mark-*.svg`): the isolated ridgeline, minimum `mark-min` (24px). In the site header set it at `mark-nav`.
- **Avatar** and **favicon**: the mark in a round coloured field (Hnry, Instagram, WhatsApp Business, Google Business, email) and a rounded square (`radius-icon`) that drops the baseline rule for clarity at 32 to 256px.

Colour variants: **color** is forest with a timber sun on bone or paper; **reverse-color** is bone with a timber sun on forest; **mono** is charcoal, for single-colour print only. Clear space is the mark's own height (`space-10` at scale 1) on all sides.

## Colour

The guide's proportion is **Forest 60 · Bone 30 · Timber 10**. Set the page in `surface` (paper), alternate sections in `surface-alt` (bone), and reverse whole sections to `forest` with `bone` text for weight. Timber is an accent: the sun disc, primary buttons, rules and marks. `coastal` is optional, for duotone photography only; `charcoal` only in mono print.

Text is `ink`; secondary text is `ink-muted`. Both clear 4.5:1 on every surface in both themes. Timber itself reads 2.8:1 on bone and 3.8:1 on forest, so small text in the accent colour uses `timber-text`, an intentional addition darkened and lightened to 4.8:1 and 6.2:1. The guide sets its DM Mono eyebrows in timber; where they are decoration keep timber, where they must be read use `timber-text`. Button labels on a timber fill (`on-accent`, forest, 3.8:1) are only ever 16px at 600 weight or larger.

Keyboard focus: `outline: 2px solid var(--focus); outline-offset: 2px`. On bone surfaces add `box-shadow: 0 0 0 1px var(--forest)` inside it so the ring reads at 3:1.

Photography is duotone when it sits with brand colour: Forest × Timber for warmth, Forest × Bone for quiet, Coastal × Bone for water. Full-colour photos only in the portfolio grid, straight verticals, daylight.

## Typography

Two faces, both shipped in `fonts/` and also on Google Fonts. **Bricolage Grotesque** for headlines (600, tracking −2.5% to −3%, leading 1.0) and body (400, leading 1.5). **DM Mono** for utility: uppercase, tracking +22% at label size, +4% for numbers. Fallback `system-ui, "Helvetica Neue"`. Use `display-xl` once per page in the hero, `h1` for section titles, `h2` for cards, `eyebrow` above any title, `mono` for phone numbers, dates and prices.

## Spacing, radius, borders

A 4px base with the guide's own stops (22, 60, 120). Cards pad `space-8` on desktop and `space-6` on phones. Sections pad `space-12` on desktop and `space-9` on phones with a `space-11` side margin. `radius-md` (6px) is the one corner radius for cards, tiles, buttons and business cards; avatars are `radius-round`, icons `radius-icon`. Separate things with a 1px `line` hairline; shadows are for lifted image tiles and business cards, never web cards.

## Iconography

Line icons at 1.5px stroke, 20 or 24px, inline SVG in `currentColor`. The mark is not an icon: use it only as a logo. No emoji.

Exception, recorded 2026-09-22: a **ridge profile derived from the mark** (the hill path alone, hairline stroke, no sun disc, no wordmark) may be used as a structural section divider, at most three times per page, always decorative (`aria-hidden`). It is a motif drawn from the mark, never the lockup itself.

## Motion

Motion is a first-class token family (v2), alongside colour/spacing/typography — not a convention documented only in prose. `design-system/tokens.json` → `motion.durations` (`motion-instant` 0ms, `motion-fast` 150ms, `motion-base` 500ms, `motion-slow` 700ms, `motion-slower` 900ms) and `motion.easings` (`ease-steady`, `ease-firm`, `ease-linear`, `ease-out-soft`) are emitted by `tools/build-tokens.py` into `:root` of both `tokens.css` files as `--motion-*`/`--ease-*`. `site/assets/motion.css` (frontend-owned) consumes these variables — it no longer declares them, since `tokens.css` loads first. Any new duration/easing value goes in `tokens.json`, never as a fresh `--motion-*`/`--ease-*` declared inline in a stylesheet.

## `.bone-outline` utility

The "double a forest-fill element with a 1px forest outline on bone, nothing on forest" pattern used to be three separate one-offs. It is now a single utility class, emitted both in `tokens.css` (`:root`/`[data-theme="dark"]` rule pair, so the site gets it without loading the component bundle) and duplicated in `components/bundle.css` for bundle-only consumers:

```css
.bone-outline{ box-shadow: 0 0 0 1px var(--forest); }
[data-theme="dark"] .bone-outline{ box-shadow: none; }
```

Three uses, do not add a fourth without reviewing this class first:
1. Keyboard focus ring on bone (focus/inputs), doubling the 2px `focus` ring with a 1px forest inner line.
2. `ridgeline-lit` ticks on bone (`RidgelineDivider` component), so the timber tick clears the 3:1 large-graphic floor on bone.
3. Any future chip/marker sitting on timber solid fill in the bone theme — reuse this class, don't mint a new one.

## Components

`components/bundle.js` defines `window.WBS`, plain functions returning DOM elements with no framework: `Button`, `Card`, `Field`, `Eyebrow`, `Stat`, `Nav`, `Chip`, `RidgelineDivider`, `Quote`. Each component folder's README says what the consumer provides vs. what the component decides; `components/preview.html` renders all nine side by side in both themes (no Storybook installed — deferred, see `docs/04-design-system-v2-plan.md` §6).

- **Nav** — the off-canvas drawer + trigger from `06-navigation-spec.md`/`09-ui-spec-v3.md` §1: dialog semantics, focus trap, `Escape`/scrim-click/toggle close, focus restoration, `inert` on background, iOS-safe scroll lock, all built in.
- **Chip** — the gallery filter chip, formalized as a component with zero visual change.
- **RidgelineDivider** — the 3-point ridgeline motif, consumer supplies cumulative `lit` state; `aria-hidden`, max 3 per page.
- **Quote** — a single attributed testimonial; returns `null` if `text` is empty, so a placeholder can never ship by accident.

## Changelog

**v2** (this pass): new colour tokens `scrim`, `ridgeline-lit`, `drawer-current-marker`, `paper-stock-rule`; new `layout` family (`drawer-width`, `nav-condensed-gap`, `nav-condensed-fontsize`, `header-height-compact`); new `motion` family (durations/easings) migrated from `motion.css` into the token pipeline; `.bone-outline` utility; `Nav`, `Chip`, `RidgelineDivider`, `Quote` components; `tools/check-tokens.py` and `tools/check-contrast.py` added. No existing token value changed; `#d8b08c`/`#a8b5af`/`#3f5c4f` hardcoded in `index.html` are flagged by `check-tokens.py` for `frontend-multistack` to replace with `var(--timber-text)`/`var(--ink-muted)`/`var(--line)` — not fixed in this pass (out of design-system scope).

**v1**: initial token set (color, type, spacing, radius, shadow, logo) and `Button`/`Card`/`Field`/`Eyebrow`/`Stat` components.
