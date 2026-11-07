// One-off enrichment of src/data/venues.json with coordinates, capacity and a freely licensed photo.
// Sources: Wikidata (coordinates P625, capacity P1083, image P18), Wikimedia Commons (photo and licence)
// and, for venues missing from Wikidata, OpenStreetMap Nominatim geocoding of the address.
// Nothing is queried at runtime: results are stored in the repo. Usage: node scripts/enrich-venues.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const venuesPath = path.join(root, "src/data/venues.json");
const imageDir = path.join(root, "public/images/venues");
const UA = { "User-Agent": "PlanCercaDataBuilder/1.0 (academic project; jmromera@hotmail.com)" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
mkdirSync(imageDir, { recursive: true });

// Wikidata item of each venue, checked by hand (null = not in Wikidata or ambiguous).
const WIKIDATA = {
  "madrid-teatro-eslava": "Q3826935", "madrid-teatro-real": "Q211250", "madrid-estadio-santiago-bernabeu": "Q164027",
  "madrid-riyadh-air-metropolitano": "Q1369687", "madrid-estadio-de-vallecas": "Q983806", "madrid-movistar-arena": "Q539019",
  "madrid-museo-reina-sofia": "Q460889", "barcelona-palau-de-la-musica-catalana": "Q327940", "barcelona-teatre-nacional-de-catalunya": "Q1320197",
  "barcelona-macba": "Q1067140", "barcelona-museu-picasso-de-barcelona": "Q1050032", "barcelona-spotify-camp-nou": "Q159848",
  "barcelona-estadi-johan-cruyff": "Q29043488", "barcelona-palau-blaugrana": "Q930832", "barcelona-gran-teatre-del-liceu": "Q1130050",
  "barcelona-teatre-tivoli": "Q5101816", "barcelona-palau-sant-jordi": "Q630630", "barcelona-estadi-olimpic-lluis-companys": "Q275715",
  "bilbao-guggenheim-bilbao": "Q179199", "bilbao-euskalduna": "Q1783240", "bilbao-san-mames": "Q182864", "bilbao-bizkaia-arena-bec": "Q4907607",
  "bilbao-bilbao-arena": "Q402599", "valencia-palau-de-la-musica-de-valencia": "Q9054601", "valencia-roig-arena": "Q82992187",
  "valencia-estadio-de-mestalla": "Q202762", "valencia-teatro-olympia": "Q8772032", "valencia-ivam": "Q1600831",
  "sevilla-teatro-de-la-maestranza": "Q3527707", "sevilla-estadio-la-cartuja-de-sevilla": "Q368737", "sevilla-estadio-benito-villamarin": "Q126844",
  "sevilla-estadio-ramon-sanchez-pizjuan": "Q275429", "sevilla-cartuja-center-cite": "Q110103772", "sevilla-caac": "Q8343569",
  "albacete-teatro-circo": "Q11951071", "albacete-teatro-de-la-paz": "Q17187030",
  "albacete-estadio-carlos-belmonte": "Q1369118", "bilbao-kafe-antzokia": "Q12261187", "valencia-palacio-de-congresos": "Q9054458", "albacete-museo-de-la-cuchilleria": "Q9047061", "bilbao-sala-bbk": "Q23833370",
};
const FREE_LICENCE = /^(cc[ -]by|cc0|public domain|pd|cc-by-sa|cc by-sa)/i;

async function json(url) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, { headers: UA });
    if (response.status === 429) { await sleep(4000 * attempt); continue; }
    if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
    return response.json();
  }
  throw new Error(`Rate limited: ${url}`);
}
const stripHtml = (text = "") => text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function fromWikidata(qid) {
  const data = await json(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
  const claims = data.entities[qid].claims;
  const coords = claims.P625?.[0]?.mainsnak?.datavalue?.value;
  const capacities = (claims.P1083 ?? []).map((claim) => Number(claim.mainsnak?.datavalue?.value?.amount)).filter((value) => value > 0);
  const image = claims.P18?.[0]?.mainsnak?.datavalue?.value;
  return { lat: coords?.latitude ?? null, lng: coords?.longitude ?? null, capacity: capacities.length ? Math.max(...capacities) : null, image };
}

async function commonsPhoto(fileName, venueId) {
  const info = await json(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1280&titles=${encodeURIComponent(`File:${fileName}`)}`);
  const page = Object.values(info.query.pages)[0];
  const meta = page.imageinfo?.[0]?.extmetadata ?? {};
  const licence = stripHtml(meta.LicenseShortName?.value);
  if (!FREE_LICENCE.test(licence)) return { skipped: `licence "${licence}"` };
  const target = path.join(imageDir, `${venueId}.webp`);
  if (!existsSync(target)) {
    await sleep(1500);
    const response = await fetch(page.imageinfo[0].thumburl, { headers: UA });
    if (!response.ok) return { skipped: `HTTP ${response.status}` };
    await sharp(Buffer.from(await response.arrayBuffer())).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 72 }).toFile(target);
  }
  return {
    image: `/images/venues/${venueId}.webp`,
    imageCredit: { author: stripHtml(meta.Artist?.value) || "Autor desconocido", license: licence, licenseUrl: meta.LicenseUrl?.value ?? null, source: page.imageinfo[0].descriptionurl },
  };
}

async function geocode(venue) {
  await sleep(1100); // Nominatim usage policy: at most one request per second.
  const results = await json(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=es&q=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`);
  const fallback = results.length ? results : await json(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=es&q=${encodeURIComponent(venue.address)}`);
  return fallback[0] ? { lat: Number(fallback[0].lat), lng: Number(fallback[0].lon) } : { lat: null, lng: null };
}

const venues = JSON.parse(readFileSync(venuesPath, "utf8"));
// Venues already enriched keep their data (re-run only processes new ones).
for (const venue of venues.filter((item) => item.lat === undefined)) {
  const qid = WIKIDATA[venue.id] ?? null;
  const report = [];
  let wd = { lat: null, lng: null, capacity: null, image: null };
  if (qid) { wd = await fromWikidata(qid); await sleep(300); }
  let { lat, lng } = wd;
  if (lat == null) { ({ lat, lng } = await geocode(venue)); report.push("coords: Nominatim"); }
  Object.assign(venue, {
    lat: lat == null ? null : Math.round(lat * 1e5) / 1e5,
    lng: lng == null ? null : Math.round(lng * 1e5) / 1e5,
    capacity: wd.capacity,
    wikidata: qid,
  });
  venue.image = null;
  venue.imageCredit = null;
  if (wd.image) {
    const photo = await commonsPhoto(wd.image, venue.id);
    if (photo.image) Object.assign(venue, photo); else report.push(`photo skipped: ${photo.skipped}`);
  } else report.push("no photo");
  console.log(`${venue.id}: ${venue.lat},${venue.lng} · aforo ${venue.capacity ?? "?"} · ${venue.image ? "foto" : "sin foto"}${report.length ? ` (${report.join("; ")})` : ""}`);
}
writeFileSync(venuesPath, `${JSON.stringify(venues, null, 2)}\n`);
