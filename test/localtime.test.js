/* ==========================================================================
   Tests for the true-solar-time (真太陽時) correction — run with `node --test`.
   Boundary cities far from their standard meridian (Paris, Istanbul, Delhi,
   Singapore) are exercised explicitly, per the feature spec.
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { equationOfTimeMinutes, localTimeCorrection, cityById, CITIES } from "../assets/js/fourpillars/localtime.js";
import { computeChart } from "../assets/js/fourpillars/ganzhi.js";

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (±${tol})`);

/* --- Equation of Time ---------------------------------------------------- */
test("EoT: mid-February ≈ −14 min, early November ≈ +16 min", () => {
  near(equationOfTimeMinutes(2000, 2, 11), -14.2, 0.6, "Feb 11 EoT");
  near(equationOfTimeMinutes(2000, 11, 3), 16.4, 0.6, "Nov 3 EoT");
});

test("EoT ≈ 0 on the four zero-crossings", () => {
  for (const [m, d] of [[4, 15], [6, 13], [9, 1], [12, 25]]) {
    near(equationOfTimeMinutes(2000, m, d), 0, 0.6, `EoT ${m}/${d}`);
  }
});

test("EoT matches Meeus worked example (1992-10-13 ≈ +13.7 min)", () => {
  near(equationOfTimeMinutes(1992, 10, 13), 13.7, 0.5, "Meeus EoT");
});

/* --- Longitude correction (boundary cities) ------------------------------ */
test("longitude correction = (lon − stdMeridian) × 4 min, incl. half-hour zones", () => {
  const at = (id) => localTimeCorrection({ ...cityById(id), year: 2000, month: 4, day: 15 });
  near(at("tokyo").longitudeMinutes, 18.77, 0.05, "Tokyo");
  near(at("paris").longitudeMinutes, -50.59, 0.05, "Paris");     // std 15°E, far west
  near(at("istanbul").longitudeMinutes, -64.09, 0.05, "Istanbul"); // std 45°E (UTC+3)
  near(at("delhi").longitudeMinutes, -21.16, 0.05, "Delhi");     // std 82.5°E (UTC+5:30)
  near(at("singapore").longitudeMinutes, -64.72, 0.05, "Singapore"); // std 120°E
  assert.equal(at("delhi").standardMeridian, 82.5); // half-hour zone handled
});

test("total correction = longitude term + EoT", () => {
  const c = localTimeCorrection({ longitude: 2.3522, tzOffsetHours: 1, year: 2000, month: 11, day: 3 });
  near(c.minutes, c.longitudeMinutes + c.eotMinutes, 1e-9, "sum");
  near(c.eotMinutes, equationOfTimeMinutes(2000, 11, 3), 1e-9, "eot component");
});

/* --- Backward compatibility ---------------------------------------------- */
test("no place → localCorrection null and pillars unchanged (JST default)", () => {
  const c = computeChart({ year: 1984, month: 2, day: 5, hour: 10, minute: 30 });
  assert.equal(c.localCorrection, null);
  assert.deepEqual(
    [c.pillars.year.cn, c.pillars.month.cn, c.pillars.day.cn, c.pillars.hour.cn],
    ["甲子", "丙寅", "己巳", "己巳"]
  );
});

/* --- Hour pillar shifts with the correction ------------------------------ */
test("Tokyo (+19 min): hour branch flips 巳 → 午 at 10:55", () => {
  const base = computeChart({ year: 2000, month: 4, day: 15, hour: 10, minute: 55 });
  const tk = computeChart({ year: 2000, month: 4, day: 15, hour: 10, minute: 55, place: cityById("tokyo") });
  assert.equal(base.pillars.hour.branch.cn, "巳");
  assert.equal(tk.pillars.hour.branch.cn, "午");
  near(tk.localCorrection.minutes, 18.8, 0.3, "Tokyo corr");
});

test("Delhi (−21 min) vs Istanbul/Singapore (−64 min) land in different hours at noon", () => {
  const hr = (id) => computeChart({ year: 2000, month: 4, day: 15, hour: 12, minute: 0, place: cityById(id) }).pillars.hour.branch.cn;
  assert.equal(hr("delhi"), "午");      // 11:39 → 午 (11–13)
  assert.equal(hr("istanbul"), "巳");   // 10:56 → 巳 (09–11)
  assert.equal(hr("singapore"), "巳");
});

/* --- Day pillar can cross a boundary ------------------------------------- */
test("Paris (−50 min): a 00:20 birth falls on the previous solar day", () => {
  const base = computeChart({ year: 2000, month: 4, day: 15, hour: 0, minute: 20 });
  const pa = computeChart({ year: 2000, month: 4, day: 15, hour: 0, minute: 20, place: cityById("paris") });
  // day pillar rolls back exactly one place in the 60-cycle
  assert.equal(((base.pillars.day.index - pa.pillars.day.index) % 60 + 60) % 60, 1);
  assert.equal(pa.pillars.day.cn, "壬寅");
  assert.equal(base.pillars.day.cn, "癸卯");
});

/* --- Timezone-correct 立春 boundary (foreign zone) ----------------------- */
test("New York zone is handled at the 2021 立春 (risshun 14:56 UT)", () => {
  const ny = cityById("new-york");
  // 09:00 EST = 14:00 UT (before 14:56) → previous solar year
  assert.equal(computeChart({ year: 2021, month: 2, day: 3, hour: 9, place: ny }).solarYear, 2020);
  // 10:00 EST = 15:00 UT (after 14:56) → new solar year
  assert.equal(computeChart({ year: 2021, month: 2, day: 3, hour: 10, place: ny }).solarYear, 2021);
});

/* --- "Other" (arbitrary longitude + offset) ------------------------------ */
test("custom place (direct longitude + offset) works like a preset", () => {
  const custom = { name: "Custom", longitude: 2.3522, tzOffsetHours: 1 };
  const a = computeChart({ year: 2000, month: 4, day: 15, hour: 0, minute: 20, place: custom });
  const b = computeChart({ year: 2000, month: 4, day: 15, hour: 0, minute: 20, place: cityById("paris") });
  assert.equal(a.pillars.day.cn, b.pillars.day.cn);
  assert.equal(a.pillars.hour.cn, b.pillars.hour.cn);
});

test("localCorrection reports its breakdown and place", () => {
  const c = computeChart({ year: 1990, month: 6, day: 15, hour: 12, place: cityById("sydney") });
  assert.ok(Number.isFinite(c.localCorrection.minutes));
  assert.ok(Number.isFinite(c.localCorrection.longitudeMinutes));
  assert.ok(Number.isFinite(c.localCorrection.eotMinutes));
  assert.equal(c.localCorrection.place.name, "Sydney");
  assert.equal(c.localCorrection.place.tzOffsetHours, 10);
});

test("all 13 preset cities produce a valid chart with a correction", () => {
  for (const city of CITIES) {
    const c = computeChart({ year: 1995, month: 7, day: 20, hour: 8, minute: 15, place: cityById(city.id) });
    assert.ok(c.pillars.day.index >= 0 && c.pillars.day.index < 60, city.name);
    assert.ok(c.localCorrection && Number.isFinite(c.localCorrection.minutes), city.name);
  }
});
