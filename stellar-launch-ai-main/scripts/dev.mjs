// `pnpm dev` — runs the LaunchPilot frontend AND backend together.
//
// Spawns:
//   1. the local API server (scripts/dev-api.mjs) on http://127.0.0.1:8788
//   2. Vite (the SPA) on http://localhost:8080, which proxies /api -> :8788
//
// One command, one Ctrl-C, both processes. No `concurrently` dependency needed.

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

// Spawn Vite through Node against its JS entry (node_modules/vite/bin/vite.js)
// rather than the `vite`/`vite.cmd` shim. On Windows, spawning a `.cmd` without a
// shell throws EINVAL (and shell:true brings quoting/escaping headaches), so we
// invoke the real JS bin with process.execPath — identical on every OS.
const viteBin = join(root, "node_modules", "vite", "bin", "vite.js");
const webArgs = existsSync(viteBin) ? [viteBin, "dev"] : null;

const procs = [
  { name: "api", cmd: process.execPath, args: [join(__dirname, "dev-api.mjs")], color: "\x1b[36m" },
  webArgs
    ? { name: "web", cmd: process.execPath, args: webArgs, color: "\x1b[35m" }
    : // Fallback: let the OS resolve `vite` via a shell if the bin isn't where we expect.
      { name: "web", cmd: "vite", args: ["dev"], color: "\x1b[35m", shell: true },
];

const children = [];
let shuttingDown = false;

function prefix(name, color, line) {
  if (!line) return;
  process.stdout.write(`${color}[${name}]\x1b[0m ${line}\n`);
}

for (const p of procs) {
  const child = spawn(p.cmd, p.args, { cwd: root, env: process.env, shell: p.shell ?? false });
  children.push(child);

  const pipe = (stream) => {
    let buf = "";
    stream.on("data", (d) => {
      buf += d.toString();
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const l of lines) prefix(p.name, p.color, l);
    });
  };
  pipe(child.stdout);
  pipe(child.stderr);

  child.on("exit", (code) => {
    if (shuttingDown) return;
    prefix(p.name, p.color, `exited with code ${code}`);
    shutdown(code ?? 0);
  });
}

function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const c of children) {
    try {
      c.kill("SIGTERM");
    } catch {
      /* ignore */
    }
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("\x1b[1mLaunchPilot AI\x1b[0m — starting web + api …");
console.log("  web  → http://localhost:8080");
console.log("  api  → http://127.0.0.1:8788 (proxied at /api)\n");
