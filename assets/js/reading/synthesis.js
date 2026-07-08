/* ==========================================================================
   Phase 2 synthesis layer (合成層) — SKELETON.
   --------------------------------------------------------------------------
   Turns derivation values + manuscripts into one reading, per
   docs/phase2-synthesis-spec.md. Two modes:
     • FREE  (§6): client, deterministic — 命式 + star name-and-one-line + 五行
       + 年運 + 日運. No API, no full paid bodies.
     • PAID  (§2–4): the Worker weaves base + strength-spin + daiun-spin into one
       piece via the API. Here we only PLAN (select stars, pick material keys)
       and ASSEMBLE the prompt payload — the actual API/Worker/Stripe wiring is
       gated for later (課金はゲート後).

   All functions are pure and DOM-free. Manuscripts (readings-*.json) are passed
   in, so this works once クロちゃん's content lands (scaffolds resolve to "").
   ========================================================================== */

import { TEN_GOD_LABELS } from "../fourpillars/derivation.js";
import { ELEMENT_LABELS } from "../fourpillars/constants.js";
import { composeDailyReading } from "./compose-daily.js";

/* --- strength spin (§2.2) -------------------------------------------------- */
/** classifyStrength label → strength-spin manuscript category. */
export const STRENGTH_SPIN_CATEGORY = { robust: "strong", weak: "weak", balanced: "balanced" };
export function strengthSpinCategory(strength) {
  return STRENGTH_SPIN_CATEGORY[strength.label];
}

/* --- current 大運 (§2.3) --------------------------------------------------- */
/** Approx age (years) at a reference year, from the birth (Gregorian) year. */
export function ageAt(chart, referenceYear) {
  return referenceYear - chart.input.year;
}
/** The luck period active at `age`, or null if before the first period. */
export function currentLuckPeriod(luck, age) {
  if (age == null) return null;
  return luck.periods.find((p) => age >= p.startAge && age < p.endAge) || null;
}

/* --- star selection (§1) --------------------------------------------------- */
/**
 * Choose the prominent ten-god stars to foreground. Prominence order:
 * month stem (tier 1) → year/hour stems (tier 2) → hidden stems (tier 3,
 * secondary, folded by default). A god appearing in several pillars is merged
 * once and flagged `isTheme` ("複数の柱に現れる＝主題").
 * @returns {Array<{god,cn,sources:string[],tier:number,isTheme:boolean}>}
 */
export function selectProminentStars(chart, tenGods, { includeHidden = false, max = 3 } = {}) {
  const candidates = [
    { pos: "month", god: tenGods.stems.month, tier: 1 },
    { pos: "year", god: tenGods.stems.year, tier: 2 },
    { pos: "hour", god: tenGods.stems.hour, tier: 2 },
  ];
  if (includeHidden) {
    for (const [pillar, arr] of Object.entries(tenGods.hidden)) {
      for (const h of arr) candidates.push({ pos: `${pillar}_hidden`, god: h.god, tier: 3, role: h.role });
    }
  }

  const byGod = new Map();
  for (const c of candidates) {
    if (!c.god) continue; // day stem is self → no god
    if (!byGod.has(c.god)) byGod.set(c.god, { god: c.god, cn: TEN_GOD_LABELS[c.god], sources: [], tier: c.tier });
    const e = byGod.get(c.god);
    e.sources.push(c.pos);
    e.tier = Math.min(e.tier, c.tier);
  }

  return [...byGod.values()]
    .map((e) => ({ ...e, isTheme: e.sources.length > 1 }))
    .sort((a, b) => a.tier - b.tier || (b.isTheme - a.isTheme))
    .slice(0, max);
}

/* --- FREE deterministic reading (§6) --------------------------------------- */
/**
 * Free one-line teaser for a star, from data/star-teasers.json (client-safe;
 * the paid base bodies live Worker-side, spec §0). Empty scaffold → a labelled
 * fallback. (The interim "reuse the body's first sentence" is a build-time step
 * that generates star-teasers.json from the Worker manuscripts — not runtime.)
 */
export function teaserFor(godKey, teasers) {
  const t = teasers?.teasers?.[godKey];
  return (t && t.trim()) || `${TEN_GOD_LABELS[godKey]} Star`;
}

const pillarView = (p) => (p ? { cn: p.cn, stem: p.stem.cn, branch: p.branch.cn, romaji: p.romaji } : null);

/**
 * The free reading (deterministic, no API): 命式 + ten-god name-and-one-line
 * lineup + 五行 + 年運 + 日運. Spins / 大運 / full compatibility are paid-only.
 */
export function buildFreeReading({ chart, tenGods, today }, { readings, daily, teasers, name } = {}) {
  const dmEl = chart.dayMaster.element;
  const lineup = ["month", "year", "hour"]
    .map((pos) => {
      const god = tenGods.stems[pos];
      if (!god) return null;
      return { position: pos, god, cn: TEN_GOD_LABELS[god], teaser: teaserFor(god, teasers) };
    })
    .filter(Boolean);

  return {
    mode: "free",
    pillars: {
      year: pillarView(chart.pillars.year), month: pillarView(chart.pillars.month),
      day: pillarView(chart.pillars.day), hour: pillarView(chart.pillars.hour),
    },
    dayMaster: { cn: chart.dayMaster.cn, element: dmEl, polarity: chart.dayMaster.polarity },
    starLineup: lineup,                       // 名指し + 1行
    fiveElements: chart.balance,              // 五行（表示）
    yearOutlook: readings?.yearOutlook?.byElement?.[dmEl] ?? null, // 年運
    daily: today && daily ? composeDailyReading({ today, dayMasterStemKey: chart.dayMaster.stem.key, name, data: daily }) : null, // 日運
    upsell: { spin: true, luck: true, compatibility: true }, // これらは有料
  };
}

/* --- PAID reading plan (§2–3) ---------------------------------------------- */
/**
 * Plan the paid reading: section order (§3) + the manuscript material KEYS for
 * each foregrounded star (§2). This is the recipe the Worker hands to the API —
 * no prose is produced here.
 */
export function buildPaidReadingPlan(
  { chart, tenGods, strength, luck, referenceYear, name },
  { maxStars = 3, includeHidden = false } = {}
) {
  const spin = strengthSpinCategory(strength);
  const age = referenceYear != null ? ageAt(chart, referenceYear) : null;
  const period = luck ? currentLuckPeriod(luck, age) : null;
  const stars = selectProminentStars(chart, tenGods, { includeHidden, max: maxStars });

  const sections = [
    { type: "day_master", key: chart.dayMaster.stem.key, element: chart.dayMaster.element, polarity: chart.dayMaster.polarity },
    { type: "balance", key: chart.balance.type, counts: chart.balance.counts },
    ...stars.map((s) => ({
      type: "star",
      god: s.god, cn: s.cn, sources: s.sources, isTheme: s.isTheme,
      material: {
        base: { table: "tenGods", key: s.god },              // §2.1
        strengthSpin: { table: "strengthSpin", key: spin },  // §2.2
        daiunSpin: period ? { god: period.tenGod, stage: period.stage } : null, // §2.3
      },
    })),
    { type: "year", key: chart.dayMaster.element },   // 年運 (readings.yearOutlook.byElement)
    { type: "closing", key: "closing_common" },
  ];

  return {
    mode: "paid",
    sections,
    strength: { label: strength.label, cn: strength.cn, score: strength.score, spin },
    luckPeriod: period,
    name: name || "you",
  };
}

/* --- API prompt payload (§4) ---------------------------------------------- */
export const DEFAULT_SYSTEM_PROMPT = [
  "You are the house voice of a Japanese fortune-telling site. Write in English.",
  "Gloss any kanji as \"Name Star (漢字)\" on first use.",
  "Never assert the future: use \"is said to\", \"traditionally associated with\", \"tends to\".",
  "No medical, legal, or financial advice. Never frame anything as doom — land every reading forward-looking.",
  "You are given manuscript modules as raw material. WEAVE them into one flowing passage — never concatenate them; remove repetition; keep one consistent voice.",
].join(" ");

function moduleText(ref, manuscripts) {
  if (!ref) return "";
  if (ref.table === "tenGods") return manuscripts.tenGods?.gods?.[ref.key]?.base ?? "";
  if (ref.table === "strengthSpin") return manuscripts.strengthSpin?.categories?.[ref.key] ?? "";
  return "";
}
function daiunText(ref, manuscripts) {
  if (!ref) return "";
  const g = manuscripts.daiunSpin?.by_god?.[ref.god] ?? "";
  const s = manuscripts.daiunSpin?.by_stage?.[ref.stage] ?? "";
  return [g, s].filter(Boolean).join(" ");
}

/**
 * Assemble the API request payload for the paid reading (§4). Pulls the chosen
 * manuscript modules and formats a user message; returns a Claude-style request
 * object. The Worker performs the actual fetch (out of scope here).
 */
export function buildApiMessages(plan, manuscripts, config = {}) {
  const lines = [];
  lines.push(`Day Master: ${plan.sections[0].key} (${plan.sections[0].polarity} ${plan.sections[0].element}).`);
  lines.push(`Body strength: ${plan.strength.label} (中和/身旺/身弱 = ${plan.strength.cn}); raw score ${plan.strength.score}; strength-spin category "${plan.strength.spin}".`);
  if (plan.luckPeriod) lines.push(`Current 10-year luck: ten-god "${plan.luckPeriod.tenGod}", life-stage "${plan.luckPeriod.stage}".`);
  lines.push("");

  for (const sec of plan.sections) {
    if (sec.type === "day_master") lines.push(`— DAY MASTER material —\n${manuscripts.readings?.dayMaster?.[sec.key] ?? ""}`);
    else if (sec.type === "balance") lines.push(`— FIVE-ELEMENT BALANCE material —\n${manuscripts.readings?.balance?.[sec.key] ?? ""}`);
    else if (sec.type === "star") {
      lines.push(`— STAR: ${sec.cn} (${sec.god})${sec.isTheme ? " [recurring theme]" : ""}, appears in: ${sec.sources.join(", ")} —`);
      lines.push(`base: ${moduleText(sec.material.base, manuscripts)}`);
      lines.push(`strength-spin (${plan.strength.spin}): ${moduleText(sec.material.strengthSpin, manuscripts)}`);
      lines.push(`daiun-spin: ${daiunText(sec.material.daiunSpin, manuscripts)}`);
    } else if (sec.type === "year") lines.push(`— YEAR OUTLOOK material —\n${manuscripts.readings?.yearOutlook?.byElement?.[sec.key] ?? ""}`);
    else if (sec.type === "closing") lines.push(`— CLOSING —\n${manuscripts.readings?.closing ?? ""}`);
    lines.push("");
  }

  const user =
    `Weave the material below into one reading for ${plan.name}, in the section order given ` +
    `(Day Master → five-element balance → the ${plan.sections.filter((s) => s.type === "star").length} foregrounded stars → year outlook → closing). ` +
    `340–500 words per section; house voice; no concatenation.\n\n` + lines.join("\n");

  return {
    model: config.model ?? "claude-sonnet-5",
    max_tokens: config.maxTokens ?? 2048,
    system: config.system ?? DEFAULT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: user }],
  };
}

/* --- Compatibility flow (§5) ---------------------------------------------- */
export const meshKey = (a, b) => [a, b].sort().join("_"); // e.g. balanced_strong

/**
 * Plan the compatibility reading (§5): intro → stem line → branch relation(s)
 * → strength meshing → closing. Score is a headline/free-hook only — NO verdict.
 */
export function buildCompatibilityPlan(compat, { strengthA, strengthB, names } = {}) {
  const stem = compat.stemRelation;
  const sections = [
    { type: "intro", key: "intro" },
    { type: "stem", key: stem.combine ? "combine" : (compat.flags.ten_sen_chi_chu ? "ten_sen_chi_chu" : stem.relation),
      relation: stem.relation, control: stem.control, combine: stem.combine },
    { type: "branch", keys: compat.branchRelations }, // 複数可・混在は両方
    ...(strengthA && strengthB ? [{ type: "strength_mesh", key: meshKey(strengthSpinCategory(strengthA), strengthSpinCategory(strengthB)) }] : []),
    { type: "closing", key: "compat_closing" },
  ];
  return {
    mode: "compatibility",
    names: names ?? { a: "you", b: "them" },
    sections,
    headline: { score: compat.score, tenSenChiChu: compat.flags.ten_sen_chi_chu }, // hook only, no verdict
  };
}
