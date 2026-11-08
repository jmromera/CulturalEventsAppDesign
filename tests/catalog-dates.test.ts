import { describe, expect, it } from "vitest";
import { catalogAt, dayKey, protagonistKey, RECOMMENDATION_RULES, recommendedEvents } from "../src/data/event-catalog";
import { venueFor } from "../src/data/venue-catalog";
import { cities } from "../src/types/Event";

// The site is evaluated any day between the delivery (20/12/2026) and 31/01/2027.
const EVALUATION_DAYS = ["2026-12-20", "2027-01-01", "2027-01-31"];
const at = (iso: string) => new Date(`${iso}T12:00:00`);
const plusDays = (iso: string, days: number) => dayKey(new Date(at(iso).getTime() + days * 86_400_000));

describe.each(EVALUATION_DAYS)("on %s", (day) => {
  const catalog = catalogAt(at(day));

  it.each(cities)("%s has upcoming events", (city) => {
    const cityEvents = catalog.events.filter((event) => venueFor(event.venueId).city === city);
    expect(cityEvents.length).toBeGreaterThan(0);
    expect(cityEvents.every((event) => (event.endDate ?? event.startDate ?? "9999") >= day)).toBe(true);
  });

  it.each(cities)("%s has plans in the next 30 days (the \"Next 30 days\" chip is never empty)", (city) => {
    const until = plusDays(day, 30);
    const soon = catalog.events.filter((event) => venueFor(event.venueId).city === city && event.startDate && event.startDate <= until && (event.endDate ?? event.startDate) >= day);
    expect(soon.length).toBeGreaterThan(0);
  });

  it.each(cities)("%s shows three recommendations that follow the rules", (city) => {
    const recommended = recommendedEvents(catalog.events.filter((event) => venueFor(event.venueId).city === city));
    const summary = recommended.map((event) => `${event.category}: ${event.title} @ ${event.venueId}`).join("\n");
    expect(recommended, summary).toHaveLength(RECOMMENDATION_RULES.size);
    // At least 2 of 3 are concerts.
    expect(recommended.filter((event) => event.category === "Música").length, summary).toBeGreaterThanOrEqual(RECOMMENDATION_RULES.minMusic);
    // At most 1 sports event, and never two sports events in a row.
    expect(recommended.filter((event) => event.category === "Deportes").length, summary).toBeLessThanOrEqual(RECOMMENDATION_RULES.maxSport);
    recommended.forEach((event, index) => {
      if (index > 0) expect(event.category === "Deportes" && recommended[index - 1].category === "Deportes", summary).toBe(false);
    });
    // No repeated artist, team or venue.
    expect(new Set(recommended.map(protagonistKey)).size, summary).toBe(recommended.length);
    expect(new Set(recommended.map((event) => event.venueId)).size, summary).toBe(recommended.length);
    // Exhibitions never lead.
    expect(["Exposiciones", "Museos"]).not.toContain(recommended[0].category);
  });

  // With favourite categories in the profile, the person's choice wins over the default rules.
  const FAVOURITE_SETS: string[][] = [["Teatro"], ["Deportes"], ["Exposiciones", "Museos"], ["Danza", "Ópera", "Teatro"], ["Música", "Teatro"]];
  describe.each(FAVOURITE_SETS.map((set) => [set.join(", "), set] as const))("with favourites %s", (_, favourites) => {
    it.each(cities)("%s recommends only those categories while the city has them", (city) => {
      const cityEvents = catalog.events.filter((event) => venueFor(event.venueId).city === city);
      const recommended = recommendedEvents(cityEvents, undefined, favourites);
      const summary = recommended.map((event) => `${event.category}: ${event.title} @ ${event.venueId}`).join("\n");
      expect(recommended, summary).toHaveLength(Math.min(RECOMMENDATION_RULES.size, cityEvents.length));
      expect(new Set(recommended.map(protagonistKey)).size, summary).toBe(recommended.length);
      expect(new Set(recommended.map((event) => event.venueId)).size, summary).toBe(recommended.length);
      const isFavourite = (event: { category: string }) => favourites.includes(event.category);
      const firstOther = recommended.findIndex((event) => !isFavourite(event));
      if (firstOther >= 0) {
        // Favourites come first; another category only fills in when no favourite fits any more.
        expect(recommended.slice(firstOther).some(isFavourite), summary).toBe(false);
        const picked = recommended.slice(0, firstOther);
        const stillFits = cityEvents.some((event) => isFavourite(event) && !picked.some((pick) => pick.venueId === event.venueId || protagonistKey(pick) === protagonistKey(event)));
        expect(stillFits, summary).toBe(false);
      }
      // Every chosen category shows up when there is room, unless all its events share a venue or artist with a pick.
      if (favourites.length <= RECOMMENDATION_RULES.size) {
        for (const category of favourites) {
          if (recommended.some((event) => event.category === category)) continue;
          const clashes = cityEvents.filter((event) => event.category === category).every((event) => recommended.some((pick) => pick.venueId === event.venueId || protagonistKey(pick) === protagonistKey(event)));
          expect(clashes, `${category}\n${summary}`).toBe(true);
        }
      }
    });
  });

  it("hides events that already finished", () => {
    expect(catalog.endedEvents.every((event) => (event.endDate ?? event.startDate)! < day)).toBe(true);
  });
});
