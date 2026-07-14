/* ==========================================================================
   Reading tool — DOM wiring.
   Reads the form, computes the chart in-browser, synthesizes the reading from
   data/readings.json, and renders the result (pillars, Day Master, element
   balance, reading text, share, email CTA, related guides).
   ========================================================================== */

import { computeChart, CITIES, cityById, todayPillar } from "../fourpillars/index.js";
import { tenGodsOf, strengthOf } from "../fourpillars/index.js";
import { ELEMENTS, ELEMENT_LABELS, SOLAR_TERM_GLOSS } from "../fourpillars/constants.js";
import { composeReading } from "./compose.js";
import { composeDailyReading } from "./compose-daily.js";
import { selectProminentStars, teaserFor } from "./synthesis.js";

const form = document.getElementById("reading-form");
const resultEl = document.getElementById("reading-result");
const timeInput = document.getElementById("birthtime");
const timeUnknown = document.getElementById("time-unknown");
const placeSelect = document.getElementById("birthplace");
const otherPlace = document.getElementById("other-place");

/* --- small helpers -------------------------------------------------------- */
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Signed minutes → "+19 min" / "−51 min" (true minus sign).
const fmtCorr = (m) => {
  const r = Math.round(m);
  return (r >= 0 ? "+" : "−") + Math.abs(r) + " min";
};

// Minimal, safe inline markdown: escape first, then allow **bold** and *italic*.
const mdInline = (s) =>
  escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

let readingsCache = null;
async function loadReadings() {
  if (readingsCache) return readingsCache;
  const res = await fetch("/data/readings.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load readings (${res.status})`);
  readingsCache = await res.json();
  return readingsCache;
}

let dailyCache = null;
async function loadDaily() {
  if (dailyCache) return dailyCache;
  const res = await fetch("/data/readings-daily.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load daily (${res.status})`);
  dailyCache = await res.json();
  return dailyCache;
}

let hiddenCache = null;
async function loadHidden() {
  if (hiddenCache) return hiddenCache;
  const res = await fetch("/data/hidden-stems.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load hidden stems (${res.status})`);
  hiddenCache = await res.json();
  return hiddenCache;
}

let teasersCache = null;
async function loadTeasers() {
  if (teasersCache) return teasersCache;
  const res = await fetch("/data/star-teasers.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load teasers (${res.status})`);
  teasersCache = await res.json();
  return teasersCache;
}

/* --- form → chart --------------------------------------------------------- */
// Populate the birthplace dropdown from the city table (grouped by region).
function populatePlaces() {
  if (!placeSelect) return;
  const other = placeSelect.querySelector('option[value="other"]');
  const byRegion = {};
  for (const c of CITIES) (byRegion[c.region] ||= []).push(c);
  for (const region of Object.keys(byRegion)) {
    const og = document.createElement("optgroup");
    og.label = region;
    for (const c of byRegion[region]) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      og.appendChild(opt);
    }
    placeSelect.insertBefore(og, other); // keep "Other…" last
  }
}
populatePlaces();

// Show the longitude/offset inputs only for "Other".
placeSelect?.addEventListener("change", () => {
  if (otherPlace) otherPlace.hidden = placeSelect.value !== "other";
});

// Disable the time field while "unknown" is checked.
timeUnknown?.addEventListener("change", () => {
  timeInput.disabled = timeUnknown.checked;
  if (timeUnknown.checked) timeInput.value = "";
});

// Auto-format the birthdate as yyyy/mm/dd while typing (digits only; slashes
// inserted automatically). Backspace works naturally since slashes are derived
// from the digit count.
const birthdateInput = document.getElementById("birthdate");
birthdateInput?.addEventListener("input", () => {
  const d = birthdateInput.value.replace(/\D/g, "").slice(0, 8);
  let out = d.slice(0, 4);
  if (d.length > 4) out += "/" + d.slice(4, 6);
  if (d.length > 6) out += "/" + d.slice(6, 8);
  birthdateInput.value = out;
});

/** Parse "yyyy/mm/dd" (also tolerant of - or . separators) into a valid date. */
function parseBirthdate(str) {
  const m = String(str).trim().match(/^(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})$/);
  if (!m) return { error: "Enter your date of birth as yyyy/mm/dd (e.g. 1990/07/15)." };
  const year = +m[1], month = +m[2], day = +m[3];
  if (year < 1920 || year > 2030) return { error: "Please enter a year between 1920 and 2030." };
  if (month < 1 || month > 12) return { error: "That month looks off — use 01–12." };
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (day < 1 || day > daysInMonth) return { error: "That day isn't valid for the month." };
  return { year, month, day };
}

function readForm() {
  const dateStr = document.getElementById("birthdate").value;
  if (!dateStr) return { error: "Please enter your date of birth." };
  const parsed = parseBirthdate(dateStr);
  if (parsed.error) return { error: parsed.error };
  const { year, month, day } = parsed;

  let hour = null;
  let minute = 0;
  const noTime = timeUnknown?.checked || !timeInput.value;
  if (!noTime) {
    const [h, m] = timeInput.value.split(":").map(Number);
    hour = h;
    minute = Number.isFinite(m) ? m : 0;
  }

  // Optional birthplace → true-solar-time correction.
  let place = null;
  const pv = placeSelect?.value;
  if (pv === "other") {
    const lonStr = document.getElementById("longitude").value;
    const offStr = document.getElementById("utc-offset").value;
    const lon = parseFloat(lonStr);
    const off = parseFloat(offStr);
    if (Number.isFinite(lon) && Number.isFinite(off)) {
      place = { name: "Custom", longitude: lon, tzOffsetHours: off };
    } else if (lonStr || offStr) {
      return { error: "For a custom birthplace, enter both longitude and UTC offset." };
    }
  } else if (pv) {
    const c = cityById(pv);
    if (c) place = { name: c.name, longitude: c.longitude, tzOffsetHours: c.tzOffsetHours };
  }

  return { input: { year, month, day, hour, minute, place } };
}

/* --- rendering ------------------------------------------------------------ */
function pillarColumn(label, pillar, isDay) {
  if (!pillar) {
    return `<div class="pillar pillar--empty">
      <div class="pillar__label">${label}</div>
      <div class="pillar__glyphs" aria-hidden="true">—</div>
      <div class="pillar__romaji">unknown</div>
    </div>`;
  }
  const stemEl = pillar.stem.element;
  const branchEl = pillar.branch.element;
  return `<div class="pillar${isDay ? " pillar--day" : ""}">
    <div class="pillar__label">${label}${isDay ? " · Day Master" : ""}</div>
    <div class="pillar__glyphs">
      <span class="glyph el-fg--${stemEl}" title="${cap(stemEl)} · ${pillar.stem.pinyin}">${pillar.stem.cn}</span>
      <span class="glyph el-fg--${branchEl}" title="${cap(branchEl)} · ${pillar.branch.zodiac}">${pillar.branch.cn}</span>
    </div>
    <div class="pillar__romaji">${pillar.romaji}</div>
    <div class="pillar__zodiac">${pillar.branch.zodiac}</div>
  </div>`;
}

function balanceBars(counts) {
  const max = Math.max(1, ...ELEMENTS.map((e) => counts[e]));
  return ELEMENTS.map((el) => {
    const n = counts[el];
    const pct = Math.round((n / max) * 100);
    return `<div class="bar-row">
      <span class="bar-row__label"><span class="el el--${el}">${ELEMENT_LABELS[el].en}</span> <span class="bar-row__cn">${ELEMENT_LABELS[el].cn}</span></span>
      <span class="bar-track"><span class="bar-fill el-bg--${el}" style="width:${pct}%"></span></span>
      <span class="bar-row__count">${n}</span>
    </div>`;
  }).join("");
}

// "Today for You" — the personal daily (personal[Day Master × today's element] +
// daily_closing), a timely note appended to the permanent reading. Reuses the
// daily engine/templates; a bonus block, so any failure just omits it.
function todayForYouCard(chart, dailyData) {
  if (!dailyData) return "";
  try {
    const today = todayPillar();
    // No name field on the reading form yet; composeDailyReading resolves the
    // empty {name} to a clean line. Pass `name` here when a field is added.
    const daily = composeDailyReading({
      today,
      dayMasterStemKey: chart.dayMaster.stem.key,
      data: dailyData,
    });
    const [, personal, closing] = daily.paragraphs; // drop the general (everyone) line
    const el = today.stem.element;
    const elLabel = ELEMENT_LABELS[el];
    const polarity = today.stem.yin ? "Yin" : "Yang";
    const dateLine = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    return `
    <div class="card today-card" style="--accent: var(--el-${el})">
      <div class="today-card__head">
        <h3>Today for You</h3>
        <span class="today-card__chip"><span class="today-card__dot"></span>${elLabel.en} <span class="today-card__chip-cn">${elLabel.cn}</span></span>
      </div>
      <p class="today-card__date">${escapeHtml(`${dateLine} · ${polarity} ${elLabel.en} (${today.stem.cn}) day`)}</p>
      <div class="today-card__body prose">
        <p>${mdInline(personal)}</p>
        <p class="today-card__closing">${mdInline(closing)}</p>
      </div>
    </div>`;
  } catch {
    return ""; // missing template / bad data — omit the block, keep the reading intact
  }
}

// English gloss names for the ten gods, paired with the kanji from the engine
// (TEN_GOD_LABELS via selectProminentStars). Displayed as "The X Star (漢字)".
const STAR_NAMES_EN = {
  peer: "Peer", rival: "Rival", creative: "Creative", expressive: "Expressive",
  fortune: "Fortune", steady_wealth: "Steady-Wealth", challenge: "Challenge",
  authority: "Authority", insight: "Insight", wisdom: "Wisdom",
};

// Body-strength badge: engine label → display (English + kanji).
const STRENGTH_LABELS = {
  robust: { en: "Robust", cn: "身旺" },
  balanced: { en: "Balanced", cn: "中和" },
  weak: { en: "Weak", cn: "身弱" },
};

// Day Master (日主) symbol + the "you are ___" identity, keyed by stem. The
// image name is the shareable headline; the line is the classical one-liner
// (reused from the ten-types guide) — the "you drew this card" hook.
const DM_IMAGE = {
  jia: "the Tall Tree", yi: "the Vine", bing: "the Sun", ding: "the Candle",
  wu: "the Mountain", ji: "the Field", geng: "the Axe", xin: "the Jewel",
  ren: "the River", gui: "the Fog",
};
const DM_LINE = {
  jia: "You are the tree others plan their lives around. They rarely say so.",
  yi: "You are the softest thing in the room. You are also the last one standing.",
  bing: "You are the reason the room is warm. Someone should tell you to go home.",
  ding: "You see people. It's not always comfortable for them.",
  wu: "You are the mountain others shelter against. Notice who is standing there.",
  ji: "Everything growing around you is standing in you. Look at what you've grown.",
  geng: "You are the one they call when someone has to say it. They will call you again.",
  xin: "You notice the flaw. Try not to point it at yourself.",
  ren: "You don't push through walls. You outlast them.",
  gui: "No one saw you coming. That was never an accident.",
};

// The Day Master's stem symbol — the eye-catching "card" at the top of the
// result. Eager (above the fold). A missing/unmapped stem just omits the image.
function dmSymbolFigure(dm) {
  const key = dm.stem?.key;
  if (!key || !DM_IMAGE[key]) return "";
  const alt = `${cap(dm.polarity)} ${cap(dm.element)} — ${DM_IMAGE[key].replace(/^the /, "The ")}`;
  return `
      <figure class="dm-symbol">
        <picture>
          <source type="image/avif" srcset="/assets/img/stem-${key}-320.avif 320w, /assets/img/stem-${key}-640.avif 640w" sizes="(max-width: 26rem) 78vw, 320px" />
          <source type="image/webp" srcset="/assets/img/stem-${key}-320.webp 320w, /assets/img/stem-${key}-640.webp 640w" sizes="(max-width: 26rem) 78vw, 320px" />
          <img class="dm-symbol__img" src="/assets/img/stem-${key}.png" width="320" height="320" alt="${escapeHtml(alt)}" decoding="async" />
        </picture>
      </figure>`;
}

// "Your Stars" — the free ten-god lineup: the prominent stars named and
// teased (one line each), plus the body-strength badge. Foregrounds month-stem
// first, folds hidden stems (selectProminentStars default). Teasers are the
// free hook; the full interpretation is the gated paid reading. A bonus block —
// any failure (missing tables) just omits it, leaving the core reading intact.
function yourStarsCard(chart, hiddenTable, teasers) {
  if (!hiddenTable) return "";
  try {
    const tenGods = tenGodsOf(chart, hiddenTable);
    const stars = selectProminentStars(chart, tenGods, { max: 3 });
    if (!stars.length) return "";

    const strength = strengthOf(chart);
    const sLabel = STRENGTH_LABELS[strength.label] ?? { en: cap(strength.label), cn: strength.cn };
    const el = chart.dayMaster.element; // accent = Day Master's element (stars are relative to it)

    const rows = stars.map((s) => {
      const t = teaserFor(s.god, teasers);
      // teaserFor returns "<kanji> Star" when the manuscript line is missing —
      // treat that as "no teaser yet" and skip the line rather than echo a label.
      const hasTeaser = t && t !== `${s.cn} Star`;
      const enName = STAR_NAMES_EN[s.god] ?? cap(s.god);
      return `
      <li class="star">
        <p class="star__name">The ${escapeHtml(enName)} Star <span class="star__cn">${s.cn}</span>${s.isTheme ? ` <span class="star__theme">recurring theme</span>` : ""}</p>
        ${hasTeaser ? `<p class="star__teaser">${mdInline(t)}</p>` : ""}
        <a class="star__cta" href="#" role="button" aria-disabled="true" tabindex="-1">Unlock full reading <span aria-hidden="true">→</span></a>
      </li>`;
    }).join("");

    return `
    <div class="card stars-card" style="--accent: var(--el-${el})">
      <div class="stars-card__head">
        <h3>Your Stars <span class="stars-card__cn">十神</span></h3>
        <span class="strength-badge" title="Body strength (身強身弱)"><span class="strength-badge__dot"></span>${sLabel.en} <span class="strength-badge__cn">${sLabel.cn}</span></span>
      </div>
      <ul class="stars">${rows}</ul>
    </div>`;
  } catch {
    return ""; // missing table / bad data — omit the block, keep the reading intact
  }
}

function renderResult(chart, reading, dailyData, hiddenTable, teasers) {
  const dm = chart.dayMaster;
  const dmElLabel = ELEMENT_LABELS[dm.element];
  const bodyHtml = reading.paragraphs
    .map((p) => `<p>${mdInline(p)}</p>`)
    .join("");

  const dmName = DM_IMAGE[dm.stem?.key];   // e.g. "the Mountain"
  const dmLine = DM_LINE[dm.stem?.key];
  const termGloss = SOLAR_TERM_GLOSS[chart.monthTerm];
  const termStr = termGloss ? `${termGloss} (${chart.monthTerm})` : chart.monthTerm;

  const shareText = dmName
    ? `I'm ${dmName} — ${cap(dm.polarity)} ${cap(dm.element)} (${dm.cn}). My Japanese Four Pillars Day Master. Read yours free:`
    : `My Japanese Four Pillars Day Master is ${dm.cn} (${cap(dm.polarity)} ${cap(dm.element)}). Read yours free:`;
  const shareUrl = "https://japanesefortune.com/reading/";

  resultEl.innerHTML = `
    <hr class="rule-mon" />
    <div class="result-head">
      <span class="kicker">Your Day Master · 日主</span>
      ${dmSymbolFigure(dm)}
      <h2>You are <span class="el-fg--${dm.element}">${dmName ? escapeHtml(dmName) : `${cap(dm.polarity)} ${dmElLabel.en}`}</span></h2>
      <p class="dm-detail"><span class="dm-glyph el-fg--${dm.element}">${dm.cn}</span> · ${cap(dm.polarity)} ${dmElLabel.en}</p>
      ${dmLine ? `<p class="dm-line"><em>${escapeHtml(dmLine)}</em></p>` : ""}
      ${dmName ? `<p class="dm-cta"><a class="btn btn--ghost" href="/day-master/${dm.polarity}-${dm.element}/">Read more about ${escapeHtml(dmName)} →</a></p>` : ""}
      <p class="result-sub">${chart.hasTime ? "" : "Calculated without a birth time — the hour pillar is omitted, but your Day Master is unaffected. "}Born under the ${termStr} solar term, solar year ${chart.solarYear}.</p>
      ${chart.localCorrection ? `<p class="corr-note">Local time correction: <strong>${fmtCorr(chart.localCorrection.minutes)}</strong>${chart.localCorrection.place.name ? ` · ${escapeHtml(chart.localCorrection.place.name)}` : ""} <span class="corr-breakdown">(longitude ${fmtCorr(chart.localCorrection.longitudeMinutes)}, equation of time ${fmtCorr(chart.localCorrection.eotMinutes)})</span></p>` : ""}
    </div>

    <div class="pillars" role="group" aria-label="Four pillars">
      ${pillarColumn("Year", chart.pillars.year, false)}
      ${pillarColumn("Month", chart.pillars.month, false)}
      ${pillarColumn("Day", chart.pillars.day, true)}
      ${pillarColumn("Hour", chart.pillars.hour, false)}
    </div>

    <div class="card balance-card">
      <h3>Five-element balance · 五行</h3>
      <div class="bars">${balanceBars(chart.balance.counts)}</div>
      ${chart.balance.lacking.length
        ? `<p class="balance-note">Traditionally read as light in ${chart.balance.lacking.map((e) => ELEMENT_LABELS[e].en).join(", ")}.</p>`
        : ""}
    </div>

    ${yourStarsCard(chart, hiddenTable, teasers)}

    <article class="reading-body prose">
      ${bodyHtml}
      <p class="reading-disclaimer"><em>${escapeHtml(reading.disclaimer)}</em></p>
    </article>

    ${todayForYouCard(chart, dailyData)}

    <div class="share-row">
      <a class="btn" id="share-x" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener">Share on X</a>
      <button class="btn btn--ghost" id="share-copy" type="button">Copy result</button>
    </div>

    <div class="card cta-card">
      <h3>Get a seasonal reading by email</h3>
      <p style="color:var(--color-text-muted)">Occasional notes on Japanese fortune telling and the turning of the solar year. No spam.</p>
      <form id="email-cta" class="cta-form">
        <input type="email" id="email-input" name="email" placeholder="you@example.com" aria-label="Email address" required />
        <button class="btn" type="submit">Notify me</button>
      </form>
      <p id="cta-msg" class="cta-msg" hidden></p>
    </div>

    <div class="related">
      <span class="kicker">Keep reading</span>
      <div class="related-grid">
        <a class="card related-card" href="/four-pillars-of-destiny-japanese-fortune-telling/">Four Pillars of Destiny <span>The 1,000-year-old system behind this reading.</span></a>
        <a class="card related-card" href="/kazuko-hosoki-straight-to-hell-true-story/">Who was Kazuko Hosoki? <span>The fortune teller behind Netflix&rsquo;s <em>Straight to Hell</em>.</span></a>
        <a class="card related-card" href="/types-of-japanese-fortune-telling/">7 Types of Japanese Fortune Telling <span>From omikuji to Nine Star Ki.</span></a>
      </div>
    </div>
  `;

  wireResultActions(shareText, shareUrl);
  resultEl.hidden = false;
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function wireResultActions(shareText, shareUrl) {
  const copyBtn = document.getElementById("share-copy");
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      copyBtn.textContent = "Copied ✓";
      setTimeout(() => (copyBtn.textContent = "Copy result"), 1800);
    } catch {
      copyBtn.textContent = "Press Ctrl+C";
    }
  });

  // Email CTA: no backend in Phase 1 — store locally and confirm honestly.
  const ctaForm = document.getElementById("email-cta");
  const ctaMsg = document.getElementById("cta-msg");
  ctaForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email-input").value.trim();
    if (!email) return;
    try {
      const list = JSON.parse(localStorage.getItem("jf_subscribers") || "[]");
      if (!list.includes(email)) list.push(email);
      localStorage.setItem("jf_subscribers", JSON.stringify(list));
    } catch { /* storage may be blocked; still confirm */ }
    ctaForm.hidden = true;
    ctaMsg.hidden = false;
    ctaMsg.textContent = "Thanks — you're on the list. We'll be in touch when readings go out.";
  });
}

function renderError(message) {
  resultEl.innerHTML = `<hr class="rule-mon" /><p class="form-error" role="alert">${escapeHtml(message)}</p>`;
  resultEl.hidden = false;
}

/* --- submit --------------------------------------------------------------- */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { input, error } = readForm();
  if (error) return renderError(error);

  try {
    const [readings, daily, hidden, teasers, chart] = await Promise.all([
      loadReadings(),
      loadDaily().catch(() => null),    // daily is a bonus — never block the core reading
      loadHidden().catch(() => null),   // hidden stems: needed for the star lineup (bonus)
      loadTeasers().catch(() => null),  // star teasers (bonus)
      Promise.resolve(computeChart(input)),
    ]);
    const reading = composeReading(chart, readings);
    renderResult(chart, reading, daily, hidden, teasers);
  } catch (err) {
    renderError(`Something went wrong generating your reading. ${err.message}`);
    // eslint-disable-next-line no-console
    console.error(err);
  }
});
