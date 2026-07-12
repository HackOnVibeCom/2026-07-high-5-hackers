# LaunchPilot AI 🚀

**Your AI growth agent — from launch day to your first 10,000 users.**

LaunchPilot AI is an AI-assisted growth cockpit for newly launched mobile apps.
Give it your app's name, category, and pitch, and it generates a full launch
package (App Store metadata + platform-specific social copy), scores how ready
you are to launch, surfaces ranked growth recommendations, and lets you plan,
simulate, and "publish" campaigns — all in one workspace.

It runs as a **static single-page app** on Cloudflare Pages, backed by
**Cloudflare Pages Functions** for the AI/analytics endpoints. Everything works
**with or without an LLM API key**: when a key is present you get real
LLM-generated copy; when it isn't, a deterministic, context-aware engine produces
genuinely useful output — so the product never breaks in a demo.

---

## Features

| Area | What it does |
| --- | --- |
| **Dashboard** (`/`) | Live launch KPIs, Launch Health Score, and a ranked Growth Advisor feed. |
| **Onboarding** (`/onboarding`) | Guided, staged setup: app info → audience → competitors → assets → launch plan → campaign → growth. |
| **Studio** (`/studio`, `/studio/$type`) | Generate & edit ASO metadata and social drafts (Reddit / LinkedIn / Twitter / Instagram / TikTok), with version history and one-click "publish" to a simulated queue. |
| **Strategy** (`/strategy`) | Launch roadmap with checkable tasks. |
| **Discover** (`/discover`) | Curated competitors, communities, and influencers with bookmarking + an in-context advisor. |
| **Campaigns** (`/campaigns`, `/campaigns/new`, `/campaigns/$id`) | Create, schedule, and track launch campaigns. |
| **Analytics** (`/analytics`) | Channel performance and install trends, derived live from your dashboard data and campaign activity. |
| **Simulator** (`/simulator`) | A live "launch week" sandbox that grades your launch and projects installs. |
| **Growth Agent** (Ask AI button) | Context-aware AI chat (`/api/assistant`) that sees your app + current screen and deep-links its advice to the right page. |
| **Light / dark mode** | Toggle in the top nav (sun/moon). Dark-first; persisted in `localStorage`, applied pre-paint so there is no flash. |

---

## Tech stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router, built as a static SPA)
- **Build:** Vite 8 (`nitro: false`, `spa.enabled: true`) → static shell + client bundle
- **State:** Zustand (persisted to `localStorage`, key `launchpilot-state-v2`)
- **UI:** Tailwind CSS v4, Radix primitives (shadcn-style components), Framer Motion, Recharts, Lucide icons
- **Backend:** Cloudflare Pages Functions (Web-standard `fetch` handlers, no Node APIs)
- **LLM:** [OpenRouter](https://openrouter.ai) (optional) with a deterministic fallback engine

---

## Local development

Requires **Node 20+**.

```bash
npm install            # or pnpm install / bun install
npm run dev            # web on :8080, api on :8788 (proxied at /api)
```

`npm run dev` starts **both** the SPA (Vite, http://localhost:8080) and the local
API server (`scripts/dev-api.mjs`, http://127.0.0.1:8788). Vite proxies `/api/*`
to the API server, which loads the **exact same** `functions/api/*.ts` handlers
that deploy to Cloudflare — so local and production behavior match.

Run them separately if you prefer:

```bash
npm run dev:web        # SPA only
npm run dev:api        # API only
```

### Enabling real LLM output (optional)

Everything works without a key. To get live LLM-generated copy:

```bash
cp .dev.vars.example .dev.vars
# then edit .dev.vars and set OPENROUTER_API_KEY=...
```

`scripts/dev-api.mjs` loads `.dev.vars` automatically (mirroring `wrangler pages dev`).
Get a free-tier key at <https://openrouter.ai/keys>. Optionally override the model
with `OPENROUTER_MODEL` (default: `anthropic/claude-3.5-sonnet`).

---

## Build & deploy

```bash
npm run build          # vite build (SPA) + scripts/make-static.mjs
```

The build emits the client bundle to `dist/client/` and a prerendered shell
`dist/client/_shell.html`. `scripts/make-static.mjs` then copies `dist/client/*`
into **`out/`** and renames the shell to `out/index.html`, producing a clean
static site the HackOnVibe CI publishes.

### Cloudflare Pages

This repo auto-deploys via `.github/workflows/deploy.yml` on push to `main`:

1. CI detects the app in `stellar-launch-ai-main/`, runs `npm ci` + `npm run build`.
2. It publishes the first of `dist / build / out / .output/public` containing an
   `index.html` — here that's **`out/`**.
3. Wrangler bundles Pages Functions from the `functions/` directory at the **repo
   root** (its working directory). Those files are one-line shims re-exporting the
   real handlers in [`functions/`](./functions/) here, served at `/api/*`.
4. A SPA `_redirects` (`/* /index.html 200`) and `_headers` (`no-store`) are added
   by CI so client-side routing and cache-busting work.

### GitHub Pages (free static mirror)

`.github/workflows/gh-pages.yml` also publishes `out/` to GitHub Pages on every
push to `main` (repo Settings → Pages → Source = **GitHub Actions**, one time).
The build sets `PUBLIC_BASE_PATH=/<repo>/` so assets and routing work under the
project-site sub-path, and `make-static.mjs` emits a `404.html` SPA fallback.

> ⚠️ GitHub Pages is **static-only** — the `/api/*` Functions do not run there,
> so AI features degrade to their built-in defaults. Use the Cloudflare URL as
> the primary demo link.

**Production env vars** (Cloudflare Pages → Settings → Environment variables):

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | No | Enables real LLM copy/recommendations. Omit to use the deterministic engine. |
| `OPENROUTER_MODEL` | No | Override the default model. |

See [`functions/README.md`](./functions/README.md) for the backend/API contract.

---

## Project structure

```
stellar-launch-ai-main/
├── src/
│   ├── routes/            # File-based routes (TanStack Router)
│   ├── components/        # UI components (ui/ = shadcn primitives)
│   ├── hooks/use-theme.tsx # Light/dark theme state (class on <html> + localStorage)
│   ├── lib/store.ts       # Zustand store + all API actions
│   ├── lib/chart-theme.ts # Theme-aware Recharts colors (CSS variables)
│   ├── lib/mock-data.ts   # Seed notifications & demo data
│   └── styles.css         # Tailwind v4 entry: tokens, dark skin, light remaps
├── functions/
│   ├── api/*.ts           # Cloudflare Pages Functions (the backend)
│   └── _lib/              # Shared engine, OpenRouter client, HTTP helpers, directory data
├── scripts/
│   ├── dev.mjs            # Runs web + api together
│   ├── dev-api.mjs        # Local edge-function runner
│   └── make-static.mjs    # Post-build: assemble out/
└── vite.config.ts         # SPA config (nitro:false, spa.enabled)
```

> **Routing note:** this app uses TanStack Start file-based routing. Do not add
> `src/pages/` or Next.js/Remix conventions — see [`src/routes/README.md`](./src/routes/README.md).
