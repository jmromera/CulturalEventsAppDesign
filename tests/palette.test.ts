import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.resolve(__dirname, "../src/index.css"), "utf8");
const token = (name: string) => {
  const matches = [...css.matchAll(new RegExp(`--${name}:(#[0-9a-f]{6})`, "gi"))];
  return matches.at(-1)?.[1]; // the last definition wins in CSS
};
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255).map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const CATEGORIES = ["music", "opera", "theatre", "dance", "exhibitions", "museums", "sports"];

describe("category palette (WCAG 1.4.3)", () => {
  it.each(CATEGORIES)("%s: white text on the badge and light text on the dark surface reach 4.5:1", (category) => {
    const base = token(`cat-${category}`)!;
    const light = token(`cat-${category}-light`)!;
    const surface = token("surface")!;
    expect(base).toBeTruthy();
    expect(contrast(base, "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light, surface)).toBeGreaterThanOrEqual(4.5);
  });
});
