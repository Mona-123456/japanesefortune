# Japanese Fortune (`japanesefortune.com`)

Static English-language site capturing search demand around Netflix's *Straight to
Hell* (地獄に堕ちるわよ) with a free **Four Pillars of Destiny** (四柱推命 / BaZi)
reading tool and explanatory articles. Part of the UMAMI brand group.

No build step, no server, no dependencies. Plain HTML/CSS + vanilla ES modules so
Mona can update everything by hand and deploy via GitHub Pages.

> **Legal (see `spec §0`):** entertainment only — not medical, legal, or financial
> advice. **No 六星占術 (Rokusei Senjutsu) calculation** exists anywhere in this
> repo (registered trademark). Readings use only the public 四柱推命 / 九星気学
> traditions and the "is said to / traditionally associated with" register.

## Layout

```
index.html               Homepage skeleton (hero + article hub placeholders)
reading/index.html       Free reading tool page (form skeleton; UI wired in Day 2)
assets/
  css/tokens.css         Design tokens — the ONLY place colors/sizes are defined
  css/base.css           Base styles, built entirely on the tokens
  css/reading.css        Reading-result styles (pillars, element bars)
  css/article.css        Article layout styles
  img/og-*.png           Generated OG share images (1200×630)
  js/fourpillars/        Ganzhi calculation engine (see below)
  js/reading/            Reading tool: compose.js (synthesis) + app.js (UI wiring)
data/readings.json       Reading templates (Mona-editable; from readings-templates.md)
content/                 Article + template drafts (source of truth for articles)
tools/                   One-shot generators (see "Building" below)
<article-slug>/          Generated article HTML (one dir per slug; committed)
test/                    Unit tests (node --test)
CNAME, robots.txt, sitemap.xml
```

## Building the articles & OG images

The site ships as plain static HTML — there is no build step to *serve* it. But
the five article pages and the social images are **generated** from the drafts in
`content/`, so re-run the generators after editing a draft:

```bash
npm run build:articles   # content/article-*.md → <slug>/index.html + sitemap.xml
npm run build:og         # → assets/img/og-*.png       (needs @napi-rs/canvas)
npm run build:hero       # hero art → assets/img/hero-* (needs sharp)
npm run build            # all three
```

`build:articles` needs only Node; `build:og` needs `@napi-rs/canvas`; `build:hero`
needs `sharp` (both in devDependencies — run `npm install`). Generated files are
committed so GitHub Pages serves them directly.

**Hero art masters** live at `content/hero-master-mobile.png` (vertical) and
`content/hero-master-desktop.png` (horizontal). They are **git-ignored** (12–13 MB
each, and kept off the public site); keep them in your local `content/` to re-run
`build:hero`. The script also applies the §4 safe-area fix (extends the vertical
canvas upward so the face clears the heading zone) and emits the WebP/AVIF srcset
widths + the 1200×630 OGP crop.

## Four Pillars engine (`assets/js/fourpillars/`)

| File | Responsibility |
|------|----------------|
| `constants.js`   | Stems 天干, branches 地支, five elements, the 12 節 term table |
| `astronomy.js`   | Julian Day, ΔT, and the Sun's apparent longitude (Meeus ch. 25) |
| `solar-terms.js` | Solves for 立春 / 節 instants (returns both JST-civil and absolute UT) |
| `localtime.js`   | True-solar-time (真太陽時) correction: longitude + Equation of Time; city table |
| `ganzhi.js`      | The four pillars, Day Master, five-element balance |
| `index.js`       | Public entry point |

```js
import { computeChart } from "/assets/js/fourpillars/index.js";
const chart = computeChart({ year: 1984, month: 2, day: 5, hour: 10, minute: 30 });
chart.pillars.year.cn;      // "甲子"
chart.dayMaster.cn;         // "己"  (element: "earth", polarity: "yin")
chart.balance.counts;       // { wood, fire, earth, metal, water }
```

### Conventions (documented for reproducibility)

- Birth details are interpreted in **Japan Standard Time (UTC+9)**.
- The **year pillar** switches on the true **立春** instant, and the **month
  pillar** on the true **節** instants — computed astronomically, *not* a fixed
  Feb 4 (spec §6: this is the one real technical risk). Validated in the tests
  against the documented record, including the rare Feb-3 立春 of 2021 and 2025.
- The **day pillar** uses `dayIndex = (JDN_noon − 11) mod 60` (甲子 = 0), anchored
  on the published reference (2019-01-27 = 甲子). It changes at civil midnight.
- Month stem via **五虎遁**, hour stem via **五鼠遁**. Birth time is optional; when
  unknown, no hour pillar is produced but the Day Master is still valid.
- **True solar time (真太陽時)** is optional: pass `place: { longitude, tzOffsetHours }`
  (or pick a city in the UI) to correct the hour/day pillars for the birthplace's
  longitude + Equation of Time. The 節/立春 boundaries are compared in absolute UT,
  so foreign timezones are handled correctly. With no `place`, behaviour is
  unchanged (JST, no correction) — fully backward compatible.

## Development

```bash
npm test          # run the unit tests (node --test, no dependencies)
```

Serve locally with any static server (paths are absolute, so serve the repo root):

```bash
python -m http.server 8080     # then open http://localhost:8080/
```

## Status

- **Day 1** — site skeleton, design tokens, ganzhi engine, unit tests.
- **Day 2** — reading-tool UI wired end-to-end: form → in-browser chart →
  synthesis from `data/readings.json` (10 Day Masters × 6 balance types × 5 year
  outlooks) → result (pillars, five-element bars, reading, X/copy share, email
  CTA, related guides). **45 tests passing** (`node --test`), incl. a jsdom UI
  smoke pass for the full submit flow.
- **Day 3** — 5 articles generated to static HTML from `content/` with resolved
  internal links; JSON-LD (Article + FAQPage, plus ItemList on the hub article);
  per-article + generic OG images; homepage/reading related links repointed to
  real URLs; sitemap regenerated. Rokusei Senjutsu appears only as factual /
  critical explanation — no calculator, per spec §0.
- **Next (Day 4)** — QA (boundary-day + mobile), Search Console + GA4, launch.
