import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";
import { cities } from "../src/types/Event";

describe("Home date shortcuts (D1)", () => {
  // A day with no events today, tomorrow or this week in Madrid (the case that showed three dead buttons).
  beforeAll(() => { vi.setSystemTime(new Date("2026-11-12T12:00:00")); });
  afterAll(() => { vi.setSystemTime(new Date(`${process.env.TEST_TODAY ?? "2026-12-20"}T12:00:00`)); });

  it.each(cities)("%s: no shortcut with zero events is shown", (city) => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    render(<MemoryRouter initialEntries={[`/?city=${encodeURIComponent(city)}`]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
    for (const chip of document.querySelectorAll(".hero-chip")) expect(Number(chip.querySelector("span")!.textContent)).toBeGreaterThan(0);
  });
});
