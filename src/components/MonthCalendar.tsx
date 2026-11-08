import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Language } from "../data/language";
import { dayKey } from "../data/event-catalog";

const locales: Record<Language, string> = { es: "es-ES", en: "en-GB", fr: "fr-FR" };
const copy: Record<Language, { previous: string; next: string; events: (n: number) => string; none: string; past: string }> = {
  es: { previous: "Mes anterior", next: "Mes siguiente", events: (n) => `${n} ${n === 1 ? "evento" : "eventos"}`, none: "sin eventos", past: "ya ha pasado" },
  en: { previous: "Previous month", next: "Next month", events: (n) => `${n} ${n === 1 ? "event" : "events"}`, none: "no events", past: "already passed" },
  fr: { previous: "Mois précédent", next: "Mois suivant", events: (n) => `${n} ${n === 1 ? "événement" : "événements"}`, none: "aucun événement", past: "déjà passé" },
};

const parse = (key: string) => { const [y, m, d] = key.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/**
 * Month grid that is always visible (WAI-ARIA grid pattern): one day is tabbable, arrow keys move
 * between days, Home/End go to the start/end of the week, PageUp/PageDown change month.
 * Each day announces how many events it has; past days are disabled.
 */
export default function MonthCalendar({ selected, onSelect, countFor, language, today = new Date() }: { selected: string | null; onSelect: (key: string) => void; countFor: (key: string) => number; language: Language; today?: Date }) {
  const text = copy[language];
  const todayKey = dayKey(today);
  const [focusKey, setFocusKey] = useState(selected ?? todayKey);
  const focusDate = parse(focusKey);
  const month = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const gridRef = useRef<HTMLTableElement>(null);
  const moved = useRef(false);

  const weeks = useMemo(() => {
    const offset = (month.getDay() + 6) % 7; // weeks start on Monday
    const start = addDays(month, -offset);
    return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)));
  }, [month.getFullYear(), month.getMonth()]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!moved.current) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focusKey}"]`)?.focus();
  }, [focusKey]);

  // Past days are disabled, so focus never moves before today.
  const move = (date: Date) => { moved.current = true; setFocusKey(dayKey(date) < todayKey ? todayKey : dayKey(date)); };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const steps: Record<string, () => Date> = {
      ArrowRight: () => addDays(focusDate, 1), ArrowLeft: () => addDays(focusDate, -1),
      ArrowDown: () => addDays(focusDate, 7), ArrowUp: () => addDays(focusDate, -7),
      Home: () => addDays(focusDate, -((focusDate.getDay() + 6) % 7)), End: () => addDays(focusDate, 6 - ((focusDate.getDay() + 6) % 7)),
      PageDown: () => new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, Math.min(focusDate.getDate(), 28)),
      PageUp: () => new Date(focusDate.getFullYear(), focusDate.getMonth() - 1, Math.min(focusDate.getDate(), 28)),
    };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    move(step());
  };

  const monthName = new Intl.DateTimeFormat(locales[language], { month: "long", year: "numeric" }).format(month);
  const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locales[language], { weekday: "short" }).format(addDays(new Date(2024, 0, 1), index)));
  const longDate = new Intl.DateTimeFormat(locales[language], { weekday: "long", day: "numeric", month: "long" });

  return <div className="month-calendar">
    <div className="month-calendar-head">
      <button type="button" aria-label={text.previous} onClick={() => move(new Date(month.getFullYear(), month.getMonth() - 1, 1))} disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)}>‹</button>
      <h4 id="calendar-month" aria-live="polite">{monthName}</h4>
      <button type="button" aria-label={text.next} onClick={() => move(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
    </div>
    <table ref={gridRef} role="grid" aria-labelledby="calendar-month">
      <thead><tr>{weekdays.map((day) => <th key={day} scope="col" abbr={day}>{day.slice(0, 2)}</th>)}</tr></thead>
      <tbody>{weeks.map((week) => <tr key={dayKey(week[0])}>{week.map((date) => {
        const key = dayKey(date);
        const inMonth = date.getMonth() === month.getMonth();
        const past = key < todayKey;
        const count = past ? 0 : countFor(key);
        const label = `${longDate.format(date)}, ${past ? text.past : count ? text.events(count) : text.none}`;
        return <td key={key} role="gridcell" aria-selected={selected === key}>
          <button type="button" data-day={key} tabIndex={key === focusKey ? 0 : -1} disabled={past} aria-label={label} aria-pressed={selected === key}
            className={[inMonth ? "" : "outside", count ? "has-events" : "", selected === key ? "selected" : "", key === todayKey ? "today" : ""].join(" ")}
            onClick={() => { setFocusKey(key); onSelect(key); }} onKeyDown={onKeyDown}>{date.getDate()}</button>
        </td>;
      })}</tr>)}</tbody>
    </table>
  </div>;
}
