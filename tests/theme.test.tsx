import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";

const visit = (route: string) => render(<MemoryRouter initialEntries={[route]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);

afterEach(() => { delete document.documentElement.dataset.theme; });

describe("Night mode", () => {
  it("the pre-paint script reads the same key as the registry", () => {
    const script = readFileSync(path.resolve(__dirname, "../public/theme-init.js"), "utf8");
    expect(script).toContain(`"${STORAGE_KEYS.theme}"`);
  });

  it("is off by default and stores nothing until it is pressed", () => {
    visit("/?city=Valencia");
    const toggle = screen.getByRole("button", { name: "Modo noche" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBeNull();
  });

  it("switches the whole page and remembers the choice", () => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    visit("/?city=Valencia");
    fireEvent.click(screen.getByRole("button", { name: "Modo noche" }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe("dark");
    expect(screen.getByRole("button", { name: "Modo noche" }).getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Modo noche" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe("light");
  });

  it("is also in the profile menu, in sync with the header button", () => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    visit("/?city=Valencia");
    fireEvent.click(screen.getByRole("button", { name: "Tu perfil" }));
    const toggles = screen.getAllByRole("button", { name: "Modo noche" });
    expect(toggles).toHaveLength(2);
    fireEvent.click(toggles[1]);
    for (const toggle of screen.getAllByRole("button", { name: "Modo noche" })) expect(toggle.getAttribute("aria-pressed")).toBe("true");
  });
});
