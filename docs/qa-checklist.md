# QA Checklist — Day 4

Two parts: (A) what the automated tests already cover, and (B) the manual
mobile/real-device checks to run before launch. Items marked **[device]** need a
real phone or browser devtools — they can't be verified from code.

---

## A. Automated (already green)

Run: `npm test` → **45 tests passing**.

### Ganzhi boundary cases (spec §6 — the core technical risk)
- [x] 立春 dates match the record incl. the rare Feb-3 years **2021** and **2025**, and Feb-5 years **1920 / 1984**.
- [x] **1985-02-04** across risshun 06:13 JST: born 05:00 → 1984 (甲子); born 07:00 → 1985 (乙丑).
- [x] **2021-02-03** across risshun 23:56 JST: 00:00 → 2020 solar year (庚子 / 小寒); 23:59 → 2021 (辛丑 / 立春); day pillar unchanged.
- [x] Month 節 boundary **2005-08-07** across 立秋 18:56: month branch 未 → 申.
- [x] Day-pillar anchors: 2019-01-27 = 甲子, 2000-01-01 = 戊午, 2024-01-01 = 甲子.
- [x] Unknown birth time → no hour pillar; Day Master + 6-char balance still valid.
- [x] Reading synthesis picks the right template for all 10 Day Masters × 6 balance types × 5 year outlooks; template completeness verified.

### Link / asset integrity
- [x] 75 internal links + OG images resolve, 0 broken (re-run: `node tools/build-articles.mjs` then the link check).
- [x] No draft-comment (`slug:`, `word count`, etc.) leaks into generated HTML.

---

## B. Manual mobile / real-device checks **[device]**

Test in browser devtools **and** at least one real phone. Widths to cover:
**320** (iPhone SE 1st gen / small Android), **360**, **375**, **390/414**, plus **768** (tablet) and one landscape.

### Global
- [ ] **No horizontal scroll** on any page at 320px. (Header was the known risk — fixed with a `max-width: 26rem` query; confirm on device.)
- [ ] Sticky header stays one line: brand + "Free Reading" / "Guides" don't overlap or wrap awkwardly.
- [ ] Tap targets comfortable (~44px): nav links, buttons, form fields, share buttons, related cards.
- [ ] Text legible without zoom; body ≥ ~16px effective; contrast OK on the dark theme (vermilion links on ink).
- [ ] Footer disclaimer readable on every page (legal requirement).
- [ ] iOS Safari: `100vh`/sticky header behaves; native date/time pickers open; no rubber-band overflow.

### Homepage `/` — hero art
- [ ] **Desktop (≥48rem)**: horizontal art, person on the right; heading/lede/CTA sit **left**, vertically centred, legible over the left scrim; person not covered by text.
- [ ] **Mobile (<48rem)**: vertical art; **heading at top, CTA at bottom**; the top band is clear sky (face is NOT covered by the heading — the §4 (b) canvas extension). No visible seam where the sky was extended.
- [ ] No text is baked into the image; all wording is live HTML and re-flows.
- [ ] **LCP**: hero image loads fast (AVIF/WebP srcset, `fetchpriority=high`). Check DevTools ▶ Performance / Lighthouse — hero should be the LCP element and stay within the 90+ budget; confirm the right variant loads (mobile vertical on phones, desktop horizontal on wide).
- [ ] Hero CTA button reachable and large; article cards stack to one column and are tappable.
- [ ] The 5 guide cards link to the right articles.
- [ ] OG share preview for `/` shows the `hero-og.jpg` character crop (person right, no text).

### Reading tool `/reading/`
- [ ] Date field required-validation shows a friendly message when empty.
- [ ] "I don't know my birth time" disables the time field.
- [ ] Submit renders the result; **four-pillar glyphs are readable at 320px** (2-char stack per column); Day pillar is highlighted.
- [ ] Five-element bars render with correct widths/labels; "light in …" note appears when an element is 0.
- [ ] Reading text (4 paragraphs) reads well; bold/italic render; disclaimer present.
- [ ] **Share on X** opens the intent with pre-filled text + URL. **Copy result** copies (toast "Copied ✓").
- [ ] Email CTA: submitting shows the confirmation; empty email blocked by required.
- [ ] Related-guide cards link to real articles.

### Articles (all 5)
- [ ] Headings, paragraphs, the `- ` list (article 4), and internal links render; links go to real slugs + `/reading/`.
- [ ] Unofficial-disclaimer **note callout** present on articles 1–3.
- [ ] FAQ section readable; "Try a free reading" CTA and related cards work.
- [ ] **Compliance spot-check**: no article offers a Rokusei Senjutsu *calculation* — only factual/critical explanation. Each of articles 1–3 states the site does not offer it.

### Tooling to run before launch
- [ ] **Lighthouse (mobile)** on `/`, `/reading/`, one article — target **90+** (spec §2.3). Watch: unused CSS, image sizes, tap targets, contrast.
- [ ] **Rich Results Test** (search.google.com/test/rich-results) on one article URL → Article + FAQPage detected, no errors.
- [ ] **OG preview**: X Card Validator + Facebook Sharing Debugger on `/` and one article → image + title + description show. (Uses the generated `assets/img/og-*.png`.)
- [ ] Reduced-motion: enable "reduce motion" → transitions suppressed.
