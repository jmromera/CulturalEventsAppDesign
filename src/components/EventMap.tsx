import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** One marker per venue; its popup lists the events there. */
export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  /** Lines shown in the popup: event title, date and the in-app path to open it. */
  items: { label: string; detail: string; href: string }[];
};

// Map tiles come from OpenStreetMap: this component is only loaded after the person asks for the map.
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

// A plain HTML marker (no image files), so it inherits the theme and needs no extra request.
const markerIcon = (count: number) => L.divIcon({
  className: "map-marker",
  html: `<span><i>${count > 1 ? count : ""}</i></span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [0, -28],
});

export default function EventMap({ points, label, center, zoom = 12 }: { points: MapPoint[]; label: string; center: { lat: number; lng: number }; zoom?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { scrollWheelZoom: false, keyboard: true }).setView([center.lat, center.lng], zoom);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
    const bounds: L.LatLngExpression[] = [];
    for (const point of points) {
      const popup = `<strong class="map-popup-title">${escapeHtml(point.title)}</strong><ul class="map-popup-list">${point.items.slice(0, 6).map((item) => `<li><a href="${escapeHtml(item.href)}" data-route="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a><small>${escapeHtml(item.detail)}</small></li>`).join("")}</ul>${point.items.length > 6 ? `<small>+${point.items.length - 6}</small>` : ""}`;
      const marker = L.marker([point.lat, point.lng], { icon: markerIcon(point.items.length), keyboard: true, title: point.title, riseOnHover: true }).bindPopup(popup).addTo(map);
      // Leaflet markers are focusable; give them a role and a name for screen readers.
      const element = marker.getElement();
      element?.setAttribute("role", "button");
      element?.setAttribute("aria-label", `${point.title}: ${point.items.length} ${point.items.length === 1 ? "evento" : "eventos"}`);
      bounds.push([point.lat, point.lng]);
    }
    if (bounds.length > 1) map.fitBounds(L.latLngBounds(bounds), { padding: [36, 36], maxZoom: 14 });
    // Keyboard: opening a popup moves focus to its first link; closing it (also with Esc) returns
    // focus to the marker, so keyboard users never get lost (WCAG 2.4.3 focus order).
    map.on("popupopen", (event) => { event.popup.getElement()?.querySelector<HTMLElement>("a[data-route]")?.focus(); });
    map.on("popupclose", (event) => {
      const source = (event.popup as L.Popup & { _source?: L.Marker })._source;
      if (container.current?.contains(document.activeElement) || document.activeElement === document.body) source?.getElement()?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") map.closePopup(); };
    container.current.addEventListener("keydown", onKeyDown);
    // Links inside popups navigate within the app instead of reloading the page.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-route]");
      if (!link) return;
      event.preventDefault();
      navigate(link.dataset.route!);
    };
    const element = container.current;
    element.addEventListener("click", onClick);
    return () => { element.removeEventListener("click", onClick); element.removeEventListener("keydown", onKeyDown); map.remove(); };
  }, [points, center.lat, center.lng, zoom, navigate]);

  return <div ref={container} className="event-map" role="region" aria-label={label} />;
}
