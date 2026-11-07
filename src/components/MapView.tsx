import { lazy, Suspense } from "react";
import type { Language } from "../data/language";
import type { MapPoint } from "./EventMap";

// Leaflet (and the OpenStreetMap tiles) are only downloaded when the person opens the map.
const EventMap = lazy(() => import("./EventMap"));

export const mapCopy: Record<Language, { view: string; list: string; map: string; showOnMap: string; hideMap: string; notice: string; loading: string; label: string; detailLabel: string; noPoints: string }> = {
  es: {
    view: "Vista", list: "Lista", map: "Mapa", showOnMap: "Ver en el mapa", hideMap: "Ocultar el mapa",
    notice: "Mapa de OpenStreetMap. Al abrirlo, tu navegador descarga las imágenes del mapa desde openstreetmap.org. La lista de eventos sigue disponible debajo.",
    loading: "Cargando el mapa…", label: "Mapa de los recintos con eventos", detailLabel: "Mapa del recinto", noPoints: "Ningún evento de la lista tiene ubicación en el mapa.",
  },
  en: {
    view: "View", list: "List", map: "Map", showOnMap: "Show on the map", hideMap: "Hide the map",
    notice: "OpenStreetMap map. When you open it, your browser downloads the map images from openstreetmap.org. The event list is still available below.",
    loading: "Loading the map…", label: "Map of venues with events", detailLabel: "Venue map", noPoints: "No event in the list has a location on the map.",
  },
  fr: {
    view: "Affichage", list: "Liste", map: "Carte", showOnMap: "Voir sur la carte", hideMap: "Masquer la carte",
    notice: "Carte OpenStreetMap. À l’ouverture, votre navigateur télécharge les images de la carte depuis openstreetmap.org. La liste des événements reste disponible en dessous.",
    loading: "Chargement de la carte…", label: "Carte des lieux avec des événements", detailLabel: "Carte du lieu", noPoints: "Aucun événement de la liste n’a d’emplacement sur la carte.",
  },
};

export default function MapView({ points, language, center, zoom, detail = false }: { points: MapPoint[]; language: Language; center: { lat: number; lng: number }; zoom?: number; detail?: boolean }) {
  const text = mapCopy[language];
  return <div className={`map-view ${detail ? "map-view--detail" : ""}`}>
    <p className="map-notice">{text.notice}</p>
    {points.length ? <Suspense fallback={<p className="map-loading" role="status">{text.loading}</p>}>
      <EventMap points={points} label={detail ? text.detailLabel : text.label} center={center} zoom={zoom} />
    </Suspense> : <p role="status">{text.noPoints}</p>}
  </div>;
}
