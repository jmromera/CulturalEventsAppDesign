// Accessibility check with axe-core (WCAG 2.0/2.1/2.2 A and AA) on every page and state,
// on mobile and desktop, plus 200 % zoom reflow and open interactive states.
// Usage: node scripts/a11y.mjs [--no-build]
// Writes docs/legal/accesibilidad-informe.json and exits with 1 if anything fails.
import { writeFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { routes, viewports } from "./lib/routes.mjs";
import { startPreview } from "./lib/preview-server.mjs";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// Interactive states that only exist after a click.
const interactions = [
  { name: "selector-ciudad-abierto", route: "inicio", act: (page) => page.locator(".header-city-trigger").click() },
  { name: "calendario-abierto", route: "evento", act: (page) => page.locator(".detail-calendar summary").click() },
  { name: "confirmar-borrado", route: "tus-datos", act: (page) => page.getByRole("button", { name: "Borrar mis datos" }).click() },
  { name: "acerca-de", route: "inicio", act: (page) => page.getByRole("button", { name: "Acerca de" }).click() },
  { name: "filtros-noche", route: "inicio", act: async (page) => { await page.getByRole("button", { name: /^Filtros/ }).click(); await page.getByRole("button", { name: /^Noche/ }).click(); } },
  { name: "filtros-calendario-teclado", route: "inicio", act: async (page) => { await page.getByRole("button", { name: /^Filtros/ }).click(); const day = page.locator(".month-calendar td button[tabindex='0']"); await day.focus(); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter"); } },
  { name: "chips-filtros", route: "inicio", act: async (page) => { await page.getByRole("button", { name: /^Filtros/ }).click(); await page.getByRole("button", { name: /^Tarde/ }).click(); await page.getByRole("button", { name: /^Ver \d+ resultado/ }).click(); } },
  { name: "cerca-de-mi", route: "inicio", act: (page) => page.getByRole("button", { name: "Cerca de mí" }).click() },
  { name: "mapa-abierto", route: "inicio", act: async (page) => { await page.getByRole("button", { name: "Mapa" }).click(); await page.locator(".leaflet-marker-icon").first().waitFor(); await page.waitForTimeout(1500); } },
  { name: "mapa-detalle", route: "evento", act: async (page) => { await page.getByRole("button", { name: "Ver en el mapa" }).click(); await page.locator(".leaflet-marker-icon").first().waitFor(); await page.waitForTimeout(1500); } },
];

const { url: base, stop } = await startPreview({ build: !process.argv.includes("--no-build") });
const browser = await chromium.launch();
const report = { date: new Date().toISOString(), tags: TAGS, results: [] };
let failures = 0;

async function open(page, route) {
  await page.goto(base);
  await page.evaluate((storage) => { localStorage.clear(); for (const [key, value] of Object.entries(storage)) localStorage.setItem(key, value); }, route.storage);
  await page.goto(base + route.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
}

async function audit(page, label) {
  const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const violations = result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
  }));
  failures += violations.length;
  report.results.push({ page: label, violations });
  console.log(`${violations.length ? "✗" : "✓"} ${label}${violations.length ? `: ${violations.map((v) => `${v.id} (${v.nodes.length})`).join(", ")}` : ""}`);
}

try {
  for (const [sizeName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const route of routes) {
      await open(page, route);
      await audit(page, `${route.name} · ${sizeName}`);
    }
    for (const interaction of interactions) {
      const route = routes.find((item) => item.name === interaction.route);
      await open(page, route);
      await interaction.act(page);
      await page.waitForTimeout(300);
      await audit(page, `${interaction.name} · ${sizeName}`);
    }
    await context.close();
  }

  // WCAG 1.4.10 reflow: 1280 px at 200 % zoom behaves like a 640 px wide window. No horizontal scroll allowed.
  const zoom = await browser.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
  const zoomPage = await zoom.newPage();
  for (const route of routes) {
    await open(zoomPage, route);
    const overflow = await zoomPage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const ok = overflow <= 1;
    if (!ok) failures += 1;
    report.results.push({ page: `${route.name} · zoom 200 %`, violations: ok ? [] : [{ id: "reflow", impact: "serious", help: `Horizontal scroll of ${overflow}px at 200 % zoom`, nodes: [] }] });
    console.log(`${ok ? "✓" : "✗"} ${route.name} · zoom 200 %${ok ? "" : `: ${overflow}px de scroll horizontal`}`);
  }
  await zoom.close();
} finally {
  await browser.close();
  stop();
}

writeFileSync(new URL("../docs/legal/accesibilidad-informe.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(failures ? `\n${failures} problemas de accesibilidad.` : `\nSin problemas: ${report.results.length} comprobaciones.`);
process.exit(failures ? 1 : 0);
