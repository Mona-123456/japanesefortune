/* ==========================================================================
   Zodiac page generator — one /zodiac/<slug>/ per Earthly Branch (12 animals).
   --------------------------------------------------------------------------
   Run:  node tools/build-zodiac-pages.mjs
   Output: zodiac/<slug>/index.html for each branch in tools/zodiac-data.mjs.

   Same shell as the Day-Master generator (build-daymaster-pages.mjs, untouched):
   Article + BreadcrumbList + FAQPage schema, hero symbol on the page ground,
   two-sentence identity line, then an inline calendar-meta line (element / hour
   / direction / season — no table, wraps at 320px). Does NOT touch sitemap.xml.
   ARTICLE9 (the twelve-signs hub) doesn't exist yet — its link is provisional.
   ========================================================================== */

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { BRANCHES } from "./zodiac-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://japanesefortune.com";
const DATE = "2026-07-17";

const LINKS = {
  TOOL: "/reading/",
  ARTICLE9: "/japanese-zodiac-animals/", // the twelve-signs hub (article 9)
  FOURPILLARS: "/four-pillars-of-destiny-japanese-fortune-telling/",
};

const escHtml = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const escAttr = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Body prose is delivered as trusted inline HTML (<em>/<strong>), so it passes
// through verbatim. Headings, FAQ, H1 and the hero line are plain text → escaped.
function renderBlocks(blocks) {
  return blocks.map((b) => {
    if (typeof b === "string") return `      <p>${b}</p>`;
    if (b.ul) return `      <ul>\n${b.ul.map((it) => `        <li>${it}</li>`).join("\n")}\n      </ul>`;
    return "";
  }).join("\n");
}

function jsonLd(s, url, og) {
  const graph = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "The 12 Signs", item: SITE + LINKS.ARTICLE9 },
        { "@type": "ListItem", position: 3, name: `${s.animal} (${s.cn})` },
      ],
    },
    {
      "@type": "Article",
      headline: s.h1,
      description: s.metaDesc,
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
  const sections = s.body.map((sec) => `      <h2>${escHtml(sec.h)}</h2>\n${renderBlocks(sec.b)}`).join("\n");
  const tail = `      <p>The ${escHtml(s.animal)} is one of <a href="${LINKS.ARTICLE9}">the twelve Earthly Branches</a> — the ox, the tiger, the dragon, and the rest.</p>\n      <p><a href="${LINKS.TOOL}">See your full chart — free →</a></p>`;
  return sections + "\n" + tail;
}

function metaLine(s) {
  const parts = [
    ["Element", s.element], ["Hour", s.hours], ["Direction", s.direction], ["Season", s.season],
  ].map(([k, v]) => `${k}: <strong>${escHtml(v)}</strong>`);
  return `        <p class="zodiac-meta">${parts.join(" · ")}</p>`;
}

function page(s) {
  const url = `${SITE}/zodiac/${s.key}/`;
  const og = `${SITE}/assets/img/og-zodiac-${s.key}.png`;
  const faqHtml = s.faqs.map((f) => `        <div class="faq-item">
          <h3 class="faq-q">${escHtml(f.q)}</h3>
          <div class="faq-a"><p>${escHtml(f.a)}</p></div>
        </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/icon-32.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#0b0a09" />
  <title>${escHtml(s.h1)}</title>
  <meta name="description" content="${escAttr(s.metaDesc)}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Japanese Fortune" />
  <meta property="og:title" content="${escAttr(s.h1)}" />
  <meta property="og:description" content="${escAttr(s.metaDesc)}" />
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
          <a href="/">Home</a> <span aria-hidden="true">›</span> <a href="${LINKS.ARTICLE9}">The 12 Signs</a>
        </nav>

        <header class="article-head">
          <span class="kicker">Earthly Branch · 十二支</span>
          <h1 class="dm-page-title">${escHtml(s.h1)}</h1>
        </header>

        <figure class="dm-hero">
          <picture>
            <source type="image/avif" srcset="/assets/img/zodiac-${s.key}-320.avif 320w, /assets/img/zodiac-${s.key}-640.avif 640w" sizes="(max-width: 26rem) 78vw, 360px" />
            <source type="image/webp" srcset="/assets/img/zodiac-${s.key}-320.webp 320w, /assets/img/zodiac-${s.key}-640.webp 640w" sizes="(max-width: 26rem) 78vw, 360px" />
            <img class="dm-hero__img" src="/assets/img/zodiac-${s.key}.png" width="360" height="360" alt="${escAttr(`${s.animal} (${s.cn}) — Japanese zodiac`)}" decoding="async" />
          </picture>
        </figure>

        <p class="dm-hero-line"><strong>${escHtml(s.heroLine)}</strong></p>
${metaLine(s)}

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
            <a class="card related-card" href="${LINKS.ARTICLE9}">← All twelve signs</a>
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

for (const s of BRANCHES) {
  const dir = join(ROOT, "zodiac", s.key);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(s), "utf8");
  console.log(`✓ /zodiac/${s.key}/  (${s.body.length} sections, ${s.faqs.length} FAQ)`);
}
console.log(`\nGenerated ${BRANCHES.length} zodiac page(s).`);
