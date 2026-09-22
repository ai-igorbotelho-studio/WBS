# Experience v3 — from "more effects" to memorable

Audit of what shipped in `05-experience-boost.md`, plus the one addition that turns the site from "a demo of techniques" into something a visitor remembers and can act on.

## 1. Honest read of what's live

**Communicates something (keep):**
- **Word-reveal (hero)** — reinforces read order on the one line that matters. Cheap, one-shot.
- **Ridgeline stroke-draw + divider** — the strongest asset on the page: it's literally Waiheke's skyline profile, tied to the brand mark, used structurally. Under-used (see §2).
- **Duotone→colour hover (gallery)** — before/after read: raw material vs. finished job. On-message.
- **FAQ grid-rows disclosure, floating labels, button loading/success** — utility motion, invisible when done right. No complaint.
- **Process rail fill** — legible "you are here" progress through 4 steps.

**Noise (cut or demote):**
- **Marquee strip** — pure decoration repeating words already on screen twice. Costs nothing but also says nothing; a scrolling ticker reads as generic template, not as this brand. **Cut.**
- **Tilt-lite on service cards** — a 4° wobble on a text card communicates nothing about landscaping/carpentry/build; it's a portfolio-site tic borrowed without a reason. **Cut.**
- **Magnetic-lite buttons** — 4px of button chase adds latency-feel with zero comprehension gain; on a trade site the CTA should feel *stable and findable*, not playful. **Cut.**
- **Ripple on press** — mild utility (press feedback) but generic Material-style noise. **Demote to `:active` colour change only**, drop the JS/pseudo-element.
- **Stat counters** — fine but forgettable; counting to 12 and 30 in 700ms is barely noticed and the numbers aren't dramatic enough to earn the animation. **Keep only if free** (it already is); not worth defending if budget gets tight.
- **Parallax-lite on hero photo** — currently isolated to one image with no relationship to anything else on the page. Purposeless motion for motion's sake. **Repurpose, not cut** — see §2.
- **FLIP filter on gallery** — legitimate (spatial continuity when tiles regroup) but the *category filter itself* is the weak idea: three trades that overlap on real jobs get force-sorted into tabs. Keep the FLIP mechanism, question the filter's necessity if the gallery grows past ~9 photos.

**Verdict:** the page currently has ~14 discrete effects and one real idea (the ridgeline). Everything else is technique in search of a reason.

## 2. The missing signature moment: the ridgeline as a narrative spine

The brief already contains its own metaphor and nobody used it: **the Waiheke ridgeline profile (ground-work → framing → finished house) is the story of the whole business** — landscape shapes the section, carpentry frames it, build finishes it. Right now the SVG divider is decoration between two sections.

**The move:** turn the existing `<svg class="ridgeline">` into one continuous path that reappears (not scrolls-with, just *recurs*) at three points — services→process, process→about, about→work — each time slightly more "built up" (the path itself doesn't change; a companion set of three tiny markers along it lights up cumulatively, using the same stroke-dashoffset technique already coded). By the time the visitor reaches "Recent work," the ridgeline motif has silently tracked landscape → carpentry → build, and the gallery becomes the payoff of a story the page was already telling with lines the visitor half-registered.

Mechanically this reuses code already shipped: three copies of the same inline SVG, three IO triggers already wired for reveal, the same `stroke-dashoffset` keyframe. No new JS module, no new library, no continuous listener — one flag per divider, cumulative fill state kept in three `data-lit="true"` attributes.

Pair it with reframing the hero parallax: instead of an isolated wobble, cap the hero photo's parallax range so its horizon line visually aligns with the first ridgeline divider beneath the fold — the photo's real skyline hands off to the drawn one. That gives the parallax a reason to exist (continuity of a horizon) instead of "photos should move a bit."

This is the one moment worth defending in review: it costs nothing new, cuts three effects to pay for it, and it's specific to Waiheke rather than portable to any trade site.

## 3. Interaction map by section — cut / keep / refine

| Section | Cut | Keep as-is | Refine |
|---|---|---|---|
| Header | — | compact-on-scroll, CTA entrance | nav underline draw: shorten to `--motion-fast` (already is), no change |
| Hero | magnetic buttons (moved to global cut) | word-reveal, stat counters | parallax: cap/align to ridgeline horizon (§2), keep IO-gated |
| Ridgeline dividers | — | stroke-draw | promote to 3-point recurring motif with cumulative lit-state (§2) |
| Services | tilt-lite | reveal+stagger | none — plain hover surface-swap is enough |
| Process | — | rail fill, reveal+stagger | none |
| About | — | portrait wipe, avatar ring (one beat) | none |
| Recent work | ripple → `:active` only | duotone hover, FLIP filter | caption rise: shorten distance 8px→4px, it's currently the most "extra" motion in this section |
| FAQ | — | grid-rows disclosure | none |
| Contact | — | floating labels, loading/success | none |
| Footer/global | marquee, magnetic-lite | — | ripple demoted to CSS-only `:active` |

**Fallback/keyboard equivalence (unchanged rule, restated for the new motif):** ridgeline lit-state renders fully-lit under `prefers-reduced-motion` and under no-JS (static SVG, no animation, all three copies visible at final state — same pattern already used for the single existing divider). No interactive element is introduced by this motif, so no new keyboard path is needed; it is purely a passive read-along, same accessibility tier as the current divider.

## 4. Budget after this pass

- **JS removed:** magnetic (~0.8 KB), tilt (~0.8 KB), ripple pointer listener (~1 KB, replaced by pure CSS `:active`) ≈ **−2.6 KB**.
- **JS added:** ridgeline cumulative-lit state, reusing the existing about/portrait IO pattern (~0.5 KB for 3 flags + attribute writes).
- **Net JS:** ~22 KB → **~19.9 KB**, under the 20 KB ceiling with no headroom to spare — CSS-only marquee removal frees paint, not JS, so it doesn't move this number but removes an always-on `animation: … infinite` loop, which is worth more than its KB cost.
- **No continuous listeners** — unchanged; every remaining effect is IO-gated or event-gated, same as v2. The tilt/magnetic pointermove handlers being cut also removes the only per-frame-adjacent JS surface (pointermove firing at native rate on hover) that CPU-conscious QA flagged as worth watching.
- **CLS < 0.1** — no new elements affect layout; the two new ridgeline copies are additional static SVGs of fixed height (24px, matching the existing one) inserted at build time, not injected post-load, so they reserve their space from first paint like the original.

## 5. Trade-offs named

- **Losing "more effects" for "fewer, meant" effects** is the whole point of this pass but it directly reverses the decision-owner's earlier explicit request in `05-experience-boost.md` for volume; flagging that this is a deliberate reversal, not a misreading, in case the direction is still wanted.
- **Cutting the marquee removes the only element with any "modern site" visual signalling to a first-time visitor scrolling fast** — a legitimate portfolio-adjacent look is being traded for restraint; if stakeholders want the immediate "this looks state-of-the-art" impression, the ridgeline motif is subtler and takes longer to register than a moving ticker did.
- **The ridgeline motif costs almost nothing but earns nothing overnight** — it is a slow-burn brand device, not a screenshot-friendly feature; if the goal is instant shareability rather than a return visitor's sense of coherence, this is the wrong bet.
- **Dropping category filter would remove FLIP's job entirely** — not recommended in this pass (portfolio is small enough that FLIP still earns its keep), but flagged for reconsideration once the gallery grows past ~9 photos and filter tabs start feeling like navigation rather than motion.
