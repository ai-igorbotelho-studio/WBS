# Navigation Spec v1 — Adaptive Header/Drawer

Status: **for approval**. Builds on `03-ux-architecture-v2.md` §5 (5 nav items, Contact = CTA not a link). Scope: header, mobile menu, mobile CTA bar. No visual styling — that's `ui-designer`'s pass once this is approved.

## 1. Pattern per breakpoint

| Range | Pattern | Why |
|---|---|---|
| 320–599 | Hamburger → **off-canvas drawer, right edge, full viewport height** (not the current inline push-panel) | An inline panel that pushes content reflows layout and breaks scroll position; an overlay drawer is the Jakob's-law-expected mobile pattern, keeps `#top` position stable on close, and is easier to focus-trap. Full height (not a short dropdown) because there are 5 items + CTA + WhatsApp — needs room without scroll on most phones. |
| 600–899 | Same off-canvas drawer | Tablet portrait doesn't have 5 items + logo + CTA width to spare (Hick's law risk of a cramped condensed bar); no benefit to inventing a third pattern here — reuse 320–599 behaviour verbatim. |
| 900–1099 | **Full bar, condensed spacing** | Logo + 5 links + CTA fits at 900px only if link gaps and logo lockup tighten (see §2). No hamburger. If content audit later adds a 6th nav item, re-open this row — don't silently drop an item to make it fit. |
| ≥1100 | Full bar, comfortable spacing (current desktop) | No change. |
| Mobile landscape, short viewport (height ≤ 480px) | Drawer becomes **internally scrollable**, header/logo/close row stays fixed at top of drawer | Prevents CTA/WhatsApp from being pushed off-screen with no way to reach them; body scroll lock still applies to the page behind. |

Breakpoint values above are the four already used in CSS; no new breakpoint is introduced.

## 2. Item priority and placement

**Always visible (every breakpoint):** logo/home link, "Get a quote" CTA, menu trigger (hamburger below 900px) or full link row (≥900px).

**Nav links (Services, How we work, About, Recent work, FAQ) — 5 items, per §5 of v2:**
- ≥900px: all 5 visible in the bar, no condensing needed further than spacing (5 short labels already fit at 900px in current typeface; if type change breaks this, shorten "How we work" → "Process" before dropping an item).
- <900px: all 5 collapse into the drawer, in the same top-to-bottom order as the bar, matching section order — no reordering, no "More" submenu (Hick's law: 5 items doesn't warrant a second-level menu).

**CTA ("Get a quote"):**
- ≥900px: pinned right of the bar, always visible.
- <900px: appears twice by design — once as the primary action at the bottom of the drawer (large tap target), and once in the persistent mobile CTA bar (`#ctaBar`) when the drawer is closed and hero is scrolled past. Never both visible at once (see coexistence rule below).

**WhatsApp:**
- Not a nav link (per v2 §2c, it's a lower-friction secondary channel, not wayfinding). Add it to the drawer as a secondary action below the primary CTA button, small text link or icon+label, so mobile users who prefer WhatsApp find it without leaving the drawer. Do not add it to the bar at ≥900px — desktop persona (PM, remote bach owner) prefers the form; keep the bar's single CTA slot uncontested.

**Coexistence rule, drawer vs. mobile CTA bar:**
- On drawer open: `#ctaBar` is hidden and marked `inert` + `aria-hidden="true"` immediately (no fade delay — it's directly behind/under the drawer's tap area and must not intercept touches or be read by AT while covered).
- On drawer close: `#ctaBar` restores to whatever visibility state the existing hero-scroll `IntersectionObserver` logic says it should have (visible only past hero, per current `site.js`) — the drawer doesn't force it visible, it just un-suppresses it.
- This is an additive rule to the existing `applyCtaBar()` suppression logic already handling `inContact`/`fieldFocused` — add `drawerOpen` as a third suppression flag, same pattern.

## 3. Behavioural spec

- **Sticky vs compact:** header stays `position: sticky` at all breakpoints (unchanged); the existing `data-shrunk` compact state (shrinks logo/header height after 80px scroll) applies at all breakpoints, including with drawer closed. Drawer open freezes header in its current shrunk/unshrunk state — don't let the compact transition run while drawer is open.
- **Closing the drawer:** on (a) click/tap on any drawer link, (b) `Escape` keydown while drawer or its contents hold focus, (c) click/tap on the scrim (the dimmed area behind the drawer, once ui-designer adds one — replaces today's push-panel with no scrim), (d) click on the trigger button again (toggle). All four call the same close routine.
- **Focus trap:** while open, `Tab`/`Shift+Tab` cycle only within drawer's focusable elements (close button → 5 links → CTA → WhatsApp → wrap to close button). Implement with a simple first/last focusable check on `keydown`, no library.
- **Focus restoration:** on close by any method, focus returns to the hamburger trigger button (`#burger`), not to `body` — screen-reader and keyboard users must not lose place.
- **`inert` on background:** when drawer opens, apply `inert` to `#main` and `.foot` (everything outside the header/drawer) so AT and Tab can't reach hidden content — mirrors the pattern already used for `#ctaBar` and the gallery filter in `site.js`.
- **ARIA:** `#burger` keeps `aria-expanded` (already implemented) and gets `aria-controls="mobilemenu"` (already implemented) — no change needed there, just port the same attributes to the new overlay drawer element. Drawer root gets `role="dialog"` `aria-modal="true"` `aria-label="Main menu"`. Scroll-spy's `aria-current="true"` (already implemented in `site.js` lines 51–70) must also apply to the matching link inside the drawer, not just the bar's hidden duplicate — reuse the same `spyPairs` array by including drawer links in the `#navlinks` query, or run a second identical spy pass over drawer links.
- **Current-section indicator in drawer:** the drawer li matching `aria-current="true"` gets a visible marker (left border, dot, or bold — ui-designer's call) so a mobile user opening the drawer mid-scroll sees where they are, not just where they can go.
- **Scroll lock without losing position:** on drawer open, capture `window.scrollY`, set `body{position:fixed; top:-{scrollY}px; width:100%}` (the standard iOS-safe technique — plain `overflow:hidden` on body is not enough on iOS Safari), on close remove those styles and `window.scrollTo(0, capturedY)`.
- **Safe-area:** drawer panel padding uses `padding-top: max(16px, env(safe-area-inset-top))`, `padding-bottom: max(16px, env(safe-area-inset-bottom))`, and side padding accounts for `env(safe-area-inset-right)` since the drawer is right-anchored — critical on notched/rounded-corner phones in landscape.
- **No horizontal overflow at 320px:** drawer width = `min(86vw, 360px)` (not 100vw) so the scrim is visibly present as a landmark that this is an overlay, and no drawer content is allowed to force page-level horizontal scroll; audit any long WhatsApp label truncates with ellipsis rather than wrapping/overflowing.
- **Tap targets:** every drawer link row and the CTA/WhatsApp buttons are ≥44×44px hit area (current buttons already meet this per `wbs-btn`; drawer `<li><a>` rows need explicit min-height, not just line-height, since they're plain text links today).

## 4. States for ui-designer to design

For hamburger trigger, drawer links, and CTA/WhatsApp inside drawer:
- `default`, `hover` (pointer:fine only), `active` (:active/pressed), `focus` (visible focus ring, keyboard-only via `:focus-visible`), `current` (scroll-spy match), `open` (trigger's own pressed/X state).

**Hamburger → X animation:** three-bar icon morphs to X on open (top bar rotates +45° and translates to center, middle bar fades or scales to 0, bottom bar rotates -45° to meet top) — standard CSS transform choreography, no new SVG needed since current markup is already 3 `<path>` lines in one `<svg>`, can be re-targeted as 3 elements with transform-origin center.
- `prefers-reduced-motion: reduce`: replace the rotate/translate morph with an instant icon swap (or opacity crossfade ≤80ms) — no rotation, matching the project-wide reduced-motion convention already used for `.reveal` and hero word-reveal in `site.js`.

## 5. Wireframes (ASCII)

### Drawer, 390px, open

```
┌─────────────────────────────┬──────────────────────┐
│  (scrim, tap to close)       │ WAIHEKE BACKYARDS  ✕ │ close = focus-trap start/end
│                               ├──────────────────────┤
│                               │ Services             │
│                               │ How we work           │
│                               │ About            ●   │ ← current-section marker
│                               │ Recent work           │
│                               │ FAQ                   │
│                               ├──────────────────────┤
│                               │ [ Get a quote ]       │ primary, 44px+
│                               │  WhatsApp             │ secondary
│                               └──────────────────────┘
│                                 ↑ min(86vw,360px) wide, full height, safe-area padded
└───────────────────────────────────────────────────────┘
#ctaBar: inert + hidden while this is open
```

### Bar, 1024px (900–1099 condensed row)

```
┌────────────────────────────────────────────────────────────────┐
│ [mark] WBS   Services  How we work  About  Work  FAQ  [Get a quote]│
└────────────────────────────────────────────────────────────────┘
   ↑ tighter link gaps + smaller logo lockup than ≥1100, no wrap, no hamburger
```

## 6. DACI

- **Driver:** ux-architect (this doc).
- **Approver:** Igor (product owner).
- **Contributors:** ui-designer (visual states, motion timing, scrim opacity), frontend-multistack (implements drawer, focus trap, scroll lock, `inert`).
- **Informed:** none further; single-page site, no other stakeholders.

**Trade-offs named, for the approver to weigh:**
1. **Off-canvas drawer vs. current inline push-panel:** drawer wins on scroll-position stability, focus-trap simplicity, and matching user expectation (Jakob's law), at the cost of needing a scrim + `inert` wiring that the current implementation doesn't have. Recommendation: switch to drawer; this is the one behaviour change in this doc that isn't purely additive to existing `site.js`.
2. **5 items always visible in drawer vs. hiding some behind "More":** kept all 5 flat — Hick's law says 5 is still low enough that a second-level menu adds a decision step for no density benefit. If a 6th nav item is added later, revisit.
3. **WhatsApp in drawer only vs. also in desktop bar:** kept out of the ≥900px bar to protect the single-CTA-slot decision already made in v2 §2c; means desktop users must go to Contact section for WhatsApp, same as today — no regression, no improvement, deliberately deferred.
