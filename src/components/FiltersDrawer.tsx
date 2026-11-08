import { useRef, useState } from "react";
import type { Language } from "../data/language";
import { useFocusTrap } from "../lib/use-focus-trap";
import { TIME_SLOTS, type TimeSlot } from "../lib/time-slot";
import { cities, type City } from "../types/Event";
import MonthCalendar from "./MonthCalendar";

export type FilterDraft = { city: City; when: string | null; slots: TimeSlot[] };
export const WHEN_SHORTCUTS = ["today", "tomorrow", "week", "month"] as const;

export const filtersCopy: Record<Language, {
  title: string; close: string; city: string; when: string; orPickDay: string; anyDate: string; slots: string; anyTime: string; clear: string;
  results: (n: number) => string; noResults: string; whenNames: Record<(typeof WHEN_SHORTCUTS)[number], string>; slotNames: Record<TimeSlot, string>; slotChips: Record<TimeSlot, string>;
  slotHint: string; removeFilter: (label: string) => string; clearAll: string; activeFilters: string;
}> = {
  es: {
    title: "Filtros", close: "Cerrar filtros", city: "Ciudad", when: "Cuándo", orPickDay: "O elige un día", anyDate: "Cualquier fecha", slots: "Franja horaria", anyTime: "Cualquier hora",
    clear: "Limpiar", results: (n) => `Ver ${n} ${n === 1 ? "resultado" : "resultados"}`, noResults: "Sin resultados con estos filtros",
    whenNames: { today: "Hoy", tomorrow: "Mañana", week: "Esta semana", month: "Próximos 30 días" },
    slotNames: { morning: "Mañana (antes de 14:00)", afternoon: "Tarde (14:00–20:00)", night: "Noche (desde 20:00)" },
    slotChips: { morning: "Por la mañana", afternoon: "Por la tarde", night: "Por la noche" },
    slotHint: "Los eventos con hora por confirmar no aparecen al filtrar por franja.",
    removeFilter: (label) => `Quitar filtro: ${label}`, clearAll: "Quitar todos", activeFilters: "Filtros activos",
  },
  en: {
    title: "Filters", close: "Close filters", city: "City", when: "When", orPickDay: "Or pick a day", anyDate: "Any date", slots: "Time of day", anyTime: "Any time",
    clear: "Clear", results: (n) => `Show ${n} ${n === 1 ? "result" : "results"}`, noResults: "No results with these filters",
    whenNames: { today: "Today", tomorrow: "Tomorrow", week: "This week", month: "Next 30 days" },
    slotNames: { morning: "Morning (before 2 pm)", afternoon: "Afternoon (2–8 pm)", night: "Evening (from 8 pm)" },
    slotChips: { morning: "In the morning", afternoon: "In the afternoon", night: "In the evening" },
    slotHint: "Events whose time is not confirmed yet are hidden when filtering by time of day.",
    removeFilter: (label) => `Remove filter: ${label}`, clearAll: "Remove all", activeFilters: "Active filters",
  },
  fr: {
    title: "Filtres", close: "Fermer les filtres", city: "Ville", when: "Quand", orPickDay: "Ou choisissez un jour", anyDate: "N’importe quand", slots: "Moment de la journée", anyTime: "N’importe quelle heure",
    clear: "Effacer", results: (n) => `Voir ${n} ${n === 1 ? "résultat" : "résultats"}`, noResults: "Aucun résultat avec ces filtres",
    whenNames: { today: "Aujourd’hui", tomorrow: "Demain", week: "Cette semaine", month: "30 prochains jours" },
    slotNames: { morning: "Matin (avant 14 h)", afternoon: "Après-midi (14 h–20 h)", night: "Soir (à partir de 20 h)" },
    slotChips: { morning: "Le matin", afternoon: "L’après-midi", night: "Le soir" },
    slotHint: "Les événements dont l’heure n’est pas confirmée sont masqués avec ce filtre.",
    removeFilter: (label) => `Retirer le filtre : ${label}`, clearAll: "Tout retirer", activeFilters: "Filtres actifs",
  },
};

export default function FiltersDrawer({ initial, language, onClose, onApply, countResults, countForDay }: {
  initial: FilterDraft; language: Language; onClose: () => void; onApply: (draft: FilterDraft) => void;
  countResults: (draft: FilterDraft) => number; countForDay: (city: City, key: string, slots: TimeSlot[]) => number;
}) {
  const text = filtersCopy[language];
  const [draft, setDraft] = useState<FilterDraft>(initial);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useFocusTrap(panel, true, onClose, closeButton);
  const results = countResults(draft);
  const isDay = draft.when !== null && !(WHEN_SHORTCUTS as readonly string[]).includes(draft.when);
  const toggleSlot = (slot: TimeSlot) => setDraft((current) => ({ ...current, slots: current.slots.includes(slot) ? current.slots.filter((item) => item !== slot) : [...current.slots, slot] }));

  return <div className="drawer-backdrop" onClick={onClose}>
    <div ref={panel} className="filters-drawer" role="dialog" aria-modal="true" aria-labelledby="filters-title" onClick={(event) => event.stopPropagation()}>
      <header className="drawer-head">
        <h2 id="filters-title">{text.title}</h2>
        <button ref={closeButton} type="button" className="drawer-close" aria-label={text.close} onClick={onClose}>×</button>
      </header>
      <div className="drawer-body">
        <section>
          <label className="drawer-label" htmlFor="filters-city">{text.city}</label>
          <select id="filters-city" className="drawer-select" value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value as City })}>
            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </section>
        <fieldset>
          <legend className="drawer-label">{text.when}</legend>
          <div className="drawer-chips">
            <button type="button" aria-pressed={draft.when === null} onClick={() => setDraft({ ...draft, when: null })}>{text.anyDate}</button>
            {WHEN_SHORTCUTS.map((option) => <button key={option} type="button" aria-pressed={draft.when === option} onClick={() => setDraft({ ...draft, when: draft.when === option ? null : option })}>{text.whenNames[option]}</button>)}
          </div>
          <p className="drawer-sublabel">{text.orPickDay}</p>
          <MonthCalendar language={language} selected={isDay ? draft.when : null} onSelect={(key) => setDraft({ ...draft, when: draft.when === key ? null : key })} countFor={(key) => countForDay(draft.city, key, draft.slots)} />
        </fieldset>
        <fieldset>
          <legend className="drawer-label">{text.slots}</legend>
          <div className="drawer-chips">
            <button type="button" aria-pressed={!draft.slots.length} onClick={() => setDraft({ ...draft, slots: [] })}>{text.anyTime}</button>
            {TIME_SLOTS.map((slot) => <button key={slot} type="button" aria-pressed={draft.slots.includes(slot)} onClick={() => toggleSlot(slot)}>{text.slotNames[slot]}</button>)}
          </div>
          <p className="drawer-hint">{text.slotHint}</p>
        </fieldset>
      </div>
      <footer className="drawer-foot">
        <button type="button" className="button button--secondary" onClick={() => setDraft({ ...draft, when: null, slots: [] })}>{text.clear}</button>
        <button type="button" className="button button--primary" disabled={results === 0} onClick={() => onApply(draft)}>{results ? text.results(results) : text.noResults}</button>
        <p className="sr-only" role="status" aria-live="polite">{results ? text.results(results) : text.noResults}</p>
      </footer>
    </div>
  </div>;
}
