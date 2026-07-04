/* ==========================================================================
   Hero image pipeline — optimize + export the site's hero art.
   --------------------------------------------------------------------------
   Run:  node tools/build-hero-images.mjs        (needs the `sharp` dev dep)

   Inputs (masters archived in content/, persona name dropped per §5.2):
     content/hero-master-mobile.png   3258×4344  vertical   → mobile hero
     content/hero-master-desktop.png  5016×2823  horizontal → desktop hero + OGP

   Outputs → assets/img/, named hero-* only (persona name deliberately dropped;
   see hero-image-spec.md §2 / §5.2). WebP (q82) + AVIF at srcset widths, a JPG
   fallback, and a 1200×630 OGP crop with no burned-in text.

   §4 safe-area fix (b): the vertical master's face sits at ~29% from the top —
   too high for a heading. We EXTEND the canvas upward with the sky's own near-
   black colour so the face drops into the lower ~⅔ and the top clears for text.
   ========================================================================== */

import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets", "img");
mkdirSync(OUT, { recursive: true });

const MASTER_DESKTOP = join(ROOT, "content", "hero-master-desktop.png");
const MASTER_MOBILE = join(ROOT, "content", "hero-master-mobile.png");

// §4 (b): pixels of sky added above the mobile master. Chosen so the face-top
// (~29% of 4344 ≈ 1260px) lands near 37% → room for a headline in the top band.
const MOBILE_TOP_EXTEND = 560;
const SKY = { r: 12, g: 12, b: 14 }; // sampled from the master's top-centre

const WEBP = { quality: 82 };
const AVIF = { quality: 52, effort: 4 };
const JPG = { quality: 82, mozjpeg: true };

const DESKTOP_WIDTHS = [1280, 1920, 2560];
const MOBILE_WIDTHS = [768, 1080, 1440];

const kb = (b) => (b / 1024).toFixed(0) + "kb";

async function emit(pipeline, base, widths, { jpgAt } = {}) {
  const src = await pipeline.toBuffer(); // resolved (e.g. extended) master in memory
  for (const w of widths) {
    const resized = () => sharp(src).resize({ width: w, withoutEnlargement: true });
    const webp = await resized().webp(WEBP).toBuffer();
    const avif = await resized().avif(AVIF).toBuffer();
    await sharp(webp).toFile(join(OUT, `${base}-${w}.webp`));
    await sharp(avif).toFile(join(OUT, `${base}-${w}.avif`));
    console.log(`  ${base}-${w}: webp ${kb(webp.length)}, avif ${kb(avif.length)}`);
    if (jpgAt === w) {
      const jpg = await resized().jpeg(JPG).toBuffer();
      await sharp(jpg).toFile(join(OUT, `${base}-${w}.jpg`));
      console.log(`  ${base}-${w}.jpg ${kb(jpg.length)} (fallback)`);
    }
  }
}

console.log("desktop (horizontal):");
await emit(sharp(MASTER_DESKTOP), "hero-desktop", DESKTOP_WIDTHS, { jpgAt: 1920 });

console.log("mobile (vertical, canvas extended upward — §4 fix b):");
const mobileMaster = sharp(MASTER_MOBILE).extend({
  top: MOBILE_TOP_EXTEND,
  background: { ...SKY, alpha: 1 },
});
// No mobile JPG: the desktop JPG is the single <img> fallback (webp/avif cover
// ~97% of users; a mobile-specific fallback would need JS/duplicate markup).
await emit(mobileMaster, "hero-mobile", MOBILE_WIDTHS);

console.log("OGP crop (1200×630, person kept right/top, no text):");
const og = await sharp(MASTER_DESKTOP)
  .resize(1200, 630, { fit: "cover", position: "top" })
  .jpeg({ quality: 85, mozjpeg: true })
  .toBuffer();
await sharp(og).toFile(join(OUT, "hero-og.jpg"));
console.log(`  hero-og.jpg ${kb(og.length)}`);

console.log("\nDone → assets/img/hero-*");
