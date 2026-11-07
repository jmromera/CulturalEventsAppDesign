import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";

const visit = (path: string) => render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);

describe("a visit without interaction", () => {
  // Shared links, the sitemap and the app's own links all carry ?city=.
  it.each(["/", "/?city=Valencia", "/event/89?city=Valencia", "/venues?city=Sevilla", "/privacidad"])("stores nothing and sets no cookies: %s", (path) => {
    visit(path);
    expect(Object.keys(window.localStorage)).toEqual([]);
    expect(document.cookie).toBe("");
  });

  it("uses the city from a shared link for the visit without remembering it", () => {
    visit("/?city=Sevilla");
    expect(document.querySelector(".hero-city-name")?.textContent).toBe("Sevilla");
    expect(window.localStorage.getItem(STORAGE_KEYS.preferredCity)).toBeNull();
  });
});

describe("an explicit choice", () => {
  it("remembers the city picked in the welcome dialog", () => {
    visit("/");
    fireEvent.change(screen.getByRole("combobox", { name: "Ciudad" }), { target: { value: "Bilbao" } });
    fireEvent.click(screen.getByRole("button", { name: "Ver eventos de Bilbao" }));
    expect(window.localStorage.getItem(STORAGE_KEYS.preferredCity)).toBe("Bilbao");
  });
});

describe("the welcome dialog", () => {
  it.each(["/privacidad", "/aviso-legal", "/cookies", "/terminos", "/accesibilidad", "/tus-datos?borrado=1"])("does not cover %s", (path) => {
    visit(path);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("still welcomes first-time visitors on the home page", () => {
    visit("/");
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});
