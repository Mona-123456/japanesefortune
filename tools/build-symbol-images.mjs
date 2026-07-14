/* ==========================================================================
   Heavenly-Stem symbol pipeline — optimize + export the 10 Day-Master icons.
   --------------------------------------------------------------------------
   Run:  node tools/build-symbol-images.mjs        (needs the `sharp` dev dep)

   Inputs (masters archived in content/, gitignored like the hero masters):
     content/10_symbols_<name>.png   ~1080² transparent PNGs (glowing medallion
     on a black field with transparent corners; blends on the dark theme).

   The delivered filenames use image nouns (tree, ivy, ax, juel…). We normalise
   to the engine's Heavenly-Stem KEYS on output so the shipped assets and all
   code references use one vocabulary (stem-jia … stem-gui) — no ax/juel spelling
   variants leak into the repo. Mapping lives here, the one place that sees both.

   Outputs → assets/img/stem-<key>-<w>.{avif,webp} at srcset widths, plus a PNG
   fallback (alpha preserved throughout). Masters are padded to a square canvas
   with transparency so every icon ships at a uniform 1:1 aspect.
   ========================================================================== */

import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets", "img");
mkdirSync(OUT, { recursive: true });

// Delivered image-noun → Heavenly-Stem key (see constants.js STEMS).
const STEM_MAP = {
  tree: "jia",      // 甲 Yang Wood
  ivy: "yi",        // 乙 Yin Wood
  sun: "bing",      // 丙 Yang Fire
  candle: "ding",   // 丁 Yin Fire
  mountain: "wu",   // 戊 Yang Earth
  field: "ji",      // 己 Yin Earth
  ax: "geng",       // 庚 Yang Metal
  juel: "xin",      // 辛 Yin Metal
  river: "ren",     // 壬 Yang Water
  fog: "gui",       // 癸 Yin Water
};

const WIDTHS = [160, 320, 640];
const PNG_FALLBACK_W = 320;
const WEBP = { quality: 82, alphaQuality: 90 };
const AVIF = { quality: 60, effort: 4 };

const kb = (b) => (b / 1024).toFixed(0) + "kb";

// Pad a (near-square) master to an exact square canvas with transparency,
// so all ten icons share one aspect ratio and lay out on a uniform grid.
async function squareMaster(file) {
  const img = sharp(file).ensureAlpha();
  const { width, height } = await img.metadata();
  const side = Math.max(width, height);
  return sharp(
    await img
      .extend({
        top: Math.floor((side - height) / 2),
        bottom: Math.ceil((side - height) / 2),
        left: Math.floor((side - width) / 2),
        right: Math.ceil((side - width) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer()
  );
}

for (const [name, key] of Object.entries(STEM_MAP)) {
  const master = join(ROOT, "content", `10_symbols_${name}.png`);
  const src = await (await squareMaster(master)).toBuffer();
  console.log(`stem-${key} (${name}):`);
  for (const w of WIDTHS) {
    const resized = () => sharp(src).resize({ width: w, height: w, fit: "inside", withoutEnlargement: true });
    const webp = await resized().webp(WEBP).toBuffer();
    const avif = await resized().avif(AVIF).toBuffer();
    await sharp(webp).toFile(join(OUT, `stem-${key}-${w}.webp`));
    await sharp(avif).toFile(join(OUT, `stem-${key}-${w}.avif`));
    console.log(`  ${w}: webp ${kb(webp.length)}, avif ${kb(avif.length)}`);
    if (w === PNG_FALLBACK_W) {
      const png = await resized().png({ compressionLevel: 9 }).toBuffer();
      await sharp(png).toFile(join(OUT, `stem-${key}.png`));
      console.log(`  stem-${key}.png ${kb(png.length)} (fallback)`);
    }
  }
}

console.log("\nDone → assets/img/stem-*");
