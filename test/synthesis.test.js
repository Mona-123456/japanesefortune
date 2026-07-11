/* ==========================================================================
   Phase 2 synthesis SKELETON — `node --test`. Deterministic (no API).
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { computeChart, dayPillarOf } from "../assets/js/fourpillars/ganzhi.js";
import { tenGodsOf, strengthOf, luckPeriods } from "../assets/js/fourpillars/derivation.js";
import { compatibility } from "../assets/js/fourpillars/derivation.js";
import {
  strengthSpinCategory, ageAt, currentLuckPeriod, selectProminentStars,
  teaserFor, buildFreeReading, buildPaidReadingPlan, buildApiMessages,
  buildCompatibilityPlan, DEFAULT_SYSTEM_PROMPT,
} from "../assets/js/reading/synthesis.js";

const load = (p) => JSON.parse(readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8"));
const HIDDEN = load("../data/hidden-stems.json");
const STAGES = load("../data/twelve-stages.json");
const BRANCH_REL = load("../data/branch-relations.json");
const READINGS = load("../data/readings.json");
const DAILY = load("../data/readings-daily.json");
const TEASERS = load("../data/star-teasers.json");          // client-safe (free 1-line)
const WORKER = {                                            // Worker-side paid bodies
  tenGods: load("../worker/readings-ten-gods.json"),
  strengthSpin: load("../worker/readings-strength-spin.json"),
  daiunSpin: load("../worker/readings-daiun-spin.json"),
  readings: READINGS,
};

const GOLD = computeChart({ year: 1970, month: 12, day: 30, hour: 22, minute: 0 });
const GOLD_TG = tenGodsOf(GOLD, HIDDEN);
const GOLD_STR = strengthOf(GOLD);
const GOLD_LUCK = luckPeriods(GOLD, { gender: "female", count: 8 }, STAGES);

/* --- strength spin --------------------------------------------------------- */
test("strengthSpinCategory maps robust→strong, weak→weak, balanced→balanced", () => {
  assert.equal(strengthSpinCategory({ label: "robust" }), "strong");
  assert.equal(strengthSpinCategory({ label: "weak" }), "weak");
  assert.equal(strengthSpinCategory({ label: "balanced" }), "balanced");
  assert.equal(strengthSpinCategory(GOLD_STR), "balanced"); // golden +1 → 中和
});

/* --- current luck period --------------------------------------------------- */
test("ageAt + currentLuckPeriod pick the active 大運", () => {
  assert.equal(ageAt(GOLD, 2026), 56);
  const p = currentLuckPeriod(GOLD_LUCK, 56);
  assert.ok(p && 56 >= p.startAge && 56 < p.endAge);
  assert.equal(currentLuckPeriod(GOLD_LUCK, 0), null); // before the first period (starts age 8)
});

/* --- star selection (§1) --------------------------------------------------- */
test("selectProminentStars: golden = 偏財(month) → 偏官(year) → 劫財(hour)", () => {
  const stars = selectProminentStars(GOLD, GOLD_TG);
  assert.deepEqual(stars.map((s) => s.god), ["fortune", "challenge", "rival"]);
  assert.equal(stars[0].sources[0], "month");     // month is tier 1
  assert.ok(stars.every((s) => !s.isTheme));      // all distinct here
});

test("selectProminentStars: repeated god is merged + flagged as theme", () => {
  const tg = { stems: { month: "fortune", year: "fortune", hour: "rival" }, hidden: { year: [], month: [], day: [], hour: [] } };
  const stars = selectProminentStars({}, tg);
  assert.equal(stars[0].god, "fortune");
  assert.equal(stars[0].isTheme, true);
  assert.deepEqual(stars[0].sources, ["month", "year"]);
  assert.equal(stars[1].god, "rival");
});

test("selectProminentStars: hidden stems folded by default, included on request", () => {
  assert.ok(selectProminentStars(GOLD, GOLD_TG).every((s) => !s.sources.some((x) => x.includes("hidden"))));
  const withHidden = selectProminentStars(GOLD, GOLD_TG, { includeHidden: true, max: 8 });
  assert.ok(withHidden.some((s) => s.sources.some((x) => x.includes("hidden"))));
});

/* --- FREE deterministic reading (§6) --------------------------------------- */
test("buildFreeReading: 命式 + star lineup(name+1line) + 五行 + 年運 + 日運", () => {
  const today = dayPillarOf(2026, 1, 1);
  const free = buildFreeReading(
    { chart: GOLD, tenGods: GOLD_TG, today },
    { readings: READINGS, daily: DAILY, teasers: TEASERS }
  );
  assert.equal(free.mode, "free");
  assert.equal(free.pillars.day.cn, "甲申");
  assert.equal(free.starLineup.length, 3);
  assert.equal(free.starLineup[0].position, "month");
  assert.equal(free.starLineup[0].cn, "偏財");
  assert.ok(free.starLineup[0].teaser.length > 0);            // teaser resolves (shipped manuscript, else label)
  assert.equal(free.fiveElements.counts.wood > 0, true);
  assert.equal(typeof free.yearOutlook, "string");           // 年運 from readings.json
  assert.ok(free.daily && Array.isArray(free.daily.paragraphs)); // 日運
  assert.deepEqual(free.upsell, { spin: true, luck: true, compatibility: true });
});

test("teaserFor: explicit teaser, else a labelled fallback", () => {
  assert.equal(teaserFor("fortune", TEASERS), TEASERS.teasers.fortune);         // shipped manuscript passes through
  assert.ok(TEASERS.teasers.fortune.length > 0);                               // manuscript landed (no longer empty scaffold)
  assert.equal(teaserFor("fortune", { teasers: { fortune: "" } }), "偏財 Star"); // empty → labelled fallback
  assert.equal(teaserFor("fortune", { teasers: { fortune: "One clear line." } }), "One clear line.");
});

/* --- PAID reading plan (§2–3) ---------------------------------------------- */
test("buildPaidReadingPlan: section order + material keys", () => {
  const plan = buildPaidReadingPlan(
    { chart: GOLD, tenGods: GOLD_TG, strength: GOLD_STR, luck: GOLD_LUCK, referenceYear: 2026, name: "Mona" },
    { maxStars: 3 }
  );
  assert.equal(plan.mode, "paid");
  assert.deepEqual(plan.sections.map((s) => s.type), ["day_master", "balance", "star", "star", "star", "year", "closing"]);
  assert.equal(plan.sections[0].key, "jia");                 // Day Master 甲
  assert.equal(plan.strength.spin, "balanced");
  const star = plan.sections.find((s) => s.type === "star");
  assert.equal(star.material.base.key, "fortune");
  assert.equal(star.material.strengthSpin.key, "balanced");
  assert.ok(star.material.daiunSpin && star.material.daiunSpin.god && star.material.daiunSpin.stage); // current 大運 attached
  assert.equal(plan.sections.at(-1).key, "closing_common");
});

/* --- API prompt payload (§4) ---------------------------------------------- */
test("buildApiMessages: Claude-style payload weaving the selected material", () => {
  const plan = buildPaidReadingPlan(
    { chart: GOLD, tenGods: GOLD_TG, strength: GOLD_STR, luck: GOLD_LUCK, referenceYear: 2026, name: "Mona" }, {}
  );
  const req = buildApiMessages(plan, WORKER, { maxTokens: 1500 });
  assert.equal(req.system, DEFAULT_SYSTEM_PROMPT);
  assert.equal(req.max_tokens, 1500);
  assert.equal(req.messages[0].role, "user");
  assert.match(req.messages[0].content, /Day Master: jia/);
  assert.match(req.messages[0].content, /STAR: 偏財/);
  assert.match(req.messages[0].content, /Weave the material/);
});

/* --- Compatibility flow (§5) ---------------------------------------------- */
test("buildCompatibilityPlan: sections + neutral headline (no verdict) for 天戦地冲", () => {
  const A = { pillars: { day: { stemIndex: 0, branchIndex: 0 } } }; // 甲子
  const B = { pillars: { day: { stemIndex: 6, branchIndex: 6 } } }; // 庚午
  const compat = compatibility(A, B, { branchRelations: BRANCH_REL });
  const plan = buildCompatibilityPlan(compat, {
    strengthA: { label: "robust" }, strengthB: { label: "weak" }, names: { a: "A", b: "B" },
  });
  assert.equal(plan.mode, "compatibility");
  assert.deepEqual(plan.sections.map((s) => s.type), ["intro", "stem", "branch", "strength_mesh", "closing"]);
  assert.equal(plan.sections.find((s) => s.type === "stem").key, "ten_sen_chi_chu");
  assert.ok(plan.sections.find((s) => s.type === "branch").keys.includes("clash"));
  assert.equal(plan.sections.find((s) => s.type === "strength_mesh").key, "strong_weak");
  assert.equal(plan.headline.tenSenChiChu, true);
  assert.ok(typeof plan.headline.score === "number");
});
