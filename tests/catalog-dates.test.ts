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

  // The same rules hold with the favourite categories a person can pick in their profile.
  const FAVOURITE_SETS: string[][] = [[], ["Teatro"], ["Deportes"], ["Exposiciones", "Museos"], ["Danza", "Ópera", "Teatro"], ["Música"]];
  describe.each(FAVOURITE_SETS.map((set) => [set.join(", ") || "no favourites", set] as const))("with %s", (_, favourites) => {
    it.each(cities)("%s shows three recommendations that follow the rules", (city) => {
      const cityEvents = catalog.events.filter((event) => venueFor(event.venueId).city === city);
      const recommended = recommendedEvents(cityEvents, undefined, favourites);
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
      // A favourite stage or exhibition category shows up whenever the city has one that fits the rules.
      // Sport only moves up within its own group: stage shows still go before it ("teatro antes que deporte").
      const others = favourites.filter((category) => !["Música", "Deportes"].includes(category));
      // So a sport favourite on its own never changes which kind of event fills each slot.
      if (favourites.length === 1 && favourites[0] === "Deportes") expect(recommended.map((event) => event.category), summary).toEqual(recommendedEvents(cityEvents).map((event) => event.category));
      const fits = cityEvents.some((event) => others.includes(event.category) && !recommended.slice(0, RECOMMENDATION_RULES.minMusic).some((pick) => pick.venueId === event.venueId || protagonistKey(pick) === protagonistKey(event)));
      if (others.length && fits) expect(recommended.some((event) => others.includes(event.category)), summary).toBe(true);
    });
  });

  it("hides events that already finished", () => {
    expect(catalog.endedEvents.every((event) => (event.endDate ?? event.startDate)! < day)).toBe(true);
  });
});
