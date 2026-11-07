import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { clearStoredData, exportStoredData, STORAGE_KEYS, STORAGE_REGISTRY } from "../src/data/storage-keys";
import YourDataPage from "../src/legal/YourDataPage";

const fillEveryKey = () => {
  for (const { key } of STORAGE_REGISTRY) window.localStorage.setItem(key, JSON.stringify("value"));
};

describe("browser data registry", () => {
  it("exports every stored key and parses JSON values", () => {
    window.localStorage.setItem(STORAGE_KEYS.savedEvents, "[1,2]");
    window.localStorage.setItem(STORAGE_KEYS.language, "en");
    expect(exportStoredData()).toEqual({ [STORAGE_KEYS.savedEvents]: [1, 2], [STORAGE_KEYS.language]: "en" });
  });

  it("clears every key the privacy policy promises to delete", () => {
    fillEveryKey();
    expect(clearStoredData()).toBe(STORAGE_REGISTRY.length);
    for (const { key } of STORAGE_REGISTRY) expect(window.localStorage.getItem(key)).toBeNull();
  });

  it("leaves other sites' data alone", () => {
    window.localStorage.setItem("another-app", "keep");
    clearStoredData();
    expect(window.localStorage.getItem("another-app")).toBe("keep");
  });
});

describe("Your data page", () => {
  it("asks for confirmation before deleting, then deletes everything", () => {
    fillEveryKey();
    const onDeleted = vi.fn();
    render(<MemoryRouter><YourDataPage language="es" onDeleted={onDeleted} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Borrar mis datos" }));
    expect(window.localStorage.getItem(STORAGE_KEYS.savedEvents)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Sí, borrar mis datos" }));
    for (const { key } of STORAGE_REGISTRY) expect(window.localStorage.getItem(key)).toBeNull();
    expect(onDeleted).toHaveBeenCalledOnce();
  });

  it("cancel keeps the data", () => {
    fillEveryKey();
    render(<MemoryRouter><YourDataPage language="es" onDeleted={vi.fn()} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Borrar mis datos" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(window.localStorage.getItem(STORAGE_KEYS.savedEvents)).not.toBeNull();
  });

  it("disables deleting when nothing is stored", () => {
    render(<MemoryRouter><YourDataPage language="es" onDeleted={vi.fn()} /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Borrar mis datos" })).toHaveProperty("disabled", true);
    expect(screen.getByText("No hay nada guardado en este navegador.")).toBeTruthy();
  });

  it("confirms the deletion after the reload", () => {
    render(<MemoryRouter initialEntries={["/tus-datos?borrado=1"]}><YourDataPage language="es" onDeleted={vi.fn()} /></MemoryRouter>);
    expect(screen.getByRole("status").textContent).toContain("Hemos borrado tus datos");
  });
});
