import { useEffect, useRef, useState } from "react";
import { onboardingCopy } from "../data/translations";
import { cities, type City } from "../types/Event";
import { usePreferredCity } from "../context/PreferredCityContext";

type Language = keyof typeof onboardingCopy;

export default function CityOnboardingDialog({ language }: { language: Language }) {
  const { selectedCity, detectedCity, status, onboardingOpen, selectCity, requestLocation, dismissOnboarding } = usePreferredCity();
  const [manualSelection, setManualSelection] = useState(false);
  const [manualCity, setManualCity] = useState<City>(detectedCity ?? selectedCity);
  const dialogRef = useRef<HTMLElement>(null);
  const labels = onboardingCopy[language];

  // Mientras el diálogo está abierto, el fondo no debe desplazarse.
  useEffect(() => {
    if (!onboardingOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [onboardingOpen]);

  useEffect(() => {
    if (!onboardingOpen) return;
    setManualSelection(status !== "location-detected");
    setManualCity(detectedCity ?? selectedCity);
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelector<HTMLElement>("button:not(:disabled), select");
    focusable?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissOnboarding();
      if (event.key !== "Tab" || !dialog) return;
      const controls = [...dialog.querySelectorAll<HTMLElement>("button:not(:disabled), select")];
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
  const message = status === "location-failed"
    ? labels.failed
    : status === "city-not-found"
      ? labels.notFound
      : locationDetected
        ? labels.detected.replace("{city}", detectedCity)
        : labels.idle;

  return <div className="city-onboarding-backdrop">
    <section className="city-onboarding-dialog" role="dialog" aria-modal="true" aria-labelledby="city-onboarding-title" aria-describedby="city-onboarding-description" ref={dialogRef}>
      <span className="kicker">Plan Cerca</span>
      <h2 id="city-onboarding-title">{labels.title}</h2>
      <p id="city-onboarding-description" role="status">{message}</p>
      {locationDetected && !manualSelection ? <div className="city-onboarding-actions">
        <button type="button" className="button button--primary" onClick={() => selectCity(detectedCity)}>{labels.viewEvents.replace("{city}", detectedCity)}</button>
        {detectedCity !== "Madrid" && <button type="button" className="button button--secondary" onClick={() => selectCity("Madrid")}>Madrid</button>}
        <button type="button" className="city-onboarding-link" onClick={() => setManualSelection(true)}>{labels.otherCity}</button>
      </div> : <div className="city-onboarding-manual">
        <label htmlFor="onboarding-city">{labels.cityLabel}</label>
        <select id="onboarding-city" value={manualCity} onChange={(event) => setManualCity(event.target.value as City)}>
          {cities.map((city) => <option value={city} key={city}>{city}</option>)}
        </select>
        <button type="button" className="button button--primary" onClick={() => selectCity(manualCity)}>{labels.viewEvents.replace("{city}", manualCity)}</button>
        <button type="button" className="button button--secondary" onClick={requestLocation} disabled={status === "loading"}>{status === "loading" ? labels.locating : labels.useLocation}</button>
      </div>}
      <button type="button" className="city-onboarding-dismiss" onClick={dismissOnboarding}>{labels.notNow}</button>
    </section>
  </div>;
}
