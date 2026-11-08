import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";
import MonthCalendar from "../src/components/MonthCalendar";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { parseSlots, timeSlotOf } from "../src/lib/time-slot";
import type { EventItem } from "../src/types/Event";

function renderHome(entry = "/?city=Valencia") {
  window.localStorage.setItem("plan-cerca.city-onboarding-dismissed", "true");
  window.localStorage.setItem("plan-cerca.preferred-city", "Valencia");
  return render(<MemoryRouter initialEntries={[entry]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}

const filtersButton = () => screen.getByRole("button", { name: /^Filtros/ });
const openFilters = () => { const button = filtersButton(); button.focus(); fireEvent.click(button); return screen.getByRole("dialog", { name: "Filtros" }); };
const applyButton = (dialog: HTMLElement) => within(dialog).getByRole("button", { name: /^Ver \d+ resultados?$|^Sin resultados/ });
const countOf = (dialog: HTMLElement) => Number(applyButton(dialog).textContent?.match(/\d+/)?.[0] ?? 0);

describe("time slots", () => {
  const at = (time: string) => ({ time } as EventItem);
  it("splits the day at 14:00 and 20:00 and ignores times that are not clock times", () => {
    expect(timeSlotOf(at("11:30"))).toBe("morning");
    expect(timeSlotOf(at("14:00"))).toBe("afternoon");
    expect(timeSlotOf(at("19:59"))).toBe("afternoon");
    expect(timeSlotOf(at("20:00"))).toBe("night");
    expect(timeSlotOf(at("Por confirmar"))).toBeNull();
  });
  it("reads the franja URL parameter and drops unknown values", () => {
    expect(parseSlots("tarde,noche,xx")).toEqual(["afternoon", "night"]);
    expect(parseSlots(null)).toEqual([]);
  });
});

describe("Filters panel", () => {
  it("opens as a modal dialog, keeps Tab inside and returns focus on Esc", () => {
    renderHome();
    expect(filtersButton().getAttribute("aria-haspopup")).toBe("dialog");
    const dialog = openFilters();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    const close = within(dialog).getByRole("button", { name: "Cerrar filtros" });
    expect(document.activeElement).toBe(close);

    // Shift+Tab from the first control wraps to the last one, and Tab from the last back to the first.
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(close);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(close);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(filtersButton());
  });

  it("updates the result count live and applies the time slot as a removable chip", () => {
    renderHome();
    const dialog = openFilters();
    const all = countOf(dialog);
    expect(all).toBeGreaterThan(0);
    fireEvent.click(within(dialog).getByRole("button", { name: /^Noche/ }));
    const night = countOf(dialog);
    expect(night).toBeGreaterThan(0);
    expect(night).toBeLessThan(all);
    expect(within(dialog).getByRole("status").textContent).toBe(applyButton(dialog).textContent);

    fireEvent.click(applyButton(dialog));
    expect(screen.queryByRole("dialog")).toBeNull();
    const chips = screen.getByRole("group", { name: "Filtros activos" });
    const chip = within(chips).getByRole("button", { name: "Quitar filtro: Por la noche" });
    expect(filtersButton().textContent).toContain("1");

    fireEvent.click(chip);
    expect(screen.queryByRole("group", { name: "Filtros activos" })).toBeNull();
  });

  it("removes every filter at once with «Quitar todos»", () => {
    renderHome("/?city=Valencia&cat=Música&when=month&franja=noche");
    const chips = screen.getByRole("group", { name: "Filtros activos" });
    expect(within(chips).getAllByRole("button").length).toBe(4);
    fireEvent.click(within(chips).getByRole("button", { name: "Quitar todos" }));
    expect(screen.queryByRole("group", { name: "Filtros activos" })).toBeNull();
    expect(filtersButton().textContent).toBe("Filtros");
  });

  it("disables the apply button when nothing matches", () => {
    renderHome();
    const dialog = openFilters();
    // A day well after the end of the catalogue (March 2027) never has events, whatever today is.
    for (let month = 0; month < 14; month += 1) fireEvent.keyDown(within(dialog).getByRole("grid").querySelector("button[tabindex='0']")!, { key: "PageDown" });
    fireEvent.click(within(dialog).getByRole("grid").querySelector<HTMLButtonElement>("button[tabindex='0']")!);
    const button = applyButton(dialog) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe("Sin resultados con estos filtros");
  });

  it("promises exactly the results the list then shows, also with a «Cerca de mí» radius", async () => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition: vi.fn((success: PositionCallback) => success({ coords: { latitude: 39.46975, longitude: -0.37739, accuracy: 30 }, timestamp: Date.now() } as unknown as GeolocationPosition)) } });
    renderHome();
    const listCount = () => Number(document.querySelector("#catalogue")!.textContent!.match(/VALENCIA · (\d+)/)![1]);
    const total = listCount();
    fireEvent.click(screen.getByRole("button", { name: "Cerca de mí" }));
    fireEvent.click(screen.getByRole("button", { name: "Usar mi ubicación" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "1 km" })).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "1 km" }));
    expect(listCount()).toBeLessThan(total);
    const dialog = openFilters();
    const promised = countOf(dialog);
    expect(promised).toBe(listCount());
    fireEvent.click(applyButton(dialog));
    expect(listCount()).toBe(promised);
  });
});

describe("Month calendar", () => {
  const today = new Date(2026, 11, 20);
  it("moves with the arrow keys, never before today, and announces the events of each day", () => {
    let picked = "";
    render(<MonthCalendar language="es" selected={null} today={today} countFor={(key) => (key === "2026-12-27" ? 3 : 0)} onSelect={(key) => { picked = key; }} />);
    const start = screen.getByRole("button", { name: /20 de diciembre/ });
    expect(start.tabIndex).toBe(0);
    fireEvent.keyDown(start, { key: "ArrowDown" });
    const next = screen.getByRole("button", { name: /27 de diciembre, 3 eventos/ });
    expect(document.activeElement).toBe(next);
    fireEvent.keyDown(next, { key: "ArrowUp" });
    fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /20 de diciembre/ }));
    expect((screen.getByRole("button", { name: /19 de diciembre/ }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(next);
    expect(picked).toBe("2026-12-27");
  });

  it("changes month with PageDown", () => {
    render(<MonthCalendar language="es" selected={null} today={today} countFor={() => 0} onSelect={() => {}} />);
    fireEvent.keyDown(screen.getByRole("button", { name: /20 de diciembre/ }), { key: "PageDown" });
    expect(screen.getByRole("heading", { name: /enero de 2027/ })).toBeTruthy();
  });
});
