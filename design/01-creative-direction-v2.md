# Creative direction v2 — WBS one-page

## 1. Crit: v1 honestly

**On-brand.** Colour proportion roughly holds (Forest header/footer/about, Bone body, Timber as accent only). `radius-md` used consistently. No shadow on web cards — `.card`, `.quote`, `form` all use a line border as the guide requires. DM Mono is doing eyebrow/number/label duty and nowhere else. That discipline is real and should survive v2 intact.

**Generic and weak.**
- **Hierarchy is flat.** Every section is `eyebrow → h1 → lead → grid`, same rhythm six times in a row. Nothing tells the eye "this is the peak" vs "this is a supporting beat." The page reads like a template with WBS colours poured in, not like a practice with a point of view.
- **The mark is decorative, not structural.** It appears once at 40px in the nav and once in the footer, both times inert. A ridgeline mark — a literal drawing of Waiheke's terrain — is never used to *organise* anything: no section divider echoes it, no photo crop references a horizon line, the hero's timber accent (`em`) is just coloured text, not the sun disc. The identity's most distinctive asset is reduced to a favicon.
- **Photography has no system yet, and what's there ignores the guide.** Only one real hero photo and one portrait exist; both run full-colour on a Forest-adjacent background. The guide is explicit: duotone Forest × Timber when photography sits with brand colour, full-colour reserved for the portfolio grid. The hero photo sitting in a `.ridge` panel next to the wordmark and CTA is exactly the "with brand colour" case that should be duotone — currently it is not.
- **Portfolio is empty and reads as a placeholder, not a gap being honestly held.** Six `.tile` cards with a diagonal hatch pattern (`.ph`) and text only. That's an acceptable *interim* state, but nothing about it signals "photos coming" versus "this is a broken feature." No treatment distinguishes a designed-empty state from an unfinished one.
- **Copy voice is present but the headline is the weakest line on the page.** "Backyards built with care" is a warm platitude; every competitor deck-builder site could run it verbatim. It does not carry the geography (Waiheke, ferry, weather) or the specificity (written quotes, 12-month warranty) that the rest of the copy nails.
- **No dark/light contrast rhythm.** Only `#about` reverses to Forest. On a page this repetitive, one reversal 60% down is not enough to reset attention before the FAQ/contact close.

## 2. Aesthetic partido — v2

**Three sentences:** WBS is the ridgeline between bush and backyard — the mark's own horizon should organise the page, not just badge it. Photography carries the trade (framing, tools, hands, weather) and stays duotone until a job is finished, at which point it earns full colour in the portfolio. The page should breathe in two registers — bright Bone worksite and dark Forest at-rest — so a visitor always knows which beat they're on.

**Three words:** Grounded. Weathered. Deliberate.

## 3. Photography rules

- **Duotone Forest × Timber** for any photo paired with brand colour, CTAs, or navigation chrome (hero, about portrait, process step art if added). Warm, mid-contrast, no pure black/white points.
- **Duotone Forest × Bone** for quiet/contextual shots (site conditions, materials, empty land before a job starts).
- **Coastal × Bone** reserved for water/horizon shots only (rare, optional per the guide) — do not default to it.
- **Full-colour** only inside the `#work` portfolio grid, and only once a job is complete and client-approved. Straight verticals, daylight, no filter, no crop rotation.
- **Framing:** shoot the ridgeline, literally — horizon or roofline in the upper third, workable ground in the lower two-thirds, echoing the mark's silhouette. Avoid centred hero-shot compositions; keep the subject off-axis so text has somewhere to sit.
- **8 shots to ask Pablo for:**
  1. Wide site shot at first light or last light, land before work starts (establishing/quiet duotone).
  2. Hands marking or measuring timber, close crop (carpentry, Forest×Timber).
  3. A finished deck or retaining wall, straight-on, full daylight, no people (portfolio full-colour).
  4. Pablo mid-conversation with a client on site, candid not posed (about section).
  5. A tool in use — saw, drill, planer — motion blur or dust visible (texture/process).
  6. Materials stacked or delivered (timber, gravel) before a build starts (process step 1–2).
  7. A wide shot from a high point on the section looking toward water, if the site allows (only real ridgeline/coastal candidate).
  8. A finished small build (sleepout/shed) exterior, one full-colour portfolio hero-quality shot per completed job going forward.

## 4. Voice & tone — headline/CTA alternatives

Current: "Backyards built with care." Alternatives, sentence case, no exclamation:

1. "Built on the island, for the island." (subhead keeps the trade list)
2. "Decks, fences and small builds that outlast the weather they're built in."
3. "Quoted in writing. Built on Waiheke. Warranted for 12 months."
4. "The backyard work Waiheke actually needs done."
5. CTA pairing test: primary "Book a site visit" / ghost "See finished work" — more concrete than "Get a quote" / "See recent work," matches the guide's specificity instruction ("say what will happen and when").

Recommend testing #2 or #3 as the `display-xl` line; both carry geography and a fact, not just a mood.

## 5. Mark and wordmark usage by section

- **Nav:** mark only (`mark-nav`, 40px), no wordmark duplication needed if the wordmark sits beside it as text (current) — keep, it's correct per guide.
- **Hero:** do not add another mark. Instead let the `.ridge` photo's horizon line do the mark's job compositionally (see framing rule above) — this is where "the mark is structural, not decorative" gets tested.
- **Section dividers (`hr`/step numbers):** consider a hairline ridgeline motif (a single-stroke horizon, not the full mark) as the divider between `#process` steps or between major sections, replacing the plain `border-top:1px solid var(--line)`. Small, low-key, not a second logo.
- **About (reverse Forest):** reverse-color mark could anchor the portrait corner at small scale (mark-min to 2×) as a signature, not a headline element.
- **Footer:** horizontal reverse-color lockup, as now — correct, keep as the one full "signature" moment.
- **Never:** the mark as a bullet, icon substitute, loading spinner, or repeated background watermark — guide explicitly says the mark is not an icon.

## 6. Dark (reverse Forest) vs Bone

- **Bone:** hero, services, process, FAQ, contact — the "working" sections, task-oriented, need maximum legibility and scan speed.
- **Forest reverse:** about (current, keep), plus one more reversal to break the page's back half — recommend reversing the CTA/contact band's *top* framing element (not the form itself, which needs Bone input contrast) or adding a Forest-ground closing statement between portfolio and FAQ. A second reversal roughly two-thirds down resets attention before the final ask.
- **Never both in one photo frame:** per guide, don't mix charcoal mono with forest reverse in the same layout; duotone photography substitutes for a "dark" treatment on Bone sections instead of literal reverse fields.

## 7. Trade-offs, named

- **Ridgeline-as-structure vs. build cost:** giving the mark a compositional role (horizon crops, divider motif) is more art-direction work per section than dropping a logo in the header and walking away. Worth it for distinctiveness; costs iteration time from `digital-product-team-ui-designer`.
- **Duotone hero vs. photographic honesty:** duotone reads more "designed," but Pablo's early real photos are strong on their own; forcing duotone on the *only* two real assets risks looking like we're hiding thin content behind a filter. Mitigation: duotone only where the photo sits directly beside brand-colour chrome (hero panel, about portrait); anything standalone in the portfolio stays full-colour per guide.
- **Second Forest reversal vs. rhythm fatigue:** two reversals help pacing but risk making Forest feel heavy if overused on a still-short one-pager; keep the second reversal narrow (a band, not a full section) rather than doubling the about-section treatment.
- **New headline vs. current copy investment:** the rest of v1's copy (process, FAQ) already earns its NZ-English, fact-forward voice; only the hero headline is weak. Rewriting just that line is low-risk; rewriting more risks diluting copy that's already working.
