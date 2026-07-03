/* ==========================================================================
   OG image generator — 1200×630 PNGs for social sharing (spec §2.3).
   --------------------------------------------------------------------------
   Run:  node tools/build-og-images.mjs
   Requires @napi-rs/canvas (dev-only; PNGs are committed, site ships static).
   Latin-only typography (Georgia/Arial) so it renders identically anywhere.
   Palette mirrors tokens.css (sumi ink + vermilion + gold).
   ========================================================================== */

import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "assets", "img");
mkdirSync(OUT, { recursive: true });

// System fonts (Windows). Registered under stable family names.
const FONTS = "C:/Windows/Fonts";
GlobalFonts.registerFromPath(`${FONTS}/georgiab.ttf`, "OGSerifBold");
GlobalFonts.registerFromPath(`${FONTS}/georgia.ttf`, "OGSerif");
GlobalFonts.registerFromPath(`${FONTS}/arialbd.ttf`, "OGSansBold");
GlobalFonts.registerFromPath(`${FONTS}/arial.ttf`, "OGSans");

const W = 1200, H = 630;
const C = {
  ink0: "#0b0a09", ink1: "#14110e",
  shu: "#b7331a", shuGlow: "rgba(183,51,26,0.16)",
  gold: "#c9a866", goldRing: "rgba(201,168,102,0.55)",
  washi: "#f4efe6", muted: "#c4b7a4", faint: "#8f8676",
};

const IMAGES = [
  { file: "og-default.png",      kicker: "JAPANESE FORTUNE",   title: "Four Pillars of Destiny",             subtitle: "& Nine Star Ki — traditional Japanese divination" },
  { file: "og-reading.png",      kicker: "FREE READING",       title: "Your Four Pillars Reading",           subtitle: "Day Master · Five-element balance · 2026 outlook" },
  { file: "og-hosoki.png",       kicker: "GUIDE",              title: "Who Was Kazuko Hosoki?",              subtitle: "The fortune teller behind Netflix’s “Straight to Hell”" },
  { file: "og-rokusei.png",      kicker: "GUIDE",              title: "Rokusei Senjutsu, Explained",         subtitle: "Japan’s “Six Star Astrology”" },
  { file: "og-daisakkai.png",    kicker: "GUIDE",              title: "What Is Daisakkai?",                  subtitle: "Japan’s most feared unlucky years" },
  { file: "og-four-pillars.png", kicker: "GUIDE",              title: "Four Pillars of Destiny",             subtitle: "The 1,000-year-old system behind Japanese fortune telling" },
  { file: "og-types.png",        kicker: "GUIDE",              title: "7 Types of Japanese Fortune Telling", subtitle: "From omikuji to Nine Star Ki" },
];

function drawLetterSpaced(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function render({ file, kicker, title, subtitle }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, C.ink1);
  bg.addColorStop(1, C.ink0);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Vermilion glow, top-left
  const glow = ctx.createRadialGradient(120, -40, 40, 120, -40, 760);
  glow.addColorStop(0, C.shuGlow);
  glow.addColorStop(1, "rgba(183,51,26,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Hinomaru-style disc bleeding off the top-right, with gold rings
  const cx = 1130, cy = 70, r = 330;
  const disc = ctx.createRadialGradient(cx, cy, 20, cx, cy, r);
  disc.addColorStop(0, "rgba(183,51,26,0.22)");
  disc.addColorStop(1, "rgba(183,51,26,0.05)");
  ctx.fillStyle = disc;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.goldRing; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.arc(cx, cy, r - 14, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;

  const marginX = 90;

  // Left vermilion accent
  ctx.fillStyle = C.shu;
  ctx.fillRect(marginX, 96, 46, 4);

  // Kicker
  ctx.fillStyle = C.gold;
  ctx.font = "26px OGSansBold";
  ctx.textBaseline = "alphabetic";
  drawLetterSpaced(ctx, kicker.toUpperCase(), marginX, 128, 5);

  // Title (auto-size + wrap)
  const size = title.length <= 20 ? 92 : title.length <= 30 ? 76 : 62;
  ctx.font = `${size}px OGSerifBold`;
  ctx.fillStyle = C.washi;
  const maxW = 900;
  const lines = wrap(ctx, title, maxW);
  const lineH = size * 1.12;
  let y = 250;
  for (const ln of lines) { ctx.fillText(ln, marginX, y); y += lineH; }

  // Subtitle
  ctx.font = "30px OGSans";
  ctx.fillStyle = C.muted;
  const subLines = wrap(ctx, subtitle, 960);
  y += 12;
  for (const ln of subLines) { ctx.fillText(ln, marginX, y); y += 40; }

  // Footer URL
  ctx.font = "24px OGSansBold";
  ctx.fillStyle = C.faint;
  ctx.fillText("japanesefortune.com", marginX, H - 54);

  writeFileSync(join(OUT, file), canvas.toBuffer("image/png"));
  console.log(`✓ assets/img/${file}  (${lines.length} title line${lines.length > 1 ? "s" : ""})`);
}

for (const img of IMAGES) render(img);
console.log(`\nGenerated ${IMAGES.length} OG images → assets/img/`);
