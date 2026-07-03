/* ==========================================================================
   Solar terms (節気) — the risshun / month boundaries.
   --------------------------------------------------------------------------
   Solves for the instant the Sun's apparent longitude reaches a target value,
   then reports it as a Japan-Standard-Time (JST) civil datetime. This is what
   lets the year pillar switch on the true 立春 (not a fixed Feb 4) and the
   month pillar switch on the true 節 boundaries.
   ========================================================================== */

import {
  gregorianToJD,
  jdToGregorian,
  deltaTSeconds,
  apparentSolarLongitude,
} from "./astronomy.js";
import { MONTH_TERMS, TZ_OFFSET_HOURS } from "./constants.js";

const DAYS_PER_DEGREE = 365.2422 / 360;

/** Nominal seed date (month/day) for each 節, used to start the solver. */
const SEED = {
  立春: [2, 4],  啓蟄: [3, 6],  清明: [4, 5],  立夏: [5, 6],
  芒種: [6, 6],  小暑: [7, 7],  立秋: [8, 8],  白露: [9, 8],
  寒露: [10, 8], 立冬: [11, 7], 大雪: [12, 7], 小寒: [1, 6],
};

/**
 * Instant a given solar longitude is reached during (near) the seed date, as
 * a JST civil datetime. Newton iteration on the ~0.9856°/day solar motion.
 *
 * @param {number} year Gregorian year the seed date belongs to
 * @param {number} targetLon target apparent longitude in degrees
 * @param {number} seedMonth 1–12
 * @param {number} seedDay
 * @returns {{jd:number, year:number, month:number, day:number, hour:number, minute:number, second:number}}
 *          `jd` is the JST-shifted Julian Day; the y/m/d/h/m/s are JST civil.
 */
export function solarTermInstant(year, targetLon, seedMonth, seedDay) {
  const dt = deltaTSeconds(year) / 86400;
  // Initial guess at 12:00 UT of the seed date, expressed as JDE (TT).
  let jde = gregorianToJD(year, seedMonth, seedDay, 12) + dt;

  for (let i = 0; i < 10; i++) {
    const lon = apparentSolarLongitude(jde);
    // shortest signed angular distance to target, in (-180, 180]
    let diff = ((targetLon - lon + 540) % 360) - 180;
    jde += diff * DAYS_PER_DEGREE;
    if (Math.abs(diff) < 1e-7) break;
  }

  const jdUT = jde - dt;                       // TT → UT
  const jstJD = jdUT + TZ_OFFSET_HOURS / 24;   // UT → JST
  return { jd: jstJD, ...jdToGregorian(jstJD) };
}

/**
 * 立春 (start of the solar year, longitude 315°) for the given Gregorian year,
 * as a JST civil datetime.
 */
export function risshun(year) {
  return solarTermInstant(year, 315, ...SEED["立春"]);
}

/**
 * All 12 major terms (節) that can bracket an instant within Gregorian `year`,
 * in chronological order, each tagged with the Earthly-Branch index of the
 * month it opens. Includes the trailing 大雪 of the previous year and the
 * leading 小寒 of the next, so any instant in `year` is guaranteed to fall
 * between two entries.
 *
 * @returns {Array<{jd:number, branch:number, term:string, year:number,
 *                  month:number, day:number, hour:number, minute:number}>}
 */
export function monthTermBoundaries(year) {
  const list = [];

  // Trailing 大雪 of the previous year (opens the 子 month spilling into January).
  const daisetsu = MONTH_TERMS.find((t) => t.term === "大雪");
  list.push({
    ...solarTermInstant(year - 1, daisetsu.longitude, ...SEED["大雪"]),
    branch: daisetsu.branch,
    term: daisetsu.term,
  });

  // The 12 terms occurring within `year`.
  for (const t of MONTH_TERMS) {
    const [m, d] = SEED[t.term];
    list.push({
      ...solarTermInstant(year, t.longitude, m, d),
      branch: t.branch,
      term: t.term,
    });
  }

  // Leading 小寒 of the next year (guards a late-December birth lookup).
  const shokan = MONTH_TERMS.find((t) => t.term === "小寒");
  list.push({
    ...solarTermInstant(year + 1, shokan.longitude, ...SEED["小寒"]),
    branch: shokan.branch,
    term: shokan.term,
  });

  return list.sort((a, b) => a.jd - b.jd);
}
