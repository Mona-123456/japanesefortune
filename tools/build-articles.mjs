/* ==========================================================================
   Article generator — content/article-*.md  →  static HTML (no runtime build).
   --------------------------------------------------------------------------
   Run:  node tools/build-articles.mjs
   Output: <slug>/index.html for each article, plus an updated sitemap.xml.

   Deliberately a ONE-SHOT generator: the site itself ships as plain static
   HTML (spec §2.3 — "Mona が1人で更新できる構造"). Re-run this after editing a
   draft in content/. The markdown subset here is tuned to those drafts.
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://japanesefortune.xyz";
const BUILD_DATE = "2026-07-03"; // datePublished / dateModified

/* --- article registry: slug + internal-link key + OG image ---------------- */
const ARTICLES = [
  { n: 1, key: "HOSOKI",      file: "article-1-kazuko-hosoki.md",                     slug: "kazuko-hosoki-straight-to-hell-true-story", og: "og-hosoki.png",      schema: ["Article", "FAQPage"] },
  { n: 2, key: "ROKUSEI",     file: "article-2-rokusei-senjutsu.md",                  slug: "rokusei-senjutsu-explained",                og: "og-rokusei.png",     schema: ["Article", "FAQPage"] },
  { n: 3, key: "DAISAKKAI",   file: "article-3-daisakkai.md",                         slug: "daisakkai-meaning-japan-unlucky-years",     og: "og-daisakkai.png",   schema: ["Article", "FAQPage"] },
  { n: 4, key: "FOURPILLARS", file: "article-4-four-pillars.md",                      slug: "four-pillars-of-destiny-japanese-fortune-telling", og: "og-four-pillars.png", schema: ["Article", "FAQPage"] },
  { n: 5, key: "TYPES",       file: "article-5-types-of-japanese-fortune-telling.md", slug: "types-of-japanese-fortune-telling",         og: "og-types.png",       schema: ["Article", "FAQPage", "ItemList"] },
];

// Internal-link keys → resolved URLs.
const LINKS = Object.fromEntries(ARTICLES.map((a) => [a.key, `/${a.slug}/`]));
LINKS.TOOL = "/reading/";

/* --- tiny helpers --------------------------------------------------------- */
const escapeHtml = (s) =>
  s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const escapeAttr = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Inline markdown: links [t][KEY] / [t](url), **bold**, *italic*. */
function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\[([A-Z]+)\]/g, (m, label, key) => {
    const url = LINKS[key];
    if (!url) { console.warn(`  ! unknown link key [${key}]`); return label; }
    return `<a href="${url}">${label}</a>`;
  });
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

/* --- markdown → structured parse ----------------------------------------- */
function parseArticle(md) {
  const meta = {};
  // META comment: parse "- key: value" lines inside the first HTML comment.
  const metaComment = md.match(/<!--([\s\S]*?)-->/);
  if (metaComment) {
    for (const line of metaComment[1].split("\n")) {
      const m = line.match(/^-\s*([a-z ]+?):\s*(.+)$/i);
      if (m) meta[m[1].trim().toLowerCase()] = m[2].trim();
    }
  }
  // Strip all HTML comments before block parsing.
  const body = md.replace(/<!--[\s\S]*?-->/g, "");

  const lines = body.split("\n");
  let title = "";
  let note = "";
  const blocks = [];          // {type, ...}
  const faqs = [];            // {q, a}
  let i = 0;
  let inFaq = false;

  const flushPara = (buf) => { if (buf.length) blocks.push({ type: "p", text: buf.join(" ") }); };

  while (i < lines.length) {
    let line = lines[i];
    const t = line.trim();

    if (t === "") { i++; continue; }

    if (t.startsWith("# ")) {                       // H1 (article title)
      title = t.slice(2).replace(/^Article\s+\d+\s*[—-]\s*/, "").trim();
      i++; continue;
    }
    if (t.startsWith("## ")) {
      const heading = t.slice(3).trim();
      if (/^faq$/i.test(heading)) { inFaq = true; i++; continue; }
      blocks.push({ type: "h2", text: heading });
      i++; continue;
    }
    if (t === "---") { i++; continue; }             // section rule (implicit)

    if (t.startsWith(">")) {                        // blockquote → note callout
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      note = buf.join(" ");
      continue;
    }

    if (inFaq) {
      // FAQ: **Question?** on its own line, then answer paragraph(s).
      const q = t.match(/^\*\*(.+?)\*\*$/);
      if (q) {
        const question = q[1].trim();
        i++;
        const ans = [];
        while (i < lines.length && lines[i].trim() !== "" && !/^\*\*(.+?)\*\*$/.test(lines[i].trim())) {
          ans.push(lines[i].trim());
          i++;
        }
        faqs.push({ q: question, a: ans.join(" ") });
        continue;
      }
      i++; continue;
    }

    if (t.startsWith("- ")) {                        // unordered list
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // paragraph (accumulate until blank / block boundary)
    const buf = [];
    while (i < lines.length) {
      const s = lines[i].trim();
      if (s === "" || s.startsWith("#") || s.startsWith(">") || s === "---" || s.startsWith("- ")) break;
      buf.push(s);
      i++;
    }
    flushPara(buf);
  }

  return { meta, title, note, blocks, faqs };
}

/* --- render blocks to HTML ------------------------------------------------ */
function renderBlocks(blocks) {
  return blocks.map((b) => {
    if (b.type === "h2") return `      <h2>${inline(b.text)}</h2>`;
    if (b.type === "p") return `      <p>${inline(b.text)}</p>`;
    if (b.type === "ul") return `      <ul>\n${b.items.map((it) => `        <li>${inline(it)}</li>`).join("\n")}\n      </ul>`;
    return "";
  }).join("\n");
}

function renderFaq(faqs) {
  if (!faqs.length) return "";
  const items = faqs.map((f) => `        <div class="faq-item">
          <h3 class="faq-q">${inline(f.q)}</h3>
          <div class="faq-a"><p>${inline(f.a)}</p></div>
        </div>`).join("\n");
  return `
      <section class="faq" aria-labelledby="faq-h">
        <h2 id="faq-h">Frequently asked questions</h2>
${items}
      </section>`;
}

/* --- JSON-LD -------------------------------------------------------------- */
function jsonLd(article, parsed, url) {
  const graph = [];
  const image = `${SITE}/assets/img/${article.og}`;

  if (article.schema.includes("Article")) {
    graph.push({
      "@type": "Article",
      headline: parsed.title,
      description: parsed.meta["meta description"] || "",
      image: [image],
      datePublished: BUILD_DATE,
      dateModified: BUILD_DATE,
      inLanguage: "en",
      author: { "@type": "Organization", name: "Japanese Fortune", url: SITE + "/" },
      publisher: {
        "@type": "Organization",
        name: "Japanese Fortune",
        logo: { "@type": "ImageObject", url: `${SITE}/assets/img/og-default.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    });
  }
  if (article.schema.includes("FAQPage") && parsed.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: parsed.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  if (article.schema.includes("ItemList")) {
    // Build from numbered H2s ("## 1. Omikuji — …").
    const items = parsed.blocks
      .filter((b) => b.type === "h2" && /^\d+\.\s/.test(b.text))
      .map((b, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: b.text.replace(/^\d+\.\s*/, "").replace(/\s*[—-].*$/, "").trim(),
      }));
    if (items.length) graph.push({ "@type": "ItemList", itemListElement: items });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

/* --- page shell ----------------------------------------------------------- */
function page(article, parsed) {
  const url = `${SITE}/${article.slug}/`;
  // Drop the draft's char-count / alternative-title annotation: "… (58 chars…)".
  const titleTag = (parsed.meta["title tag"] || parsed.title)
    .replace(/\s*\(\d+\s*chars[\s\S]*$/i, "")
    .trim();
  const desc = parsed.meta["meta description"] || "";
  const og = `${SITE}/assets/img/${article.og}`;

  // Related links: every article except this one + the tool.
  const related = ARTICLES.filter((a) => a.n !== article.n).slice(0, 3);

  const noteHtml = parsed.note
    ? `      <aside class="note" role="note">${inline(parsed.note)}</aside>\n`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(titleTag)}</title>
  <meta name="description" content="${escapeAttr(desc)}" />
  <link rel="canonical" href="${url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Japanese Fortune" />
  <meta property="og:title" content="${escapeAttr(parsed.title)}" />
  <meta property="og:description" content="${escapeAttr(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${og}" />
  <meta property="article:published_time" content="${BUILD_DATE}" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="stylesheet" href="/assets/css/tokens.css" />
  <link rel="stylesheet" href="/assets/css/base.css" />
  <link rel="stylesheet" href="/assets/css/article.css" />

  <!-- Search Console: verify the whole domain with a DNS TXT record (recommended),
       or uncomment and paste the HTML-tag token: -->
  <!-- <meta name="google-site-verification" content="PASTE_TOKEN_HERE" /> -->
  <script defer src="/assets/js/analytics.js"></script>

  <script type="application/ld+json">
${jsonLd(article, parsed, url)}
  </script>
</head>
<body>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="/"><span class="brand__mark">☰</span> Japanese&nbsp;Fortune</a>
      <nav class="nav" aria-label="Primary">
        <a href="/reading/">Free Reading</a>
        <a href="/#articles">Guides</a>
      </nav>
    </div>
  </header>

  <main>
    <article class="article">
      <div class="container container--narrow">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a> <span aria-hidden="true">›</span> <a href="/#articles">Guides</a>
        </nav>

        <header class="article-head">
          <span class="kicker">Guide</span>
          <h1>${inline(parsed.title)}</h1>
          <p class="article-meta">Japanese Fortune · <time datetime="${BUILD_DATE}">July 2026</time></p>
        </header>

${noteHtml}
        <div class="prose article-body">
${renderBlocks(parsed.blocks)}
        </div>
${renderFaq(parsed.faqs)}

        <div class="tool-cta card">
          <h2>Try a free Four Pillars reading</h2>
          <p style="color:var(--color-text-muted)">Your Day Master, five-element balance, and 2026 outlook — calculated privately in your browser from your date of birth.</p>
          <p><a class="btn" href="/reading/">Start your free reading →</a></p>
        </div>

        <nav class="related" aria-label="Related guides">
          <span class="kicker">Keep reading</span>
          <div class="related-grid">
${related.map((a) => `            <a class="card related-card" href="/${a.slug}/">${escapeHtml(TITLES[a.n])}</a>`).join("\n")}
          </div>
        </nav>
      </div>
    </article>
  </main>

  <footer class="site-footer">
    <div class="container stack">
      <p class="disclaimer"><strong>For entertainment purposes only.</strong> Not medical, legal, or financial advice.</p>
      <p class="disclaimer">Independent, unofficial fan and educational project. Not affiliated with, endorsed by, or connected to Netflix, the Hosoki office, or any registered fortune-telling brand.</p>
      <small>&copy; 2026 Japanese Fortune · japanesefortune.xyz</small>
    </div>
  </footer>
</body>
</html>
`;
}

/* --- run ------------------------------------------------------------------ */
const TITLES = {}; // n → short title for related cards (filled during parse)

const parsedAll = ARTICLES.map((a) => {
  const md = readFileSync(join(ROOT, "content", a.file), "utf8");
  const parsed = parseArticle(md);
  TITLES[a.n] = parsed.title;
  return { a, parsed };
});

for (const { a, parsed } of parsedAll) {
  const dir = join(ROOT, a.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(a, parsed), "utf8");
  console.log(`✓ /${a.slug}/  (${parsed.blocks.length} blocks, ${parsed.faqs.length} FAQ, schema: ${a.schema.join("+")})`);
}

/* --- sitemap -------------------------------------------------------------- */
const urls = [
  { loc: `${SITE}/`, priority: "1.0", freq: "weekly" },
  { loc: `${SITE}/reading/`, priority: "0.9", freq: "monthly" },
  ...ARTICLES.map((a) => ({ loc: `${SITE}/${a.slug}/`, priority: "0.8", freq: "monthly" })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
writeFileSync(join(ROOT, "sitemap.xml"), sitemap, "utf8");
console.log(`✓ sitemap.xml (${urls.length} URLs)`);
