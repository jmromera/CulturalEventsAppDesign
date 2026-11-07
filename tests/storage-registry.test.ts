import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { STORAGE_KEYS, STORAGE_REGISTRY } from "../src/data/storage-keys";

const root = path.resolve(__dirname, "..");
const walk = (dir: string): string[] => readdirSync(path.join(root, dir)).flatMap((name) => {
  const rel = path.join(dir, name);
  return statSync(path.join(root, rel)).isDirectory() ? walk(rel) : [rel];
});
const sources = walk("src").filter((file) => /\.(tsx?|jsx?)$/.test(file)).map((file) => ({ file, code: readFileSync(path.join(root, file), "utf8") }));

describe("cookie policy matches the code", () => {
  it("the registry lists exactly the declared keys", () => {
    expect(STORAGE_REGISTRY.map((entry) => entry.key).sort()).toEqual(Object.values(STORAGE_KEYS).sort());
  });

  it("no storage key is defined outside the registry", () => {
    const strays = sources
      .filter(({ file }) => !file.endsWith("storage-keys.ts"))
      .flatMap(({ file, code }) => [...code.matchAll(/["'`](plan-?cerca\.[a-z0-9-]+)["'`]/g)].map((match) => `${file}: ${match[1]}`));
    expect(strays).toEqual([]);
  });

  it("localStorage is only accessed with registry keys", () => {
    const calls = sources.flatMap(({ file, code }) => [...code.matchAll(/localStorage\.(?:setItem|getItem|removeItem)\(\s*([^,)]+)/g)].map((match) => ({ file, arg: match[1].trim() })));
    const allowed = new Set(["key", "storageKey", "LANGUAGE_KEY", "SAVED_EVENTS_KEY", "DETECTED_CITY_KEY", "PREFERRED_CITY_KEY", "GEOLOCATION_STATUS_KEY", "ONBOARDING_DISMISSED_KEY"]);
    expect(calls.filter(({ arg }) => !allowed.has(arg) && !arg.startsWith("STORAGE_KEYS."))).toEqual([]);
  });

  it("sets no cookies and uses no other browser storage", () => {
    const offenders = sources.filter(({ code }) => /document\.cookie\s*=|sessionStorage|indexedDB|caches\.open/.test(code)).map(({ file }) => file);
    expect(offenders).toEqual([]);
  });
});
