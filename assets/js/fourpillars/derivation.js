/* ==========================================================================
   Phase 2 derivation layer (導出層) — pure functions over the four pillars.
   --------------------------------------------------------------------------
   NO new astronomy: everything derives from what computeChart() already returns
   (year/month/day/hour ganzhi) plus the existing solar-term boundaries. Lookup
   tables live in data/*.json (Mona-editable) and are passed in as arguments so
   these functions stay pure and unit-testable. Interpretation text is out of
   scope (that ships as a separate readings JSON).

   Verified against the golden fixture (1970-12-30 22:00 JST): see test/derivation.test.js.
   ========================================================================== */

import { STEMS, BRANCHES, ELEMENTS } from "./constants.js";
import { pillarFromIndex } from "./ganzhi.js";
import { gregorianToJD } from "./astronomy.js";
import { monthTermBoundaries } from "./solar-terms.js";

const mod = (n, m) => ((n % m) + m) % m;

/* --- five-element relation (canonical; reused by the daily reading) --------- */
const GENERATES = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const CONTROLS = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };

/**
 * Relation of `toEl` seen from `fromEl`:
 *   peer 比和 / output 我生(from→to) / resource 生我(to→from) /
 *   wealth 我剋(from⇒to) / authority 剋我(to⇒from).
 */
export function fiveElementRelation(fromEl, toEl) {
  if (fromEl === toEl) return "peer";
  if (GENERATES[fromEl] === toEl) return "output";
  if (GENERATES[toEl] === fromEl) return "resource";
  if (CONTROLS[fromEl] === toEl) return "wealth";
  if (CONTROLS[toEl] === fromEl) return "authority";
  throw new Error(`invalid element pair: ${fromEl} / ${toEl}`);
}

/* --- §2 通変星 (ten gods) --------------------------------------------------- */
/** peer→[same,diff] polarity → the two gods for each element relation. */
const TEN_GOD_BY_RELATION = {
  peer:      ["peer", "rival"],            // 比肩 / 劫財
  output:    ["creative", "expressive"],   // 食神 / 傷官
  wealth:    ["fortune", "steady_wealth"], // 偏財 / 正財
  authority: ["challenge", "authority"],   // 偏官(七殺) / 正官
  resource:  ["insight", "wisdom"],        // 偏印 / 印綬
};

export const TEN_GODS = [
  "peer", "rival", "creative", "expressive", "fortune",
  "steady_wealth", "challenge", "authority", "insight", "wisdom",
];

export const TEN_GOD_LABELS = {
  peer: "比肩", rival: "劫財", creative: "食神", expressive: "傷官",
  fortune: "偏財", steady_wealth: "正財", challenge: "偏官", authority: "正官",
  insight: "偏印", wisdom: "印綬",
};

/** Ten-god of `otherStemIndex` relative to the Day Master `dayStemIndex`. */
export function tenGod(dayStemIndex, otherStemIndex) {
  const day = STEMS[dayStemIndex];
  const other = STEMS[otherStemIndex];
  const rel = fiveElementRelation(day.element, other.element);
  const samePolarity = day.yin === other.yin;
  return TEN_GOD_BY_RELATION[rel][samePolarity ? 0 : 1];
}

/* --- §1 蔵干 (hidden stems) ------------------------------------------------- */
/** Hidden stems of a branch, from data/hidden-stems.json. */
export function hiddenStemsOf(branchIndex, hiddenTable) {
  const entries = hiddenTable.table[BRANCHES[branchIndex].key] || [];
  return entries.map((e) => ({
    stem: STEMS.find((s) => s.key === e.stem),
    stemIndex: STEMS.findIndex((s) => s.key === e.stem),
    role: e.role,
  }));
}

/**
 * All ten gods of a chart: the year/month/hour stems, plus every branch's
 * hidden stems. The day stem itself is the reference ("self", no god).
 */
export function tenGodsOf(chart, hiddenTable) {
  const dayStem = chart.pillars.day.stemIndex;
  const stemGod = (p) => (p ? tenGod(dayStem, p.stemIndex) : null);
  const hiddenGods = (p) =>
    p ? hiddenStemsOf(p.branchIndex, hiddenTable).map((h) => ({
      stem: h.stem, role: h.role, god: tenGod(dayStem, h.stemIndex),
    })) : [];
  return {
    day: "self",
    stems: { year: stemGod(chart.pillars.year), month: stemGod(chart.pillars.month), hour: stemGod(chart.pillars.hour) },
    hidden: {
      year: hiddenGods(chart.pillars.year),
      month: hiddenGods(chart.pillars.month),
      day: hiddenGods(chart.pillars.day),
      hour: hiddenGods(chart.pillars.hour),
    },
  };
}

/* --- §3 十二運 (twelve life stages) ---------------------------------------- */
export function twelveStageOf(dayStemIndex, branchIndex, stagesTable) {
  const key = stagesTable.table[STEMS[dayStemIndex].key][BRANCHES[branchIndex].key];
  return { key, cn: stagesTable._stage_labels?.[key] ?? key };
}

/** The four pillars' life stages (day master vs each branch). */
export function twelveStagesOf(chart, stagesTable) {
  const dayStem = chart.pillars.day.stemIndex;
  const of = (p) => (p ? twelveStageOf(dayStem, p.branchIndex, stagesTable) : null);
  return {
    year: of(chart.pillars.year),
    month: of(chart.pillars.month),
    day: of(chart.pillars.day),
    hour: of(chart.pillars.hour),
  };
}

/* --- §4 空亡 (void) --------------------------------------------------------- */
/**
 * The two void branches for a day pillar's 60-cycle index. Each 旬 of 10 covers
 * 10 branches; the remaining 2 are void. English "void period" only — the
 * Rokusei-Senjutsu aliases (天冲殺 etc.) are deliberately omitted (spec §4).
 */
export function voidBranches(dayIndex60) {
  const xunStartBranch = mod(Math.floor(mod(dayIndex60, 60) / 10) * 10, 12);
  const b1 = mod(xunStartBranch + 10, 12);
  const b2 = mod(xunStartBranch + 11, 12);
  return { branches: [BRANCHES[b1], BRANCHES[b2]], cn: BRANCHES[b1].cn + BRANCHES[b2].cn };
}

/* --- §5 身強身弱 (strength) ------------------------------------------------- */
/** Tunable weights — centralised for transparency (spec §5). */
export const STRENGTH_WEIGHTS = { resource: +1, authority: -1, monthSupport: +1, stage: 0 };

/**
 * Classification thresholds (tunable). A middle 中和 (balanced) band keeps
 * borderline charts off the extremes — without it, any score ≠ 0 spins hard to
 * 身旺/身弱, which is exactly what strength-spin.md's neutral middle needs to
 * avoid. Default: score in [-2, 2] → balanced.
 *   score >  balancedMax → robust (身旺)
 *   score <  balancedMin → weak   (身弱)
 *   otherwise            → balanced (中和)
 */
export const STRENGTH_THRESHOLDS = { balancedMin: -2, balancedMax: 2 };

/** Classify a numeric strength score into weak / balanced / robust. */
export function classifyStrength(score, t = STRENGTH_THRESHOLDS) {
  if (score > t.balancedMax) return { label: "robust", cn: "身旺" };
  if (score < t.balancedMin) return { label: "weak", cn: "身弱" };
  return { label: "balanced", cn: "中和" };
}

/**
 * Body-strength score. Over the seven non-day-master characters (3 stems + 4
 * branch principal elements): a character that GENERATES the day master
 * (resource/印) adds +1, one that CONTROLS it (authority/官殺) subtracts 1;
 * others are neutral. A month branch that supports the day master (得令) adds a
 * further +1. The twelve-stage term is weight 0 (kept for future tuning).
 * The numeric score is classified via STRENGTH_THRESHOLDS (weak/balanced/robust);
 * the raw score is always returned so the middle band can be re-tuned freely.
 */
export function strengthOf(chart, weights = STRENGTH_WEIGHTS, thresholds = STRENGTH_THRESHOLDS) {
  const dmEl = chart.dayMaster.element;
  const chars = [
    chart.pillars.year?.stem, chart.pillars.month?.stem, chart.pillars.hour?.stem,
    chart.pillars.year?.branch, chart.pillars.month?.branch, chart.pillars.day?.branch, chart.pillars.hour?.branch,
  ].filter(Boolean);

  let generates = 0, controls = 0;
  for (const ch of chars) {
    const rel = fiveElementRelation(dmEl, ch.element);
    if (rel === "resource") generates += 1;
    else if (rel === "authority") controls += 1;
  }
  const monthRel = fiveElementRelation(dmEl, chart.pillars.month.branch.element);
  const monthSupport = monthRel === "resource" || monthRel === "peer" ? 1 : 0;

  const score =
    generates * weights.resource +
    controls * weights.authority +
    monthSupport * weights.monthSupport;

  const { label, cn } = classifyStrength(score, thresholds);
  return {
    score,
    label,   // weak (身弱) | balanced (中和) | robust (身旺)
    cn,
    detail: { generates, controls, monthSupport, dayMasterElement: dmEl },
  };
}

/* --- §6 大運 (10-year luck periods) ---------------------------------------- */
/** Forward if (yang year × male) or (yin year × female); else backward. */
export function luckDirection(chart, gender) {
  const yearYang = !chart.pillars.year.stem.yin;
  const male = gender === "male";
  const forward = (yearYang && male) || (!yearYang && !male);
  return forward ? "forward" : "backward";
}

/**
 * 大運. Direction per luckDirection(); start age = days from birth to the next
 * (forward) or previous (backward) 節 boundary ÷ 3. Periods advance the month
 * pillar ±1 per decade; each carries its ten-god and life-stage.
 * @param {object} chart @param {object} opts { gender, count=8 }
 * @param {object} stagesTable data/twelve-stages.json (for each period's stage)
 */
export function luckPeriods(chart, { gender, count = 8 }, stagesTable) {
  const direction = luckDirection(chart, gender);
  const forward = direction === "forward";

  const { year, month, day, hour } = chart.input;
  const tz = typeof chart.input.tz === "number" ? chart.input.tz : 9; // JST default
  const effHour = hour == null ? 12 : hour;
  const birthUT = gregorianToJD(year, month, day, effHour, chart.input.minute ?? 0) - tz / 24;

  // Bracketing 節 boundaries (UT). monthTermBoundaries spans prev-大雪 … next-小寒.
  const bounds = [
    ...monthTermBoundaries(year - 1),
    ...monthTermBoundaries(year),
    ...monthTermBoundaries(year + 1),
  ].map((b) => b.jdUT).sort((a, b) => a - b);
  const next = bounds.find((jd) => jd > birthUT);
  const prev = [...bounds].reverse().find((jd) => jd <= birthUT);
  const startDays = forward ? next - birthUT : birthUT - prev;
  const startAgeYears = Math.round(startDays / 3);

  const dayStem = chart.pillars.day.stemIndex;
  const step = forward ? 1 : -1;
  const periods = [];
  for (let i = 1; i <= count; i++) {
    const p = pillarFromIndex(mod(chart.pillars.month.index + step * i, 60));
    const startAge = startAgeYears + (i - 1) * 10;
    periods.push({
      index: i,
      startAge,
      endAge: startAge + 10,
      pillar: p,
      cn: p.cn,
      tenGod: tenGod(dayStem, p.stemIndex),
      stage: twelveStageOf(dayStem, p.branchIndex, stagesTable).key,
    });
  }

  return { direction, startAgeYears, startDays, periods };
}

/* --- §7 相性 (compatibility) ----------------------------------------------- */
/** Relations between two branches, from data/branch-relations.json. */
export function branchRelationsBetween(b1, b2, branchTable) {
  const k1 = BRANCHES[b1].key, k2 = BRANCHES[b2].key;
  const has = (pairs) => pairs.some(([a, b]) => (a === k1 && b === k2) || (a === k2 && b === k1));
  const out = [];
  const B = branchTable.branch;
  if (has(B.combine_six.pairs)) out.push("combine_six");
  if (B.combine_three.groups.some((g) => g.branches.includes(k1) && g.branches.includes(k2))) out.push("combine_three");
  if (has(B.clash.pairs)) out.push("clash");
  if (has(B.harm.pairs)) out.push("harm");
  if (has(B.break.pairs)) out.push("break");
  if (B.punish.triads.some((t) => t.includes(k1) && t.includes(k2) && k1 !== k2)) out.push("punish");
  if (B.punish.mutual.some(([a, b]) => (a === k1 && b === k2) || (a === k2 && b === k1))) out.push("punish");
  if (k1 === k2 && B.punish.self.includes(k1)) out.push("punish_self");
  return out;
}

/** Relation between two day stems: five-element relation, control flag, 干合 flag. */
export function stemRelationBetween(s1, s2, stemTable) {
  const e1 = STEMS[s1].element, e2 = STEMS[s2].element;
  const relation = fiveElementRelation(e1, e2);
  const control = relation === "wealth" || relation === "authority"; // 天干剋 (either direction)
  const k1 = STEMS[s1].key, k2 = STEMS[s2].key;
  const combine = stemTable.stem.combine.pairs.some(
    ([a, b]) => (a === k1 && b === k2) || (a === k2 && b === k1)
  );
  return { relation, control, combine };
}

/** Tunable compatibility weights (neutral inputs; interpretation is elsewhere). */
export const COMPAT_WEIGHTS = {
  day_stem_combine: +3, day_branch_combine_six: +3, day_branch_combine_three: +2,
  day_branch_clash: -3, day_branch_harm: -1, day_branch_break: -1, day_branch_punish: -2,
  ten_sen_chi_chu: -2,
};

/**
 * Compatibility between two charts, based on the two DAY pillars (self axis).
 * Returns a neutral composite score + flags. NO verdicts — the "0 points / you
 * break up" style is deliberately excluded (spec §7). Formula centralised/tunable.
 */
export function compatibility(chartA, chartB, tables, weights = COMPAT_WEIGHTS) {
  const sA = chartA.pillars.day.stemIndex, sB = chartB.pillars.day.stemIndex;
  const bA = chartA.pillars.day.branchIndex, bB = chartB.pillars.day.branchIndex;

  const stem = stemRelationBetween(sA, sB, tables.branchRelations);
  const branchRels = branchRelationsBetween(bA, bB, tables.branchRelations);

  const flags = {
    day_stem_combine: stem.combine,
    day_branch_combine_six: branchRels.includes("combine_six"),
    day_branch_combine_three: branchRels.includes("combine_three"),
    day_branch_clash: branchRels.includes("clash"),
    day_branch_harm: branchRels.includes("harm"),
    day_branch_break: branchRels.includes("break"),
    day_branch_punish: branchRels.includes("punish"),
    // 天戦地冲: day stems control each other AND day branches clash.
    ten_sen_chi_chu: stem.control && branchRels.includes("clash"),
  };

  let score = 0;
  for (const [k, on] of Object.entries(flags)) if (on && weights[k]) score += weights[k];

  return { score, flags, stemRelation: stem, branchRelations: branchRels };
}
