// Checks every page at 360, 390 and 768 px (no horizontal scroll), loads the home page on a slow
// 3G connection, and uses the app with location permission denied.
// Usage: node scripts/responsive.mjs [--no-build]
import { chromium } from "playwright";
import { routes } from "./lib/routes.mjs";
import { startPreview } from "./lib/preview-server.mjs";

const { url: base, stop } = await startPreview({ build: !process.argv.includes("--no-build") });
const browser = await chromium.launch();
let failures = 0;
const fail = (message) => { failures += 1; console.log(`✗ ${message}`); };

async function open(page, route) {
  await page.goto(base);
  await page.evaluate((storage) => { localStorage.clear(); for (const [key, value] of Object.entries(storage)) localStorage.setItem(key, value); }, route.storage);
  await page.goto(base + route.path, { waitUntil: "networkidle" });
}

try {
  for (const width of [360, 390, 768]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    let ok = 0;
    for (const route of routes) {
      await open(page, route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) fail(`${route.name} · ${width}px: ${overflow}px de scroll horizontal`); else ok += 1;
    }
    console.log(`✓ ${width}px: ${ok}/${routes.length} páginas sin scroll horizontal`);
    await page.close();
  }

  // Slow 3G (Lighthouse preset): 400 ms latency, ~400 kbps.
  const slow = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const cdp = await slow.context().newCDPSession(slow);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: 50_000, uploadThroughput: 50_000 });
  const start = Date.now();
  await slow.goto(`${base}/?city=Valencia`, { waitUntil: "commit" });
  await slow.locator(".hero h1").waitFor({ timeout: 90_000 });
  const seconds = (Date.now() - start) / 1000;
  console.log(`${seconds <= 30 ? "✓" : "✗"} 3G lenta: portada visible en ${seconds.toFixed(1)} s`);
  if (seconds > 30) failures += 1;
  await slow.close();

  // Location permission denied: the app must explain it and keep working with the city list.
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: [] });
  const page = await context.newPage();
  await page.goto(base);
  await page.evaluate(() => localStorage.clear());
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Usar mi ubicación" }).click();
  const message = page.getByText(/No pudimos detectar tu ubicación|No encontramos una ciudad cercana/);
  await message.waitFor({ timeout: 15_000 }).catch(() => fail("sin ubicación: no se muestra ningún aviso"));
  await page.getByRole("combobox", { name: "Ciudad" }).selectOption("Sevilla");
  await page.getByRole("button", { name: "Ver eventos de Sevilla" }).click();
  await page.locator(".hero h1").waitFor({ timeout: 10_000 }).then(() => console.log("✓ sin ubicación: aviso mostrado y la ciudad se elige de la lista")).catch(() => fail("sin ubicación: no se puede elegir ciudad"));
  await context.close();
} finally {
  await browser.close();
  stop();
}
console.log(failures ? `\n${failures} problemas.` : "\nTodo correcto.");
process.exit(failures ? 1 : 0);
