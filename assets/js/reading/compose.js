/* ==========================================================================
   Reading synthesis — turn a computed chart + readings.json into text.
   --------------------------------------------------------------------------
   Pure and DOM-free so it can be unit-tested. Compose order follows
   readings-templates.md: dayMaster + balance + 2026 year outlook + closing.
   ========================================================================== */

/** Replace the {name} placeholder. Empty/undefined → "you". */
function interpolate(text, name) {
  const who = (name && String(name).trim()) || "you";
  return text.replaceAll("{name}", who);
}

/**
 * Compose the four paragraphs of a reading.
 * @param {object} chart  result of computeChart()
 * @param {object} data   parsed readings.json
 * @param {object} [opts]
 * @param {string} [opts.name] optional user name for {name} placeholders
 * @returns {{ paragraphs: string[], keys: object, disclaimer: string }}
 */
export function composeReading(chart, data, { name } = {}) {
  const dayMasterKey = chart.dayMaster.stem.key;      // jia, yi, bing, ...
  const balanceKey = chart.balance.type;              // wood_dominant … | balanced
  const yearKey = chart.dayMaster.element;            // wood/fire/earth/metal/water

  const dmText = data.dayMaster?.[dayMasterKey];
  const balText = data.balance?.[balanceKey];
  const yearText = data.yearOutlook?.byElement?.[yearKey];
  const closing = data.closing;

  const missing = [];
  if (!dmText) missing.push(`dayMaster.${dayMasterKey}`);
  if (!balText) missing.push(`balance.${balanceKey}`);
  if (!yearText) missing.push(`yearOutlook.byElement.${yearKey}`);
  if (!closing) missing.push("closing");
  if (missing.length) {
    throw new Error(`readings.json is missing template(s): ${missing.join(", ")}`);
  }

  const paragraphs = [dmText, balText, yearText, closing].map((p) => interpolate(p, name));

  return {
    paragraphs,
    keys: { dayMaster: dayMasterKey, balance: balanceKey, year: yearKey },
    disclaimer: data.disclaimer || "",
  };
}
