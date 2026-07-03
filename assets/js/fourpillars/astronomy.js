/* ==========================================================================
   Astronomy helpers — Julian Day, ΔT, and the Sun's apparent longitude.
   --------------------------------------------------------------------------
   Purpose: compute solar-term (節気) instants precisely so that the year and
   month pillars use the real 立春 boundary rather than a fixed calendar date
   (spec §6: this is the one genuine technical risk).

   Solar-longitude model: Jean Meeus, "Astronomical Algorithms" 2nd ed., ch. 25
   (low-accuracy Sun). Longitude accuracy ≈ 0.01° ≈ 15 min of time — far below
   the precision at which the traditional term "date" is defined, and validated
   in the test suite against known 立春 dates (incl. the Feb-3 years 2021/2025).

   No timezone libraries: everything is done with explicit Julian Day math so
   results are identical in the browser and in Node, regardless of the host TZ.
   ========================================================================== */

const DEG2RAD = Math.PI / 180;

/**
 * Julian Day for a Gregorian calendar instant given as UTC components.
 * Valid across the Gregorian range; returns a fractional JD (0h = .5 boundary).
 * @param {number} y full year
 * @param {number} m month 1–12
 * @param {number} d day of month (may be fractional)
 * @param {number} [hour=0]
 * @param {number} [min=0]
 * @param {number} [sec=0]
 * @returns {number} Julian Day (UT)
 */
export function gregorianToJD(y, m, d, hour = 0, min = 0, sec = 0) {
  const dayFrac = d + (hour + min / 60 + sec / 3600) / 24;
  let Y = y;
  let M = m;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4); // Gregorian correction
  return (
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    dayFrac + B - 1524.5
  );
}

/**
 * Integer Julian Day Number at noon for a civil date (used by the day pillar).
 * Equals the classic astronomical JDN; e.g. 2019-01-27 → 2458511.
 * @returns {number} integer JDN
 */
export function julianDayNumberNoon(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

/** Convert a JD (UT) back to Gregorian UTC calendar components. */
export function jdToGregorian(jd) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let A = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const dayWithFrac = B - D - Math.floor(30.6001 * E) + f;
  const day = Math.floor(dayWithFrac);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  const hoursTotal = (dayWithFrac - day) * 24;
  const hour = Math.floor(hoursTotal);
  const minutesTotal = (hoursTotal - hour) * 60;
  const minute = Math.floor(minutesTotal);
  const second = Math.round((minutesTotal - minute) * 60);
  return { year, month, day, hour, minute, second };
}

/**
 * ΔT = TT − UT, in seconds. Piecewise polynomials from Espenak & Meeus
 * (NASA Five Millennium Canon). Covers the site's 1920–2030 range (plus a
 * little slack) with sub-minute accuracy, which is all the term dates need.
 * @param {number} year full year (fractional ok)
 */
export function deltaTSeconds(year) {
  const y = year;
  let t;
  if (y >= 2005 && y < 2050) {
    t = y - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (y >= 1986 && y < 2005) {
    t = y - 2000;
    return (
      63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t ** 3 +
      0.000651814 * t ** 4 + 0.00002373599 * t ** 5
    );
  }
  if (y >= 1961 && y < 1986) {
    t = y - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t ** 3) / 718;
  }
  if (y >= 1941 && y < 1961) {
    t = y - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t ** 3) / 2547;
  }
  if (y >= 1920 && y < 1941) {
    t = y - 1920;
    return 21.20 + 0.84493 * t - 0.076100 * t * t + 0.0020936 * t ** 3;
  }
  if (y >= 1900 && y < 1920) {
    t = y - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t * t + 0.0061966 * t ** 3 - 0.000197 * t ** 4;
  }
  // 2050–2150 fallback (out of primary range, kept for robustness).
  const u = (y - 1820) / 100;
  return -20 + 32 * u * u;
}

/**
 * The Sun's apparent geocentric ecliptic longitude, in degrees [0, 360),
 * for a given Julian Ephemeris Day (JDE, i.e. TT-based JD). Meeus ch. 25.
 */
export function apparentSolarLongitude(jde) {
  const T = (jde - 2451545.0) / 36525.0; // Julian centuries TT from J2000

  // Geometric mean longitude of the Sun (deg)
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  // Mean anomaly of the Sun (deg)
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = norm360(M) * DEG2RAD;

  // Sun's equation of the center (deg)
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  const trueLon = L0 + C; // true (geometric) longitude ☉
  // Correction to apparent longitude (nutation + aberration)
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLon - 0.00569 - 0.00478 * Math.sin(omega * DEG2RAD);
  return norm360(lambda);
}

/** Normalize an angle to [0, 360). */
export function norm360(deg) {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
}
