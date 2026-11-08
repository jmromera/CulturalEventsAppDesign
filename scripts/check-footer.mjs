// Fails if any page leaves blank space below the footer at 1440 x 900 (P2.6).
import { chromium } from "playwright";
import { startPreview } from "./lib/preview-server.mjs";
import { routes } from "./lib/routes.mjs";
const { url, stop } = await startPreview({ build: !process.argv.includes("--no-build"), port: 4218 });
const browser = await chromium.launch();
let bad = 0;
try {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url + "/");
    await page.evaluate((storage) => { localStorage.clear(); for (const [k, v] of Object.entries(storage)) localStorage.setItem(k, v); }, route.storage);
    await page.goto(url + route.path);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => { const f = document.querySelector(".site-footer"); if (!f) return null; return { bottom: Math.round(f.getBoundingClientRect().bottom + window.scrollY), page: document.documentElement.scrollHeight }; });
    const ok = r && r.bottom >= 900 && r.bottom >= r.page - 1;
    if (!ok) { bad += 1; console.log("✗", route.name, JSON.stringify(r)); }
    await page.close();
  }
} finally { await browser.close(); stop(); }
console.log(bad ? `${bad} rutas con hueco bajo el pie` : `OK: ${routes.length} rutas sin hueco bajo el pie`);
if (bad) process.exitCode = 1;
