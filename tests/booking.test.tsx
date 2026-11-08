import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { bookableSessions, demoCode, MAX_TICKETS } from "../src/components/BookingPage";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { events } from "../src/data/event-catalog";
import { STORAGE_KEYS } from "../src/data/storage-keys";

// Tests run on 20/12/2026 (tests/setup.ts). 3: Fedora, 7–10 Jan 2027 (four sessions). 12: «Desde 13 €». 243: Editors, sold out.
const event = (id: number) => events.find((item) => item.id === id)!;
function visit(path: string) {
  window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
  window.localStorage.setItem(STORAGE_KEYS.preferredCity, "Madrid");
  return render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}
const panel = () => screen.getByRole("region", { name: /./ });
const stored = () => JSON.stringify({ ...window.localStorage });

describe("bookable sessions", () => {
  it("lists each day of a run from today on, and none once it has passed", () => {
    expect(bookableSessions(event(3), new Date(2026, 11, 20))).toEqual(["2027-01-07", "2027-01-08", "2027-01-09", "2027-01-10"]);
    expect(bookableSessions(event(3), new Date(2027, 0, 9))).toEqual(["2027-01-09", "2027-01-10"]);
    expect(bookableSessions(event(3), new Date(2027, 0, 11))).toEqual([]);
  });
});

describe("Demo booking", () => {
  it("is offered from the event page and says no payment is taken", () => {
    visit("/event/3?city=Madrid");
    fireEvent.click(screen.getByRole("link", { name: "Probar la reserva (demostración)" }));
    expect(screen.getByRole("heading", { level: 1, name: "Reserva de demostración" })).toBeTruthy();
    expect(screen.getByRole("note").textContent).toContain("no se realiza ningún pago");
  });

  it("goes through session, tickets, review and confirmation without storing anything or asking for personal data", () => {
    visit("/event/3/reservar?city=Madrid");
    const before = stored();
    expect(screen.getByRole("list", { name: "Pasos de la reserva" }).querySelector('[aria-current="step"]')?.textContent).toContain("Sesión");
    const next = () => within(panel()).getByRole("button", { name: "Continuar" }) as HTMLButtonElement;
    expect(next().disabled).toBe(true);
    fireEvent.click(screen.getByRole("radio", { name: /8 de enero de 2027/ }));
    fireEvent.click(next());

    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 2, name: "¿Cuántas entradas?" }));
    const more = screen.getByRole("button", { name: "Una entrada más" });
    fireEvent.click(more);
    fireEvent.click(screen.getByRole("button", { name: "Una entrada más" }));
    expect(screen.getByText("3 entradas")).toBeTruthy();
    fireEvent.click(next());

    expect(screen.getByRole("heading", { level: 2, name: "Revisa tu reserva" })).toBeTruthy();
    expect(panel().textContent).toContain("Fedora");
    expect(panel().textContent).toContain("8 de enero de 2027");
    fireEvent.click(screen.getByRole("button", { name: "Confirmar reserva de demostración" }));

    expect(screen.getByRole("heading", { level: 2, name: "Reserva de demostración confirmada" })).toBeTruthy();
    expect(panel().textContent).toContain(demoCode(event(3), "2027-01-08", 3));
    expect(document.querySelectorAll("main input:not([type=radio])")).toHaveLength(0);
    expect(stored()).toBe(before);
  });

  it("limits the tickets and shows the price as a guide only when there is one", () => {
    visit(`/event/12/reservar?paso=2&entradas=${MAX_TICKETS}&sesion=${event(12).startDate}`);
    expect((screen.getByRole("button", { name: "Una entrada más" }) as HTMLButtonElement).disabled).toBe(true);
    expect(panel().textContent).toMatch(/Importe orientativo: 78,00\s€\. No se cobra nada\./);
  });

  it("starts again at the first step when the link has no valid session", () => {
    visit("/event/3/reservar?paso=3&sesion=1999-01-01");
    expect(screen.getByRole("heading", { level: 2, name: "Elige la sesión" })).toBeTruthy();
  });

  it("is not offered for sold-out events", () => {
    visit("/event/243");
    expect(screen.queryByRole("link", { name: "Probar la reserva (demostración)" })).toBeNull();
    visit("/event/243/reservar");
    expect(screen.getAllByText("Las entradas están agotadas.").length).toBeGreaterThan(0);
  });
});
