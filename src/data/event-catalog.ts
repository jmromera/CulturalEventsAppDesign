import cityImageData from "./city-images.json";
import eventData from "./events.json";
import { cities, type City, type EventItem } from "../types/Event";
import { venueFor } from "./venue-catalog";

export const cityImages = cityImageData as Record<City, string>;
export const events = eventData as EventItem[];

export const cityEventCounts: Record<City, number> = Object.fromEntries(
  cities.map((city) => [city, events.filter((event) => venueFor(event.venueId).city === city).length]),
) as Record<City, number>;
