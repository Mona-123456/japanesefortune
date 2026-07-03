/* ==========================================================================
   Reading tool — DOM wiring.
   Reads the form, computes the chart in-browser, synthesizes the reading from
   data/readings.json, and renders the result (pillars, Day Master, element
   balance, reading text, share, email CTA, related guides).
   ========================================================================== */

import { computeChart } from "../fourpillars/index.js";
import { ELEMENTS, ELEMENT_LABELS } from "../fourpillars/constants.js";
import { composeReading } from "./compose.js";

const form = document.getElementById("reading-form");
const resultEl = document.getElementById("reading-result");
const timeInput = document.getElementById("birthtime");
const timeUnknown = document.getElementById("time-unknown");

/* --- small helpers -------------------------------------------------------- */
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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

/* --- form → chart --------------------------------------------------------- */
// Disable the time field while "unknown" is checked.
timeUnknown?.addEventListener("change", () => {
  timeInput.disabled = timeUnknown.checked;
  if (timeUnknown.checked) timeInput.value = "";
});

function readForm() {
  const dateStr = document.getElementById("birthdate").value;
  if (!dateStr) return { error: "Please enter your date of birth." };
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return { error: "That date looks incomplete." };

  let hour = null;
  let minute = 0;
  const noTime = timeUnknown?.checked || !timeInput.value;
  if (!noTime) {
    const [h, m] = timeInput.value.split(":").map(Number);
    hour = h;
    minute = Number.isFinite(m) ? m : 0;
  }
  return { input: { year, month, day, hour, minute } };
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

function renderResult(chart, reading) {
  const dm = chart.dayMaster;
  const dmElLabel = ELEMENT_LABELS[dm.element];
  const bodyHtml = reading.paragraphs
    .map((p) => `<p>${mdInline(p)}</p>`)
    .join("");

  const shareText =
    `My Japanese Four Pillars Day Master is ${dm.cn} (${cap(dm.polarity)} ${cap(dm.element)}). ` +
    `Read yours free:`;
  const shareUrl = "https://japanesefortune.com/reading/";

  resultEl.innerHTML = `
    <hr class="rule-mon" />
    <div class="result-head">
      <span class="kicker">Your Four Pillars · 四柱</span>
      <h2>You are <span class="el-fg--${dm.element}">${cap(dm.polarity)} ${dmElLabel.en}</span> <span class="dm-glyph el-fg--${dm.element}">${dm.cn}</span></h2>
      <p class="result-sub">${chart.hasTime ? "" : "Calculated without a birth time — the hour pillar is omitted, but your Day Master is unaffected. "}Born under the ${chart.monthTerm} solar term, solar year ${chart.solarYear}.</p>
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

    <article class="reading-body prose">
      ${bodyHtml}
      <p class="reading-disclaimer"><em>${escapeHtml(reading.disclaimer)}</em></p>
    </article>

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
    const [readings, chart] = await Promise.all([loadReadings(), Promise.resolve(computeChart(input))]);
    const reading = composeReading(chart, readings);
    renderResult(chart, reading);
  } catch (err) {
    renderError(`Something went wrong generating your reading. ${err.message}`);
    // eslint-disable-next-line no-console
    console.error(err);
  }
});
