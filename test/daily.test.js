/* ==========================================================================
   Tests for the daily-fortune (日運) engine + synthesis — `node --test`.
   Content: data/readings-daily.json (10 general + 50 personal + cta + closing).
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { dayPillarOf, todayPillar, computeChart } from "../assets/js/fourpillars/ganzhi.js";
import { STEMS, ELEMENTS } from "../assets/js/fourpillars/constants.js";
import {
  dailyRelation, DAILY_RELATIONS, generalKeyFor, personalKeyFor, composeDailyReading,
} from "../assets/js/reading/compose-daily.js";

const daily = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/readings-daily.json", import.meta.url)), "utf8")
);

/* -------------------------------------------------------------------------
   dayPillarOf / todayPillar — the day ganzhi for a civil date.
   Known samples, incl. 立春-boundary DATES (the day pillar is date-based, so
   the solar-term boundaries never change it — used here only for confidence).
   ------------------------------------------------------------------------- */
const DAY_SAMPLES = [
  [2019, 1, 27, "甲子"], // published anchor
  [2000, 1, 1, "戊午"],
  [2024, 1, 1, "甲子"],
  [1984, 2, 5, "己巳"],  // 1984 立春 was Feb 5
  [2021, 2, 3, "壬午"],  // 2021 立春 was Feb 3
  [1985, 2, 4, "甲戌"],  // 1985 立春 was Feb 4 (day pillar via JDN 2446101)
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

test("dayPillarOf rejects non-integer input", () => {
  assert.throws(() => dayPillarOf(2020.5, 1, 1), TypeError);
});

test("todayPillar is consistent with the viewer's local date", () => {
  const now = new Date();
  const t = todayPillar();
  assert.equal(t.cn, dayPillarOf(now.getFullYear(), now.getMonth() + 1, now.getDate()).cn);
  assert.ok(t.index >= 0 && t.index < 60);
});

/* -------------------------------------------------------------------------
   Key builders.
   ------------------------------------------------------------------------- */
test("generalKeyFor maps the day stem to general_{element}_{yinyang}", () => {
  assert.equal(generalKeyFor(dayPillarOf(2019, 1, 27)), "general_wood_yang");  // 甲
  assert.equal(generalKeyFor(dayPillarOf(2000, 1, 1)), "general_earth_yang");  // 戊午 → 戊
  assert.equal(generalKeyFor(dayPillarOf(2021, 2, 3)), "general_water_yang");  // 壬午 → 壬
});

test("personalKeyFor maps Day-Master stem × today element", () => {
  assert.equal(personalKeyFor("jia", dayPillarOf(2019, 1, 27)), "personal_jia_wood");
  assert.equal(personalKeyFor("geng", dayPillarOf(2021, 2, 3)), "personal_geng_water");
});

/* -------------------------------------------------------------------------
   dailyRelation — used to VALIDATE the 50 personal keys are consistent.
   ------------------------------------------------------------------------- */
test("dailyRelation known cases (Wood Day Master)", () => {
  assert.equal(dailyRelation("wood", "wood"), "peer");
  assert.equal(dailyRelation("wood", "fire"), "output");
  assert.equal(dailyRelation("wood", "water"), "resource");
  assert.equal(dailyRelation("wood", "earth"), "wealth");
  assert.equal(dailyRelation("wood", "metal"), "authority");
});

test("dailyRelation is a bijection over the 5 elements for every Day Master", () => {
  for (const dm of ELEMENTS) {
    const seen = new Set(ELEMENTS.map((t) => dailyRelation(dm, t)));
    assert.equal(seen.size, 5, dm);
    for (const r of seen) assert.ok(DAILY_RELATIONS.includes(r));
  }
});

/* -------------------------------------------------------------------------
   Content completeness (10 + 50 + cta + closing).
   ------------------------------------------------------------------------- */
test("readings-daily.json has all 10 general keys, non-empty", () => {
  for (const s of STEMS) {
    const k = `general_${s.element}_${s.yin ? "yin" : "yang"}`;
    assert.equal(typeof daily.general[k], "string", k);
    assert.ok(daily.general[k].length > 60, k);
  }
});

test("readings-daily.json has all 50 personal keys, non-empty, each with {name}", () => {
  for (const s of STEMS) {
    for (const el of ELEMENTS) {
      const k = `personal_${s.key}_${el}`;
      assert.equal(typeof daily.personal[k], "string", k);
      assert.ok(daily.personal[k].length > 80, k);
      assert.ok(daily.personal[k].includes("{name}"), `${k} should carry a {name} placeholder`);
    }
  }
  assert.equal(Object.keys(daily.personal).length, 50);
});

test("daily_cta, daily_closing, disclaimer present", () => {
  for (const k of ["daily_cta", "daily_closing", "disclaimer"]) {
    assert.equal(typeof daily[k], "string");
    assert.ok(daily[k].length > 20, k);
  }
});

/* -------------------------------------------------------------------------
   Composition.
   ------------------------------------------------------------------------- */
test("general-only reading = general + daily_cta", () => {
  const r = composeDailyReading({ today: dayPillarOf(2019, 1, 27), data: daily });
  assert.equal(r.keys.general, "general_wood_yang");
  assert.equal(r.keys.personal, null);
  assert.equal(r.keys.tail, "daily_cta");
  assert.equal(r.relation, null);
  assert.equal(r.paragraphs.length, 2);
  assert.equal(r.paragraphs[0], daily.general.general_wood_yang);
  assert.equal(r.paragraphs[1], daily.daily_cta);
  assert.equal(r.dayGanzhi, "甲子");
});

test("personal reading = general + personal + daily_closing, with relation reported", () => {
  const today = dayPillarOf(2019, 1, 27); // wood day
  const r = composeDailyReading({ today, dayMasterStemKey: "geng", name: "Mona", data: daily });
  assert.equal(r.keys.general, "general_wood_yang");
  assert.equal(r.keys.personal, "personal_geng_wood");
  assert.equal(r.keys.tail, "daily_closing");
  assert.equal(r.relation, "wealth"); // metal(庚) controls wood(today) → today is wealth
  assert.equal(r.paragraphs.length, 3);
  assert.match(r.paragraphs[1], /Mona/);        // {name} substituted
  assert.doesNotMatch(r.paragraphs[1], /\{name\}/);
});

test("{name} falls back to 'you' when no name is given", () => {
  const r = composeDailyReading({ today: dayPillarOf(2019, 1, 27), dayMasterStemKey: "jia", data: daily });
  assert.match(r.paragraphs[1], /\byou\b/);
  assert.doesNotMatch(r.paragraphs[1], /\{name\}/);
});

test("every Day-Master × every day-stem composes and resolves keys", () => {
  // 10 consecutive days cover all 10 day stems; × 10 Day Masters = full matrix.
  const dates = [[2019, 1, 27], [2019, 1, 28], [2019, 1, 29], [2019, 1, 30], [2019, 1, 31],
                 [2019, 2, 1], [2019, 2, 2], [2019, 2, 3], [2019, 2, 4], [2019, 2, 5]];
  const stemsSeen = new Set();
  for (const [y, m, d] of dates) {
    const today = dayPillarOf(y, m, d);
    stemsSeen.add(today.stem.key);
    for (const dm of STEMS) {
      assert.doesNotThrow(() =>
        composeDailyReading({ today, dayMasterStemKey: dm.key, data: daily }));
    }
  }
  assert.equal(stemsSeen.size, 10);
});

test("compose throws a clear error if a template key is absent", () => {
  const broken = { general: {}, personal: {}, daily_cta: "x" };
  assert.throws(() => composeDailyReading({ today: dayPillarOf(2019, 1, 27), data: broken }), /missing template/);
});
