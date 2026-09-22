# UX Architecture v2 — WBS one-page

## 1. Jobs-to-be-done and the 10-second question

| Audience | JTBD | 10-second question |
|---|---|---|
| **Island homeowner** | Get backyard ground work or a build done by someone local who won't ghost them | "Do these people actually work on Waiheke, and can I reach them today?" |
| **Bach owner in Auckland** | Commission and trust work on a property they can't watch, without visiting | "Can I trust this from a distance — written quote, updates, warranty — without being on site?" |
| **Property manager** | Book a reliable trade for a client property, fast, with paperwork they can forward | "Can I get a fixed quote and a paper trail I can send my client, without a phone call first?" |

v1 already answers all three inside the hero (`Est 2024 · Waiheke Island`, `12 mo warranty`, `30 days` quote validity, phone visible). This is confirmed as correct and kept structurally identical in v2 — the JTBDs don't change the order of proof, they justify why it sits in the hero rather than lower on the page.

## 2. Section order, final, with justification

1. **Header/nav** — orientation + CTA, always available (sticky).
2. **Hero** — headline, lead, dual CTA, proof strip (est. 2024 / 12-month warranty / 30-day quote). *Why here:* all three JTBDs need this before they scroll; a bach owner or property manager deciding "is this legit" from a link shared by someone else must get the answer in one screen, no scroll.
3. **Services** — landscape / carpentry / build, scannable. *Why:* answers "do you do what I need" immediately after "are you real."
4. **How we work (process)** — 4 steps, site visit → quote → build → handover. *Why here, not later:* this is where "trust at a distance" is earned procedurally (written quote, WhatsApp updates) — critical for the Auckland bach owner and property manager, who can't verify trust any other way.
5. **About (Pablo, reverse Forest)** — founder-led credibility, island residency stated explicitly. *Why after process, not before:* process de-risks the decision with facts; About then puts a face and a local address behind those facts, reinforcing "not a fly-by-night operator."
6. **Recent work / portfolio** — proof of craft, full-colour once real, currently placeholder tiles. *Why here:* by this point the visitor is qualified and wants evidence, not the first thing they need.
7. **FAQ** — objection handling (timelines, payment terms, guarantee, coverage). *Why here:* catches remaining doubt right before the ask; keeps the ask (contact) uncluttered.
8. **Contact** — form + phone + email + WhatsApp link, the single conversion point.
9. **Footer** — legal, secondary contact repeat, terms/privacy.

**Where proof lives:** the three hard numbers (est. 2024, 12-month warranty, 30-day quote validity) are hero-only, in the `.stats` strip — repeating them elsewhere (process step 2, FAQ) is fine as restatement in context but the hero is their canonical, single first appearance. No other invented numbers anywhere on the page.

**Where WhatsApp secondary CTA lives:** WhatsApp is not a hero CTA (hero stays two buttons: primary "Get a quote" → `#contact`, ghost "See recent work" → `#work`, per existing creative direction — adding a third hero CTA violates Hick's law on the highest-traffic decision point). WhatsApp appears in three lower-friction, lower-commitment spots instead: (a) the contact-list block beside the form (already in v1), (b) a persistent mobile sticky bar item (see §5), and (c) the process-step-3 copy ("progress photos on WhatsApp") as a trust cue, not a link. This matches JTBD: island homeowner wants the fastest channel (WhatsApp/phone), Auckland/PM personas want the form's paper trail — offering both without forcing a choice in the hero.

## 3. Section hierarchy (word-count ceilings)

| Section | Eyebrow | Title | Lead | Content | CTA |
|---|---|---|---|---|---|
| Hero | 6 words | 8 words | 40 words | 3-stat strip, 4 words each | 2 buttons, 3 words each |
| Services | 4 words | 12 words | 16 words | 3 cards × (title 1-2 words + 12-word desc + 3×6-word bullets) | none (cards link nowhere; nav CTA covers conversion) |
| Process | 4 words | 6 words | — | 4 steps × (label + title 2 words + 28-word desc) | none |
| About | 4 words | 4 words | 35 words | 1 para ≤40 words + 3-item team list, 6 words each | none |
| Recent work | 4 words | 6 words | 20 words | 6 tiles × (title 4 words + location 2 words) | none |
| FAQ | 4 words | 3 words | — | 5 Q/A, question ≤10 words, answer ≤45 words | none |
| Contact | 4 words | 6 words | 20 words | contact list (3 links) + form (7 fields) | 1 button, 2 words |

Rule: only the hero gets a lead sentence over 30 words; every other lead is a single short sentence or omitted, keeping the hierarchy in §1 of the creative-direction crit from repeating flat rhythm.

## 4. Wireframe — hero and contact

### Hero — 390px (mobile, stacked, photo below fold-safe content)

```
┌─────────────────────────────┐
│ [mark] WAIHEKE BACKYARDS     │ sticky header, 64px
├─────────────────────────────┤
│ LANDSCAPE · CARPENTRY · BUILD│ eyebrow
│                               │
│ Quoted in writing. Built on  │ h1 display
│ Waiheke. Warranted 12 mo.    │
│                               │
│ Decks, fences, retaining...  │ lead, ~2 lines
│                               │
│ [ Get a quote ] [See work]   │ stacked or wrap, 44px tap
│                               │
│ EST 2024 | 12 MO | 30 DAYS   │ 3-col stat strip
├─────────────────────────────┤
│ ░░░░░░ ridge photo 4:3 ░░░░░░│ hero image, below fold ok
│ Framing · Waiheke            │ caption
└─────────────────────────────┘
```

### Hero — 1280px (photo right, 7fr/5fr)

```
┌──────────────────────────────────────────────────────────┐
│ [mark] WBS      Services  How we work  About  Work  FAQ  [Get a quote]│
├──────────────────────────────────────────────────────────┤
│  LANDSCAPE · CARPENTRY · BUILD          ┌──────────────┐  │
│  Quoted in writing. Built on            │              │  │
│  Waiheke. Warranted 12 mo.              │  ridge photo │  │
│  Decks, fences, retaining walls...      │    4:5       │  │
│  [Get a quote]  [See recent work]       │              │  │
│  EST 2024 | 12 MO WARRANTY | 30 DAYS    │ Framing·Waiheke│
└──────────────────────────────────────────────────────────┘
```

### Contact — 390px (stacked, form after contact list)

```
┌─────────────────────────────┐
│ GET A QUOTE                  │ eyebrow
│ Tell us about your backyard  │ h2
│ Send a few details...        │ lead
│ +64 21 182 2723               │
│ pablo.wbs@gmail.com          │ contact list
│ WhatsApp                     │
├─────────────────────────────┤
│ [Your name        ]          │
│ [Phone/WhatsApp    ]         │
│ [Email             ]         │
│ [What do you need ▾]         │
│ [Tell us about the job     ] │ textarea
│ [x] consent text             │
│ [ Send request ]             │
│ (status line, aria-live)     │
└─────────────────────────────┘
[  sticky bottom bar: Call | WhatsApp | ↑Quote ]  ← mobile only, see §5
```

### Contact — 1280px (5fr info / 7fr form)

```
┌────────────────────────────────────────────────────────────┐
│ GET A QUOTE                    ┌───────────────────────────┐│
│ Tell us about your backyard    │ Name          Phone        ││
│ Send a few details...          │ Email         Service ▾    ││
│ +64 21 182 2723                │ Job details (span 2)       ││
│ pablo.wbs@gmail.com            │ [x] consent (span 2)       ││
│ WhatsApp                       │ [ Send request ]           ││
└────────────────────────────────────────────────────────────┘
```

## 5. Navigation, scroll-spy, sticky CTA, keyboard

- **Nav items (unchanged from v1):** Services, How we work, About, Recent work, FAQ — 5 items, Hick's-law-safe; Contact is not a nav link, it's the persistent primary CTA button instead, keeping the action separate from wayfinding.
- **Scroll-spy:** IntersectionObserver, `rootMargin: -40% 0px -55% 0px` (as built), sets `aria-current="true"` on the active link; underline via `border-color:var(--timber)`. No JS scroll listener (perf budget in experience-vision §4 holds).
- **Mobile CTA:** recommend adding a **sticky bottom bar** (new, not in v1) below 900px, fixed, two icons + one primary: `Call` / `WhatsApp` / `Get a quote`, 56px height, safe-area-inset-bottom padding. *Trade-off:* this duplicates the header CTA and costs ~14px of permanent viewport, but the mobile audience (island homeowner on a job site, low patience) benefits more from a zero-scroll action bar than from vertical space; the hamburger menu remains for section jumps. Hide the bar only while the contact form itself is in viewport (avoid stacking CTA on CTA) via the same IntersectionObserver already watching `#contact`.
- **Keyboard access:** skip-link (present, keep), all nav links and burger reachable by Tab in DOM order, burger toggles `aria-expanded`, mobile menu closes on link activation (present, keep), focus ring per design-system tokens (`outline 2px solid var(--focus)` + forest inner box-shadow on bone). New sticky bar: buttons must be real `<a>`/`<button>`, included in normal tab order after the mobile menu, not before — otherwise it steals focus ahead of primary content on every page load.

## 6. States

**Form**
- *Empty:* no inline errors on load; required fields marked visually via label only (no red before interaction).
- *Error (client-side, on submit):* `data-invalid="true"` on the field, border turns `--danger`, hint text turns `--danger`; status line (`role=status`, `aria-live=polite`) reads "Please fill in your name, phone, the job details and tick the consent box." — already implemented in v1, kept as-is.
- *Sending:* submit button shows a disabled/busy state (`aria-busy="true"`, label "Sending…") — new, not yet in v1 markup; needed because the endpoint is external (Netlify forms per pipeline P4/04) and network latency is real on Waiheke 4G.
- *Success:* status line turns `data-ok="true"` (green/success token), copy states what happens next: "Thanks — Pablo will reply within one working day." Redirect to `/thanks.html` is the resilient fallback if JS status update fails.
- *Endpoint unreachable/down:* status line falls back to an explicit apology + direct fallback: "Something went wrong sending this. Call or WhatsApp us directly," with the phone/WhatsApp links restated inline — never a silent failure, since this is the site's single conversion path.

**Gallery (no photos yet)**
- Current `.ph` diagonal-hatch placeholder tiles with title/location text are the designed-empty state (per creative-direction v2 crit) — keep, do not treat as a bug. Caption line under each ("Photos of finished work are added with each client's permission") already signals "coming, not broken." No change recommended until real photo pairs exist per pipeline P3.

**FAQ**
- Default: all `<details>` closed, `+` marker. Open: `–` marker, native disclosure animation (browser default, no custom JS). Multiple items can be open simultaneously (no accordion exclusivity) — simplest native behaviour, matches "no scroll-jacking" principle in experience-vision.

## 7. DACI and trade-offs

| Role | Party |
|---|---|
| **Driver** | `digital-product-team-ux-architect` (this document) |
| **Contributors** | `content-seo` (copy word counts), `creative-direction` (section order rationale, proof placement) |
| **Approver** | User |
| **Informed** | Head, `ui-designer`, `frontend-multistack` |

**Named trade-offs:**
- **Sticky mobile bar vs. viewport space:** adds a persistent 56px bar on small screens, costing real content height, in exchange for zero-scroll conversion actions; rejected keeping only the header CTA because it disappears once the user scrolls past a tall hero.
- **WhatsApp kept out of hero vs. matching the island homeowner's channel preference:** the fastest-reacting audience (island homeowner) would prefer WhatsApp as prominent as the form, but hero CTA count is capped at two per Hick's law; WhatsApp is demoted to secondary placement (contact block + sticky bar) rather than competing with "Get a quote" for primary hero weight.
- **Proof restricted to hero-only canonical placement vs. reinforcing trust lower on page:** repeating the three real numbers in Process/FAQ risks diluting them into decoration; keeping them singular to the hero keeps them scannable as the page's one fact-block, at the cost of not re-anchoring trust right before the contact form.
- **No accordion exclusivity in FAQ vs. shorter page height:** allowing multiple open FAQ items keeps interaction simple and native but can make the FAQ section long if a visitor opens all five; accepted since native `<details>` has no built-in exclusivity without JS, and adding JS here would violate the "native, free, instant" principle already set in experience-vision.


---

> **Head decision (2026-09-22):** where this document conflicts with `design/04-ui-spec-v2.md` § "Head decisions after design audit", the UI spec wins (closing band padding, overlay, button size, sticky bar hiding, copy).
