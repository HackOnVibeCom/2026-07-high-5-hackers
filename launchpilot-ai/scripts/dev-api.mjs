// Local dev backend for LaunchPilot AI.
//
// The production backend is Cloudflare Pages Functions in `functions/api/*.ts`
// (Web-standard fetch handlers). Locally there's no Cloudflare runtime, so this
// tiny server loads those SAME handler files through Vite's SSR module loader
// (Vite is already a dependency and transpiles the TS for us) and serves them on
// http://127.0.0.1:8788 — exactly where vite.config.ts proxies `/api`.
//
// Result: `pnpm dev` gives you the real backend on localhost with zero extra deps,
// and the identical function files deploy unchanged to Cloudflare Pages.

import { createServer as createHttpServer } from "node:http";
import { readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);
const functionsDir = join(root, "functions", "api");
const PORT = Number(process.env.API_PORT || 8788);

// Load .dev.vars (KEY=value lines) into process.env, mirroring `wrangler pages dev`.
async function loadDevVars() {
  try {
    const { readFileSync, existsSync } = await import("node:fs");
    const p = join(root, ".dev.vars");
    if (!existsSync(p)) return;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    console.log("[dev-api] loaded .dev.vars");
  } catch (e) {
    console.warn("[dev-api] could not read .dev.vars:", e.message);
  }
}

// Convert a Node req/res pair into a Web Request, run a Pages handler, write back.
function toWebRequest(req) {
  const url = `http://${req.headers.host || "127.0.0.1"}${req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === "string") headers.set(k, v);
    else if (Array.isArray(v)) headers.set(k, v.join(", "));
  }
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () =>
      resolve(
        new Request(url, {
          method: req.method,
          headers,
          body: hasBody && chunks.length ? Buffer.concat(chunks) : undefined,
        }),
      ),
    );
  });
}

async function main() {
  await loadDevVars();

  // We use Vite ONLY as a TS/ESM module loader (ssrLoadModule) — no dev server, no
  // HMR, no file watching. Disabling all three keeps it from grabbing the HMR
  // WebSocket port (24678), which the real web-facing Vite already owns.
  const vite = await createViteServer({
    root,
    appType: "custom",
    server: { middlewareMode: true, hmr: false, watch: null, ws: false },
    optimizeDeps: { noDiscovery: true },
    logLevel: "warn",
  });

  // Map "/api/<name>" -> functions/api/<name>.ts
  const routes = new Map();
  for (const file of readdirSync(functionsDir)) {
    if (!/\.(t|j)s$/.test(file)) continue;
    routes.set(`/api/${basename(file).replace(/\.(t|j)s$/, "")}`, join(functionsDir, file));
  }
  console.log(`[dev-api] routes: ${[...routes.keys()].sort().join(", ")}`);

  const server = createHttpServer(async (req, res) => {
    const path = (req.url || "").split("?")[0].replace(/\/$/, "") || "/";
    const modPath = routes.get(path);

    if (!modPath) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Not found", path }));
      return;
    }

    try {
      const mod = await vite.ssrLoadModule(modPath);
      const method = (req.method || "GET").toUpperCase();
      const handler =
        mod[`onRequest${method[0]}${method.slice(1).toLowerCase()}`] || mod.onRequest;

      if (!handler) {
        res.writeHead(405, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: `Method ${method} not allowed` }));
        return;
      }

      const request = await toWebRequest(req);
      const env = process.env; // OPENROUTER_API_KEY etc. flow through here.
      const response = await handler({ request, env, params: {}, waitUntil: () => {} });

      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      const buf = Buffer.from(await response.arrayBuffer());
      res.end(buf);
    } catch (err) {
      console.error(`[dev-api] ${path} failed:`, err);
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Handler error", message: String(err?.message || err) }));
    }
  });

  server.listen(PORT, "127.0.0.1", () => {
    const key = process.env.OPENROUTER_API_KEY ? "OpenRouter LIVE" : "deterministic fallback";
    console.log(`[dev-api] LaunchPilot backend on http://127.0.0.1:${PORT}  (${key})`);
  });
}

main().catch((e) => {
  console.error("[dev-api] fatal:", e);
  process.exit(1);
});
