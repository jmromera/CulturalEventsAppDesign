import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import CityOnboardingDialog from "../src/components/CityOnboardingDialog";
import { PreferredCityProvider } from "../src/context/PreferredCityContext";
import { STORAGE_KEYS } from "../src/data/storage-keys";

// Valencia city centre, as the browser would report it.
const coords = { latitude: 39.4697, longitude: -0.3774, accuracy: 20 };

function renderDialog() {
  return render(<MemoryRouter><PreferredCityProvider><CityOnboardingDialog language="es" /></PreferredCityProvider></MemoryRouter>);
}

describe("geolocation", () => {
  it("does not ask for location until the person presses the button", () => {
    const getCurrentPosition = vi.fn();
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: { getCurrentPosition } });
    renderDialog();
    expect(getCurrentPosition).not.toHaveBeenCalled();
    expect(screen.getByText(/se calcula en tu dispositivo/)).toBeTruthy();
  });

  it("keeps the coordinates on the device: stores only the city name and sends nothing", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const xhrSpy = vi.spyOn(XMLHttpRequest.prototype, "open");
    const beaconSpy = vi.fn();
    Object.defineProperty(navigator, "sendBeacon", { configurable: true, value: beaconSpy });
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: (success: PositionCallback) => success({ coords, timestamp: Date.now() } as unknown as GeolocationPosition) },
    });
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Usar mi ubicación" }));
    await waitFor(() => expect(window.localStorage.getItem(STORAGE_KEYS.detectedCity)).toBe("Valencia"));

    const everything = Object.keys(window.localStorage).map((key) => window.localStorage.getItem(key)).join(" ");
    expect(everything).not.toMatch(/39[.,]4|0[.,]37|latitude|longitude/);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
    expect(beaconSpy).not.toHaveBeenCalled();
  });

  it("works without location: the city list is always available", () => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
    renderDialog();
    expect(screen.getByRole("combobox", { name: "Ciudad" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Ver eventos de/ })).toBeTruthy();
  });
});
