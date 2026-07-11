/* ==========================================================================
   Homepage "Today's Fortune" widget (§A).
   --------------------------------------------------------------------------
   UI wiring only — reuses the existing daily engine/data/templates:
     todayPillar() → general daily (general[今日の五行×陰陽]) + daily_cta, shown
     to every visitor. If a birthdate is on file (localStorage), it upgrades to
     the personal daily (personal[日主×今日の五行]) + daily_closing.
   Nothing is sent to a server; the birthdate stays in the browser.
   ========================================================================== */

import { todayPillar, computeChart } from "../fourpillars/index.js";
import { ELEMENT_LABELS } from "../fourpillars/constants.js";
import { composeDailyReading } from "./compose-daily.js";

const mount = document.getElementById("today-fortune");
if (mount) init(mount);

const STORE_KEY = "jf_birthdate"; // "yyyy-mm-dd" (client-only)

/* --- helpers -------------------------------------------------------------- */
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mdInline = (s) =>
  escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Parse "yyyy/mm/dd" (tolerant of - . separators) to a valid date, else null. */
function parseBirthdate(str) {
  const m = String(str).trim().match(/^(\d{4})[/.\-](\d{1,2})[/.\-](\d{1,2})$/);
  if (!m) return null;
  const year = +m[1], month = +m[2], day = +m[3];
  if (year < 1920 || year > 2030 || month < 1 || month > 12) return null;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const dim = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (day < 1 || day > dim) return null;
  return { year, month, day };
}

async function loadDaily() {
  const res = await fetch("/data/readings-daily.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`daily ${res.status}`);
  return res.json();
}

/* --- render --------------------------------------------------------------- */
async function init(root) {
  let daily;
  try { daily = await loadDaily(); } catch { root.hidden = true; return; }

  const today = todayPillar();
  const stem = today.stem;
  const el = stem.element;                       // wood/fire/earth/metal/water
  const elLabel = ELEMENT_LABELS[el];            // { cn, en }
  const polarity = stem.yin ? "Yin" : "Yang";
  const now = new Date();
  const dateLine = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const sub = `${dateLine} · ${polarity} ${elLabel.en} (${stem.cn}) day`;

  function render() {
    const stored = readStored();
    let bodyHtml, formHtml = "";

    if (stored) {
      // Personal daily: general + personal + closing.
      const chart = computeChart(stored);
      const r = composeDailyReading({ today, dayMasterStemKey: chart.dayMaster.stem.key, data: daily });
      const [general, personal, closing] = r.paragraphs;
      bodyHtml =
        `<p>${mdInline(general)}</p>` +
        `<p class="daily__personal-label">Today for you — your ${cap(chart.dayMaster.polarity)} ${ELEMENT_LABELS[chart.dayMaster.element].en} Day Master (${chart.dayMaster.cn})</p>` +
        `<p>${mdInline(personal)}</p>` +
        `<p class="daily__closing">${mdInline(closing)}</p>`;
      formHtml = `<button type="button" class="daily__reset" id="daily-reset">Use a different birth date</button>`;
    } else {
      // General daily + cta + input.
      const r = composeDailyReading({ today, data: daily });
      const [general, cta] = r.paragraphs;
      bodyHtml =
        `<p>${mdInline(general)}</p>` +
        `<p class="daily__cta">${mdInline(cta)}</p>`;
      formHtml = `
        <form class="daily__form" id="daily-form" novalidate>
          <div class="daily__field">
            <label for="daily-bd">Your date of birth</label>
            <input type="text" id="daily-bd" inputmode="numeric" autocomplete="off" maxlength="10"
                   placeholder="yyyy/mm/dd" pattern="\\d{4}/\\d{2}/\\d{2}" aria-describedby="daily-note" />
          </div>
          <button type="submit" class="btn">Read today for me</button>
          <p class="daily__note" id="daily-note">Birth time is optional — it deepens a full reading, not today's.</p>
          <p class="daily__err" id="daily-err" role="alert" hidden></p>
        </form>`;
    }

    root.innerHTML = `
      <div class="container container--narrow">
        <div class="daily card" style="--accent: var(--el-${el})">
          <div class="daily__head">
            <span class="kicker">Today's Fortune</span>
            <span class="daily__chip"><span class="daily__dot"></span>${elLabel.en} (${elLabel.cn})</span>
          </div>
          <p class="daily__date">${escapeHtml(sub)}</p>
          <div class="daily__body prose">${bodyHtml}</div>
          ${formHtml}
        </div>
      </div>`;

    wire();
  }

  function wire() {
    const form = document.getElementById("daily-form");
    if (form) {
      const input = document.getElementById("daily-bd");
      const err = document.getElementById("daily-err");
      input.addEventListener("input", () => {
        const d = input.value.replace(/\D/g, "").slice(0, 8);
        let out = d.slice(0, 4);
        if (d.length > 4) out += "/" + d.slice(4, 6);
        if (d.length > 6) out += "/" + d.slice(6, 8);
        input.value = out;
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const parsed = parseBirthdate(input.value);
        if (!parsed) {
          err.hidden = false;
          err.textContent = "Enter your date of birth as yyyy/mm/dd (e.g. 1990/07/15).";
          return;
        }
        writeStored(parsed);
        render();
      });
    }
    const reset = document.getElementById("daily-reset");
    reset?.addEventListener("click", () => { clearStored(); render(); });
  }

  render();
}

/* --- storage (client-only birthdate) -------------------------------------- */
function readStored() {
  try {
    const v = localStorage.getItem(STORE_KEY);
    if (!v) return null;
    return parseBirthdate(v);
  } catch { return null; }
}
function writeStored({ year, month, day }) {
  try {
    localStorage.setItem(STORE_KEY, `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  } catch { /* storage blocked — session-only is fine */ }
}
function clearStored() {
  try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
}
