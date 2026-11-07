import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";

// jsdom cannot draw Leaflet maps: replace the map with a stub that reports what it received.
const mapRenders = vi.hoisted(() => [] as { points: number; label: string }[]);
vi.mock("../src/components/EventMap", () => ({
  default: ({ points, label }: { points: unknown[]; label: string }) => {
    mapRenders.push({ points: points.length, label });
    return <div role="region" aria-label={label} data-points={points.length} />;
  },
}));

function renderAt(path: string) {
  window.localStorage.setItem("plan-cerca.city-onboarding-dismissed", "true");
  window.localStorage.setItem("plan-cerca.preferred-city", "Valencia");
  return render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}

describe("map", () => {
  it("is not loaded until the person asks for it, and the list stays available", async () => {
    mapRenders.length = 0;
    renderAt("/?city=Valencia");
    expect(screen.queryByText(/Mapa de OpenStreetMap/)).toBeNull();
    expect(mapRenders).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Mapa" }));
    expect(screen.getByText(/Mapa de OpenStreetMap/)).toBeTruthy();
    const map = await screen.findByRole("region", { name: "Mapa de los recintos con eventos" });
    expect(Number(map.getAttribute("data-points"))).toBeGreaterThan(0);
    expect(within(document.getElementById("catalogue")!).getAllByRole("article").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Mapa" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("goes back to the list", () => {
    renderAt("/?city=Valencia");
    fireEvent.click(screen.getByRole("button", { name: "Mapa" }));
    fireEvent.click(screen.getByRole("button", { name: "Lista" }));
    expect(screen.queryByText(/Mapa de OpenStreetMap/)).toBeNull();
  });

  it("shows the venue on a mini map in the event page only on request", async () => {
    mapRenders.length = 0;
    renderAt("/event/89?city=Valencia");
    expect(mapRenders).toHaveLength(0);
    const toggle = screen.getByRole("button", { name: "Ver en el mapa" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    const map = await screen.findByRole("region", { name: "Mapa del recinto" });
    expect(map.getAttribute("data-points")).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Ocultar el mapa" }));
    expect(screen.queryByRole("region", { name: "Mapa del recinto" })).toBeNull();
  });
});
