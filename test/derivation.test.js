/* ==========================================================================
   Phase 2 derivation layer — `node --test`.
   Golden fixture: 1970-12-30 22:00 JST (from マニアック四柱推命.html), spec §8.
   ========================================================================== */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { computeChart } from "../assets/js/fourpillars/ganzhi.js";
import {
  fiveElementRelation, tenGod, tenGodsOf, hiddenStemsOf,
  twelveStageOf, twelveStagesOf, voidBranches, strengthOf,
  luckDirection, luckPeriods, branchRelationsBetween, stemRelationBetween, compatibility,
} from "../assets/js/fourpillars/derivation.js";

const load = (p) => JSON.parse(readFileSync(fileURLToPath(new URL(p, import.meta.url)), "utf8"));
const HIDDEN = load("../data/hidden-stems.json");
const STAGES = load("../data/twelve-stages.json");
const BRANCH_REL = load("../data/branch-relations.json");

// --- The golden chart ------------------------------------------------------
const GOLD = computeChart({ year: 1970, month: 12, day: 30, hour: 22, minute: 0 });

test("golden four pillars = 庚戌 戊子 甲申 乙亥 (Day Master 甲)", () => {
  assert.deepEqual(
    [GOLD.pillars.year.cn, GOLD.pillars.month.cn, GOLD.pillars.day.cn, GOLD.pillars.hour.cn],
    ["庚戌", "戊子", "甲申", "乙亥"]
  );
  assert.equal(GOLD.dayMaster.cn, "甲");
});

/* --- §2 通変星 ------------------------------------------------------------- */
test("ten gods (hour/month/year) = 劫財 / 偏財 / 偏官", () => {
  const g = tenGodsOf(GOLD, HIDDEN);
  assert.equal(g.stems.hour, "rival");       // 乙 → 劫財
  assert.equal(g.stems.month, "fortune");    // 戊 → 偏財
  assert.equal(g.stems.year, "challenge");   // 庚 → 偏官
  assert.equal(g.day, "self");
  // hidden-stem gods are produced too (month 子 hides 癸 → 印綬/wisdom for 甲)
  assert.equal(g.hidden.month[0].god, "wisdom");
});

test("tenGod direct: same polarity → 偏, different → 正/劫", () => {
  assert.equal(tenGod(0, 1), "rival");   // 甲(yang) vs 乙(yin) wood → 劫財
  assert.equal(tenGod(0, 4), "fortune"); // 甲 vs 戊(yang) earth → 偏財
  assert.equal(tenGod(0, 5), "steady_wealth"); // 甲 vs 己(yin) earth → 正財
});

/* --- §1 蔵干 --------------------------------------------------------------- */
test("hidden stems: 子=[癸], 申=[庚,壬,戊] with roles", () => {
  const zi = hiddenStemsOf(0, HIDDEN);
  assert.deepEqual(zi.map((h) => h.stem.key), ["gui"]);
  assert.equal(zi[0].role, "primary");
  const shen = hiddenStemsOf(8, HIDDEN);
  assert.deepEqual(shen.map((h) => h.stem.key), ["geng", "ren", "wu"]);
  assert.deepEqual(shen.map((h) => h.role), ["primary", "middle", "residual"]);
});

/* --- §3 十二運 ------------------------------------------------------------- */
test("twelve stages (hour/day/month/year) = 長生 / 絶 / 沐浴 / 養", () => {
  const s = twelveStagesOf(GOLD, STAGES);
  assert.equal(s.hour.key, "chosei");   // 亥
  assert.equal(s.day.key, "zetsu");     // 申
  assert.equal(s.month.key, "mokuyoku");// 子
  assert.equal(s.year.key, "yo");       // 戌
  assert.equal(s.hour.cn, "長生");
});

test("twelve-stage anchors for Day Master 甲 (spec §3)", () => {
  const st = (br) => twelveStageOf(0, br, STAGES).key;
  assert.equal(st(11), "chosei");   // 亥 長生
  assert.equal(st(8), "zetsu");     // 申 絶
  assert.equal(st(0), "mokuyoku");  // 子 沐浴
  assert.equal(st(10), "yo");       // 戌 養
});

/* --- §4 空亡 --------------------------------------------------------------- */
test("void branches for the golden (day 甲申) = 午未", () => {
  assert.equal(voidBranches(GOLD.pillars.day.index).cn, "午未");
});

test("void branches by 旬: 甲子旬 → 戌亥, 甲寅旬 → 子丑", () => {
  assert.equal(voidBranches(0).cn, "戌亥");   // 甲子 (index 0)
  assert.equal(voidBranches(50).cn, "子丑");  // 甲寅 (index 50)
});

/* --- §5 身強身弱 ----------------------------------------------------------- */
test("strength of the golden = 身旺 (robust), score > 0", () => {
  const s = strengthOf(GOLD);
  assert.equal(s.label, "robust");
  assert.equal(s.cn, "身旺");
  assert.ok(s.score > 0, `score ${s.score}`);
  assert.equal(s.detail.generates, 2); // 子, 亥 (water → wood)
  assert.equal(s.detail.controls, 2);  // 庚, 申 (metal → wood)
});

/* --- §6 大運 --------------------------------------------------------------- */
test("luck direction: 陽年×女 → backward (golden is 逆行)", () => {
  assert.equal(luckDirection(GOLD, "female"), "backward"); // 庚(yang) × female
  assert.equal(luckDirection(GOLD, "male"), "forward");
});

test("luck periods: golden (female) = 逆行, ~8-year start", () => {
  const dy = luckPeriods(GOLD, { gender: "female", count: 8 }, STAGES);
  assert.equal(dy.direction, "backward");
  assert.equal(dy.startAgeYears, 8);
  assert.equal(dy.periods.length, 8);
  // first period = month pillar stepped back one in the 60-cycle
  assert.equal(dy.periods[0].pillar.index, ((GOLD.pillars.month.index - 1) % 60 + 60) % 60);
  // each period carries a ten-god + stage
  assert.ok(dy.periods.every((p) => p.tenGod && p.stage && p.endAge - p.startAge === 10));
});

test("boundary: forward + backward start-days span the two bracketing 節", () => {
  const fwd = luckPeriods(GOLD, { gender: "male" }, STAGES).startDays;   // to next 節
  const bwd = luckPeriods(GOLD, { gender: "female" }, STAGES).startDays; // to prev 節
  assert.ok(fwd > 0 && bwd > 0);
  assert.ok(fwd + bwd > 25 && fwd + bwd < 33, `span ${fwd + bwd}`); // one 節 interval ≈ 30 days
});

/* --- §7 相性 --------------------------------------------------------------- */
test("branch relations: clash / combine / triad / harm / punish", () => {
  assert.ok(branchRelationsBetween(0, 6, BRANCH_REL).includes("clash"));        // 子午 冲
  assert.ok(branchRelationsBetween(0, 1, BRANCH_REL).includes("combine_six"));  // 子丑 支合
  assert.ok(branchRelationsBetween(8, 0, BRANCH_REL).includes("combine_three"));// 申子(辰) 三合
  assert.ok(branchRelationsBetween(0, 7, BRANCH_REL).includes("harm"));         // 子未 六害
  assert.ok(branchRelationsBetween(2, 5, BRANCH_REL).includes("punish"));       // 寅巳(申) 刑
  assert.ok(branchRelationsBetween(4, 4, BRANCH_REL).includes("punish_self"));  // 辰辰 自刑
});

test("stem relation: 甲己 干合, 甲庚 天干剋", () => {
  assert.equal(stemRelationBetween(0, 5, BRANCH_REL).combine, true);  // 甲己
  assert.equal(stemRelationBetween(0, 6, BRANCH_REL).control, true);  // 庚剋甲
});

test("compatibility detects 天戦地冲 (day stems 剋 + day branches 冲)", () => {
  const A = { pillars: { day: { stemIndex: 0, branchIndex: 0 } } }; // 甲子
  const B = { pillars: { day: { stemIndex: 6, branchIndex: 6 } } }; // 庚午
  const r = compatibility(A, B, { branchRelations: BRANCH_REL });
  assert.equal(r.flags.ten_sen_chi_chu, true);
  assert.equal(r.flags.day_branch_clash, true);
  assert.ok(r.score < 0);
});

test("compatibility: harmonious pair (干合 + 支合) scores positive, no clash", () => {
  const A = { pillars: { day: { stemIndex: 0, branchIndex: 0 } } }; // 甲子
  const B = { pillars: { day: { stemIndex: 5, branchIndex: 1 } } }; // 己丑
  const r = compatibility(A, B, { branchRelations: BRANCH_REL });
  assert.equal(r.flags.day_stem_combine, true);        // 甲己 干合
  assert.equal(r.flags.day_branch_combine_six, true);  // 子丑 支合
  assert.equal(r.flags.day_branch_clash, false);
  assert.ok(r.score > 0);
});

/* --- reuse: daily reading still uses the canonical relation ---------------- */
test("fiveElementRelation basics", () => {
  assert.equal(fiveElementRelation("wood", "wood"), "peer");
  assert.equal(fiveElementRelation("wood", "fire"), "output");
  assert.equal(fiveElementRelation("wood", "metal"), "authority");
});
