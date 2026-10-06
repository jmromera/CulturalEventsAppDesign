import { useEffect, useRef, useState } from "react";
import { cityEventCounts } from "../data/event-catalog";
import { copy, interfaceText } from "../data/translations";
import { usePreferredCity } from "../context/PreferredCityContext";
import { cities } from "../types/Event";

type Language = "es" | "en" | "fr";

export default function CitySelector({ language }: { language: Language }) {
  const { selectedCity, selectCity } = usePreferredCity();
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const labels = interfaceText[language];

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      summaryRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const chooseCity = (city: typeof selectedCity) => {
    const pathname = window.location.pathname;
    const destinationPath = pathname.startsWith("/artist/") || pathname.startsWith("/entity/") || pathname.startsWith("/event/") || pathname === "/favorites" ? "/" : undefined;
    selectCity(city, destinationPath);
    setIsOpen(false);
    summaryRef.current?.focus();
  };

  return <details ref={detailsRef} className="header-city-picker" open={isOpen} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
    <summary ref={summaryRef} className="header-city-trigger" aria-label={`${selectedCity}, ${cityEventCounts[selectedCity]} ${labels.availableEvents}`} aria-controls="header-city-options" aria-expanded={isOpen}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
      <span className="header-city-name">{selectedCity}</span>
      <span className="header-city-count">{cityEventCounts[selectedCity]}</span>
      <svg className="header-city-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m7 10 5 5 5-5" /></svg>
    </summary>
    <div id="header-city-options" className="header-city-menu" role="group" aria-label={copy[language].city}>
      {cities.map((city) => <button key={city} type="button" className="header-city-option" aria-current={city === selectedCity ? "true" : undefined} onClick={() => chooseCity(city)}>
        <span>{city}</span><small>{cityEventCounts[city]} {labels.eventCount}</small>
        {city === selectedCity && <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>}
      </button>)}
    </div>
  </details>;
}
