# LaunchPilot AI 🚀

**Your AI growth agent — from launch day to your first 10,000 users.**

This is the team repo for **LaunchPilot AI**, an AI-assisted growth cockpit for
newly launched mobile apps. The full application lives in
[`stellar-launch-ai-main/`](./stellar-launch-ai-main/).

> 📖 **Start here:** [`stellar-launch-ai-main/README.md`](./stellar-launch-ai-main/README.md)
> for features, local dev, the API contract, and deployment details.

## Quick start

```bash
cd stellar-launch-ai-main
npm install
npm run dev      # web on http://localhost:8080, api proxied at /api
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app
in `stellar-launch-ai-main/` (`npm run build` → static site in `out/`) and
deploys it to Cloudflare Pages, with the edge API in
`stellar-launch-ai-main/functions/` served at `/api/*`.

Everything runs **without any API key** thanks to a deterministic fallback
engine. To enable live LLM output, set `OPENROUTER_API_KEY` in Cloudflare Pages
env vars (see the app README).
