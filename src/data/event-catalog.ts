import cityImageData from "./city-images.json";
import eventData from "./events.json";
import { cities, type City, type EventItem } from "../types/Event";
import { venueFor } from "./venue-catalog";

export const cityImages = cityImageData as Record<City, string>;
const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const hasEnded = (event: EventItem) => {
  const lastDate = event.endDate ?? event.startDate;
  return Boolean(lastDate && lastDate < todayKey);
};

// Ya terminados: fuera del catálogo, pero su ficha debe poder avisar de que el evento ha pasado.
export const endedEvents = (eventData as EventItem[]).filter(hasEnded);

// Sin fecha de inicio, al final; los que ya terminaron se excluyen.
export const events = (eventData as EventItem[])
  .filter((event) => !hasEnded(event))
  .sort((a, b) => (a.startDate ?? "9999-12-31").localeCompare(b.startDate ?? "9999-12-31"));

export const cityEventCounts: Record<City, number> = Object.fromEntries(
  cities.map((city) => [city, events.filter((event) => venueFor(event.venueId).city === city).length]),
) as Record<City, number>;

export function relatedEventsByEntity(entityId: string, excludedEventId?: number): EventItem[] {
  return events
    .filter((event) => event.relatedEntityId === entityId
      && event.id !== excludedEventId
      && event.confirmed)
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}
