// Visits every page in a real browser and fails if it requests anything from an undeclared domain.
// Usage: node scripts/check-external-requests.mjs   (builds and serves the site itself)
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { routes, viewports } from "./lib/routes.mjs";
import { startPreview } from "./lib/preview-server.mjs";

const declared = []; // keep in sync with src/legal/third-parties.ts (empty: everything is self-hosted)

// vite preview ignores vercel.json, so its security headers are applied here to catch CSP breakage.
const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const securityHeaders = Object.fromEntries(vercel.headers.find((rule) => rule.source === "/(.*)").headers.map(({ key, value }) => [key, value.replace(/; upgrade-insecure-requests/, "")]));

const { url: base, stop } = await startPreview({ build: !process.argv.includes("--no-build") });
const browser = await chromium.launch();
const offending = new Set();
try {
  for (const viewport of Object.values(viewports)) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.route("**/*", async (route) => {
      if (route.request().resourceType() !== "document") return route.continue();
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), ...securityHeaders } });
    });
    page.on("console", (message) => {
      if (/Content Security Policy|Refused to/i.test(message.text())) offending.add(`CSP: ${message.text().slice(0, 160)}`);
    });
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
  console.error("Undeclared third-party requests, cookies or CSP violations:\n" + [...offending].map((item) => `  - ${item}`).join("\n"));
  process.exit(1);
}
console.log(`OK: ${routes.length} pages × ${Object.keys(viewports).length} sizes, no third-party requests, no cookies and no CSP violations.`);
