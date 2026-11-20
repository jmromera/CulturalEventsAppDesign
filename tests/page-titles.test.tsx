import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { events } from "../src/data/event-catalog";
import { STORAGE_KEYS } from "../src/data/storage-keys";

// WCAG 2.4.2 (Page Titled): profile and demo booking used to fall through to «Página no encontrada».
function visit(path: string) {
  window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
  window.localStorage.setItem(STORAGE_KEYS.preferredCity, "Madrid");
  return render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}

describe("Document titles", () => {
  it("names the profile page", () => {
    visit("/perfil");
    expect(document.title).toBe("Tu perfil · Plan Cerca");
  });

  it("names the demo booking with its event", () => {
    const event = events.find((item) => item.id === 3)!;
    visit("/event/3/reservar?city=Madrid");
    expect(document.title).toBe(`Reserva de demostración: ${event.title} · Plan Cerca`);
  });

  it("still marks unknown pages as not found", () => {
    visit("/no-existe");
    expect(document.title).toContain("Página no encontrada");
  });
});
