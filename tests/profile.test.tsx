import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { DEFAULT_PROFILE, readProfile } from "../src/data/profile";
import { exportStoredData, STORAGE_KEYS } from "../src/data/storage-keys";

const visit = (path: string) => render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
const stored = () => JSON.parse(window.localStorage.getItem(STORAGE_KEYS.profile) ?? "null");

describe("Profile page", () => {
  it("stores nothing just by visiting it", () => {
    visit("/perfil");
    expect(screen.getByRole("heading", { level: 1, name: "Tu perfil" })).toBeTruthy();
    expect(Object.keys(window.localStorage)).toEqual([]);
  });

  it("is reachable from the header link", () => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    visit("/?city=Valencia");
    const headerLink = () => document.querySelector<HTMLAnchorElement>(".site-header a.guest-profile")!;
    expect(headerLink().textContent).toBe("Tu perfil");
    fireEvent.click(headerLink());
    expect(screen.getByRole("heading", { level: 1, name: "Tu perfil" })).toBeTruthy();
    expect(headerLink().getAttribute("aria-current")).toBe("page");
  });

  it("saves the avatar and favourite categories only when they change, and confirms it", () => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    visit("/perfil");
    fireEvent.click(screen.getByRole("radio", { name: "Máscaras de teatro" }));
    const categories = screen.getByRole("group", { name: "Categorías favoritas" });
    fireEvent.click(within(categories).getByRole("button", { name: "Teatro" }));
    expect(stored()).toEqual({ avatar: "mask", categories: ["Teatro"] });
    expect(within(categories).getByRole("button", { name: "Teatro" }).getAttribute("aria-pressed")).toBe("true");
    expect(document.querySelector(".profile-status")!.textContent).toBe("Cambios guardados en este navegador.");
    // The data tools export (and delete) the profile too.
    expect(exportStoredData()[STORAGE_KEYS.profile]).toEqual({ avatar: "mask", categories: ["Teatro"] });
  });

  it("remembers the default city and the language from the same page", () => {
    window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
    visit("/perfil");
    fireEvent.change(screen.getByRole("combobox", { name: "Ciudad por defecto" }), { target: { value: "Bilbao" } });
    expect(window.localStorage.getItem(STORAGE_KEYS.preferredCity)).toBe("Bilbao");
    expect(screen.getByRole("heading", { level: 1, name: "Tu perfil" })).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "Idioma" }), { target: { value: "en" } });
    expect(window.localStorage.getItem(STORAGE_KEYS.language)).toBe("en");
    expect(screen.getByRole("heading", { level: 1, name: "Your profile" })).toBeTruthy();
  });

  it("falls back to the defaults when the stored profile is broken or unknown", () => {
    window.localStorage.setItem(STORAGE_KEYS.profile, "{not json");
    expect(readProfile()).toEqual(DEFAULT_PROFILE);
    window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify({ avatar: "<img>", categories: ["Teatro", "Nope", "Teatro"] }));
    expect(readProfile()).toEqual({ avatar: "profile", categories: ["Teatro"] });
  });
});
