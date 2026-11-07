// Generates public/sitemap.xml from the data at build time (run by `pnpm build`).
// Only indexable pages: city listings, upcoming events, venues, artist pages and legal pages.
import { readFileSync, writeFileSync } from "node:fs";

const read = (file) => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"));
const site = read("datos-legales.json").sitio.url.replace(/\/$/, "");
const cities = Object.keys(read("src/data/city-images.json"));
const events = read("src/data/events.json");
const venues = read("src/data/venues.json");
const entities = Object.keys(read("src/data/related-entities.json"));

const today = new Date().toISOString().slice(0, 10);
const upcoming = events.filter((event) => (event.endDate ?? event.startDate ?? "9999-12-31") >= today);
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const urls = [
  ...cities.map((city) => `/?city=${encodeURIComponent(city)}`),
  ...cities.map((city) => `/venues?city=${encodeURIComponent(city)}`),
  ...upcoming.map((event) => `/event/${event.id}`),
  ...venues.map((venue) => `/venues/${venue.id}`),
  ...entities.map((id) => `/artist/${id}`),
  "/aviso-legal", "/privacidad", "/cookies", "/terminos", "/accesibilidad",
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${escape(site + path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
