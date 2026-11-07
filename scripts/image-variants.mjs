// Creates smaller copies of the self-hosted images so phones do not download desktop-sized files.
// Every image gets a 640 px wide copy (name-640.webp); city covers also get 1024 px (name-1024.webp).
// The app picks the right one with srcset (src/lib/responsive-image.ts). Safe to run again.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "public", "images", "remote");
const cityFiles = new Set(Object.values(JSON.parse(readFileSync(path.join(root, "src/data/city-images.json"), "utf8"))).map((url) => path.basename(url)));
let created = 0;
const manifest = {};
for (const file of readdirSync(dir).filter((name) => /^[0-9a-f]{16}\.webp$/.test(name))) {
  const source = path.join(dir, file);
  const { width } = await sharp(source).metadata();
  const variants = [];
  for (const target of cityFiles.has(file) ? [640, 1024] : [640]) {
    if (width <= target) continue;
    const out = path.join(dir, file.replace(".webp", `-${target}.webp`));
    if (!existsSync(out)) {
      await sharp(source).resize({ width: target }).webp({ quality: 70 }).toFile(out);
      created += 1;
    }
    variants.push(target);
  }
  if (variants.length) manifest[`/images/remote/${file}`] = { width, variants };
}
writeFileSync(path.join(root, "src/data/image-variants.json"), `${JSON.stringify(manifest, null, 2)}
`);
console.log(`${created} variants created; ${Object.keys(manifest).length} images with variants`);
