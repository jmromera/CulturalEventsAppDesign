import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";

function visit(path: string) {
  window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
  window.localStorage.setItem(STORAGE_KEYS.preferredCity, "Madrid");
  return render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}
const catalogue = () => document.getElementById("catalogue")!;

describe("P1.6 accessibility", () => {
  it("has one h1 per page and card titles as h3 under section h2s", () => {
    visit("/?city=Madrid");
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    const cards = within(catalogue()).getAllByRole("article");
    expect(within(cards[0]).getByRole("heading", { level: 3 })).toBeTruthy();
    expect(within(catalogue()).getByRole("heading", { level: 2, name: "Explorar todos" })).toBeTruthy();
  });

  it("names the heart button after its event and announces the change", () => {
    visit("/?city=Madrid");
    const card = within(catalogue()).getAllByRole("article")[0];
    const title = within(card).getByRole("heading", { level: 3 }).textContent!;
    fireEvent.click(within(card).getByRole("button", { name: `Guardar: ${title}` }));
    expect(within(card).getByRole("button", { name: `Guardado: ${title}` }).getAttribute("aria-pressed")).toBe("true");
    const live = [...document.querySelectorAll('[role="status"]')].map((node) => node.textContent);
    expect(live).toContain(`«${title}» añadido a favoritos.`);
    fireEvent.click(within(card).getByRole("button", { name: `Guardado: ${title}` }));
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain(`«${title}» quitado de favoritos.`);
  });

  it("moves focus to the first new card after «Mostrar más»", () => {
    visit("/?city=Madrid");
    const before = within(catalogue()).getAllByRole("article").length;
    fireEvent.click(within(catalogue()).getByRole("button", { name: "Mostrar más eventos" }));
    const cards = within(catalogue()).getAllByRole("article");
    expect(cards.length).toBeGreaterThan(before);
    expect(document.activeElement).toBe(within(cards[before]).getByRole("link", { name: within(cards[before]).getByRole("heading", { level: 3 }).textContent! }));
  });
});
