// Screenshots for docs/GUIA-VISUAL.md, the manual and the README (docs/screenshots/), with the same file names.
// Valencia selected, three favourites saved, blue default theme. Desktop 1440×900, mobile 390×844 (2× pixels).
// Usage: node scripts/capture-guide.mjs [--no-build]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { startPreview } from "./lib/preview-server.mjs";

const out = "docs/screenshots";
mkdirSync(out, { recursive: true });

const valencia = { "plan-cerca.preferred-city": "Valencia", "plan-cerca.city-onboarding-dismissed": "true" };
const favourites = { ...valencia, "plan-cerca.saved-events": "[89,208,109]" };
const desktop = { width: 1440, height: 900 };
const mobile = { width: 390, height: 844 };

const scrollTo = (selector, offset = 90) => async (page) => {
  await page.evaluate(([sel, off]) => { const el = document.querySelector(sel); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off); }, [selector, offset]);
};
const click = (selector) => async (page) => { await page.click(selector); };

// [file, viewport, path, storage, action]
const shots = [
  ["onboarding-desktop", desktop, "/", {}],
  ["city-selector-desktop", desktop, "/?city=Valencia", valencia, click(".header-city-trigger")],
  ["city-selector-mobile", mobile, "/?city=Valencia", valencia, click(".header-city-trigger")],
  ["home-desktop", desktop, "/?city=Valencia", valencia],
  ["home-mobile", mobile, "/?city=Valencia", valencia],
  ["catalogue-desktop", desktop, "/?city=Valencia", valencia, scrollTo(".discovery-strip--shortcuts", 110)],
  ["search-desktop", desktop, "/search?q=rock&city=Valencia", valencia],
  ["search-other-cities-desktop", desktop, "/search?q=melendi&city=Barcelona", { ...valencia, "plan-cerca.preferred-city": "Barcelona" }],
  ["filters-mobile", mobile, "/?city=Valencia", valencia, click(".filter-control:not(.near-me-trigger)")],
  ["event-desktop", desktop, "/event/89?city=Valencia", favourites],
  ["event-mobile", mobile, "/event/89?city=Valencia", favourites],
  ["calendar-desktop", desktop, "/event/89?city=Valencia", favourites, click(".detail-calendar > summary")],
  ["event-more-desktop", desktop, "/event/89?city=Valencia", favourites, scrollTo(".detail-content")],
  ["venues-desktop", desktop, "/venues?city=Valencia", valencia],
  ["venue-desktop", desktop, "/venues/valencia-roig-arena?city=Valencia", valencia],
  ["venue-mobile", mobile, "/venues/valencia-roig-arena?city=Valencia", valencia],
  ["artist-desktop", desktop, "/entity/muse?city=Valencia", valencia],
  ["favorites-desktop", desktop, "/favorites?city=Valencia", favourites],
  ["favorites-mobile", mobile, "/favorites?city=Valencia", favourites],
  ["home-english-desktop", desktop, "/?city=Sevilla", { ...valencia, "plan-cerca.preferred-city": "Sevilla", "plan-cerca.language": "en" }],
  ["ended-event-desktop", desktop, "/event/84?city=Valencia", valencia],
];

const { url, stop } = await startPreview({ build: !process.argv.includes("--no-build") });
const browser = await chromium.launch();
try {
  for (const [name, viewport, path, storage, action] of shots) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: viewport === mobile ? 2 : 1, reducedMotion: "reduce", colorScheme: "light" });
    const page = await context.newPage();
    await page.goto(url);
    await page.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, storage);
    await page.goto(url + path, { waitUntil: "networkidle" });
    // Load lazy images on the visible area and a bit below.
    await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = "eager"; }));
    await page.waitForLoadState("networkidle");
    if (action) await action(page);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${name}.jpg`, type: "jpeg", quality: 85 });
    console.log(`✓ ${name}`);
    await context.close();
  }
} finally {
  await browser.close();
  stop();
}
