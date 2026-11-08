import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";
import { buildCalendar } from "../src/lib/ics";
import { parseSharedList, SHARED_LIST_MAX } from "../src/lib/shared-list";

// 89, 99 and 104 are in January 2027; 16 took place in October 2026.
function visit(path: string, saved?: number[]) {
  window.localStorage.setItem(STORAGE_KEYS.onboardingDismissed, "true");
  window.localStorage.setItem(STORAGE_KEYS.preferredCity, "Valencia");
  if (saved) window.localStorage.setItem(STORAGE_KEYS.savedEvents, JSON.stringify(saved));
  return render(<MemoryRouter initialEntries={[path]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
}
const storedSaved = () => JSON.parse(window.localStorage.getItem(STORAGE_KEYS.savedEvents) ?? "[]") as number[];

afterEach(() => vi.restoreAllMocks());

describe("Favourites page", () => {
  it("groups upcoming and past events under their own headings, with one h1", () => {
    visit("/favorites", [89, 16, 99]);
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    const upcoming = screen.getByRole("region", { name: "Próximos" });
    expect(within(upcoming).getAllByRole("article")).toHaveLength(2);
    const past = screen.getByRole("region", { name: "Pasados" });
    expect(within(past).getByRole("link", { name: /Karmento/ })).toBeTruthy();
  });

  it("removes with an undo that restores the event and keeps focus on the page", () => {
    visit("/favorites", [89, 99]);
    const card = screen.getAllByRole("article")[0];
    const title = within(card).getByRole("link", { name: /Muse|TINI/ }).textContent!;
    fireEvent.click(within(card).getByRole("button", { name: `Guardado: ${title}` }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(document.querySelector(".saved-notice")!.textContent).toContain(`«${title}» quitado de favoritos`);
    const undo = screen.getByRole("button", { name: "Deshacer" });
    expect(document.activeElement).toBe(undo);
    fireEvent.click(undo);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(storedSaved().sort()).toEqual([89, 99]);
    expect(document.activeElement?.textContent).toBe(title);
  });

  it("removes a past event from its row", () => {
    visit("/favorites", [89, 16]);
    fireEvent.click(screen.getByRole("button", { name: /Quitar «Karmento.*» de favoritos/ }));
    expect(screen.queryByRole("region", { name: "Pasados" })).toBeNull();
    expect(storedSaved()).toEqual([89]);
  });

  it("downloads one calendar with every upcoming favourite, each linking to its own page", async () => {
    let blob: Blob | null = null;
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: vi.fn((value: Blob) => { blob = value; return "blob:test"; }) });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    visit("/favorites", [89, 99, 104, 16]);
    fireEvent.click(screen.getByRole("button", { name: "Añadir todos al calendario" }));
    const ics = await (blob as unknown as Blob).text();
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    const uids = [...ics.matchAll(/^UID:(.+)$/gm)].map((match) => match[1].trim());
    expect(new Set(uids).size).toBe(3);
    for (const id of [89, 99, 104]) expect(ics).toContain(`URL:${window.location.origin}/event/${id}`);
    expect(ics).not.toContain("/event/16");
    expect(document.querySelector(".saved-notice")!.textContent).toContain("3 eventos");
  });
});

describe("Shared favourites list", () => {
  it("reads only whole numbers, without repeats and with a limit", () => {
    expect(parseSharedList("12, 45,abc,12,-3,1e3,99")).toEqual([12, 45, 99]);
    expect(parseSharedList(Array.from({ length: 80 }, (_, index) => index + 1).join(","))).toHaveLength(SHARED_LIST_MAX);
    expect(parseSharedList(null)).toEqual([]);
  });

  it("shows the list without storing anything until the person saves it", () => {
    render(<MemoryRouter initialEntries={["/favorites?lista=89,99,999999"]}><PreferredCityProvider><App /></PreferredCityProvider></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: "Lista compartida" })).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(Object.keys(window.localStorage)).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "Guardar en mis favoritos (2)" }));
    expect(storedSaved().sort()).toEqual([89, 99]);
    expect(document.querySelector(".saved-notice")?.textContent).toContain("2 eventos guardados");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("iCalendar builder", () => {
  it("escapes text and writes one VEVENT per entry", () => {
    const ics = buildCalendar([
      { uid: "1@x", start: "20270101", end: "20270102", allDay: true, title: "A, B; C", description: "line\nnext", location: "Sala", url: "https://plancerca.com/event/1" },
      { uid: "2@x", start: "20270101T190000Z", end: "20270101T210000Z", allDay: false, title: "D", description: "", location: "", url: "https://plancerca.com/event/2" },
    ], new Date("2026-12-01T00:00:00Z"));
    expect(ics).toContain("SUMMARY:A\\, B\\; C");
    expect(ics).toContain("DESCRIPTION:line\\nnext\\n\\nhttps://plancerca.com/event/1");
    expect(ics).toContain("DTSTART;VALUE=DATE:20270101");
    expect(ics).toContain("DTSTART:20270101T190000Z");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  });
});
