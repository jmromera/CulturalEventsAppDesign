import { useEffect, useRef, useState } from "react";
import { cities, type City } from "../types/Event";
import { usePreferredCity } from "../context/PreferredCityContext";

export default function CityOnboardingDialog() {
  const { selectedCity, detectedCity, status, onboardingOpen, selectCity, dismissOnboarding } = usePreferredCity();
  const [manualSelection, setManualSelection] = useState(false);
  const [manualCity, setManualCity] = useState<City>(detectedCity ?? selectedCity);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!onboardingOpen) return;
    setManualSelection(status !== "location-detected");
    setManualCity(detectedCity ?? selectedCity);
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelector<HTMLElement>("button, select");
    focusable?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissOnboarding();
      if (event.key !== "Tab" || !dialog) return;
      const controls = [...dialog.querySelectorAll<HTMLElement>("button, select")];
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onboardingOpen, status, detectedCity, selectedCity, dismissOnboarding]);

  if (!onboardingOpen) return null;
  const locationDetected = status === "location-detected" && detectedCity;
  const message = status === "geolocation-denied"
    ? "No pudimos acceder a tu ubicación. Puedes elegir una ciudad manualmente."
    : status === "city-not-found"
      ? "No encontramos una ciudad cercana con eventos. Elige una para continuar."
      : `Hemos detectado que podrías estar cerca de ${detectedCity}.`;

  return <div className="city-onboarding-backdrop">
    <section className="city-onboarding-dialog" role="dialog" aria-modal="true" aria-labelledby="city-onboarding-title" aria-describedby="city-onboarding-description" ref={dialogRef}>
      <span className="kicker">Plan Cerca</span>
      <h2 id="city-onboarding-title">¿Qué ciudad quieres explorar?</h2>
      <p id="city-onboarding-description">{message}</p>
      {locationDetected && !manualSelection ? <div className="city-onboarding-actions">
        <button type="button" className="button button--primary" onClick={() => selectCity(detectedCity)}>{`Ver eventos de ${detectedCity}`}</button>
        {detectedCity !== "Madrid" && <button type="button" className="button button--secondary" onClick={() => selectCity("Madrid")}>Madrid</button>}
        <button type="button" className="city-onboarding-link" onClick={() => setManualSelection(true)}>Elegir otra ciudad</button>
      </div> : <div className="city-onboarding-manual">
        <label htmlFor="onboarding-city">Ciudad</label>
        <select id="onboarding-city" value={manualCity} onChange={(event) => setManualCity(event.target.value as City)}>
          {cities.map((city) => <option value={city} key={city}>{city}</option>)}
        </select>
        <button type="button" className="button button--primary" onClick={() => selectCity(manualCity)}>Ver eventos de {manualCity}</button>
      </div>}
      <button type="button" className="city-onboarding-dismiss" onClick={dismissOnboarding}>Ahora no</button>
    </section>
  </div>;
}
