import { useEffect, useId, useRef, useState } from "react";
import type { Language } from "../data/language";
import { RADIUS_OPTIONS, useNearMe, type Radius } from "../context/NearMeContext";
import Icon from "./Icon";

export const nearMeCopy: Record<Language, {
  button: string; buttonActive: string; title: string; explain: string; allow: string; cancel: string; locating: string;
  ready: string; radius: string; anyDistance: string; stop: string; denied: string; unavailable: string; retry: string; withinKm: string;
}> = {
  es: {
    button: "Cerca de mí", buttonActive: "Cerca de mí · activo", title: "Ordenar por distancia",
    explain: "Usaremos tu ubicación solo para ordenar los eventos por distancia y mostrar lo cerca que están. Se calcula en tu dispositivo: no se envía a ningún sitio ni se guarda, y se olvida al cerrar la página.",
    allow: "Usar mi ubicación", cancel: "Ahora no", locating: "Buscando tu ubicación…",
    ready: "Eventos ordenados por distancia desde tu ubicación.", radius: "Distancia máxima", anyDistance: "Sin límite",
    stop: "Dejar de usar mi ubicación",
    denied: "No tenemos permiso para usar tu ubicación. Puedes seguir eligiendo ciudad o buscar un recinto o barrio en el buscador.",
    unavailable: "No hemos podido obtener tu ubicación. Puedes seguir eligiendo ciudad o buscar un recinto o barrio en el buscador.",
    retry: "Intentarlo de nuevo", withinKm: "a menos de {km} km",
  },
  en: {
    button: "Near me", buttonActive: "Near me · on", title: "Sort by distance",
    explain: "We will use your location only to sort events by distance and show how far they are. It is worked out on your device: it is never sent anywhere or stored, and it is forgotten when you close the page.",
    allow: "Use my location", cancel: "Not now", locating: "Finding your location…",
    ready: "Events sorted by distance from your location.", radius: "Maximum distance", anyDistance: "Any distance",
    stop: "Stop using my location",
    denied: "We don't have permission to use your location. You can still pick a city or search for a venue or area.",
    unavailable: "We couldn't get your location. You can still pick a city or search for a venue or area.",
    retry: "Try again", withinKm: "within {km} km",
  },
  fr: {
    button: "Près de moi", buttonActive: "Près de moi · activé", title: "Trier par distance",
    explain: "Nous utiliserons votre position uniquement pour trier les événements par distance et indiquer leur éloignement. Elle est calculée sur votre appareil : elle n’est envoyée nulle part, n’est pas enregistrée et est oubliée à la fermeture de la page.",
    allow: "Utiliser ma position", cancel: "Plus tard", locating: "Recherche de votre position…",
    ready: "Événements triés par distance depuis votre position.", radius: "Distance maximale", anyDistance: "Sans limite",
    stop: "Ne plus utiliser ma position",
    denied: "Nous n’avons pas l’autorisation d’utiliser votre position. Vous pouvez choisir une ville ou chercher un lieu ou un quartier.",
    unavailable: "Nous n’avons pas pu obtenir votre position. Vous pouvez choisir une ville ou chercher un lieu ou un quartier.",
    retry: "Réessayer", withinKm: "à moins de {km} km",
  },
};

/**
 * "Near me" control for the catalogue toolbar. The location is requested only after the
 * person reads why and presses "Use my location"; without it the list keeps working by city.
 */
export default function NearMePanel({ language }: { language: Language }) {
  const text = nearMeCopy[language];
  const { status, radiusKm, setRadiusKm, request, stop } = useNearMe();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const active = status === "ready";

  useEffect(() => { if (open) firstActionRef.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  const radiusLabel = (radius: Radius) => (radius === null ? text.anyDistance : `${radius} km`);

  return <div className="near-me">
    <button ref={triggerRef} type="button" className={`filter-control near-me-trigger ${active ? "active" : ""}`} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
      <Icon name="location" />{active ? text.buttonActive : text.button}
    </button>
    {open && <section id={panelId} className="near-me-panel" aria-label={text.title}>
      <h3>{text.title}</h3>
      {status === "off" && <>
        <p>{text.explain}</p>
        <div className="near-me-actions">
          <button ref={firstActionRef} type="button" className="button button--primary" onClick={request}>{text.allow}</button>
          <button type="button" className="button button--secondary" onClick={close}>{text.cancel}</button>
        </div>
      </>}
      {status === "locating" && <p role="status">{text.locating}</p>}
      {status === "ready" && <>
        <p role="status">{text.ready}</p>
        <fieldset className="near-me-radius">
          <legend>{text.radius}</legend>
          <div>{RADIUS_OPTIONS.map((radius) => <button key={String(radius)} ref={radius === null ? firstActionRef : undefined} type="button" aria-pressed={radiusKm === radius} className={radiusKm === radius ? "active" : ""} onClick={() => setRadiusKm(radius)}>{radiusLabel(radius)}</button>)}</div>
        </fieldset>
        <button type="button" className="near-me-stop" onClick={() => { stop(); close(); }}>{text.stop}</button>
      </>}
      {(status === "denied" || status === "unavailable") && <>
        <p role="alert">{status === "denied" ? text.denied : text.unavailable}</p>
        <div className="near-me-actions">
          <button ref={firstActionRef} type="button" className="button button--secondary" onClick={request}>{text.retry}</button>
          <button type="button" className="button button--secondary" onClick={() => { stop(); close(); }}>{text.cancel}</button>
        </div>
      </>}
    </section>}
  </div>;
}
