/* ==========================================================================
   Tests for the daily-fortune (日運) engine + synthesis — `node --test`.
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { dayPillarOf, todayPillar } from "../assets/js/fourpillars/ganzhi.js";
import { computeChart } from "../assets/js/fourpillars/ganzhi.js";
import { ELEMENTS } from "../assets/js/fourpillars/constants.js";
import { dailyRelation, DAILY_RELATIONS, composeDailyReading } from "../assets/js/reading/compose-daily.js";

const daily = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/readings-daily.json", import.meta.url)), "utf8")
);

/* -------------------------------------------------------------------------
   dayPillarOf — the day ganzhi for a civil date. Known samples, including
   solar-term boundary DATES (the day pillar is date-based, so 立春/節 don't
   change it; boundary dates are used here only to build confidence).
   ------------------------------------------------------------------------- */
const DAY_SAMPLES = [
  [2019, 1, 27, "甲子"], // published anchor
  [2000, 1, 1, "戊午"],
  [2024, 1, 1, "甲子"],
  [1984, 2, 5, "己巳"],  // 1984 立春 was Feb 5
  [2021, 2, 3, "壬午"],  // 2021 立春 was Feb 3
  [1985, 2, 4, "甲戌"],  // 1985 立春 was Feb 4 (day pillar verified via JDN 2446101)
];

for (const [y, m, d, cn] of DAY_SAMPLES) {
  test(`dayPillarOf ${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} = ${cn}`, () => {
    assert.equal(dayPillarOf(y, m, d).cn, cn);
  });
}

test("dayPillarOf matches computeChart(...).pillars.day for the same date", () => {
  for (const [y, m, d] of DAY_SAMPLES) {
    assert.equal(dayPillarOf(y, m, d).cn, computeChart({ year: y, month: m, day: d }).pillars.day.cn);
  }
});

test("dayPillarOf exposes stem key / element / index for daily use", () => {
  const p = dayPillarOf(2019, 1, 27); // 甲子
  assert.equal(p.stem.key, "jia");
  assert.equal(p.stem.element, "wood");
  assert.equal(p.index, 0);
});

test("dayPillarOf rejects non-integer input", () => {
  assert.throws(() => dayPillarOf(2020.5, 1, 1), TypeError);
});

test("todayPillar returns a valid pillar consistent with the local date", () => {
  const now = new Date();
  const expected = dayPillarOf(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const t = todayPillar();
  assert.equal(t.cn, expected.cn);
  assert.ok(t.index >= 0 && t.index < 60);
  assert.equal(typeof t.stem.key, "string");
});

/* -------------------------------------------------------------------------
   dailyRelation — Day Master × today five-element relation.
   ------------------------------------------------------------------------- */
test("dailyRelation known cases (from a Wood Day Master)", () => {
  assert.equal(dailyRelation("wood", "wood"), "peer");
  assert.equal(dailyRelation("wood", "fire"), "output");     // wood generates fire
  assert.equal(dailyRelation("wood", "water"), "resource");  // water generates wood
  assert.equal(dailyRelation("wood", "earth"), "wealth");    // wood controls earth
  assert.equal(dailyRelation("wood", "metal"), "authority"); // metal controls wood
});

test("dailyRelation is a bijection over the 5 elements for every Day Master", () => {
  for (const dm of ELEMENTS) {
    const seen = new Set(ELEMENTS.map((t) => dailyRelation(dm, t)));
    assert.equal(seen.size, 5, `DM ${dm} should map the 5 elements to 5 distinct relations`);
    for (const r of seen) assert.ok(DAILY_RELATIONS.includes(r));
  }
});

/* -------------------------------------------------------------------------
   composeDailyReading — key selection + scaffold completeness.
   ------------------------------------------------------------------------- */
test("readings-daily.json scaffold has all 10 general + 5 personal keys", () => {
  for (const k of ["jia", "yi", "bing", "ding", "wu", "ji", "geng", "xin", "ren", "gui"]) {
    assert.ok(Object.prototype.hasOwnProperty.call(daily.general, k), `general.${k}`);
  }
  for (const r of DAILY_RELATIONS) {
    assert.ok(Object.prototype.hasOwnProperty.call(daily.personal, r), `personal.${r}`);
  }
  assert.ok(Object.prototype.hasOwnProperty.call(daily, "closing"));
});

test("compose (general only) picks today's stem + closing", () => {
  const today = dayPillarOf(2019, 1, 27); // 甲子 → stem jia
  const r = composeDailyReading({ today, data: daily });
  assert.equal(r.keys.general, "jia");
  assert.equal(r.keys.relation, null);
  assert.equal(r.dayGanzhi, "甲子");
  assert.equal(r.paragraphs.length, 2); // general + closing (scaffold values are "")
});

test("compose (personal) adds the Day-Master relation paragraph", () => {
  const today = dayPillarOf(2019, 1, 27); // wood day
  const r = composeDailyReading({ today, dayMasterElement: "metal", data: daily });
  assert.equal(r.keys.general, "jia");
  assert.equal(r.keys.relation, "wealth"); // metal controls wood → today(wood) is wealth for a metal DM
  assert.equal(r.paragraphs.length, 3);    // general + personal + closing
});

test("compose scaffold keys resolve for every stem × Day-Master element", () => {
  // Every day-stem and every DM element must select present keys (no throw).
  const dates = [[2019, 1, 27], [2019, 1, 28], [2019, 1, 29], [2019, 1, 30], [2019, 1, 31],
                 [2019, 2, 1], [2019, 2, 2], [2019, 2, 3], [2019, 2, 4], [2019, 2, 5]];
  const stems = new Set();
  for (const [y, m, d] of dates) {
    const today = dayPillarOf(y, m, d);
    stems.add(today.stem.key);
    for (const dm of ELEMENTS) {
      assert.doesNotThrow(() => composeDailyReading({ today, dayMasterElement: dm, data: daily }));
    }
  }
  assert.equal(stems.size, 10, "10 consecutive days cover all 10 day stems");
});

test("compose throws a clear error when a template key is absent", () => {
  const today = dayPillarOf(2019, 1, 27);
  const broken = { general: {}, personal: {}, closing: "" };
  assert.throws(() => composeDailyReading({ today, data: broken }), /missing template/);
});
