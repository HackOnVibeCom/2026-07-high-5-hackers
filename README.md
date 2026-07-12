# LaunchPilot AI 🚀

**Your AI growth agent — from launch day to your first 10,000 users.**

LaunchPilot AI is an AI-assisted growth cockpit for newly launched mobile apps.
Describe your app once, and it generates your App Store metadata and social
launch copy, scores your launch readiness in real time, surfaces ranked growth
recommendations, matches you with communities and influencers, and lets you
plan, simulate, and publish campaigns — all from one workspace, with a
context-aware AI assistant one click away on every screen.

Built by **Team High 5 Hackers** for the HackOnVibe hackathon.

---

## Why it's different

- **Always-on AI, key-optional.** Every AI endpoint pairs an LLM (via
  OpenRouter) with a deterministic, context-aware fallback engine. No API key?
  The product still works end to end — a judge can clone and run it with zero
  setup and nothing breaks mid-demo.
- **Human-in-the-loop.** Every AI draft stays locked until you approve it.
  Publishing goes through a visible queue — no rogue posting.
- **It closes the loop.** Most tools stop at "here's a chart." LaunchPilot's
  Growth Advisor tells you *what happened, why, and the exact next action* —
  and deep-links you to the screen where you can take it.

## Product tour

| Screen | What you can do |
| --- | --- |
| **Landing / Dashboard** (`/`) | Animated 3D landing board → after onboarding: live KPIs, Launch Health Score, ranked Growth Advisor feed. |
| **Onboarding** (`/onboarding`) | Staged setup: app info → audience → competitors → assets → launch plan → campaign → growth. |
| **Studio** (`/studio`) | One-click AI **Brand Launch Package**: ASO metadata + Reddit/LinkedIn/Twitter drafts, with version history and approval-gated publishing. |
| **Strategy** (`/strategy`) | Launch roadmap with checkable tasks and competitor intel. |
| **Campaigns** (`/campaigns`) | Create, schedule, and track launch campaigns across platforms. |
| **Sandbox Simulator** (`/simulator`) | Simulate a full launch week — watch installs, CTR, and rank evolve, get a letter grade. |
| **Discover** (`/discover`) | Curated communities and influencers with bookmarking. |
| **Analytics** (`/analytics`) | Install trends and channel performance derived from your real campaign data (unlocks once a campaign runs). |
| **Growth Agent** (Ask AI) | Context-aware AI chat that knows your app and your current screen, and links its advice to the right page. |
| **Light / dark mode** | Sun/moon toggle in the nav; dark-first, persisted, no flash on load. |

## Architecture

```
┌────────────────────────────── Browser ──────────────────────────────┐
│  TanStack Start SPA (React 19) · Tailwind v4 · Zustand (persisted)  │
│  src/lib/store.ts — every screen reads state + API actions here     │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ fetch /api/* (JSON)
┌───────────────────────────────▼─────────────────────────────────────┐
│  Cloudflare Pages Functions (Web-standard fetch handlers, edge)     │
│  stellar-launch-ai-main/functions/api/                              │
│   dashboard · launch-health-score · recommendations ·               │
│   generate-content · assistant · competitors · communities ·        │
│   influencers                                                       │
│        │                                                            │
│        ├── _lib/openrouter.ts  → OpenRouter LLM (if key present)    │
│        └── _lib/engine.ts      → deterministic fallback (always)    │
└─────────────────────────────────────────────────────────────────────┘
```

- **Frontend:** [TanStack Start](https://tanstack.com/start) (React 19), built
  as a fully static SPA (`nitro: false`). State lives in a Zustand store
  persisted to `localStorage`; all backend calls are actions on that store.
- **Backend:** Cloudflare Pages Functions — no servers, no cold-start pain,
  same files run locally and at the edge.
- **AI:** OpenRouter (`anthropic/claude-3.5-sonnet` by default) with the
  deterministic engine as a guaranteed fallback.

📖 Full details: [`stellar-launch-ai-main/README.md`](./stellar-launch-ai-main/README.md) ·
API contract: [`stellar-launch-ai-main/functions/README.md`](./stellar-launch-ai-main/functions/README.md)

## Quick start

Requires **Node 20+**.

```bash
cd stellar-launch-ai-main
npm install
npm run dev      # web on http://localhost:8080 · api on :8788 (proxied at /api)
```

One command starts both the SPA and the local API runner — the same
`functions/api/*.ts` files that deploy to the edge, so local and production
behave identically.

**Optional — live LLM output:**

```bash
cd stellar-launch-ai-main
cp .dev.vars.example .dev.vars   # then set OPENROUTER_API_KEY=...
```

Without a key everything still works via the deterministic engine.

## Repository layout

```
.
├── stellar-launch-ai-main/   # The application (frontend + backend + scripts)
├── functions/                # Deploy shims → re-export the app's API handlers
│                             #   (the CI runs wrangler from the repo root)
├── .github/workflows/
│   ├── deploy.yml            # HackOnVibe CI → Cloudflare Pages (organizer-managed)
│   └── gh-pages.yml          # Free static mirror → GitHub Pages
├── LICENSE                   # MIT
└── README.md                 # You are here
```

## Deployment

| Target | Trigger | What runs |
| --- | --- | --- |
| **Cloudflare Pages** (primary) | push to `main` | Static site from `out/` **plus** the `/api/*` edge Functions — the full product. Set `OPENROUTER_API_KEY` in Pages env vars for live LLM output. |
| **GitHub Pages** (free mirror) | push to `main` | Static site only — `/api/*` does not run; AI features degrade to built-in defaults. Enable once: Settings → Pages → Source = "GitHub Actions". |

## Team

**High 5 Hackers** — HackOnVibe 2026.

## License

[MIT](./LICENSE)
