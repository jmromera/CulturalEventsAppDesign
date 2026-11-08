import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";

// 89: Muse, 23 Jan 2027, time to be confirmed.
function visit(path: string) {
  window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
  return render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}

describe("Event page (P2.5)", () => {
  it("has a single Save control, in the action bar", () => {
    visit("/event/89?city=Valencia");
    const purchase = document.querySelector(".purchase-card") as HTMLElement;
    expect(within(purchase).queryByRole("button", { name: /Guardar/ })).toBeNull();
    expect(within(document.querySelector(".detail-top") as HTMLElement).getByRole("button", { name: /Guardar/ })).toBeTruthy();
  });

  it("says the time is to be confirmed only once", () => {
    visit("/event/89?city=Valencia");
    const text = (document.querySelector(".detail-hero")!.textContent ?? "") + (document.querySelector(".purchase-card")!.textContent ?? "");
    expect(text.match(/por confirmar/gi)).toHaveLength(1);
  });

  it("keeps the mobile buy bar out of the tab order and hidden from screen readers until it is shown", () => {
    visit("/event/89?city=Valencia");
    const bar = document.querySelector(".detail-mobile-cta") as HTMLElement;
    expect(bar.getAttribute("aria-hidden")).toBe("true");
    expect(within(bar).getByRole("link", { hidden: true }).getAttribute("tabindex")).toBe("-1");
    expect(screen.getAllByRole("link", { name: /Comprar en la web oficial/ }).length).toBeGreaterThan(0);
  });
});
