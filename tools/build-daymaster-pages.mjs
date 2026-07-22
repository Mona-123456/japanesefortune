/* ==========================================================================
   Day-Master page generator — one /day-master/<slug>/ per Heavenly Stem.
   --------------------------------------------------------------------------
   Run:  node tools/build-daymaster-pages.mjs
   Output: day-master/<slug>/index.html ×10.
   Single source of truth = tools/daymaster-data.mjs (HTML only — no parallel
   markdown, so the manuscript lives in exactly one place).

   Does NOT touch sitemap.xml (that file is hand-maintained across articles +
   the /about/ page — the 10 URLs are added there separately). Template mirrors
   the article shell but adds the hero symbol, the one-line identity, and a
   BreadcrumbList. Manuscripts confirmed; edit here and re-run to regenerate.
   ========================================================================== */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://japanesefortune.com";
const DATE = "2026-07-15";

const LINKS = {
  TOOL: "/reading/",
  ARTICLE8: "/ten-japanese-elemental-types/",
  FOURPILLARS: "/four-pillars-of-destiny-japanese-fortune-telling/",
};

const escHtml = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const escAttr = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Inline markdown: [t][KEY] links, **bold**, *italic*. */
function inline(text) {
  let out = escHtml(text);
  out = out.replace(/\[([^\]]+)\]\[([A-Z0-9]+)\]/g, (m, label, key) => {
    const url = LINKS[key];
    if (!url) { console.warn(`  ! unknown link key [${key}]`); return label; }
    return `<a href="${url}">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

/** A body section's blocks: string → <p>, {ul:[...]} → list. */
function renderBlocks(blocks) {
  return blocks.map((b) => {
    if (typeof b === "string") return `      <p>${inline(b)}</p>`;
    if (b.ul) return `      <ul>\n${b.ul.map((it) => `        <li>${inline(it)}</li>`).join("\n")}\n      </ul>`;
    return "";
  }).join("\n");
}

function jsonLd(s, url, og) {
  const graph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "The 10 Types", item: SITE + LINKS.ARTICLE8 },
        { "@type": "ListItem", position: 3, name: `${s.pe} (${s.cn})` },
      ],
    },
    {
      "@type": "Article",
      headline: s.h1,
      description: s.desc,
      image: [og],
      datePublished: DATE,
      dateModified: DATE,
      inLanguage: "en",
      author: { "@type": "Organization", name: "Japanese Fortune", url: SITE + "/" },
      publisher: { "@type": "Organization", name: "Japanese Fortune", logo: { "@type": "ImageObject", url: `${SITE}/assets/img/og-default.png` } },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@type": "FAQPage",
      mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

function bodyHtml(s) {
  const sections = s.body.map((sec) => `      <h2>${inline(sec.h)}</h2>\n${renderBlocks(sec.b)}`).join("\n");
  // Hub back-link + the reading CTA, appended to every page's body.
  const tail = `      <p>${s.pe} is one of <a href="${LINKS.ARTICLE8}">the ten Day Master types</a> — a tree, a candle, a mountain, fog.</p>\n      <p><a href="${LINKS.TOOL}">Calculate your full chart — free →</a></p>`;
  return sections + "\n" + tail;
}

function page(s) {
  const url = `${SITE}/day-master/${s.slug}/`;
  const og = `${SITE}/assets/img/og-stem-${s.key}.png`;
  const faqHtml = s.faqs.map((f) => `        <div class="faq-item">
          <h3 class="faq-q">${inline(f.q)}</h3>
          <div class="faq-a"><p>${inline(f.a)}</p></div>
        </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/icon-32.png" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#0b0a09" />
  <title>${escHtml(s.h1)}</title>
  <meta name="description" content="${escAttr(s.desc)}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Japanese Fortune" />
  <meta property="og:title" content="${escAttr(s.h1)}" />
  <meta property="og:description" content="${escAttr(s.desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${og}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="stylesheet" href="/assets/css/tokens.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/article.css" />

  <script defer src="/assets/js/analytics.js"></script>

  <script type="application/ld+json">
${jsonLd(s, url, og)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="/"><span class="brand__mark">☰</span> Japanese&nbsp;Fortune</a>
      <nav class="nav" aria-label="Primary">
        <a href="/reading/">Free Reading</a>
        <a href="/#articles">Guides</a>
        <a href="/about/">About</a>
      </nav>
    </div>
  </header>

  <main>
    <article class="article">
      <div class="container container--narrow">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a> <span aria-hidden="true">›</span> <a href="/ten-japanese-elemental-types/">The 10 Types</a>
        </nav>

        <header class="article-head">
          <span class="kicker">Day Master · 日主</span>
          <h1 class="dm-page-title">${inline(s.h1)}</h1>
        </header>

        <figure class="dm-hero">
          <picture>
            <source type="image/avif" srcset="/assets/img/stem-${s.key}-320.avif 320w, /assets/img/stem-${s.key}-640.avif 640w" sizes="(max-width: 26rem) 78vw, 360px" />
            <source type="image/webp" srcset="/assets/img/stem-${s.key}-320.webp 320w, /assets/img/stem-${s.key}-640.webp 640w" sizes="(max-width: 26rem) 78vw, 360px" />
            <img class="dm-hero__img" src="/assets/img/stem-${s.key}.png" width="360" height="360" alt="${escAttr(`${s.pe} — ${s.name}`)}" decoding="async" />
          </picture>
        </figure>

        <p class="dm-hero-line"><strong>${escHtml(s.heroLine)}</strong></p>

        <div class="prose article-body">
${bodyHtml(s)}
        </div>

      <section class="faq" aria-labelledby="faq-h">
        <h2 id="faq-h">Frequently asked questions</h2>
${faqHtml}
      </section>

        <nav class="related" aria-label="Related guides">
          <span class="kicker">Keep reading</span>
          <div class="related-grid">
            <a class="card related-card" href="/ten-japanese-elemental-types/">← All ten types</a>
            <a class="card related-card" href="/four-pillars-of-destiny-japanese-fortune-telling/">Four Pillars explained</a>
            <a class="card related-card" href="/reading/">Free reading</a>
          </div>
        </nav>
      </div>
    </article>
  </main>

  <footer class="site-footer">
    <div class="container stack">
      <nav class="footer-nav" aria-label="Footer"><a href="/about/">About</a> <a href="/reading/">Free Reading</a> <a href="/#articles">Guides</a></nav>
      <p class="disclaimer"><strong>For entertainment purposes only.</strong> Not medical, legal, or financial advice.</p>
      <p class="disclaimer">Independent, unofficial educational project. Not affiliated with, endorsed by, or connected to any registered fortune-telling brand.</p>
      <small>&copy; 2026 Japanese Fortune · japanesefortune.com</small>
    </div>
  </footer>
</body>
</html>
`;
}

import { STEMS } from "./daymaster-data.mjs";

// Single source of truth = daymaster-data.mjs. We emit HTML only (no parallel
// markdown) so the manuscript lives in exactly one place — no double-management.
for (const s of STEMS) {
  const dir = join(ROOT, "day-master", s.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(s), "utf8");
  console.log(`✓ /day-master/${s.slug}/  (${s.body.length} sections, ${s.faqs.length} FAQ)`);
}
console.log(`\nGenerated ${STEMS.length} Day-Master pages.`);
