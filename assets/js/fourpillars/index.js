/* ==========================================================================
   Four Pillars engine — public entry point.
   Import from here; the internal modules may be refactored.

   Usage:
     import { computeChart } from "/assets/js/fourpillars/index.js";
     const chart = computeChart({ year: 1984, month: 2, day: 5, hour: 10, minute: 30 });
     chart.dayMaster.cn;           // "甲"
     chart.pillars.year.cn;        // "甲子"
     chart.balance.counts.wood;    // number of Wood among the pillars
   ========================================================================== */

export { computeChart, dayPillarOf, todayPillar } from "./ganzhi.js";
export { risshun, solarTermInstant, monthTermBoundaries } from "./solar-terms.js";
export { STEMS, BRANCHES, ELEMENTS, ELEMENT_LABELS } from "./constants.js";
export { CITIES, cityById, localTimeCorrection, equationOfTimeMinutes } from "./localtime.js";
// Phase 2 derivation layer (pure derivations over the four pillars)
export {
  fiveElementRelation,
  tenGod, tenGodsOf, TEN_GODS, TEN_GOD_LABELS,
  hiddenStemsOf,
  twelveStageOf, twelveStagesOf,
  voidBranches,
  strengthOf, classifyStrength, STRENGTH_WEIGHTS, STRENGTH_THRESHOLDS,
  luckDirection, luckPeriods,
  branchRelationsBetween, stemRelationBetween, compatibility, COMPAT_WEIGHTS,
} from "./derivation.js";
