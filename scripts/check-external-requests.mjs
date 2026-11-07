// Visits every page in a real browser and fails if it requests anything from an undeclared domain.
// Usage: node scripts/check-external-requests.mjs   (builds and serves the site itself)
import { chromium } from "playwright";
import { routes, viewports } from "./lib/routes.mjs";
import { startPreview } from "./lib/preview-server.mjs";

const declared = []; // keep in sync with src/legal/third-parties.ts (empty: everything is self-hosted)

const { url: base, stop } = await startPreview({ build: !process.argv.includes("--no-build") });
const browser = await chromium.launch();
const offending = new Set();
try {
  for (const viewport of Object.values(viewports)) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on("request", (request) => {
      const { hostname, protocol } = new URL(request.url());
      if (protocol === "data:" || protocol === "blob:" || hostname === "localhost") return;
      if (!declared.includes(hostname)) offending.add(`${hostname} (${request.url().slice(0, 90)})`);
    });
    for (const route of routes) {
      await page.goto(base);
      await page.evaluate((storage) => { localStorage.clear(); for (const [k, v] of Object.entries(storage)) localStorage.setItem(k, v); }, route.storage);
      await page.goto(base + route.path, { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(400);
    }
    const cookies = await context.cookies();
    if (cookies.length) offending.add(`cookies set: ${cookies.map((cookie) => cookie.name).join(", ")}`);
    await context.close();
  }
} finally {
  await browser.close();
  stop();
}
if (offending.size) {
  console.error("Undeclared third-party requests or cookies:\n" + [...offending].map((item) => `  - ${item}`).join("\n"));
  process.exit(1);
}
console.log(`OK: ${routes.length} pages × ${Object.keys(viewports).length} sizes, no third-party requests and no cookies.`);
