/* ==========================================================================
   Ganzhi engine — the four pillars (年柱・月柱・日柱・時柱).
   --------------------------------------------------------------------------
   Conventions (documented so results are reproducible and auditable):
     • Birth details are interpreted in Japan Standard Time (JST, UTC+9).
     • Year pillar switches on the true 立春 instant (not a fixed date).
     • Month pillar switches on the true 節 (major solar-term) instants.
     • Day pillar changes at civil midnight (mainstream Japanese convention);
       the 23:00–00:59 slot is the 子 hour of the current civil day.
     • Month stem via 五虎遁, hour stem via 五鼠遁.
   ========================================================================== */

import { STEMS, BRANCHES, ELEMENTS } from "./constants.js";
import { julianDayNumberNoon, gregorianToJD } from "./astronomy.js";
import { risshun, monthTermBoundaries } from "./solar-terms.js";

const mod = (n, m) => ((n % m) + m) % m;

/** Build a pillar object from a 0–59 sexagenary index. */
function pillarFromIndex(index60) {
  const s = mod(index60, 10);
  const b = mod(index60, 12);
  const stem = STEMS[s];
  const branch = BRANCHES[b];
  return {
    index: mod(index60, 60),
    stemIndex: s,
    branchIndex: b,
    stem,
    branch,
    cn: stem.cn + branch.cn,
    romaji: `${stem.romaji}-${branch.romaji}`,
    element: stem.element, // pillar's governing element = its stem's element
    yin: stem.yin,
  };
}

/** Combine a stem index and branch index into the matching 0–59 index. */
function indexFromStemBranch(stemIndex, branchIndex) {
  // Solve i ≡ stemIndex (mod 10) and i ≡ branchIndex (mod 12) via CRT (period 60).
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stemIndex && i % 12 === branchIndex) return i;
  }
  throw new Error("invalid stem/branch combination");
}

/** Year pillar from the 立春-based solar year. */
function yearPillar(solarYear) {
  const stemIndex = mod(solarYear - 4, 10);
  const branchIndex = mod(solarYear - 4, 12);
  return pillarFromIndex(indexFromStemBranch(stemIndex, branchIndex));
}

/**
 * Month pillar.
 * @param {number} monthBranchIndex branch of the solar month (from 節 boundary)
 * @param {number} yearStemIndex stem of the (立春-based) year
 */
function monthPillar(monthBranchIndex, yearStemIndex) {
  // 五虎遁: stem of the 寅 month = (2 + 2 * (yearStem mod 5)) mod 10.
  const yinMonthStem = mod(2 + 2 * (yearStemIndex % 5), 10);
  // Months advance from 寅 (branch 2). n = steps since the 寅 month.
  const n = mod(monthBranchIndex - 2, 12);
  const stemIndex = mod(yinMonthStem + n, 10);
  return pillarFromIndex(indexFromStemBranch(stemIndex, monthBranchIndex));
}

/** Day pillar from the JST civil date. */
function dayPillar(year, month, day) {
  const jdn = julianDayNumberNoon(year, month, day);
  const index = mod(jdn - 11, 60); // (JDN_noon − 11) mod 60, 甲子 = 0
  return pillarFromIndex(index);
}

/** Hour pillar from clock hour and the day's stem (五鼠遁). Returns null if unknown. */
function hourPillar(hour, dayStemIndex) {
  if (hour == null) return null;
  // 子 hour = 23:00–00:59 → branch 0; each 2h block advances the branch.
  const branchIndex = Math.floor((mod(hour + 1, 24)) / 2);
  const ziHourStem = mod(2 * (dayStemIndex % 5), 10);
  const stemIndex = mod(ziHourStem + branchIndex, 10);
  return pillarFromIndex(indexFromStemBranch(stemIndex, branchIndex));
}

/** Count the five elements across the present pillars (stems + branch 本気). */
function elementBalance(pillars) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const p of pillars) {
    if (!p) continue;
    counts[p.stem.element] += 1;
    counts[p.branch.element] += 1;
  }
  let dominant = null;
  let max = -1;
  for (const el of ELEMENTS) {
    if (counts[el] > max) { max = counts[el]; dominant = el; }
  }
  const lacking = ELEMENTS.filter((el) => counts[el] === 0);

  // Reading-template selector (readings-templates.md §2 rule): use "balanced"
  // when the spread is tight (max − min ≤ 1) OR when several elements tie for
  // the maximum; otherwise "<element>_dominant".
  const values = ELEMENTS.map((el) => counts[el]);
  const min = Math.min(...values);
  const tiedForMax = values.filter((v) => v === max).length > 1;
  const type = (max - min <= 1 || tiedForMax) ? "balanced" : `${dominant}_dominant`;

  return { counts, dominant, lacking, type };
}

/**
 * Compute the full chart.
 *
 * @param {object} birth
 * @param {number} birth.year  Gregorian year (JST)
 * @param {number} birth.month 1–12
 * @param {number} birth.day   1–31
 * @param {number|null} [birth.hour]   0–23; omit / null when the time is unknown
 * @param {number} [birth.minute=0]
 * @returns {object} chart with pillars, day master, and element balance
 */
export function computeChart({ year, month, day, hour = null, minute = 0 }) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError("year, month, and day are required integers");
  }
  const hasTime = hour != null;

  // JD of the birth wall-clock (JST). Term instants are in the same JST-JD space,
  // so these are directly comparable. Unknown time → noon (neutral for the day boundary).
  const effHour = hasTime ? hour : 12;
  const birthJD = gregorianToJD(year, month, day, effHour, minute);

  // --- Solar year (立春 boundary) ---
  const risshunThisYear = risshun(year);
  const solarYear = birthJD >= risshunThisYear.jd ? year : year - 1;
  const yp = yearPillar(solarYear);

  // --- Solar month (節 boundary) ---
  const boundaries = monthTermBoundaries(year);
  let monthBranch = boundaries[0].branch;
  let openingTerm = boundaries[0].term;
  for (const bnd of boundaries) {
    if (birthJD >= bnd.jd) { monthBranch = bnd.branch; openingTerm = bnd.term; }
    else break;
  }
  const mp = monthPillar(monthBranch, yp.stemIndex);

  // --- Day & hour ---
  const dp = dayPillar(year, month, day);
  const hp = hourPillar(hasTime ? hour : null, dp.stemIndex);

  const pillars = { year: yp, month: mp, day: dp, hour: hp };
  const balance = elementBalance([yp, mp, dp, hp]);

  const dayMaster = {
    stem: dp.stem,
    element: dp.stem.element,
    yin: dp.stem.yin,
    polarity: dp.stem.yin ? "yin" : "yang",
    cn: dp.stem.cn,
  };

  return {
    input: { year, month, day, hour: hasTime ? hour : null, minute: hasTime ? minute : null, tz: "JST" },
    solarYear,
    monthTerm: openingTerm,
    risshun: risshunThisYear,
    pillars,
    dayMaster,
    balance,
    hasTime,
  };
}

export { pillarFromIndex, indexFromStemBranch };
