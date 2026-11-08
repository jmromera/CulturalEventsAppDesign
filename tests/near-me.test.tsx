import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { formatDistance } from "../src/lib/geo";

// Plaza del Ayuntamiento, Valencia.
const VALENCIA = { latitude: 39.46975, longitude: -0.37739, accuracy: 30 };

function mockGeolocation(result: "allow" | "deny") {
  const getCurrentPosition = vi.fn((success: PositionCallback, failure?: PositionErrorCallback | null) => {
    if (result === "allow") success({ coords: VALENCIA, timestamp: Date.now() } as unknown as GeolocationPosition);
    else failure?.({ code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3, message: "denied" } as GeolocationPositionError);
  });
  Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition } });
  return getCurrentPosition;
}

function renderHome() {
  window.localStorage.setItem("plan-cerca.city-onboarding-dismissed", "true");
  window.localStorage.setItem("plan-cerca.preferred-city", "Valencia");
  return render(<MemoryRouter initialEntries={["/?city=Valencia"]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}

const catalogueCards = () => within(document.getElementById("catalogue")!).queryAllByRole("article");
const distanceOf = (card: HTMLElement) => card.querySelector(".event-distance")?.textContent ?? "";
const kmOf = (label: string) => { const match = label.match(/([\d.,]+)\s*(k?m)/); if (!match) return Infinity; const value = Number(match[1].replace(/\./g, "").replace(",", ".")); return match[2] === "m" ? value / 1000 : value; };

describe("Near me", () => {
  it("explains first and only asks for the location after the person accepts", () => {
    const geo = mockGeolocation("allow");
    renderHome();
    fireEvent.click(screen.getByRole("button", { name: "Cerca de mí" }));
    expect(screen.getByText(/no se envía a ningún sitio ni se guarda/)).toBeTruthy();
    expect(geo).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Usar mi ubicación" }));
    expect(geo).toHaveBeenCalledOnce();
  });

  it("sorts by distance, shows it on each card and keeps the position on the device", async () => {
    mockGeolocation("allow");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderHome();
    const storedBefore = JSON.stringify({ ...window.localStorage });
    fireEvent.click(screen.getByRole("button", { name: "Cerca de mí" }));
    fireEvent.click(screen.getByRole("button", { name: "Usar mi ubicación" }));
    await waitFor(() => expect(distanceOf(catalogueCards()[0])).not.toBe(""));
    const distances = catalogueCards().map((card) => kmOf(distanceOf(card)));
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
    expect(JSON.stringify({ ...window.localStorage })).toBe(storedBefore);
    expect(JSON.stringify({ ...window.localStorage })).not.toMatch(/39[.,]4|0[.,]37/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("filters by radius", async () => {
    mockGeolocation("allow");
    renderHome();
    fireEvent.click(screen.getByRole("button", { name: "Cerca de mí" }));
    fireEvent.click(screen.getByRole("button", { name: "Usar mi ubicación" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "5 km" })).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "5 km" }));
    const cards = catalogueCards();
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((card) => kmOf(distanceOf(card)) <= 5)).toBe(true);
  });

  it("explains a denied permission and keeps the city list working", async () => {
    mockGeolocation("deny");
    renderHome();
    fireEvent.click(screen.getByRole("button", { name: "Cerca de mí" }));
    fireEvent.click(screen.getByRole("button", { name: "Usar mi ubicación" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("No tenemos permiso"));
    expect(catalogueCards().length).toBeGreaterThan(0);
    expect(catalogueCards().every((card) => distanceOf(card) === "")).toBe(true);
  });
});

describe("formatDistance", () => {
  it("speaks like a person in every language", () => {
    expect(formatDistance(0.42, "es")).toBe("a 400 m");
    expect(formatDistance(2.34, "es")).toBe("a 2,3 km");
    expect(formatDistance(18.6, "en")).toBe("19 km away");
    expect(formatDistance(3.05, "fr")).toBe("à 3,1 km");
  });
});
