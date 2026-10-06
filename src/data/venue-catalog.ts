import venueData from "./venues.json";
import type { City, Venue } from "../types/Event";

export const venues = venueData as Venue[];

export function venueIdFor(city: City, venueName: string): string {
  const mainVenueName = venueName.split(" · ")[0].trim();
  return `${city}-${mainVenueName}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function venueFor(id: string): Venue {
  const venue = venues.find((item) => item.id === id);
  if (!venue) throw new Error(`Unknown venue: ${id}`);
  return venue;
}
