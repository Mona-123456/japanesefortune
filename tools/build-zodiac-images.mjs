/* ==========================================================================
   Zodiac (Earthly Branch) image pipeline — the 12 animals + the article-9 grid.
   --------------------------------------------------------------------------
   Run:  node tools/build-zodiac-images.mjs        (needs the `sharp` dev dep)

   Inputs (masters archived in content/, gitignored like the hero + stem masters):
     content/j01.png … content/j13.png   opaque medallions on a BLACK field
     (no transparency). Delivered filenames kept; mapped to English keys here.
     j01–j12 are 1254² (the twelve animals); j13 is 1086×1448 portrait (grid).

   The black field blends on the dark page ground (same treatment as the stem
   symbols — sit them directly on the page, never on a light card). Outputs →
   assets/img/, mirroring the stem pipeline: WebP + AVIF at srcset widths plus a
   PNG fallback. Squares stay square; the grid keeps its portrait aspect (no
   padding), widths capped to native (no upscaling). Separate from
   build-symbol-images.mjs (that one is untouched).
   ========================================================================== */

import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets", "img");
mkdirSync(OUT, { recursive: true });

// Delivered master (jNN) → English zodiac key. j13 is the article-9 hero grid.
const ZODIAC_MAP = {
  j01: "rat", j02: "ox", j03: "tiger", j04: "rabbit", j05: "dragon", j06: "snake",
  j07: "horse", j08: "goat", j09: "monkey", j10: "rooster", j11: "dog", j12: "boar",
  j13: "grid",
};

const ANIMAL_WIDTHS = [160, 320, 640];
const ANIMAL_PNG_W = 320;
const GRID_WIDTHS = [640, 960, 1280]; // capped to native (portrait hero, no upscaling)
const GRID_PNG_W = 640;

const WEBP = { quality: 82 };
const AVIF = { quality: 60, effort: 4 };
const kb = (b) => (b / 1024).toFixed(0) + "kb";

// The 12 animal masters are opaque medallions on a pure-black square — the
// square clashes with the page's warm-black ground. Punch the outside of the
// medallion to transparent (a circular mask, like the stem symbols) so the page
// shows through and only the round medallion remains. The grid (j13) is a 4×3
// layout, not a single disc, so it is left as-is.

// Detect the medallion's outer radius: cast rays from centre and, along each,
// find the farthest bright (non-black) pixel — the outer edge of the gold ring
// (and its top/bottom flourishes). Max over rays, capped at the inscribed circle.
async function detectRadius(buf, w, h) {
  const { data } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const cx = w / 2, cy = h / 2, T = 40, inscribed = Math.min(w, h) / 2 - 1;
  const lum = (x, y) => data[Math.round(y) * w + Math.round(x)];
  let maxR = 0;
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * 2 * Math.PI, dx = Math.cos(a), dy = Math.sin(a);
    for (let rr = inscribed; rr >= 0; rr--) {
      const x = cx + dx * rr, y = cy + dy * rr;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      if (lum(x, y) > T) { if (rr > maxR) maxR = rr; break; }
    }
  }
  return Math.min(maxR + 3, inscribed); // small margin, never exceed the inscribed circle
}

// Keep the disc, drop everything outside it (dest-in against a white circle).
async function maskCircle(buf) {
  const { width: w, height: h } = await sharp(buf).metadata();
  const r = await detectRadius(buf, w, h);
  const circle = Buffer.from(`<svg width="${w}" height="${h}"><circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="#fff"/></svg>`);
  const out = await sharp(buf).ensureAlpha().composite([{ input: circle, blend: "dest-in" }]).png().toBuffer();
  return { buf: out, r, w };
}

// Emit WebP/AVIF at each width (capped to native, named by ACTUAL output width so
// srcset descriptors stay accurate) + one PNG fallback. Returns the actual widths.
// `quantize` palettizes the PNG fallback (sharp/libimagequant, dithered) — used
// for the large grid so its fallback lands ~200-300KB instead of ~900KB.
async function emit(srcBuf, outKey, widths, pngNear, quantize = false) {
  const src = srcBuf;
  const seen = new Set();
  let pngW = null, pngBest = Infinity;
  for (const reqW of widths) {
    const buf = await sharp(src).resize({ width: reqW, withoutEnlargement: true }).png().toBuffer();
    const w = (await sharp(buf).metadata()).width; // actual (≤ native)
    if (seen.has(w)) continue;
    seen.add(w);
    const webp = await sharp(src).resize({ width: w, withoutEnlargement: true }).webp(WEBP).toBuffer();
    const avif = await sharp(src).resize({ width: w, withoutEnlargement: true }).avif(AVIF).toBuffer();
    // Write the encoded buffers directly — re-opening via sharp().toFile() would
    // re-encode and, for the quantized PNG, silently drop the palette.
    writeFileSync(join(OUT, `zodiac-${outKey}-${w}.webp`), webp);
    writeFileSync(join(OUT, `zodiac-${outKey}-${w}.avif`), avif);
    console.log(`  ${w}: webp ${kb(webp.length)}, avif ${kb(avif.length)}`);
    if (Math.abs(w - pngNear) < pngBest) { pngBest = Math.abs(w - pngNear); pngW = w; }
  }
  // PNG fallback at the width closest to the requested fallback size. The grid is
  // palette-quantized (high quality + full dither keeps the gradients smooth).
  const pngOpts = quantize
    ? { palette: true, quality: 80, colours: 256, dither: 1.0, effort: 10 }
    : { compressionLevel: 9 };
  const png = await sharp(src).resize({ width: pngW, withoutEnlargement: true }).png(pngOpts).toBuffer();
  writeFileSync(join(OUT, `zodiac-${outKey}.png`), png);
  console.log(`  zodiac-${outKey}.png ${kb(png.length)} (fallback @${pngW}${quantize ? ", quantized" : ""})`);
  return [...seen];
}

const ONLY = process.env.ZONLY; // e.g. ZONLY=rat to regenerate a single key
for (const [j, key] of Object.entries(ZODIAC_MAP)) {
  if (ONLY && key !== ONLY) continue;
  const master = join(ROOT, "content", `${j}.png`);
  const isGrid = key === "grid";
  let srcBuf = await sharp(master).toBuffer();
  if (!isGrid) { const m = await maskCircle(srcBuf); srcBuf = m.buf; console.log(`zodiac-${key} (${j}): circular mask r=${m.r}/${m.w >> 1}`); }
  else console.log(`zodiac-${key} (${j}): no mask (grid)`);
  await emit(srcBuf, key, isGrid ? GRID_WIDTHS : ANIMAL_WIDTHS, isGrid ? GRID_PNG_W : ANIMAL_PNG_W, isGrid);
}
console.log(`\nDone → assets/img/zodiac-*  (12 animals + grid)`);
