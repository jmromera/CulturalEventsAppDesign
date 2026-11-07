// Finds a picture for every event that has none, in this order:
//   1. matches: the image already used by another match of the same home club;
//   2. the event's own page (og:image of sourceUrl): the poster or the artist's photo;
//   3. nothing: the app then shows the venue's freely licensed photo as a last resort.
// It writes the remote URL into events.json; then run `pnpm images:self-host` and `pnpm images:variants`
// so the image is downloaded, converted to WebP and served from our own domain.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const eventsPath = path.join(root, "src/data/events.json");
const events = JSON.parse(readFileSync(eventsPath, "utf8"));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ogImage(url) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
    if (!response.ok) return null;
    const html = await response.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    return match ? new URL(match[1], url).href : null;
  } catch {
    return null;
  }
}

const homeClub = (event) => event.title.split(/\s+vs\.?\s+/i)[0].trim();
let filled = 0;
for (const event of events.filter((item) => !item.image)) {
  if (event.category === "Deportes") {
    const sibling = events.find((other) => other.image && other.category === "Deportes" && other.venueId === event.venueId && homeClub(other) === homeClub(event));
    if (sibling) { event.image = sibling.image; filled += 1; continue; }
  }
  if (event.category === "Museos") continue; // the museum building is the right picture
  if (!event.sourceUrl) continue;
  await sleep(700);
  const image = await ogImage(event.sourceUrl);
  if (image) { event.image = image; filled += 1; }
  console.log(`${event.id} ${event.title.slice(0, 50)}: ${image ? "ok" : "sin imagen (foto del recinto)"}`);
}
writeFileSync(eventsPath, `${JSON.stringify(events, null, 2)}\n`);
console.log(`${filled} events got an image; ${events.filter((item) => !item.image).length} will show their venue photo.`);
