/* ==========================================================================
   Unit tests for the Four Pillars engine — run with `node --test`.
   --------------------------------------------------------------------------
   Ground truth used here is INDEPENDENT of the engine:
     • Day pillars are anchored on the published relation
       dayIndex = (JDN_noon − 11) mod 60, 甲子 = 0
       (ytliu0.github.io/ChineseCalendar/sexagenary.html — verified: the noon
       JDN of 2019-01-27 is 2458511, which gives 甲子). Cross-checked cases:
         2019-01-27 → 甲子, 2000-01-01 → 戊午, 2024-01-01 → 甲子.
     • 立春 dates match the well-documented record, including the rare Feb-3
       years 2021 and 2025 and the Feb-5 years 1920/1984.
   Boundary cases (立春 and a mid-year 節) are included per spec §2.1 / §6.
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { computeChart } from "../assets/js/fourpillars/ganzhi.js";
import { risshun, solarTermInstant } from "../assets/js/fourpillars/solar-terms.js";
import { julianDayNumberNoon } from "../assets/js/fourpillars/astronomy.js";

const pillars = (c) => [
  c.pillars.year.cn,
  c.pillars.month.cn,
  c.pillars.day.cn,
  c.pillars.hour ? c.pillars.hour.cn : null,
];

/* -------------------------------------------------------------------------
   1. Day-pillar anchor: the verified formula, checked at the reference date.
   ------------------------------------------------------------------------- */
test("JDN noon of 2019-01-27 is 2458511 (anchor)", () => {
  assert.equal(julianDayNumberNoon(2019, 1, 27), 2458511);
});

test("day pillar — 2019-01-27 is 甲子 (published anchor)", () => {
  assert.equal(computeChart({ year: 2019, month: 1, day: 27, hour: 12 }).pillars.day.cn, "甲子");
});

test("day pillar — 2000-01-01 is 戊午", () => {
  assert.equal(computeChart({ year: 2000, month: 1, day: 1, hour: 0 }).pillars.day.cn, "戊午");
});

test("day pillar — 2024-01-01 is 甲子", () => {
  assert.equal(computeChart({ year: 2024, month: 1, day: 1, hour: 12 }).pillars.day.cn, "甲子");
});

/* -------------------------------------------------------------------------
   2. Ten known sample charts (spec §2.1: "既知の生年月日サンプル10件").
      Each fully hand-verifiable from the day anchor + standard 五虎遁/五鼠遁.
   ------------------------------------------------------------------------- */
const SAMPLES = [
  // [label, input, [year, month, day, hour]]
  ["1984-02-05 10:30 (just after 1984 立春 00:24)", { year: 1984, month: 2, day: 5, hour: 10, minute: 30 }, ["甲子", "丙寅", "己巳", "己巳"]],
  ["2000-01-01 00:00 (pre-立春 → 1999 solar year)", { year: 2000, month: 1, day: 1, hour: 0 }, ["己卯", "丙子", "戊午", "壬子"]],
  ["2019-01-27 12:00 (anchor day 甲子)", { year: 2019, month: 1, day: 27, hour: 12 }, ["戊戌", "乙丑", "甲子", "庚午"]],
  ["2024-01-01 12:00 (day 甲子, solar year 2023)", { year: 2024, month: 1, day: 1, hour: 12 }, ["癸卯", "甲子", "甲子", "庚午"]],
  ["2024-06-15 (Dragon year 甲辰)", { year: 2024, month: 6, day: 15, hour: 12 }, ["甲辰", "庚午", "庚戌", "壬午"]],
  ["2026-04-27 09:00 (drama release date)", { year: 2026, month: 4, day: 27, hour: 9 }, ["丙午", "壬辰", "辛未", "癸巳"]],
  ["1990-06-15 23:30 (late 子 hour keeps civil day)", { year: 1990, month: 6, day: 15, hour: 23, minute: 30 }, ["庚午", "壬午", "辛亥", "戊子"]],
  ["2005-08-07 12:00 (before 立秋 → 小暑/未 month)", { year: 2005, month: 8, day: 7, hour: 12 }, ["乙酉", "癸未", "癸亥", "戊午"]],
  ["2005-08-07 23:00 (after 立秋 18:56 → 申 month)", { year: 2005, month: 8, day: 7, hour: 23 }, ["乙酉", "甲申", "癸亥", "壬子"]],
  ["2021-02-03 23:59 (after 立春 23:56 → 2021 solar year)", { year: 2021, month: 2, day: 3, hour: 23, minute: 59 }, ["辛丑", "庚寅", "壬午", "庚子"]],
];

for (const [label, input, expected] of SAMPLES) {
  test(`chart — ${label}`, () => {
    assert.deepEqual(pillars(computeChart(input)), expected);
  });
}

/* -------------------------------------------------------------------------
   3. 立春 (year) boundary — the primary technical risk (spec §6).
      Same civil day, opposite sides of the risshun instant → different year
      AND month pillar; the day pillar is unchanged.
   ------------------------------------------------------------------------- */
test("立春 boundary 2021-02-03: before 23:56 stays in 2020 solar year", () => {
  const c = computeChart({ year: 2021, month: 2, day: 3, hour: 0 });
  assert.equal(c.solarYear, 2020);
  assert.equal(c.pillars.year.cn, "庚子");
  assert.equal(c.monthTerm, "小寒");
  assert.equal(c.pillars.month.cn, "己丑");
});

test("立春 boundary 2021-02-03: after 23:56 enters 2021 solar year", () => {
  const c = computeChart({ year: 2021, month: 2, day: 3, hour: 23, minute: 59 });
  assert.equal(c.solarYear, 2021);
  assert.equal(c.pillars.year.cn, "辛丑");
  assert.equal(c.monthTerm, "立春");
  assert.equal(c.pillars.month.cn, "庚寅");
  // day pillar identical across the boundary
  assert.equal(c.pillars.day.cn, computeChart({ year: 2021, month: 2, day: 3, hour: 0 }).pillars.day.cn);
});

test("立春 boundary 1985-02-04 (risshun 06:13): before → 1984 甲子, after → 1985 乙丑", () => {
  assert.equal(computeChart({ year: 1985, month: 2, day: 4, hour: 5 }).pillars.year.cn, "甲子");
  assert.equal(computeChart({ year: 1985, month: 2, day: 4, hour: 7 }).pillars.year.cn, "乙丑");
});

/* -------------------------------------------------------------------------
   4. Month (節) boundary within a year — 立秋 2005 at 18:56 JST.
   ------------------------------------------------------------------------- */
test("節 boundary 2005-08-07 (立秋 18:56): month branch flips 未 → 申", () => {
  assert.equal(computeChart({ year: 2005, month: 8, day: 7, hour: 12 }).pillars.month.branch.cn, "未");
  assert.equal(computeChart({ year: 2005, month: 8, day: 7, hour: 23 }).pillars.month.branch.cn, "申");
});

/* -------------------------------------------------------------------------
   5. 立春 date validation (well-documented public record).
   ------------------------------------------------------------------------- */
const RISSHUN_DATES = {
  1920: [2, 5], 1984: [2, 5], 2000: [2, 4], 2020: [2, 4],
  2021: [2, 3], 2022: [2, 4], 2024: [2, 4], 2025: [2, 3], 2026: [2, 4],
};
for (const [y, [m, d]] of Object.entries(RISSHUN_DATES)) {
  test(`立春 ${y} falls on ${m}/${d}`, () => {
    const r = risshun(Number(y));
    assert.equal(r.month, m);
    assert.equal(r.day, d);
  });
}

/* -------------------------------------------------------------------------
   6. Day Master, five-element balance, and structural invariants.
   ------------------------------------------------------------------------- */
test("day master is the day-pillar stem with element + polarity", () => {
  const c = computeChart({ year: 1984, month: 2, day: 5, hour: 10, minute: 30 });
  assert.equal(c.dayMaster.cn, "己");
  assert.equal(c.dayMaster.element, "earth");
  assert.equal(c.dayMaster.polarity, "yin");
});

test("element balance counts 8 characters when time is known", () => {
  const c = computeChart({ year: 1984, month: 2, day: 5, hour: 10, minute: 30 });
  const total = Object.values(c.balance.counts).reduce((a, b) => a + b, 0);
  assert.equal(total, 8);
  assert.deepEqual(c.balance.counts, { wood: 2, fire: 3, earth: 2, metal: 0, water: 1 });
  assert.equal(c.balance.dominant, "fire");
  assert.deepEqual(c.balance.lacking, ["metal"]);
});

test("unknown birth time → no hour pillar, 6-character balance, day master intact", () => {
  const c = computeChart({ year: 2024, month: 6, day: 15 });
  assert.equal(c.hasTime, false);
  assert.equal(c.pillars.hour, null);
  const total = Object.values(c.balance.counts).reduce((a, b) => a + b, 0);
  assert.equal(total, 6);
  assert.equal(c.dayMaster.cn, "庚");
});

test("year zodiac reflects the solar year (2024 → Dragon 辰)", () => {
  const c = computeChart({ year: 2024, month: 6, day: 15 });
  assert.equal(c.pillars.year.branch.zodiac, "Dragon");
  assert.equal(c.pillars.year.branch.cn, "辰");
});

test("every pillar index is a valid 0–59 sexagenary combination", () => {
  const c = computeChart({ year: 1984, month: 2, day: 5, hour: 10, minute: 30 });
  for (const key of ["year", "month", "day", "hour"]) {
    const p = c.pillars[key];
    assert.ok(p.index >= 0 && p.index < 60);
    assert.equal(p.index % 10, p.stemIndex);
    assert.equal(p.index % 12, p.branchIndex);
  }
});

test("invalid input throws", () => {
  assert.throws(() => computeChart({ year: 1990.5, month: 1, day: 1 }), TypeError);
  assert.throws(() => computeChart({ month: 1, day: 1 }), TypeError);
});
