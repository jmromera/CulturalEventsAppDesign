import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.resolve(__dirname, "../src/index.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const token = (name: string, scope = css) => {
  const matches = [...scope.matchAll(new RegExp(`--${name}:(#[0-9a-f]{6})`, "gi"))];
  return matches.at(-1)?.[1]; // the last definition wins in CSS
};
// Token blocks: night mode, the blue default (the theme :root) and the light cards inside it.
const block = (selector: string) => {
  const start = css.lastIndexOf(selector);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("}", start));
};
const night = block(':root[data-theme="dark"]{');
const blue = block(":root{\n\tcolor-scheme:dark;".replace(/\n/g, css.includes("\r\n") ? "\r\n" : "\n"));
const cards = block(':root:not([data-theme="dark"]) :is(.event-card');

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255).map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// --cat-soft is color-mix(in srgb, var(--cat) 14%, #fff)
const soft = (hex: string) => `#${[1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * 0.14 + 255 * 0.86).toString(16).padStart(2, "0")).join("")}`;

const CATEGORIES = ["music", "opera", "theatre", "dance", "exhibitions", "museums", "sports"];

describe("category palette (WCAG 1.4.3)", () => {
  it.each(CATEGORIES)("%s: white on the badge, its colour on the soft chip and the light tone on the night surface reach 4.5:1", (category) => {
    const base = token(`cat-${category}`)!;
    const light = token(`cat-${category}-light`)!;
    expect(base).toBeTruthy();
    expect(contrast(base, "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(base, soft(base))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light, token("surface", night)!)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("theme tokens (WCAG 1.4.3)", () => {
  it("blue default: page text, secondary text and amber links on the blue background", () => {
    const canvas = token("canvas", blue)!;
    const chrome = token("chrome", blue)!;
    for (const text of ["ink", "muted", "accent-text"]) expect(contrast(token(text, blue)!, canvas), text).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("ink", blue)!, chrome)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("muted", blue)!, chrome)).toBeGreaterThanOrEqual(4.5);
  });

  it("blue default: text and links inside the light cards", () => {
    for (const text of ["ink", "muted", "accent-text", "positive", "negative-text"]) expect(contrast(token(text, cards)!, "#ffffff"), text).toBeGreaterThanOrEqual(4.5);
  });

  it("night mode: text and amber on graphite", () => {
    const surface = token("surface", night)!;
    for (const text of ["accent-text", "positive", "negative-text"]) expect(contrast(token(text, night)!, surface), text).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("on-dark")!, surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("on-dark-muted")!, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("the amber button keeps dark text in both themes", () => {
    expect(contrast(token("on-accent", blue)!, token("accent", blue)!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("on-accent", night)!, token("accent", night)!)).toBeGreaterThanOrEqual(4.5);
  });
});
