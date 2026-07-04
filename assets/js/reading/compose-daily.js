/* ==========================================================================
   Daily fortune (日運) synthesis — pure, DOM-free, unit-tested.
   --------------------------------------------------------------------------
   Compose order (see data/readings-daily.json):
     general[today's day-stem key]         五行×陰陽, everyone
   + personal[Day Master × today relation] 生剋, individual (needs a chart)
   + closing
   Content ships later (readings-daily.md → readings-daily.json); this is the
   vessel + key-selection logic, so empty scaffold values compose fine.
   ========================================================================== */

// Five-element cycles. GENERATES: 木→火→土→金→水→木 (相生). CONTROLS: 木→土→水→火→金→木 (相剋).
const GENERATES = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const CONTROLS = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };

/** The five Day-Master-vs-today relations. */
export const DAILY_RELATIONS = ["peer", "output", "resource", "wealth", "authority"];

/**
 * Relation of `todayElement` seen from the Day Master `dmElement`:
 *   peer      同五行（比和）
 *   output    日主が生じる（食傷・泄）   dm → today
 *   resource  日主を生じる（印・生）     today → dm
 *   wealth    日主が剋す（財）           dm ⇒ today
 *   authority 日主を剋す（官殺）         today ⇒ dm
 * These five are exhaustive and mutually exclusive for any two of the elements.
 */
export function dailyRelation(dmElement, todayElement) {
  if (dmElement === todayElement) return "peer";
  if (GENERATES[dmElement] === todayElement) return "output";
  if (GENERATES[todayElement] === dmElement) return "resource";
  if (CONTROLS[dmElement] === todayElement) return "wealth";
  if (CONTROLS[todayElement] === dmElement) return "authority";
  throw new Error(`invalid element pair: ${dmElement} / ${todayElement}`);
}

const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);

/**
 * Compose the daily reading paragraphs.
 * @param {object} p
 * @param {object} p.today   a day pillar (from todayPillar() / dayPillarOf())
 * @param {string} [p.dayMasterElement] the viewer's Day Master element; omit for
 *                 the general (everyone) reading only
 * @param {object} p.data    parsed readings-daily.json
 * @returns {{paragraphs:string[], keys:{general:string, relation:string|null},
 *            dayGanzhi:string, disclaimer:string}}
 */
export function composeDailyReading({ today, dayMasterElement, data }) {
  const stemKey = today.stem.key;

  const missing = [];
  if (!has(data.general, stemKey)) missing.push(`general.${stemKey}`);

  let relation = null;
  if (dayMasterElement) {
    relation = dailyRelation(dayMasterElement, today.stem.element);
    if (!has(data.personal, relation)) missing.push(`personal.${relation}`);
  }
  if (!has(data, "closing")) missing.push("closing");
  if (missing.length) {
    throw new Error(`readings-daily.json is missing template(s): ${missing.join(", ")}`);
  }

  const paragraphs = [data.general[stemKey]];
  if (relation) paragraphs.push(data.personal[relation]);
  paragraphs.push(data.closing);

  return {
    paragraphs,
    keys: { general: stemKey, relation },
    dayGanzhi: today.cn,
    disclaimer: data.disclaimer || "",
  };
}
