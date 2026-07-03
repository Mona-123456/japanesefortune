# Japanese Fortune (`japanesefortune.xyz`)

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
  js/fourpillars/        Ganzhi calculation engine (see below)
data/readings.json       Reading templates (Mona-editable; filled by クロちゃん)
content/                 Article drafts (added Day 3)
test/ganzhi.test.js      Unit tests (node --test)
CNAME, robots.txt, sitemap.xml
```

## Four Pillars engine (`assets/js/fourpillars/`)

| File | Responsibility |
|------|----------------|
| `constants.js`   | Stems 天干, branches 地支, five elements, the 12 節 term table |
| `astronomy.js`   | Julian Day, ΔT, and the Sun's apparent longitude (Meeus ch. 25) |
| `solar-terms.js` | Solves for 立春 / 節 instants in JST (the real boundaries) |
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

## Development

```bash
npm test          # run the unit tests (node --test, no dependencies)
```

Serve locally with any static server (paths are absolute, so serve the repo root):

```bash
python -m http.server 8080     # then open http://localhost:8080/
```

## Status

Day 1 complete: site skeleton, design tokens, ganzhi engine, unit tests (33 passing).
Next (Day 2): reading-tool UI + template synthesis from `data/readings.json`; articles
land in `content/` on Day 3.
