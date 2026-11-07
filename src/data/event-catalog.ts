import cityImageData from "./city-images.json";
import eventData from "./events.json";
import { cities, type City, type EventItem } from "../types/Event";
import { venueFor } from "./venue-catalog";

export const cityImages = cityImageData as Record<City, string>;
const allEvents = eventData as EventItem[];

/** Local calendar day as YYYY-MM-DD (event dates are local Spanish dates, not UTC). */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const lastDay = (event: EventItem) => event.endDate ?? event.startDate;

/**
 * "Big event" label: an objective criterion instead of ratings with no source.
 * Venues with capacity for 10,000 people or more (stadiums, arenas, large pavilions).
 */
export const BIG_EVENT_CAPACITY = 10_000;
export function isBigEvent(event: EventItem): boolean {
  return (venueFor(event.venueId).capacity ?? 0) >= BIG_EVENT_CAPACITY;
}

// Exhibitions and museums run for months: they are filler and must not lead the recommendations.
const LONG_RUNNING = new Set(["Exposiciones", "Museos"]);

export type Catalog = {
  /** Upcoming and ongoing events, by start date (undated events last). */
  events: EventItem[];
  /** Events that already finished: their page still exists and says so. */
  endedEvents: EventItem[];
  cityEventCounts: Record<City, number>;
};

/** The catalogue as seen on a given day. The app uses today; tests simulate other dates. */
export function catalogAt(now: Date): Catalog {
  const today = dayKey(now);
  const hasEnded = (event: EventItem) => Boolean(lastDay(event) && lastDay(event)! < today);
  const events = allEvents
    .filter((event) => !hasEnded(event))
    .sort((a, b) => (a.startDate ?? "9999-12-31").localeCompare(b.startDate ?? "9999-12-31"));
  const cityEventCounts = Object.fromEntries(
    cities.map((city) => [city, events.filter((event) => venueFor(event.venueId).city === city).length]),
  ) as Record<City, number>;
  return { events, endedEvents: allEvents.filter(hasEnded), cityEventCounts };
}

/**
 * Up to `limit` recommendations for a city: big events first, then featured ones, then the rest,
 * each group by date; long-running exhibitions go last; one entry per artist or show.
 */
export function recommendedEvents(cityEvents: EventItem[], limit = 3): EventItem[] {
  const rank = (event: EventItem) => (LONG_RUNNING.has(event.category) ? 3 : isBigEvent(event) ? 0 : event.featured ? 1 : 2);
  const ordered = [...cityEvents].sort((a, b) => rank(a) - rank(b) || (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999"));
  const seen = new Set<string>();
  const picked: EventItem[] = [];
  for (const event of ordered) {
    if (!event.title?.trim()) continue;
    const key = event.relatedEntityId ?? event.title.split(/\s+[—–-]\s+/)[0].normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(event);
    if (picked.length === limit) break;
  }
  return picked;
}

const current = catalogAt(new Date());
export const events = current.events;
export const endedEvents = current.endedEvents;
export const cityEventCounts = current.cityEventCounts;

export function relatedEventsByEntity(entityId: string, excludedEventId?: number): EventItem[] {
  return events
    .filter((event) => event.relatedEntityId === entityId
      && event.id !== excludedEventId
      && event.confirmed)
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}
