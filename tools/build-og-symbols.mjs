/* ==========================================================================
   Day-Master OG images — 1200×630 social cards, one per Heavenly Stem.
   --------------------------------------------------------------------------
   Run:  node tools/build-og-symbols.mjs      (needs @napi-rs/canvas + sharp)

   Left: kicker / element-polarity / image name. Right: the stem symbol.
   The symbol masters are glowing medallions on a baked BLACK field (rgb ~2,2,0)
   with transparent corners — so the canvas is filled with the master's OWN
   sampled background colour. That makes the medallion's square field vanish
   into the card (no visible frame), matching how it blends on the dark site.
   Separate from build-og-images.mjs on purpose (that one stays untouched).
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
// A CJK face for the kanji in the title. Fall back gracefully if absent.
let JP = null;
for (const [file, fam] of [["YuGothB.ttc", "OGJp"], ["meiryob.ttc", "OGJp"], ["msgothic.ttc", "OGJp"]]) {
  if (existsSync(`${FONTS}/${file}`)) { GlobalFonts.registerFromPath(`${FONTS}/${file}`, fam); JP = fam; break; }
}

const W = 1200, H = 630;
const C = { gold: "#c9a866", shu: "#b7331a", washi: "#f4efe6", muted: "#c4b7a4", faint: "#8f8676" };

// key → { master noun, element-polarity, kanji, image name }
const STEMS = [
  { key: "jia",  file: "tree",     pe: "Yang Wood",  cn: "甲", name: "The Tall Tree" },
  { key: "yi",   file: "ivy",      pe: "Yin Wood",   cn: "乙", name: "The Vine" },
  { key: "bing", file: "sun",      pe: "Yang Fire",  cn: "丙", name: "The Sun" },
  { key: "ding", file: "candle",   pe: "Yin Fire",   cn: "丁", name: "The Candle" },
  { key: "wu",   file: "mountain", pe: "Yang Earth", cn: "戊", name: "The Mountain" },
  { key: "ji",   file: "field",    pe: "Yin Earth",  cn: "己", name: "The Field" },
  { key: "geng", file: "ax",       pe: "Yang Metal", cn: "庚", name: "The Axe" },
  { key: "xin",  file: "juel",     pe: "Yin Metal",  cn: "辛", name: "The Jewel" },
  { key: "ren",  file: "river",    pe: "Yang Water", cn: "壬", name: "The River" },
  { key: "gui",  file: "fog",      pe: "Yin Water",  cn: "癸", name: "The Fog" },
];

function letterSpaced(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + spacing; }
}

// The master's baked background is the darkest thing in it (the medallion and
// its gold glow are brighter). Sample many opaque edge/inset points and take
// the darkest — robust against art that reaches a single sample point — so the
// canvas fill matches the symbol's black field exactly and no seam appears.
async function sampleBg(masterPath) {
  const { data, info } = await sharp(masterPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
  const pts = [];
  const insets = [6, 18, 40];
  for (const d of insets) {
    pts.push([Math.floor(w / 2), d], [Math.floor(w / 2), h - 1 - d], [d, Math.floor(h / 2)], [w - 1 - d, Math.floor(h / 2)], [d, d], [w - 1 - d, d], [d, h - 1 - d], [w - 1 - d, h - 1 - d]);
  }
  let best = null;
  for (const [x, y] of pts) {
    const [r, g, b, a] = px(x, y);
    if (a < 250) continue;                     // skip transparent corners
    if (!best || r + g + b < best[0] + best[1] + best[2]) best = [r, g, b];
  }
  best = best || [2, 2, 0];
  return `rgb(${best[0]},${best[1]},${best[2]})`;
}

for (const s of STEMS) {
  const masterPath = join(ROOT, "content", `10_symbols_${s.file}.png`);
  const bg = await sampleBg(masterPath);
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Symbol on the right, vertically centred.
  const size = 500, sx = W - size - 70, sy = (H - size) / 2;
  const sym = await loadImage(masterPath);
  ctx.drawImage(sym, sx, sy, size, size);

  const marginX = 90;
  // Left vermilion accent
  ctx.fillStyle = C.shu; ctx.fillRect(marginX, 214, 46, 4);
  // Kicker
  ctx.fillStyle = C.gold; ctx.font = "26px OGSansBold"; ctx.textBaseline = "alphabetic";
  letterSpaced(ctx, "YOUR DAY MASTER", marginX, 250, 5);
  // Title: element-polarity (serif) + kanji (JP font) appended
  ctx.fillStyle = C.washi; ctx.font = "82px OGSerifBold";
  ctx.fillText(s.pe, marginX, 340);
  const peW = ctx.measureText(s.pe).width;
  if (JP) { ctx.font = `58px ${JP}`; ctx.fillText(s.cn, marginX + peW + 22, 340); }
  // Subtitle: image name
  ctx.fillStyle = C.muted; ctx.font = "36px OGSans";
  ctx.fillText(s.name, marginX, 404);
  // Footer
  ctx.fillStyle = C.faint; ctx.font = "24px OGSansBold";
  ctx.fillText("japanesefortune.com", marginX, H - 54);

  // Quantize to a palette PNG so we ship ~150KB cards, not multi-hundred-KB
  // truecolor. High quality + full dither keeps the gold-glow gradient smooth
  // (no visible banding). libimagequant via sharp — same engine as pngquant.
  const outFile = `og-stem-${s.key}.png`;
  const png = await sharp(canvas.toBuffer("image/png"))
    .png({ palette: true, quality: 90, colours: 256, dither: 1.0, effort: 10 })
    .toBuffer();
  writeFileSync(join(OUT, outFile), png);
  console.log(`✓ ${outFile}  ${(png.length / 1024).toFixed(0)}kb  bg=${bg}  (${s.pe} ${s.cn} — ${s.name})`);
}
console.log(`\nGenerated ${STEMS.length} Day-Master OG images → assets/img/  (JP font: ${JP ?? "none"})`);
