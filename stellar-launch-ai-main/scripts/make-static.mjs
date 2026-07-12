// Post-build: assemble a clean static publish directory the HackOnVibe CI deploys.
//
// TanStack Start's SPA build emits the client bundle to dist/client/ and names the
// prerendered shell "_shell.html" (plus a dist/server/ dir we don't ship). The CI
// (.github/workflows/deploy.yml) publishes the first of dist / build / out /
// .output/public that contains an index.html. So we copy dist/client/* into out/
// and rename _shell.html -> index.html. Result: out/index.html, ready to deploy.
import { existsSync, rmSync, mkdirSync, cpSync, renameSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const clientDir = join(root, "dist", "client");
const outDir = join(root, "out");

if (!existsSync(join(clientDir, "_shell.html"))) {
  console.error(
    "[make-static] dist/client/_shell.html not found — did `vite build` (SPA mode) run first?",
  );
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(clientDir, outDir, { recursive: true });
renameSync(join(outDir, "_shell.html"), join(outDir, "index.html"));

// GitHub Pages has no _redirects support — it serves 404.html for unknown paths,
// so a copy of the SPA shell keeps client-side routing working there too.
copyFileSync(join(outDir, "index.html"), join(outDir, "404.html"));

console.log("[make-static] wrote static site to out/ (index.html + 404.html ready for deploy)");
