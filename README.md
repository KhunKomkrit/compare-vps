# VPS Team Cost Planner
Single-page Thai infrastructure planner using Vite, Tailwind CSS and Mermaid. All calculations run in the browser; no server credentials are collected.

## Local
Node 22+: `pnpm install --frozen-lockfile`, then `pnpm run dev`. Production: `pnpm run build`.

## GitHub Pages
Push these source files to the root of a public repository on branch `develop`. In Settings → Pages → Build and deployment, select GitHub Actions. The included workflow publishes `dist/`. If needed, run Publish GitHub Pages manually in Actions.

Pricing is a snapshot dated 2026-10-17; FX defaults to a scenario of 35 THB/USD. Tax is an optional 7% scenario, not a tax determination. Specs do not guarantee equal CPU or disk performance. Excludes backup, licenses, support and migration. See the source links and assumptions in the page.
