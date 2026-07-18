/* ==========================================================================
   Zodiac OG images — 1200×630 social cards, one per Earthly Branch (12 animals).
   --------------------------------------------------------------------------
   Run:  node tools/build-og-zodiac.mjs      (needs @napi-rs/canvas + sharp)

   Left: kicker / animal (+ kanji) / epithet. Right: the zodiac medallion.
   The masters (content/j01–j12.png) are opaque medallions on a BLACK field, so
   the canvas is filled with the master's OWN sampled black — the medallion's
   square vanishes (no frame), matching the dark site. Epithets are deliberately
   NOT "Year of the X" (this site reads the branch as a character, not a
   year-fortune). Palette-quantized to ~120KB. Separate from build-og-symbols.mjs.
   ========================================================================== */

import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets", "img");
mkdirSync(OUT, { recursive: true });

const FONTS = "C:/Windows/Fonts";
GlobalFonts.registerFromPath(`${FONTS}/georgiab.ttf`, "OGSerifBold");
GlobalFonts.registerFromPath(`${FONTS}/arialbd.ttf`, "OGSansBold");
GlobalFonts.registerFromPath(`${FONTS}/arial.ttf`, "OGSans");
let JP = null;
for (const [file, fam] of [["YuGothB.ttc", "OGJp"], ["meiryob.ttc", "OGJp"], ["msgothic.ttc", "OGJp"]]) {
  if (existsSync(`${FONTS}/${file}`)) { GlobalFonts.registerFromPath(`${FONTS}/${file}`, fam); JP = fam; break; }
}

const W = 1200, H = 630;
const C = { gold: "#c9a866", shu: "#b7331a", washi: "#f4efe6", muted: "#c4b7a4", faint: "#8f8676" };

// master (jNN) → { key, kanji, animal, epithet }
const BRANCHES = [
  { j: "j01", key: "rat",     cn: "子", animal: "Rat",     ep: "First of the Twelve" },
  { j: "j02", key: "ox",      cn: "丑", animal: "Ox",      ep: "The Patient One" },
  { j: "j03", key: "tiger",   cn: "寅", animal: "Tiger",   ep: "Courage and Presence" },
  { j: "j04", key: "rabbit",  cn: "卯", animal: "Rabbit",  ep: "Grace and Quiet Luck" },
  { j: "j05", key: "dragon",  cn: "辰", animal: "Dragon",  ep: "The Only Myth" },
  { j: "j06", key: "snake",   cn: "巳", animal: "Snake",   ep: "Wisdom and Depth" },
  { j: "j07", key: "horse",   cn: "午", animal: "Horse",   ep: "Freedom and Fire" },
  { j: "j08", key: "goat",    cn: "未", animal: "Goat",    ep: "The Gentle One" },
  { j: "j09", key: "monkey",  cn: "申", animal: "Monkey",  ep: "Wit and Invention" },
  { j: "j10", key: "rooster", cn: "酉", animal: "Rooster", ep: "The Bird that Called the Sun" },
  { j: "j11", key: "dog",     cn: "戌", animal: "Dog",     ep: "The Loyal Guardian" },
  { j: "j12", key: "boar",    cn: "亥", animal: "Boar",    ep: "The Headlong Charge" },
];

function letterSpaced(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + spacing; }
  return cx; // end x (for appending a different-font run, e.g. the kanji)
}
function wrap(ctx, text, maxWidth) {
  const words = text.split(" "); const lines = []; let line = "";
  for (const w of words) { const t = line ? `${line} ${w}` : w; if (ctx.measureText(t).width > maxWidth && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}

// Darkest of many edge points = the master's black field (art/glow is brighter).
async function sampleBg(masterPath) {
  const { data, info } = await sharp(masterPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
  const pts = [];
  for (const d of [6, 18, 40]) pts.push([(w >> 1), d], [(w >> 1), h - 1 - d], [d, (h >> 1)], [w - 1 - d, (h >> 1)], [d, d], [w - 1 - d, d], [d, h - 1 - d], [w - 1 - d, h - 1 - d]);
  let best = null;
  for (const [x, y] of pts) { const [r, g, b, a] = px(x, y); if (a < 250) continue; if (!best || r + g + b < best[0] + best[1] + best[2]) best = [r, g, b]; }
  best = best || [0, 0, 0];
  return `rgb(${best[0]},${best[1]},${best[2]})`;
}

for (const s of BRANCHES) {
  const masterPath = join(ROOT, "content", `${s.j}.png`);
  const bg = await sampleBg(masterPath);
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const size = 500, sx = W - size - 70, sy = (H - size) / 2;
  ctx.drawImage(await loadImage(masterPath), sx, sy, size, size);

  const marginX = 90;
  ctx.fillStyle = C.shu; ctx.fillRect(marginX, 214, 46, 4);
  ctx.fillStyle = C.gold; ctx.font = "26px OGSansBold"; ctx.textBaseline = "alphabetic";
  letterSpaced(ctx, "EARTHLY BRANCH", marginX, 250, 5);
  ctx.fillStyle = C.washi; ctx.font = "82px OGSerifBold";
  ctx.fillText(s.animal, marginX, 340);
  const aw = ctx.measureText(s.animal).width;
  if (JP) { ctx.font = `58px ${JP}`; ctx.fillText(s.cn, marginX + aw + 22, 340); }
  ctx.fillStyle = C.muted; ctx.font = "36px OGSans";
  for (const [i, ln] of wrap(ctx, s.ep, 560).entries()) ctx.fillText(ln, marginX, 400 + i * 44);
  ctx.fillStyle = C.faint; ctx.font = "24px OGSansBold";
  ctx.fillText("japanesefortune.com", marginX, H - 54);

  const png = await sharp(canvas.toBuffer("image/png"))
    .png({ palette: true, quality: 90, colours: 256, dither: 1.0, effort: 10 })
    .toBuffer();
  writeFileSync(join(OUT, `og-zodiac-${s.key}.png`), png);
  console.log(`✓ og-zodiac-${s.key}.png  ${(png.length / 1024).toFixed(0)}kb  bg=${bg}  (${s.animal} ${s.cn} — ${s.ep})`);
}
console.log(`\nGenerated ${BRANCHES.length} zodiac OG images → assets/img/  (JP font: ${JP ?? "none"})`);

// --- Article-9 card: the 12-medallion grid (j13) with the hub title ----------
{
  const master = join(ROOT, "content", "j13.png");
  const bg = await sampleBg(master);
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // The grid (1086×1448 portrait) on the right, full height.
  const grid = await loadImage(master);
  const gh = 560, gw = Math.round(gh * (grid.width / grid.height)); // keep aspect
  ctx.drawImage(grid, W - gw - 48, (H - gh) / 2, gw, gh);

  const marginX = 90;
  ctx.fillStyle = C.shu; ctx.fillRect(marginX, 214, 46, 4);
  // Kicker: Latin run + kanji in the JP face.
  ctx.fillStyle = C.gold; ctx.font = "26px OGSansBold"; ctx.textBaseline = "alphabetic";
  const kx = letterSpaced(ctx, "JAPANESE ZODIAC · ", marginX, 250, 5);
  if (JP) { ctx.font = `26px ${JP}`; ctx.fillText("十二支", kx, 250); }
  ctx.fillStyle = C.washi; ctx.font = "88px OGSerifBold";
  ctx.fillText("The 12 Animals", marginX, 348);
  ctx.fillStyle = C.muted; ctx.font = "36px OGSans";
  ctx.fillText("What Your Sign Really Means", marginX, 404);
  ctx.fillStyle = C.faint; ctx.font = "24px OGSansBold";
  ctx.fillText("japanesefortune.com", marginX, H - 54);

  const png = await sharp(canvas.toBuffer("image/png"))
    .png({ palette: true, quality: 90, colours: 256, dither: 1.0, effort: 10 })
    .toBuffer();
  writeFileSync(join(OUT, "og-japanese-zodiac.png"), png);
  console.log(`✓ og-japanese-zodiac.png  ${(png.length / 1024).toFixed(0)}kb  bg=${bg}  (The 12 Animals grid)`);
}
