# Creative direction v3 — optimize UI, elevate UX to memorable

Builds on `01-creative-direction-v2.md`, Head decisions in `04-ui-spec-v2.md`, and the effects shipped per `05-experience-boost.md`. Reads the live site (`index.html`, `motion.css`, `site.js`).

## 1. Crit of what is on the air

**Coherent.** Colour proportion still holds (Forest/Bone/Timber). Duotone gallery tiles are the strongest single element on the page — cheap, on-brand, and finally give the "unfinished work" problem from v1 a real fix. Process steps now have real photography and read as a designed sequence, not a placeholder. Ridgeline SVG dividers between services→process and about→work are subtle and correct — exactly the "structural, not decorative" mark use v2 asked for.

**Noisy or generic.**
- **Effect density has outpaced hierarchy.** Word-reveal headline, parallax hero photo, counting stats, ridgeline stroke-draw, card tilt, progress rail, portrait clip-reveal + ring, gallery hover-to-colour, FLIP filter chips, marquee ×2, magnetic buttons, ripple, floating labels, animated FAQ — 05 shipped nearly everything it proposed. Individually each is restrained; together, every section now has its own "moment," which means no section has *the* moment. Memorability comes from contrast, and there is none left to spend.
- **Two marquees is one too many.** Identical "Landscape · Carpentry · Build · Waiheke" strip appears between process→about and again between work→FAQ. Repeating the same decorative line twice in one scroll reads as a template tic, not a device.
- **Ridgeline divider + rail + marquee are three different "connective tissue" motifs doing overlapping jobs** (mark-as-horizon, mark-as-progress, mark-as-loop). The guide asked for one structural role for the mark; it now has three unrelated micro-mechanics between sections, all quiet, none reinforcing each other visually.
- **The duotone gallery has no analogue anywhere else.** It's the best idea on the page and it is used exactly once. The hero photo (the section that most needed the "photography carries the trade" idea) is full-colour, not duotone, contradicting v2 §3 and the UI-spec §4 note ("photo duotone Forest×Timber") — this was never actually implemented on `.ridge img`.
- **Process cards carry both a photo *and* a rail *and* stagger *and* a mono step number *and* an eyebrow-style label** — five hierarchy devices on a four-item grid that only needs two (photo, number).
- **Form is dense but not distinguished.** 15+ fields worth of visual weight (floating labels, a 190-country dial select, consent block, status line) sit in the same `surface-raised` card as everything else; nothing marks it as the one place a visitor commits. A form that important should not look like a generic card.
- **`.quote`/testimonial styles exist in the stylesheet but no section uses them** — dead CSS, a half-shipped idea that reads as an oversight if left, or as a missed memorable-moment opportunity (a real Pablo quote is free social proof) if cut without replacement.

## 2. The memorable idea: "Pablo's site diary"

One concept the site should leave behind: **this is a working diary of one job, told once, on Waiheke** — not a marketing template with a logo swapped in. Every recurring device on the page should read as an entry in that diary, not as a decorative flourish borrowed from a components library.

- **Hero** = the diary's cover: one photo (duotone, per the original brief), one line, today's date-coded eyebrow ("Est 2024 · Waiheke Island").
- **Services** = the index of trades, flat and plain — a diary's table of contents doesn't animate.
- **Process** = the diary's actual pages: photo + handwritten-feeling step number, nothing else moving. This is the section that earns motion (the rail), because it *is* the narrative spine.
- **About** = the one signed page — portrait wipe + ring stays here, and only here, as "Pablo's signature."
- **Work** = the diary's photo insert — duotone-to-colour on hover is the site's single best trick, and it should be the *only* place a hover changes a photo's colour state.
- **Contact** = closing the entry — visually distinct paper stock (see §3), because this is the one page the visitor is meant to write on, not read.

Every other effect (marquee, tilt, magnetic, ripple, counters) is sub-plot; §5 cuts most of them so the diary metaphor is not competing with itself.

## 3. Colour sequence and 60/30/10

Sequence per scroll should read as a heartbeat, not a checkerboard: **Bone (cover) → Bone-alt (index) → Bone (pages) → Forest (signature) → Bone-alt (insert) → Forest-band (close-out) → Bone-alt (questions) → Bone (write to us) → Forest (colophon)**. That is already close to the current build order — keep it, but tighten the ratio:

- **60% Bone/Bone-alt** — hero, services, process, gallery, FAQ, contact body. This is the "daylight, on the tools" register and must stay the majority read.
- **30% Forest** — about, closing band, footer. Three reversals, not two: the closing band earns its keep as the second beat the Head already approved; a third (footer) was always there. Do not add a fourth — a fourth reversal turns the heartbeat into noise.
- **10% Timber/accent** — eyebrows, step numbers, one em-phrase in the headline, CTA fill, focus ring. Timber must stay confined to *text and small marks*, never a fill larger than a button or icon chip. Cut: no Timber-tinted marquee or divider — currently the ridgeline stroke risks reading as an accent line; keep it in `line`/`bone`-on-forest only, never timber.
- **To respect 60/30/10, cut** one of the two marquees (§5) and do not let the gallery's `#d8b08c` caption colour spread anywhere else — it is currently the only non-token warm colour outside `--timber-text` and should be re-mapped to the existing token or removed.

## 4. Typographic hierarchy, final

One idea per level, and stop adding new ones per section:

- **display (52/72/88)** — hero headline only. One `em` phrase per page, always Timber-text, never repeated as a style elsewhere (currently correct, keep).
- **h1 (32/40, "`.h1`")** — every section heading, no exceptions, no per-section size drift (process/services/about/work/faq/contact all already share it — keep, it's the load-bearing consistency device).
- **h3 (20–28)** — card/step/FAQ titles only. Reduce: service card h3 (24/28) and step h3 (20) are two different sizes doing the same "this is a sub-item" job — collapse step h3 up to the card h3 value so cards and steps read as one family of "unit" typography, not two.
- **mono/eyebrow (11–16, DM Mono)** — labels, step numbers, stats, contact links, legal line. This is the diary's "handwriting in the margin" register; do not let it migrate into anything that isn't a label (it currently stays disciplined — protect this, it's the strongest system trait on the page).
- **body/lead** — everything else. Cut the `.lead` on cards/steps if any card grows a second paragraph in future; one paragraph, one hierarchy level, no lead-inside-a-card exception.

## 5. Remove, keep, add

**Remove or consolidate**
1. One of the two identical marquees (keep process→about or work→FAQ, not both).
2. Card tilt-on-hover and magnetic-button drag — both read as generic SaaS-template gestures, at odds with "person with a nail gun, not a design studio" from the motion spec's own refusal list; the site doesn't need three different pointer-tracking effects (tilt, magnetic, ripple) to feel alive.
3. Stat counters — a 12/30 count-up is a fintech-dashboard trick on a two-fact stat strip; drop the animation, keep the numbers static (already the reduced-motion fallback — just make it the only state).
4. Dead `.quote`/testimonial CSS — either ship one real Pablo quote (see Add) or delete the rule block.
5. Step-card device count: drop either the mono step number or the "STEP 0X" redundancy with the visible position in a 4-up grid — keep number, cut nothing else, but do not add more.

**Keep as-is**
- Duotone gallery hover-to-colour (the one signature moment).
- Ridgeline SVG dividers (two placements, unchanged).
- Process rail fill (it's the diary's narrative spine, earns its motion).
- About portrait wipe + ring, FAQ grid-rows disclosure, floating labels, gallery FLIP filter chips.
- 60/40 Bone/Forest section rhythm and the three named reversals.

**Add (max 3)**
1. **Duotone hero photo** — implement what v2 always specified but was never shipped: Forest×Timber duotone on `.ridge img`, matching the gallery's technique so the hero and the portfolio visually rhyme as "before" and "after" entries in the same diary.
2. **One real testimonial** — a single Pablo-attributed client quote between Process and About (reuses the existing but unused `.quote` styles), giving the "About" reversal a reason to follow it rather than about being the only voice-of-Pablo moment on the page.
3. **Contact section paper-stock shift** — a one-off surface treatment (subtle `surface-alt` + a hairline top rule matching the ridgeline stroke width) that makes `#contact` visually distinct from every other Bone section, marking it as "the page you write on" without inventing a new colour.

## 6. Trade-offs, named

- **Cutting tilt/magnetic vs. "the client explicitly asked for more effects" (v2 experience-boost mandate)** — the current ask is now "memorable," not "more"; a memorable site needs contrast, which a fully-saturated effects budget cannot supply. Recommend the Head accept this reversal explicitly, since it partially supersedes an earlier decision-owner directive.
- **One marquee vs. two vs. "reinforces the offering between content sections" rationale from 05** — losing repetition costs a small amount of message reinforcement; gains a cleaner page. Keep whichever placement sits nearer the CTA (work→FAQ) so the categories are still visible near conversion.
- **Duotone hero vs. "Pablo's early real photo is strong on its own" concern from v2 §7** — now that the gallery has proven duotone works well with real photography (six live examples), the earlier hedge is resolved; recommend closing this open item in v2 rather than leaving hero as the one un-duotoned brand-adjacent photo.
- **New testimonial vs. scope creep** — adding a quote section between two live sections nudges vertical rhythm and requires one real piece of copy from Pablo; worth it because it reuses dormant CSS rather than adding new surface area.
