import type { Language } from "../data/language";

export type Coordinates = { lat: number; lng: number };

/** Great-circle distance in kilometres (haversine formula). */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Coordinates are rounded to 3 decimals (about 100 m) as soon as they arrive:
 * enough to sort events by distance, without keeping an exact position.
 */
export function roundCoordinates({ lat, lng }: Coordinates): Coordinates {
  return { lat: Math.round(lat * 1000) / 1000, lng: Math.round(lng * 1000) / 1000 };
}

const locales: Record<Language, string> = { es: "es-ES", en: "en-GB", fr: "fr-FR" };

/** "a 850 m", "a 2,3 km", "a 25 km" (in the visitor's language). */
export function formatDistance(km: number, language: Language): string {
  const prefix = { es: "a ", en: "", fr: "à " }[language];
  const suffix = { es: "", en: " away", fr: "" }[language];
  if (km < 1) return `${prefix}${Math.max(50, Math.round((km * 1000) / 50) * 50)} m${suffix}`;
  const value = new Intl.NumberFormat(locales[language], { maximumFractionDigits: km < 10 ? 1 : 0 }).format(km);
  return `${prefix}${value} km${suffix}`;
}
