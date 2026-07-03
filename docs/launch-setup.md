# Launch Setup — GA4, Search Console, and Publishing

Everything the site needs to go live. The **analytics tag and Search Console
verification hooks are already embedded** on every page (as no-ops), so most of
this is account setup + pasting one or two values.

> **Publishing waits for Mona's final approval.** The repo is **private**. Do not
> enable GitHub Pages or flip the repo to public until sign-off — steps 3–4 below
> are the "when approved" actions.

---

## 1. Google Analytics 4 (GA4)

The tag is wired via [`assets/js/analytics.js`](../assets/js/analytics.js) and
loaded on all pages. It stays **off** until a real Measurement ID is set — no
cookies or network calls before then.

1. Go to **analytics.google.com** → Admin → **Create property** ("Japanese Fortune").
2. Add a **Web data stream** for `https://japanesefortune.xyz`.
3. Copy the **Measurement ID** (looks like `G-ABCD1234`).
4. Edit **one line** in `assets/js/analytics.js`:
   ```js
   var GA4_MEASUREMENT_ID = "G-ABCD1234"; // ← your real ID
   ```
5. Commit + push. Every page picks it up automatically. Verify in GA4 **Realtime**
   after visiting the live site.

Notes: `anonymize_ip` is already on. If you later add a consent banner, gate the
IIFE in `analytics.js` on consent.

---

## 2. Google Search Console

Recommended: verify the **whole domain** once (covers every page + subpath).

**Option A — DNS TXT (recommended, no code):**
1. search.google.com/search-console → Add property → **Domain** → `japanesefortune.xyz`.
2. Copy the `google-site-verification=…` **TXT** value it gives you.
3. Add it as a **TXT record** at the domain's DNS (same place as the Pages A/AAAA
   + www CNAME records). Wait for propagation, then click **Verify**.

**Option B — HTML tag (per-page):** each page's `<head>` already has a commented
placeholder:
```html
<!-- <meta name="google-site-verification" content="PASTE_TOKEN_HERE" /> -->
```
Uncomment it and paste the token in `index.html`, `reading/index.html`, and the
generator template `tools/build-articles.mjs` (then `npm run build:articles`).
Option A is cleaner — prefer it.

**After verification:**
- Submit the sitemap: **Sitemaps → add** `https://japanesefortune.xyz/sitemap.xml`.
- Use **URL Inspection → Request indexing** for article 1 (the drama entry point) to speed first impressions.

---

## 3. Enable GitHub Pages  *(when approved)*

1. Repo → **Settings → Pages**.
2. **Source: Deploy from a branch** → branch `main`, folder `/ (root)`.
3. **Custom domain**: `japanesefortune.xyz` (the [`CNAME`](../CNAME) file is already
   in the repo, so this should populate automatically). Enable **Enforce HTTPS**.

DNS (Mona's task, likely already done for the domain):
- Apex `japanesefortune.xyz` → GitHub Pages **A/AAAA** records
  (`185.199.108–111.153` and the IPv6 set).
- `www` → **CNAME** to `<user>.github.io`.

CLI alternative once approved:
```bash
gh api -X POST repos/Mona-123456/japanesefortune/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

## 4. Make the repository public  *(when approved)*

GitHub Pages on the **Free** plan requires a public repo (Pro can serve Pages from
private). To publish on Free:
```bash
gh repo edit Mona-123456/japanesefortune --visibility public --accept-visibility-change-consequences
```
> Before flipping to public, confirm nothing sensitive is committed. The internal
> spec (`japanese-fortune-mvp-spec.md`) is already **git-ignored** and not in the
> repo; `node_modules` and `.env*` are ignored too. Double-check `git ls-files`.

---

## 5. Post-launch (first 2 weeks — spec §5)

- Search Console: watch impressions for "straight to hell netflix" queries (article 1).
- GA4: reading-tool runs, article → reading transition rate, email-CTA / follow conversions.
- Re-run **Lighthouse mobile** on the live URL; keep it **90+**.
- Decision gate: weekly sessions in the hundreds **and** non-zero conversion → start Phase 2; otherwise leave the articles up as a zero-maintenance asset.
