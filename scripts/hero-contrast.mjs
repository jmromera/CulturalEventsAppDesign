// Measures the contrast of the hero text against the brightest pixel of each city cover behind it
// (axe cannot evaluate text over images). Usage: node scripts/hero-contrast.mjs [--no-build]
import { chromium } from "playwright";
import sharp from "sharp";
import { startPreview } from "./lib/preview-server.mjs";
import cities from "../src/data/city-images.json" with { type: "json" };

const luminance = ([r, g, b]) => {
  const c = [r, g, b].map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrastWithWhite = (rgb) => 1.05 / (luminance(rgb) + 0.05);

const { url: base, stop } = await startPreview({ build: !process.argv.includes("--no-build") });
const browser = await chromium.launch();
let worst = Infinity;
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    for (const city of Object.keys(cities)) {
      await page.goto(base);
      await page.evaluate((c) => { localStorage.setItem("plan-cerca.preferred-city", c); localStorage.setItem("plan-cerca.city-onboarding-dismissed", "true"); }, city);
      await page.goto(`${base}/?city=${encodeURIComponent(city)}`, { waitUntil: "networkidle" });
      const box = await page.locator(".hero-copy").boundingBox();
      await page.addStyleTag({ content: ".hero-copy{visibility:hidden}" });
      const png = await page.screenshot({ clip: box });
      const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      // 98th percentile brightness, so a few stray pixels do not dominate.
      const lums = [];
      for (let i = 0; i < data.length; i += info.channels) lums.push([data[i], data[i + 1], data[i + 2]]);
      lums.sort((a, b) => luminance(a) - luminance(b));
      const ratio = contrastWithWhite(lums[Math.floor(lums.length * 0.98)]);
      worst = Math.min(worst, ratio);
      console.log(`${ratio >= 4.5 ? "✓" : "✗"} ${city} · ${viewport.width}px: ${ratio.toFixed(2)}:1`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  stop();
}
process.exit(worst >= 4.5 ? 0 : 1);
