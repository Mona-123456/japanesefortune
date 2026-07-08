# worker/ — Phase 2 paid-tier assets (NOT served to the client)

These manuscripts feed the **paid** reading, which is composed server-side by a
Cloudflare Worker calling the Claude API (spec §0: paid bodies must not ship to
the free client). This directory is **excluded from GitHub Pages** (see
`_config.yml`). The synthesis skeleton (`assets/js/reading/synthesis.js`) accepts
these as `manuscripts` arguments.

- `readings-ten-gods.json` — per-star paid body (`base`)
- `readings-strength-spin.json` — strong/weak/balanced spin
- `readings-daiun-spin.json` — 大運 theme (by god) × phase (by stage)
- `readings-compatibility.json` — compatibility modules

**When real paid content is delivered**, it should live in the Worker's private
storage (KV / secret / private repo), not committed to this public repo. These
scaffolds only define the shape for the skeleton. Billing (Stripe) + the Worker
fetch are gated for later (課金はゲート後).
