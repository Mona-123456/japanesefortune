/* ==========================================================================
   Tests for reading synthesis + template completeness (node --test).
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { composeReading } from "../assets/js/reading/compose.js";
import { computeChart } from "../assets/js/fourpillars/ganzhi.js";
import { STEMS, ELEMENTS } from "../assets/js/fourpillars/constants.js";

const readings = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/readings.json", import.meta.url)), "utf8")
);

/** Minimal chart shape consumed by composeReading. */
const fakeChart = (stem, element, balanceType) => ({
  dayMaster: { stem, element },
  balance: { type: balanceType },
});

/* --- template completeness ----------------------------------------------- */
test("readings.json has all 10 Day Master templates", () => {
  for (const s of STEMS) {
    assert.equal(typeof readings.dayMaster[s.key], "string", `missing dayMaster.${s.key}`);
    assert.ok(readings.dayMaster[s.key].length > 100);
  }
});

test("readings.json has 5 dominant balance templates + balanced", () => {
  for (const el of ELEMENTS) {
    assert.equal(typeof readings.balance[`${el}_dominant`], "string");
  }
  assert.equal(typeof readings.balance.balanced, "string");
});

test("readings.json has a 2026 year outlook for each element", () => {
  for (const el of ELEMENTS) {
    assert.equal(typeof readings.yearOutlook.byElement[el], "string", `missing year.${el}`);
  }
});

test("required top-level fields exist", () => {
  assert.equal(typeof readings.closing, "string");
  assert.equal(typeof readings.disclaimer, "string");
});

/* --- composition selects the right templates ----------------------------- */
test("compose picks dayMaster by stem key (all 10)", () => {
  for (const s of STEMS) {
    const r = composeReading(fakeChart(s, s.element, "balanced"), readings);
    assert.equal(r.paragraphs.length, 4);
    assert.equal(r.paragraphs[0], readings.dayMaster[s.key]);
    assert.equal(r.keys.dayMaster, s.key);
  }
});

test("compose picks balance by type (all 6)", () => {
  const stem = STEMS[0];
  for (const type of [...ELEMENTS.map((e) => `${e}_dominant`), "balanced"]) {
    const r = composeReading(fakeChart(stem, stem.element, type), readings);
    assert.equal(r.paragraphs[1], readings.balance[type]);
  }
});

test("compose picks year outlook by Day Master element (all 5)", () => {
  for (const el of ELEMENTS) {
    const stem = STEMS.find((s) => s.element === el);
    const r = composeReading(fakeChart(stem, el, "balanced"), readings);
    assert.equal(r.paragraphs[2], readings.yearOutlook.byElement[el]);
  }
});

test("compose appends the closing and reports the disclaimer", () => {
  const r = composeReading(fakeChart(STEMS[0], "wood", "balanced"), readings);
  assert.equal(r.paragraphs[3], readings.closing);
  assert.equal(r.disclaimer, readings.disclaimer);
});

test("{name} placeholder falls back to 'you'", () => {
  const data = { dayMaster: { jia: "Hello {name}." }, balance: { balanced: "b" }, yearOutlook: { byElement: { wood: "y" } }, closing: "c", disclaimer: "d" };
  const r1 = composeReading(fakeChart(STEMS[0], "wood", "balanced"), data);
  assert.equal(r1.paragraphs[0], "Hello you.");
  const r2 = composeReading(fakeChart(STEMS[0], "wood", "balanced"), data, { name: "Mona" });
  assert.equal(r2.paragraphs[0], "Hello Mona.");
});

test("compose throws a clear error if a template is missing", () => {
  const broken = { dayMaster: {}, balance: {}, yearOutlook: { byElement: {} } };
  assert.throws(() => composeReading(fakeChart(STEMS[0], "wood", "balanced"), broken), /missing template/);
});

/* --- balance.type selection (engine) integrates with templates ----------- */
test("engine balance.type resolves to an existing template (dominant + tie cases)", () => {
  // fire-dominant chart
  const fire = computeChart({ year: 1984, month: 2, day: 5, hour: 10, minute: 30 });
  assert.equal(fire.balance.type, "fire_dominant");
  assert.ok(readings.balance[fire.balance.type]);

  // tie for max → balanced
  const tie = computeChart({ year: 2024, month: 6, day: 15 }); // earth2/metal2 tie
  assert.equal(tie.balance.type, "balanced");
  assert.ok(readings.balance[tie.balance.type]);
});

test("end-to-end: computeChart → composeReading yields 4 non-empty paragraphs", () => {
  const chart = computeChart({ year: 1990, month: 6, day: 15, hour: 23, minute: 30 });
  const r = composeReading(chart, readings);
  assert.equal(r.paragraphs.length, 4);
  for (const p of r.paragraphs) assert.ok(p.trim().length > 0);
});
