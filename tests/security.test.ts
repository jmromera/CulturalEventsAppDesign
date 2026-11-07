import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "../src/lib/json-ld";
import { DECLARED_THIRD_PARTY_HOSTS } from "../src/legal/third-parties";

const root = path.resolve(__dirname, "..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const walk = (dir: string): string[] => readdirSync(path.join(root, dir)).flatMap((name) => {
  const rel = path.join(dir, name);
  return statSync(path.join(root, rel)).isDirectory() ? walk(rel) : [rel];
});
const sourceFiles = walk("src").filter((file) => /\.(tsx?|jsx?)$/.test(file));

describe("XSS", () => {
  it("structured data cannot break out of its script tag", () => {
    const lineSeparator = String.fromCharCode(0x2028);
    const input = { name: "</script><script>alert(1)</script>", text: `a${lineSeparator}b` };
    const html = serializeJsonLd(input);
    expect(html).not.toContain("<");
    expect(html).not.toContain(lineSeparator);
    expect(JSON.parse(html)).toEqual(input);
  });

  it("raw HTML is only injected through the JSON-LD serialiser", () => {
    const uses = sourceFiles.flatMap((file) => [...read(file).matchAll(/dangerouslySetInnerHTML=\{\{\s*__html:\s*([^}]+)\}\}/g)].map((match) => `${file}: ${match[1].trim()}`));
    expect(uses.every((use) => use.includes("serializeJsonLd("))).toBe(true);
    const unsafe = sourceFiles.filter((file) => /\.innerHTML\s*=|outerHTML\s*=|insertAdjacentHTML|document\.write|\beval\(|new Function\(/.test(read(file)));
    expect(unsafe).toEqual([]);
  });

  it("every link in the data uses http(s) or a relative path (no javascript: URLs)", () => {
    const bad: string[] = [];
    const visit = (node: unknown, where: string) => {
      if (Array.isArray(node)) node.forEach((item, index) => visit(item, `${where}[${index}]`));
      else if (node && typeof node === "object") for (const [key, value] of Object.entries(node)) visit(value, `${where}.${key}`);
      else if (typeof node === "string" && /^[a-z][a-z0-9+.-]*:\S*$/i.test(node.trim()) && !/^https?:\/\//i.test(node.trim())) bad.push(`${where}: ${node.slice(0, 60)}`);
    };
    for (const file of ["events", "venues", "related-entities", "city-images"]) visit(JSON.parse(read(`src/data/${file}.json`)), file);
    expect(bad).toEqual([]);
  });

  it("links that open a new tab do not give the other site access to this one", () => {
    const missing = sourceFiles.flatMap((file) => [...read(file).matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].filter((match) => !/rel="[^"]*noreferrer/.test(match[0])).map((match) => `${file}: ${match[0].slice(0, 80)}`));
    expect(missing).toEqual([]);
  });
});

describe("security headers (vercel.json)", () => {
  const vercel = JSON.parse(read("vercel.json"));
  const headers = Object.fromEntries(vercel.headers.find((rule: { source: string }) => rule.source === "/(.*)").headers.map(({ key, value }: { key: string; value: string }) => [key, value]));

  it("sends every required header on every path", () => {
    for (const name of ["Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "X-Frame-Options"]) expect(headers[name], name).toBeTruthy();
  });

  it("has a strict CSP: only our own origin, no inline scripts, no framing", () => {
    const csp: string = headers["Content-Security-Policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self';");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toMatch(/'unsafe-eval'|script-src[^;]*'unsafe-inline'/);
    // The only remote origin allowed is the declared map tile server, and only for images.
    const remote = [...csp.matchAll(/https:\/\/([a-z0-9.-]+)/g)].map((match) => match[1]);
    expect(remote.every((host) => DECLARED_THIRD_PARTY_HOSTS.includes(host))).toBe(true);
    expect(csp).toMatch(/img-src[^;]*https:\/\/tile\.openstreetmap\.org/);
    expect(csp).not.toMatch(/(script|connect|font|style|frame)-src[^;]*https:/);
  });

  it("forces HTTPS for two years and blocks sniffing", () => {
    expect(headers["Strict-Transport-Security"]).toMatch(/max-age=(\d+)/);
    expect(Number(headers["Strict-Transport-Security"].match(/max-age=(\d+)/)[1])).toBeGreaterThanOrEqual(31536000);
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("only lets the site itself ask for the location", () => {
    expect(headers["Permissions-Policy"]).toContain("geolocation=(self)");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });
});

describe("secrets", () => {
  it("keeps .env files out of git", () => {
    expect(read(".gitignore")).toMatch(/^\.env\*?$/m);
  });

  it("has no hard-coded secrets in the source", () => {
    const hits = [...sourceFiles, "vite.config.ts", "index.html", "vercel.json"].filter((file) => /(api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{8,}/i.test(read(file)));
    expect(hits).toEqual([]);
  });
});
