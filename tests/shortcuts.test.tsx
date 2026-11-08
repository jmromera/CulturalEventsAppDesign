import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";

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
});
