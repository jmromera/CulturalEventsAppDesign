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

/** Event photo: its own image or, by default, the freely licensed photo of its venue. */
export function eventImage(event: EventItem): string | null {
  return event.image ?? venueFor(event.venueId).image ?? null;
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

const normalise = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase().trim();

/** Who the event is about: the artist or show, or the home team for a match. Used to avoid repeats. */
export function protagonistKey(event: EventItem): string {
  if (event.relatedEntityId) return event.relatedEntityId;
  const title = event.title ?? "";
  if (event.category === "Deportes") return normalise(title.split(/\s+vs\.?\s+/i)[0]);
  return normalise(title.split(/\s+[—–-]\s+/)[0]);
}

export const RECOMMENDATION_RULES = { size: 3, minMusic: 2, maxSport: 1 } as const;

/**
 * Recommendations for a city (see docs/CHANGELOG-UI.md):
 * - at least 2 of every 3 are concerts (Música), big concerts in stadiums and arenas first;
 * - at most 1 sports event, so never two in a row;
 * - no two events with the same artist, team or venue;
 * - gaps are filled with theatre, musicals, opera or dance before sport; exhibitions only as a last resort.
 * Within each group: big events (venue capacity >= 10,000) first, then featured, then by date.
 * With favourite categories (profile), they come first inside each group and a favourite outside music takes
 * the slot that is not reserved for concerts; the rules above still apply.
 */
export function recommendedEvents(cityEvents: EventItem[], limit: number = RECOMMENDATION_RULES.size, favourites: readonly string[] = []): EventItem[] {
  const liked = (event: EventItem) => (favourites.includes(event.category) ? 0 : 1);
  const priority = (event: EventItem) => (isBigEvent(event) ? 0 : event.featured ? 1 : 2);
  const byPriority = (a: EventItem, b: EventItem) => liked(a) - liked(b) || priority(a) - priority(b) || (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999");
  const valid = cityEvents.filter((event) => event.title?.trim()).sort(byPriority);
  const music = valid.filter((event) => event.category === "Música");
  const stage = valid.filter((event) => !["Música", "Deportes"].includes(event.category) && !LONG_RUNNING.has(event.category));
  const sport = valid.filter((event) => event.category === "Deportes");
  const longRunning = valid.filter((event) => LONG_RUNNING.has(event.category));

  const picked: EventItem[] = [];
  const usedKeys = new Set<string>();
  const usedVenues = new Set<string>();
  let sports = 0;
  const take = (pool: EventItem[], max: number) => {
    for (const event of pool) {
      if (picked.length >= limit || max <= 0) return;
      if (picked.includes(event) || usedKeys.has(protagonistKey(event)) || usedVenues.has(event.venueId)) continue;
      if (event.category === "Deportes" && sports >= RECOMMENDATION_RULES.maxSport) continue;
      picked.push(event);
      usedKeys.add(protagonistKey(event));
      usedVenues.add(event.venueId);
      if (event.category === "Deportes") sports += 1;
      max -= 1;
    }
  };
  const likedOthers = valid.filter((event) => event.category !== "Música" && favourites.includes(event.category));
  if (likedOthers.length) {
    take(music, Math.min(limit, RECOMMENDATION_RULES.minMusic)); // the concerts the rules require
    take(likedOthers, limit);                                     // then the person's favourite categories
  }
  take(music, limit);          // concerts fill as many slots as they can
  take(stage, limit);          // then a big musical, theatre, opera or dance
  take(sport, RECOMMENDATION_RULES.maxSport);
  take(longRunning, limit);
  // Concerts lead, then the rest; with at most one sports event there are never two in a row.
  return [...picked.filter((event) => event.category === "Música"), ...picked.filter((event) => event.category !== "Música")];
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
