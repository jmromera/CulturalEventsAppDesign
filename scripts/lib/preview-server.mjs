// Builds the site and serves it with `vite preview`, so checks run against the real production bundle.
import { spawn, spawnSync } from "node:child_process";

export async function startPreview({ port = 4173, build = true } = {}) {
  if (build) {
    const result = spawnSync("pnpm", ["build"], { stdio: "inherit", shell: true });
    if (result.status !== 0) throw new Error("Build failed");
  }
  const server = spawn("pnpm", ["exec", "vite", "preview", "--port", String(port), "--strictPort"], { shell: true, stdio: "pipe" });
  const url = `http://localhost:${port}`;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if ((await fetch(url)).ok) return { url, stop: () => killTree(server) };
    } catch { /* not ready yet */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  killTree(server);
  throw new Error("Preview server did not start");
}

function killTree(child) {
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  else child.kill("SIGTERM");
}
