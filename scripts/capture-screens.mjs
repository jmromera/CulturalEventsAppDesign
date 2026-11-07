// Screenshots of the key screens on mobile (390×844) and desktop (1440×900), visible area and full page.
// Usage: node scripts/capture-screens.mjs <output-folder> [--no-build]   e.g. docs/capturas/antes
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { startPreview } from "./lib/preview-server.mjs";

const out = process.argv[2];
if (!out) throw new Error("Usage: node scripts/capture-screens.mjs <output-folder>");
mkdirSync(out, { recursive: true });
const city = { "plan-cerca.preferred-city": "Valencia", "plan-cerca.city-onboarding-dismissed": "true" };
const favourites = { ...city, "plan-cerca.saved-events": "[89,99,104,211,100]" };
const screens = [
  ["1-inicio", "/?city=Valencia", city],
  ["2-filtros", "/search?city=Valencia", city],
  ["2-busqueda", "/search?q=rock&city=Valencia", city],
  ["3-detalle", "/event/89?city=Valencia", favourites],
  ["4-favoritos", "/favorites?city=Valencia", favourites],
  ["4-favoritos-vacio", "/favorites?city=Valencia", city],
];
const { url, stop } = await startPreview({ build: !process.argv.includes("--no-build") });
const browser = await chromium.launch();
try {
  for (const [size, viewport] of [["movil", { width: 390, height: 844 }], ["escritorio", { width: 1440, height: 900 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: size === "movil" ? 2 : 1, reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const [name, path, storage] of screens) {
      await page.goto(url);
      await page.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, storage);
      await page.goto(url + path, { waitUntil: "networkidle" });
      // Load every lazy image before the full-page shot.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${out}/${name}-${size}.jpg`, type: "jpeg", quality: 82 });
      await page.screenshot({ path: `${out}/${name}-${size}-completa.jpg`, type: "jpeg", quality: 75, fullPage: true });
    }
    await context.close();
  }
} finally {
  await browser.close();
  stop();
}
console.log(`Saved to ${out}`);
