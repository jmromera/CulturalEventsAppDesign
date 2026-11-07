import { legalData } from "../legal/legal-data";

const SITE_URL = legalData.sitio.url.replace(/\/$/, "");
// Listing pages whose content depends on the city keep it in the canonical URL.
const CITY_PAGES = new Set(["/", "/venues"]);
// Personal or endless pages that search engines should not index.
const NOINDEX_PAGES = new Set(["/search", "/favorites", "/tus-datos"]);

function upsert(selector: string, create: () => HTMLElement): HTMLElement {
  return document.head.querySelector<HTMLElement>(selector) ?? document.head.appendChild(create());
}

/** Keeps <link rel="canonical"> and <meta name="robots"> in sync with the current route. */
export function updatePageMeta(pathname: string, search: string, notFound: boolean) {
  const city = new URLSearchParams(search).get("city");
  const canonical = `${SITE_URL}${pathname}${CITY_PAGES.has(pathname) && city ? `?city=${encodeURIComponent(city)}` : ""}`;
  const link = upsert('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }));
  link.setAttribute("href", canonical);
  const ogUrl = upsert('meta[property="og:url"]', () => { const meta = document.createElement("meta"); meta.setAttribute("property", "og:url"); return meta; });
  ogUrl.setAttribute("content", canonical);
  const robots = upsert('meta[name="robots"]', () => Object.assign(document.createElement("meta"), { name: "robots" }));
  robots.setAttribute("content", notFound || NOINDEX_PAGES.has(pathname) ? "noindex, follow" : "index, follow");
}
