import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { STORAGE_REGISTRY } from "../src/data/storage-keys";
import { CookiePolicyPage, LegalNoticePage, PrivacyPolicyPage, TermsPage } from "../src/legal/LegalPages";
import { legalData } from "../src/legal/legal-data";

const pages = { LegalNoticePage, PrivacyPolicyPage, CookiePolicyPage, TermsPage };

describe("legal pages", () => {
  it.each(Object.entries(pages))("%s shows the red draft notice while esEjemplo is true", (_, Page) => {
    render(<MemoryRouter><Page language="es" /></MemoryRouter>);
    const notice = screen.queryByRole("note");
    if (legalData.esEjemplo) expect(notice).toHaveProperty("textContent", expect.stringContaining("datos de ejemplo"));
    else expect(notice).toBeNull();
  });

  it("legal notice shows every LSSI field from datos-legales.json", () => {
    render(<MemoryRouter><LegalNoticePage language="es" /></MemoryRouter>);
    const text = document.body.textContent ?? "";
    for (const value of [legalData.titular.nombre, legalData.titular.nif, legalData.titular.direccion, legalData.titular.email, legalData.titular.datosRegistrales]) {
      expect(text).toContain(value);
    }
  });

  it("privacy policy has the 5-point summary and the processing table", () => {
    render(<MemoryRouter><PrivacyPolicyPage language="es" /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Resumen en 5 puntos" })).toBeTruthy();
    const summary = screen.getByRole("heading", { name: "Resumen en 5 puntos" }).parentElement!;
    expect(summary.querySelectorAll("ol > li")).toHaveLength(5);
    const headers = [...document.querySelectorAll(".legal-table thead th")].map((th) => th.textContent);
    expect(headers).toEqual(["Datos", "Finalidad", "Base legal", "Plazo", "Encargados", "Transferencias fuera de la UE"]);
  });

  it("cookie policy lists every storage key in the registry", () => {
    render(<MemoryRouter><CookiePolicyPage language="es" /></MemoryRouter>);
    const keys = [...document.querySelectorAll(".legal-table tbody code")].map((code) => code.textContent);
    expect(keys).toEqual(STORAGE_REGISTRY.map((entry) => entry.key));
  });

  it("marks legal texts as Spanish and tells other languages so", () => {
    render(<MemoryRouter><TermsPage language="en" /></MemoryRouter>);
    expect(document.querySelector("article")?.getAttribute("lang")).toBe("es");
    expect(document.body.textContent).toContain("published in Spanish");
  });
});
