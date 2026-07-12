// Vite configuration for LaunchPilot AI (TanStack Start, built as a static SPA).
//
// The HackOnVibe CI (.github/workflows/deploy.yml) auto-deploys a STATIC site: it
// looks for an index.html in dist / build / out / .output/public. A default
// TanStack Start build emits a Cloudflare Worker (SSR) with NO index.html, so the
// CI treats it as "broken" and serves an error page instead of the app.
//
// Fix: disable the Nitro server build (`nitro: false`) and turn on SPA mode so the
// build prerenders a static shell to the client output dir (dist/) with an
// index.html the CI can publish. The app is client-rendered and uses in-memory
// mock data + a zustand store, so it needs no server at runtime.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Skip the Nitro (Cloudflare Worker) server build — we ship a static SPA.
  nitro: false,
  tanstackStart: {
    // Emit a static index.html shell and client-render every route.
    spa: { enabled: true },
  },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8788",
          changeOrigin: true,
        },
      },
    },
  },
});
