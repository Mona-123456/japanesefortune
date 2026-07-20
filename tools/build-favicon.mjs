/* ==========================================================================
   Favicon pipeline — one master → the full icon set.
   --------------------------------------------------------------------------
   Run:  node tools/build-favicon.mjs        (needs the `sharp` dev dep)

   Input (master archived in content/, gitignored):
     content/favicon1.png   1254² opaque emblem on black (gold ring + five
     element discs + a vermilion centre). Black background is intentional —
     no transparency.

   Outputs:
     favicon.ico              (root; 16/32/48, PNG-in-ICO)
     apple-touch-icon.png     (root; 180, iOS auto-requests this path)
     assets/img/icon-32.png   (PNG favicon for <link rel=icon>)
     assets/img/icon-192.png  (site.webmanifest)
     assets/img/icon-512.png  (site.webmanifest)
   No SVG: the source is raster, not vector.
   ========================================================================== */

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MASTER = join(ROOT, "content", "favicon1.png");
mkdirSync(join(ROOT, "assets", "img"), { recursive: true });

const kb = (b) => (b / 1024).toFixed(0) + "kb";
const png = (size) => sharp(MASTER).resize(size, size, { fit: "cover" }).png({ compressionLevel: 9 }).toBuffer();

// Assemble a PNG-in-ICO container (valid since Windows Vista / all modern
// browsers): ICONDIR header + one ICONDIRENTRY per image + the PNG payloads.
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: 1 = icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const dir = [];
  for (const { size, buf } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2);                       // palette colours
    e.writeUInt8(0, 3);                       // reserved
    e.writeUInt16LE(1, 4);                    // colour planes
    e.writeUInt16LE(32, 6);                   // bits per pixel
    e.writeUInt32LE(buf.length, 8);           // image byte size
    e.writeUInt32LE(offset, 12);              // offset from file start
    offset += buf.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...images.map((i) => i.buf)]);
}

const [p16, p32, p48, p180, p192, p512] = await Promise.all([16, 32, 48, 180, 192, 512].map(png));

const icoBuf = buildIco([{ size: 16, buf: p16 }, { size: 32, buf: p32 }, { size: 48, buf: p48 }]);
writeFileSync(join(ROOT, "favicon.ico"), icoBuf);
writeFileSync(join(ROOT, "apple-touch-icon.png"), p180);
writeFileSync(join(ROOT, "assets", "img", "icon-32.png"), p32);
writeFileSync(join(ROOT, "assets", "img", "icon-192.png"), p192);
writeFileSync(join(ROOT, "assets", "img", "icon-512.png"), p512);

console.log(`✓ favicon.ico            ${kb(icoBuf.length)} (16/32/48)`);
console.log(`✓ apple-touch-icon.png   ${kb(p180.length)} (180)`);
console.log(`✓ assets/img/icon-32.png ${kb(p32.length)}`);
console.log(`✓ assets/img/icon-192.png ${kb(p192.length)}`);
console.log(`✓ assets/img/icon-512.png ${kb(p512.length)}`);
console.log("\nDone → favicon set.");
