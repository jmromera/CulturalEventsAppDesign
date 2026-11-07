// Downloads every external image referenced by the data files, optimises it to WebP and
// rewrites the data to point at the local copy, so visitors' browsers never contact third parties.
// The original URL of each image is kept in docs/legal/ORIGEN-IMAGENES.json for licence review.
//
// Usage: node scripts/self-host-images.mjs
// Safe to run again: already downloaded images are reused.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "images", "remote");
const publicPrefix = "/images/remote/";
const manifestPath = path.join(root, "docs", "legal", "ORIGEN-IMAGENES.json");

// Max width per use: city covers fill the hero; event/venue images reach 1200 px on detail pages.
const files = [
  { file: "src/data/city-images.json", width: 1920, kind: "city" },
  { file: "src/data/events.json", width: 1200, kind: "event" },
  { file: "src/data/venues.json", width: 1200, kind: "venue" },
  { file: "src/data/related-entities.json", width: 640, kind: "entity" },
];

mkdirSync(outDir, { recursive: true });
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { images: {}, failed: {} };
manifest.failed = {};

const isRemote = (value) => typeof value === "string" && /^https?:\/\//.test(value);
const localNameFor = (url) => `${createHash("sha1").update(url).digest("hex").slice(0, 16)}.webp`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retries rate limits (Wikimedia answers 429 when downloading many files in a row).
async function download(url, attempt = 1) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
    headers: { "User-Agent": "PlanCercaImageMirror/1.0 (one-off mirror for an academic project)", Accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
  });
  if (response.status === 429 && attempt < 6) {
    await sleep(5_000 * attempt);
    return download(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  // Some servers send no content type: trust the bytes if sharp can read them as an image.
  await sharp(buffer).metadata().catch(() => { throw new Error("Not an image"); });
  return buffer;
}

async function localise(url, width, kind, usedBy) {
  const name = localNameFor(url);
  const target = path.join(outDir, name);
  if (!existsSync(target)) {
    const input = await download(url);
    await sharp(input, { animated: false }).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(target);
  }
  const entry = manifest.images[publicPrefix + name] ?? { original: url, kind, usedBy: [] };
  if (!entry.usedBy.includes(usedBy)) entry.usedBy.push(usedBy);
  manifest.images[publicPrefix + name] = entry;
  return publicPrefix + name;
}

// Finds every remote URL stored under an "image" key (or any city value) and replaces it
// textually, so the rest of the file keeps its original formatting.
async function processFile({ file, width, kind }) {
  const fullPath = path.join(root, file);
  let text = readFileSync(fullPath, "utf8");
  const data = JSON.parse(text);
  const found = new Map();
  const visit = (node) => {
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      if ((key === "image" || kind === "city") && isRemote(value)) found.set(value, `${kind}:${node.id ?? key}`);
      else if (typeof value === "object") visit(value);
    }
  };
  visit(data);
  for (const [url, usedBy] of found) {
    let replacement;
    try {
      replacement = JSON.stringify(await localise(url, width, kind, usedBy));
    } catch (error) {
      manifest.failed[url] = { usedBy, error: String(error.message ?? error) };
      replacement = "null"; // FallbackImage shows the category icon instead.
    }
    text = text.split(JSON.stringify(url)).join(replacement);
  }
  JSON.parse(text); // still valid JSON
  writeFileSync(fullPath, text);
  console.log(`${file}: ${found.size} remote images`);
}

for (const entry of files) await processFile(entry);
manifest.generatedAt = new Date().toISOString();
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Saved ${Object.keys(manifest.images).length} images; ${Object.keys(manifest.failed).length} failed (see ${path.relative(root, manifestPath)}).`);
