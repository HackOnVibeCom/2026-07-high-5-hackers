# LaunchPilot AI — Backend (Cloudflare Pages Functions)

These are the app's edge API endpoints. Each file in `api/` is a
[Cloudflare Pages Function](https://developers.cloudflare.com/pages/functions/)
using **Web-standard `fetch` handlers only** (no Node APIs), so the same files
run on the Cloudflare edge in production and through the local runner
(`scripts/dev-api.mjs`) in development.

## Design: always-on, key-optional

Every LLM-backed endpoint has a **deterministic fallback**:

- `_lib/engine.ts` — pure, I/O-free functions that generate ASO copy, social
  posts, a Launch Health Score, growth recommendations, and dashboard KPIs from
  the app's name / category / description. These always run and always return
  useful, context-aware output.
- `_lib/openrouter.ts` — thin OpenRouter client. If `OPENROUTER_API_KEY` is
  absent or any call fails, it returns `null` and the endpoint falls back to the
  engine. **The product never breaks**, with or without a key.

So a judge running the demo with no key still gets a fully working app; adding a
key upgrades the copy to live LLM output.

## Endpoints

| Route | Method | Body / Query | Returns |
| --- | --- | --- | --- |
| `/api/dashboard` | `POST` | `AppContext` | `{ installs, installsDelta, activationRate, productHuntRank, weeklyInstalls[], topChannel }` |
| `/api/launch-health-score` | `POST` | `AppContext` | `{ score, breakdown{asoQuality,contentReadiness,campaignExecution,communityPresence}, summary }` |
| `/api/recommendations` | `POST` | `AppContext` | `Recommendation[]` (`finding, cause, recommendation, confidence, expected_impact, tone`) |
| `/api/generate-content` | `POST` | `{ name, category, description }` | `{ aso{title,subtitle,keywords[],longDescription}, social[], source }` |
| `/api/competitors` | `GET` | — | curated competitor list |
| `/api/communities` | `GET` | — | curated community list |
| `/api/influencers` | `GET` | — | curated influencer list |

`AppContext` (sent by the frontend store as the "context payload") is defined in
[`_lib/http.ts`](./_lib/http.ts): app metadata, current ASO fields, social
drafts, campaigns, and completed onboarding stages. The engine reads it to make
scores and recommendations reflect the user's actual progress.

All endpoints:

- Handle CORS preflight via `onRequestOptions` (`_lib/http.ts → preflight`).
- Return `Cache-Control: no-store` so the edge never serves stale AI output.
- Never throw — bad JSON bodies parse to `{}` and endpoints degrade gracefully.

## Environment variables

Set locally in `.dev.vars` (gitignored) or in Cloudflare Pages → Settings →
Environment variables:

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `OPENROUTER_API_KEY` | No | — | Enables live LLM output. Omit → deterministic engine. |
| `OPENROUTER_MODEL` | No | `anthropic/claude-3.5-sonnet` | Override the model. |

## Files

```
functions/
├── api/
│   ├── dashboard.ts             POST — KPIs
│   ├── launch-health-score.ts   POST — readiness score
│   ├── recommendations.ts       POST — growth advisor (LLM + fallback)
│   ├── generate-content.ts      POST — ASO + social package (LLM + fallback)
│   ├── competitors.ts           GET  — directory
│   ├── communities.ts           GET  — directory
│   └── influencers.ts           GET  — directory
└── _lib/
    ├── engine.ts        deterministic content + analytics engine (pure)
    ├── openrouter.ts    OpenRouter client (returns null on any failure)
    ├── http.ts          json()/preflight()/readJSON() + AppContext type
    └── directory.ts     static competitor/community/influencer data
```
