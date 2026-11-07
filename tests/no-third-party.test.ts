import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DECLARED_THIRD_PARTY_HOSTS } from "../src/legal/third-parties";

const root = path.resolve(__dirname, "..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const walk = (dir: string): string[] => readdirSync(path.join(root, dir)).flatMap((name) => {
  const rel = path.join(dir, name);
  return statSync(path.join(root, rel)).isDirectory() ? walk(rel) : [rel];
});
const hostOf = (url: string) => new URL(url).hostname;
const undeclared = (urls: string[]) => urls.map(hostOf).filter((host) => !DECLARED_THIRD_PARTY_HOSTS.includes(host));

describe("no automatic requests to third parties", () => {
  it("index.html loads nothing from other domains", () => {
    const html = read("index.html");
    const resources = [...html.matchAll(/<(?:script|link|img|iframe)[^>]+(?:src|href)="(https?:\/\/[^"]+)"/g)].map((match) => match[1]);
    expect(undeclared(resources)).toEqual([]);
  });

  it("stylesheets import no remote fonts or images", () => {
    const css = walk("src").filter((file) => file.endsWith(".css")).map(read).join("\n");
    const remote = [...css.matchAll(/(?:url\(|@import\s+)["']?(https?:\/\/[^"')\s]+)/g)].map((match) => match[1]);
    expect(undeclared(remote)).toEqual([]);
  });

  it("source code embeds no remote resources (img, script, iframe, fetch)", () => {
    const code = walk("src").filter((file) => /\.(tsx?|jsx?)$/.test(file)).map(read).join("\n");
    const remote = [
      ...code.matchAll(/\bsrc=\{?["'`](https?:\/\/[^"'`]+)/g),
      ...code.matchAll(/\b(?:fetch|sendBeacon|EventSource|WebSocket)\(\s*["'`](https?:\/\/[^"'`]+)/g),
    ].map((match) => match[1]);
    expect(undeclared(remote)).toEqual([]);
  });

  it("every image in the data is self-hosted and exists", () => {
    const problems: string[] = [];
    const check = (value: unknown, where: string) => {
      if (value === null) return;
      if (typeof value !== "string" || !value.startsWith("/")) problems.push(`${where}: ${String(value)}`);
      else if (!existsSync(path.join(root, "public", value))) problems.push(`${where}: missing file ${value}`);
    };
    const visit = (node: unknown, where: string) => {
      if (Array.isArray(node)) node.forEach((item, index) => visit(item, `${where}[${index}]`));
      else if (node && typeof node === "object") for (const [key, value] of Object.entries(node)) key === "image" ? check(value, `${where}.${key}`) : visit(value, `${where}.${key}`);
    };
    for (const file of ["events", "venues", "related-entities"]) visit(JSON.parse(read(`src/data/${file}.json`)), file);
    for (const [city, url] of Object.entries(JSON.parse(read("src/data/city-images.json")))) check(url, `city-images.${city}`);
    expect(problems).toEqual([]);
  });
});
