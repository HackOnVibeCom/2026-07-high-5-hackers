# Deploy shims — do not add logic here

The real backend lives in [`../stellar-launch-ai-main/functions/`](../stellar-launch-ai-main/functions/).

These files exist only because the HackOnVibe CI (`.github/workflows/deploy.yml`,
managed centrally by the organizers) runs `wrangler pages deploy` from the **repo
root**, and Wrangler only bundles Pages Functions from a `functions/` directory in
its working directory. Each file below simply re-exports the real handler so the
deployed site serves the same `/api/*` endpoints you get in local dev.

If you add a new endpoint under `stellar-launch-ai-main/functions/api/`, add a
matching one-line re-export file here.
