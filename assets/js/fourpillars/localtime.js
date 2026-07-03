/* ==========================================================================
   Local / true solar time (真太陽時) correction.
   --------------------------------------------------------------------------
   Traditional 四柱推命 reads the HOUR (and, in the strict school, the DAY) from
   the birthplace's *apparent solar time*, not the civil clock. Two corrections
   turn a standard-zone clock time into true solar time:

     true solar time = zone clock + longitudeCorrection + equationOfTime
       longitudeCorrection = (birthLongitude − zoneStandardMeridian) × 4 min/deg
       equationOfTime      = apparent − mean solar time  (the "EoT", ±~16 min)

   The zone's standard meridian = UTC-offset × 15° (works for half-hour zones
   like India's +5:30 → 82.5°E too).

   This module is pure/DOM-free and independently unit-tested. The 節/立春
   boundaries are handled in absolute UT by ganzhi.js — the correction cancels
   there — so this file only produces the local-time delta and the city table.
   ========================================================================== */

import { gregorianToJD, apparentSolarLongitude, deltaTSeconds, norm360 } from "./astronomy.js";

const DEG2RAD = Math.PI / 180;

/**
 * Equation of Time (apparent − mean solar time), in minutes, for a civil date.
 * Meeus, "Astronomical Algorithms" ch. 28. Positive ≈ early November (+16 min),
 * negative ≈ mid-February (−14 min). Evaluated at 12:00 (the diurnal variation
 * of the EoT is tiny compared with the day-to-day change).
 * @param {number} year @param {number} month @param {number} day
 * @returns {number} minutes
 */
export function equationOfTimeMinutes(year, month, day) {
  const jdUT = gregorianToJD(year, month, day, 12);
  const jde = jdUT + deltaTSeconds(year) / 86400;
  const T = (jde - 2451545.0) / 36525.0;

  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T); // mean longitude
  const lambda = apparentSolarLongitude(jde);                          // apparent longitude
  // Mean obliquity of the ecliptic (deg), Meeus 22.2 (sufficient here).
  const eps = 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;

  const lamR = lambda * DEG2RAD;
  const epsR = eps * DEG2RAD;
  let alpha = Math.atan2(Math.cos(epsR) * Math.sin(lamR), Math.cos(lamR)) / DEG2RAD; // apparent RA
  alpha = norm360(alpha);

  let E = L0 - 0.0057183 - alpha;           // degrees
  E = ((E + 180) % 360 + 360) % 360 - 180;  // fold to (−180, 180]
  return E * 4;                             // 1° = 4 minutes
}

/**
 * Full local-time correction for a birthplace, in minutes (add to the zone
 * clock time to get true solar time).
 * @param {object} p
 * @param {number} p.longitude       birthplace longitude, East positive
 * @param {number} p.tzOffsetHours   UTC offset of the entered clock time (e.g. +9, −5, +5.5)
 * @param {number} p.year @param {number} p.month @param {number} p.day
 * @returns {{minutes:number, longitudeMinutes:number, eotMinutes:number, standardMeridian:number}}
 */
export function localTimeCorrection({ longitude, tzOffsetHours, year, month, day }) {
  const standardMeridian = tzOffsetHours * 15;
  const longitudeMinutes = (longitude - standardMeridian) * 4;
  const eotMinutes = equationOfTimeMinutes(year, month, day);
  return {
    minutes: longitudeMinutes + eotMinutes,
    longitudeMinutes,
    eotMinutes,
    standardMeridian,
  };
}

/**
 * Preset birthplaces for the UI dropdown. `tzOffsetHours` is the STANDARD
 * (non-DST) offset — see the DST note in the reading form.
 */
export const CITIES = [
  // Japan (JST, +9)
  { id: "tokyo",       name: "Tokyo",       region: "Japan",         longitude: 139.6917, tzOffsetHours: 9 },
  { id: "osaka",       name: "Osaka",       region: "Japan",         longitude: 135.5023, tzOffsetHours: 9 },
  { id: "sapporo",     name: "Sapporo",     region: "Japan",         longitude: 141.3545, tzOffsetHours: 9 },
  { id: "fukuoka",     name: "Fukuoka",     region: "Japan",         longitude: 130.4017, tzOffsetHours: 9 },
  { id: "naha",        name: "Naha",        region: "Japan",         longitude: 127.6809, tzOffsetHours: 9 },
  // International (standard offsets)
  { id: "new-york",    name: "New York",    region: "International",  longitude: -74.0060, tzOffsetHours: -5 },
  { id: "los-angeles", name: "Los Angeles", region: "International",  longitude: -118.2437, tzOffsetHours: -8 },
  { id: "london",      name: "London",      region: "International",  longitude: -0.1276, tzOffsetHours: 0 },
  { id: "paris",       name: "Paris",       region: "International",  longitude: 2.3522,  tzOffsetHours: 1 },
  { id: "istanbul",    name: "Istanbul",    region: "International",  longitude: 28.9784, tzOffsetHours: 3 },
  { id: "delhi",       name: "Delhi",       region: "International",  longitude: 77.2090, tzOffsetHours: 5.5 },
  { id: "sydney",      name: "Sydney",      region: "International",  longitude: 151.2093, tzOffsetHours: 10 },
  { id: "singapore",   name: "Singapore",   region: "International",  longitude: 103.8198, tzOffsetHours: 8 },
];

/** Look up a preset city by id. */
export function cityById(id) {
  return CITIES.find((c) => c.id === id) || null;
}
