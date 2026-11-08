import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";
import { cities } from "../src/types/Event";

const listCount = (city: string) => Number(document.querySelector("#catalogue")!.textContent!.match(new RegExp(`${city.toLocaleUpperCase()} · (\\d+)`))![1]);

describe("«Lo que más hay» shortcuts", () => {
  it("apply that category alone (replacing others) in one step", () => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    render(<MemoryRouter initialEntries={["/?city=Valencia&cat=Teatro"]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
    const shortcuts = screen.getByRole("region", { name: "Lo que más hay en Valencia" });
    fireEvent.click(within(shortcuts).getByRole("button", { name: /^Música/ }));
    const chips = screen.getByRole("group", { name: "Filtros activos" });
    expect(within(chips).getByRole("button", { name: "Quitar filtro: Música" })).toBeTruthy();
    expect(within(chips).queryByRole("button", { name: "Quitar filtro: Teatro" })).toBeNull();
    expect(within(shortcuts).getByRole("button", { name: /^Música/ }).getAttribute("aria-pressed")).toBe("true");
  });

  it("promise exactly what the list shows for a category, with other filters on", () => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    render(<MemoryRouter initialEntries={["/?city=Valencia&when=month&franja=noche"]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
    const shortcuts = screen.getByRole("region", { name: "Lo que más hay en Valencia" });
    const button = within(shortcuts).getByRole("button", { name: /^Música/ });
    const promised = Number(button.querySelector("small")!.textContent);
    expect(promised).toBeGreaterThan(0);
    fireEvent.click(button);
    expect(listCount("Valencia")).toBe(promised);
  });

  it("promise exactly what the list shows for this week, with a category on", () => {
    let checked = 0;
    for (const city of cities) {
      window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
      const { unmount } = render(<MemoryRouter initialEntries={[`/?city=${city}&cat=Música`]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
      const week = document.querySelector<HTMLButtonElement>(".discovery-shortcuts button:not([data-cat])");
      if (week) {
        const promised = Number(week.querySelector("small")!.textContent);
        fireEvent.click(week);
        expect(listCount(city), city).toBe(promised);
        checked += 1;
      }
      unmount();
    }
    expect(checked).toBeGreaterThan(0);
  });
});
