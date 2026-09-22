# Experience Vision — WBS one-page site

## 1. Concept and feel

**One line:** the site moves the way a well-run job site does — steady, deliberate, nothing rushed, nothing wasted.

**Target feel:** confident craft, not spectacle. The v1 shell (`site/index.html`) already sets the right defaults — calm scroll reveals, sticky nav with scroll-spy, `prefers-reduced-motion` respected — and this vision keeps that restraint as the concept rather than a placeholder to "enhance" later.

**Reference bar** (read for craft, not for replication — none of these run on Waiheke 4G, and that gap is the point):

- **eszterbial** — restrained type-led scroll pacing, generous whitespace holding attention without kinetic tricks. Take: let typography and spacing carry rhythm before motion does.
- **Dropbox Brand** — disciplined section-to-section colour/surface switching (the reverse "About" band already does this) instead of scroll-jacking. Take: alternate `surface`/`surface-alt`/`forest` as the primary pacing device, motion secondary.
- **bdsn (Bureau du Style / similar craft studios)** — hover states that reveal one extra fact (material, location) rather than an animation. Take: hover as information disclosure, not decoration.
- **uncommon** — sparing use of a single signature interaction (one hero device) rather than many small ones competing. Take: pick one "signature" moment (the before/after slider in Recent work) and let everything else be quiet.

What is explicitly *not* referenced as a build target: splose, epic.net, Rive-driven 3D/WebGL sites, Lusion-style cursor/particle work — see Section 3.

## 2. Moment map

| Section | Interaction | Why | Reduced-motion fallback |
|---|---|---|---|
| **Hero** | Single `.reveal` fade/rise (200ms stagger, already in CSS) on headline, lead, CTAs; hero photo loads eager with `fetchpriority="high"`, no parallax | First paint must be fast and legible; a static hero photo *is* the credibility statement, no gimmick needed | Content shows instantly, no transform |
| **Services** | Card `.reveal` on scroll (existing), subtle border/shadow-free hover (`surface-raised` swap only, per design system — no lift shadow on web cards) | Cards are scanned, not admired; hover confirms interactivity without inventing a shadow language the tokens forbid | Cards visible on load, hover still works (hover is not motion, stays on) |
| **Process (How we work)** | Numbered steps reveal in sequence (stagger by `step` index, ~80ms offset), scroll-spy already highlights nav as visited | The four-step sequence *is* the story; staggered reveal reinforces "step 1 then step 2" without a progress bar or scroll-jack | All four steps show at once, no stagger |
| **About (reverse forest band)** | Section-level colour reverse (already built) as the sole "interaction"; portrait image has no ken-burns/zoom | The colour reverse is the interaction — it signals "this is Pablo speaking," which is more honest than a video autoplay | No dependency on motion; colour reverse is static and always on |
| **Recent work** | **Signature moment:** before/after slider (drag or click-to-toggle) on tiles once real photo pairs exist; until then keep current placeholder tiles with plain `.reveal` | This is the one place proof of craft belongs; a slider communicates transformation, which no other section can show | Slider becomes a static side-by-side or tap-to-swap image with a visible toggle button, no drag physics required; keyboard-operable via button, not only pointer drag |
| **FAQ** | Native `<details>/<summary>` disclosure, symbol swap `+`/`–` (already built) | Native accordion is free, accessible, and instant on 4G | No change needed — no animation to disable |
| **Contact** | Inline field-level validation state (`data-invalid`) on submit, no animated success screen | A trades client wants to know the form worked, not watch a checkmark animate | Same — state changes are instant, not transitions |
| **Header/nav** | Sticky header with blur backdrop, scroll-spy `aria-current` on nav links (already built) | Orientation on a long one-pager; tells the visitor where they are without a progress bar | Sticky stays (positional, not motion); blur can degrade to flat colour on low-end GPUs without visual loss |

## 3. What NOT to do, and why

- **No 3D/WebGL (Rive, Lusion, Unseen-style scenes).** Waiheke's mobile coverage is patchy 4G; a shed customer opening the site from a driveway cannot afford a WebGL bundle or a GPU-bound canvas. It also fights the brand: this is a person with a nail gun, not a design studio.
- **No custom cursor.** Adds JS weight and input latency for zero comprehension gain; trades clients are on phones anyway, where cursors don't exist.
- **No sound.** Unsolicited audio on a site opened at a job site or in traffic is a liability, not a delight; nothing in the brand voice (plain, first-person, no exclamation marks) suggests audio branding.
- **No scroll-jacking / pinned full-page sections.** It fights the one thing this audience wants fast: the phone number and the quote form. Every extra second of "experience" between landing and `#contact` is a lost lead.

## 4. Performance budget

- **LCP < 2.5s on 4G:** hero image ships as `webp` with `fetchpriority="high"` (already done); no additional hero-blocking JS or web font beyond the two already subset/self-hosted.
- **CLS < 0.1:** all media has explicit `width`/`height` or `aspect-ratio` (already the case for `.ridge`, `.portrait`, `.tile`); the before/after slider must reserve its box size before the image pair loads — no layout shift when the second image arrives.
- **JS < 30 KB (uncompressed, hand-written, no framework):** current inline script (menu, scroll-spy, reveal, form) is already a few KB. The slider adds a small vanilla module (drag/keyboard toggle) — budget it at ≤ 4 KB; total interactive JS stays under 30 KB with headroom for the QA and performance pods to verify.
- Every interaction in Section 2 must degrade to CSS-only or no-JS states without breaking content visibility (`html.js` gate pattern already in place covers this).

## 5. Named trade-offs

- **Motion vs. weight:** staggered reveals cost a few extra CSS transitions but no extra JS; rejected a scroll-driven progress bar for Process because it would need a scroll-linked JS listener running continuously, which is the wrong trade for a 4-step list that reads fine statically.
- **Before/after slider vs. photos not yet shot:** the signature interaction for Recent work depends on paired photography (same angle, before/after) that does not exist yet. Ship the section now with plain reveal tiles and placeholder captions; the slider is a scoped addition once Pablo supplies matched photo pairs — do not fake it with stock or mismatched crops.
- **Sticky header blur vs. paint cost:** `backdrop-filter: blur(8px)` is a minor GPU cost kept because it aids legibility over photography in the hero; if `system-performance` flags it on low-end Android, the fallback is a flat `surface` colour at 94% opacity, already the base layer under the blur.
- **Scroll-spy IntersectionObserver vs. simplicity:** kept because it is cheap (no scroll listener, native browser API) and gives real wayfinding value on a long one-pager; would be cut first if JS budget were ever tight, since content works without it.
- **Hover disclosure vs. touch devices:** hover states (cards, nav underline) have no equivalent value on touch; accepted as a desktop-only enhancement since it never gates content — touch users see the same information without needing to hover.
