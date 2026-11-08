import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";

function cards(city: string) {
  window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
  render(<MemoryRouter initialEntries={[`/?city=${city}`]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
  return within(document.getElementById("catalogue")!).getAllByRole("article");
}

describe("Compact event card", () => {
  it.each(["Madrid", "Valencia"])("%s: one link per card (the title), a heart, and no filler texts", (city) => {
    for (const card of cards(city)) {
      expect(within(card).getAllByRole("link")).toHaveLength(1);
      expect(within(card).getAllByRole("button")).toHaveLength(1);
      expect(card.textContent).not.toMatch(/Ver detalle|Consultar precio|Precio pendiente/);
    }
  });

  it("shows a price only when the official site publishes one, and keeps the full date for screen readers", () => {
    for (const card of cards("Madrid")) {
      const price = card.querySelector(".event-price");
      if (price && !price.classList.contains("event-price--soldout")) expect(price.textContent).toMatch(/\d/);
      expect(card.querySelector(".event-when")?.textContent).toMatch(/\d{4}/);
    }
  });
});
