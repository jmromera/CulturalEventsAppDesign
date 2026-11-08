import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { updatePageMeta } from "../src/lib/page-meta";

const root = path.resolve(__dirname, "..");
const robots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute("content");
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute("href");

describe("page metadata", () => {
  it("keeps the city in the canonical URL of city listings only", () => {
    updatePageMeta("/", "?city=Sevilla&q=x", false);
    expect(canonical()).toBe("https://plancerca.com/?city=Sevilla");
    updatePageMeta("/event/89", "?city=Valencia", false);
    expect(canonical()).toBe("https://plancerca.com/event/89");
  });

  it("tells search engines not to index personal pages and missing pages", () => {
    for (const path of ["/search", "/favorites", "/tus-datos", "/perfil"]) {
      updatePageMeta(path, "", false);
      expect(robots(), path).toBe("noindex, follow");
    }
    updatePageMeta("/whatever", "", true);
    expect(robots()).toBe("noindex, follow");
    updatePageMeta("/privacidad", "", false);
    expect(robots()).toBe("index, follow");
  });

  it("marks an unknown event as noindex when the app renders it", () => {
    render(<MemoryRouter initialEntries={["/event/999999"]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
    expect(robots()).toBe("noindex, follow");
  });
});

describe("sitemap", () => {
  execFileSync(process.execPath, [path.join(root, "scripts/generate-sitemap.mjs")]);
  const xml = readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  it("lists the legal pages and every city", () => {
    for (const page of ["/aviso-legal", "/privacidad", "/cookies", "/terminos", "/accesibilidad"]) expect(locs).toContain(`https://plancerca.com${page}`);
    expect(locs.filter((loc) => /\/\?city=/.test(loc))).toHaveLength(6);
  });

  it("leaves out personal pages and events that already happened", () => {
    expect(locs.some((loc) => /\/(search|favorites|tus-datos|perfil)/.test(loc))).toBe(false);
    expect(locs).not.toContain("https://plancerca.com/event/16");
  });

  it("is referenced from robots.txt", () => {
    expect(readFileSync(path.join(root, "public/robots.txt"), "utf8")).toContain("Sitemap: https://plancerca.com/sitemap.xml");
  });
});
