/* ==========================================================================
   Daily fortune (日運) synthesis — pure, DOM-free, unit-tested.
   Source content: data/readings-daily.json (from docs/readings-daily.md v1.0).
   --------------------------------------------------------------------------
   Keys (from the delivered draft):
     general[`general_{todayElement}_{yinyang}`]        10, everyone
     personal[`personal_{dayMasterStem}_{todayElement}`] 50, needs a chart
   Compose order:
     • general only (no birth input): general + daily_cta
     • personal (birth input):        general + personal + daily_closing
   {name} → "you" when empty. Year-independent (permanent 60-line set).
   ========================================================================== */

import { STEMS } from "../fourpillars/constants.js";
import { fiveElementRelation } from "../fourpillars/derivation.js";

/** The five Day-Master-vs-today relations (for validating the 50 personal keys). */
export const DAILY_RELATIONS = ["peer", "output", "resource", "wealth", "authority"];

/**
 * Relation of `todayElement` seen from the Day Master `dmElement`:
 *   peer 比和 / output 食傷(dm→today) / resource 印(today→dm) /
 *   wealth 財(dm⇒today) / authority 官殺(today⇒dm).
 * Canonical implementation lives in the derivation layer (single source of truth).
 */
export const dailyRelation = fiveElementRelation;

/** general key for a day pillar: `general_{element}_{yin|yang}`. */
export function generalKeyFor(dayPillar) {
  return `general_${dayPillar.stem.element}_${dayPillar.stem.yin ? "yin" : "yang"}`;
}

/** personal key: `personal_{dayMasterStemKey}_{todayElement}`. */
export function personalKeyFor(dayMasterStemKey, dayPillar) {
  return `personal_${dayMasterStemKey}_${dayPillar.stem.element}`;
}

function interpolate(text, name) {
  const who = (name && String(name).trim()) || "you";
  return text.replaceAll("{name}", who);
}

const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);

/**
 * Compose the daily reading.
 * @param {object} p
 * @param {object} p.today            a day pillar (from todayPillar()/dayPillarOf())
 * @param {string} [p.dayMasterStemKey] the viewer's Day Master stem key (jia..gui);
 *                 omit for the general (everyone) reading only
 * @param {string} [p.name]           optional name for {name}
 * @param {object} p.data             parsed readings-daily.json
 * @returns {{paragraphs:string[], keys:{general:string, personal:string|null, tail:string},
 *            relation:string|null, dayGanzhi:string, disclaimer:string}}
 */
export function composeDailyReading({ today, dayMasterStemKey = null, name, data }) {
  const generalKey = generalKeyFor(today);
  const personal = dayMasterStemKey != null;
  const tailKey = personal ? "daily_closing" : "daily_cta";

  const missing = [];
  if (!has(data.general, generalKey)) missing.push(`general.${generalKey}`);
  let personalKey = null;
  if (personal) {
    personalKey = personalKeyFor(dayMasterStemKey, today);
    if (!has(data.personal, personalKey)) missing.push(`personal.${personalKey}`);
  }
  if (!has(data, tailKey)) missing.push(tailKey);
  if (missing.length) {
    throw new Error(`readings-daily.json is missing template(s): ${missing.join(", ")}`);
  }

  const parts = [data.general[generalKey]];
  if (personalKey) parts.push(data.personal[personalKey]);
  parts.push(data[tailKey]);

  const dmStem = personal ? STEMS.find((s) => s.key === dayMasterStemKey) : null;

  return {
    paragraphs: parts.map((p) => interpolate(p, name)),
    keys: { general: generalKey, personal: personalKey, tail: tailKey },
    relation: dmStem ? dailyRelation(dmStem.element, today.stem.element) : null,
    dayGanzhi: today.cn,
    disclaimer: data.disclaimer || "",
  };
}
