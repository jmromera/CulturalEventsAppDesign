import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Language } from "../data/language";
import { dayKey } from "../data/event-catalog";
import { venueFor } from "../data/venue-catalog";
import type { EventItem } from "../types/Event";
import Icon from "./Icon";

export const MAX_TICKETS = 6;
const MAX_SESSIONS = 14;
const locales: Record<Language, string> = { es: "es-ES", en: "en-GB", fr: "fr-FR" };

export const bookingCopy: Record<Language, {
  title: string; demo: string; demoDetail: string; steps: [string, string, string, string]; stepsLabel: string; stepOf: (n: number, total: number) => string;
  sessionTitle: string; sessionHint: string; timeTbc: string; ticketsTitle: string; ticketType: string; fewer: string; more: string; ticketCount: (n: number) => string; maxHint: string;
  priceGuide: (total: string) => string; noPrice: string; reviewTitle: string; event: string; venue: string; session: string; tickets: string; noData: string;
  next: string; back: string; confirm: string; doneTitle: string; doneText: string; code: string; addToCalendar: string; realTickets: (provider: string) => string; backToEvent: string;
  unavailable: string; soldOut: string; cta: string;
}> = {
  es: {
    title: "Reserva de demostración", demo: "Reserva de demostración: no se realiza ningún pago.",
    demoDetail: "Es un ejemplo del proceso para la asignatura. No se reservan entradas reales ni se piden datos personales ni de tarjeta.",
    steps: ["Sesión", "Entradas", "Revisar", "Confirmación"], stepsLabel: "Pasos de la reserva", stepOf: (n, total) => `Paso ${n} de ${total}`,
    sessionTitle: "Elige la sesión", sessionHint: "Solo se muestran las fechas que aún no han pasado.", timeTbc: "hora por confirmar",
    ticketsTitle: "¿Cuántas entradas?", ticketType: "Entrada general", fewer: "Una entrada menos", more: "Una entrada más", ticketCount: (n) => `${n} ${n === 1 ? "entrada" : "entradas"}`, maxHint: `Máximo ${MAX_TICKETS} por reserva.`,
    priceGuide: (total) => `Importe orientativo: ${total}. No se cobra nada.`, noPrice: "El precio lo fija la web oficial de venta.",
    reviewTitle: "Revisa tu reserva", event: "Evento", venue: "Recinto", session: "Sesión", tickets: "Entradas", noData: "No te pedimos nombre, correo ni tarjeta: no hacen falta en una demostración.",
    next: "Continuar", back: "Atrás", confirm: "Confirmar reserva de demostración",
    doneTitle: "Reserva de demostración confirmada", doneText: "Así terminaría una reserva real. No se ha cobrado nada ni se ha guardado nada en tu navegador.",
    code: "Código de demostración", addToCalendar: "Añadir al calendario", realTickets: (provider) => `Comprar entradas reales en ${provider}`, backToEvent: "Volver al evento",
    unavailable: "Este evento ya no admite reservas.", soldOut: "Las entradas están agotadas.", cta: "Probar la reserva (demostración)",
  },
  en: {
    title: "Demo booking", demo: "Demo booking: no payment is taken.",
    demoDetail: "This is an example of the process for a university course. No real tickets are booked and no personal or card details are requested.",
    steps: ["Session", "Tickets", "Review", "Confirmation"], stepsLabel: "Booking steps", stepOf: (n, total) => `Step ${n} of ${total}`,
    sessionTitle: "Choose a session", sessionHint: "Only dates that have not passed are shown.", timeTbc: "time to be confirmed",
    ticketsTitle: "How many tickets?", ticketType: "General admission", fewer: "One ticket fewer", more: "One more ticket", ticketCount: (n) => `${n} ${n === 1 ? "ticket" : "tickets"}`, maxHint: `Up to ${MAX_TICKETS} per booking.`,
    priceGuide: (total) => `Approximate amount: ${total}. Nothing is charged.`, noPrice: "The price is set by the official ticket site.",
    reviewTitle: "Review your booking", event: "Event", venue: "Venue", session: "Session", tickets: "Tickets", noData: "We do not ask for your name, email or card: a demo does not need them.",
    next: "Continue", back: "Back", confirm: "Confirm demo booking",
    doneTitle: "Demo booking confirmed", doneText: "This is how a real booking would end. Nothing has been charged and nothing has been stored in your browser.",
    code: "Demo code", addToCalendar: "Add to calendar", realTickets: (provider) => `Buy real tickets at ${provider}`, backToEvent: "Back to the event",
    unavailable: "This event no longer accepts bookings.", soldOut: "Tickets are sold out.", cta: "Try booking (demo)",
  },
  fr: {
    title: "Réservation de démonstration", demo: "Réservation de démonstration : aucun paiement n’est effectué.",
    demoDetail: "C’est un exemple du processus pour un cours universitaire. Aucun billet réel n’est réservé et aucune donnée personnelle ou bancaire n’est demandée.",
    steps: ["Séance", "Billets", "Vérifier", "Confirmation"], stepsLabel: "Étapes de la réservation", stepOf: (n, total) => `Étape ${n} sur ${total}`,
    sessionTitle: "Choisissez la séance", sessionHint: "Seules les dates à venir sont affichées.", timeTbc: "heure à confirmer",
    ticketsTitle: "Combien de billets ?", ticketType: "Entrée générale", fewer: "Un billet de moins", more: "Un billet de plus", ticketCount: (n) => `${n} ${n === 1 ? "billet" : "billets"}`, maxHint: `${MAX_TICKETS} au maximum par réservation.`,
    priceGuide: (total) => `Montant indicatif : ${total}. Rien n’est débité.`, noPrice: "Le prix est fixé par le site officiel de vente.",
    reviewTitle: "Vérifiez votre réservation", event: "Événement", venue: "Lieu", session: "Séance", tickets: "Billets", noData: "Nous ne demandons ni nom, ni e-mail, ni carte : une démonstration n’en a pas besoin.",
    next: "Continuer", back: "Retour", confirm: "Confirmer la réservation de démonstration",
    doneTitle: "Réservation de démonstration confirmée", doneText: "Voici comment se terminerait une vraie réservation. Rien n’a été débité ni enregistré dans votre navigateur.",
    code: "Code de démonstration", addToCalendar: "Ajouter au calendrier", realTickets: (provider) => `Acheter de vrais billets sur ${provider}`, backToEvent: "Retour à l’événement",
    unavailable: "Cet événement n’accepte plus de réservations.", soldOut: "Les billets sont épuisés.", cta: "Essayer la réservation (démo)",
  },
};

/** Days that can still be booked: each day of the run from today on (at most 14), or the single date. */
export function bookableSessions(event: EventItem, today = new Date()): string[] {
  if (!event.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(event.startDate)) return [];
  const todayKey = dayKey(today);
  const last = event.endDate && /^\d{4}-\d{2}-\d{2}$/.test(event.endDate) ? event.endDate : event.startDate;
  const days: string[] = [];
  const [y, m, d] = event.startDate.split("-").map(Number);
  for (let date = new Date(y, m - 1, d); dayKey(date) <= last && days.length < MAX_SESSIONS; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
    if (dayKey(date) >= todayKey) days.push(dayKey(date));
  }
  return days;
}

/** Demo code built from the choices only: no randomness and nothing stored. */
export const demoCode = (event: EventItem, session: string, tickets: number) => `DEMO-${event.id}-${session.replace(/-/g, "")}-${tickets}`;

export const canBook = (event: EventItem, today = new Date()) => !/agotad/i.test(event.availability) && bookableSessions(event, today).length > 0;

export default function BookingPage({ event, language, onAddToCalendar, today = new Date() }: { event: EventItem; language: Language; onAddToCalendar: (event: EventItem) => void; today?: Date }) {
  const text = bookingCopy[language];
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const venue = venueFor(event.venueId);
  const sessions = bookableSessions(event, today);
  const soldOut = /agotad/i.test(event.availability);

  // Step and choices live in the URL, so the browser Back button moves between steps and nothing is stored.
  const session = sessions.includes(params.get("sesion") ?? "") ? params.get("sesion")! : sessions.length === 1 ? sessions[0] : null;
  const ticketsParam = Number(params.get("entradas"));
  const tickets = Number.isInteger(ticketsParam) && ticketsParam >= 1 && ticketsParam <= MAX_TICKETS ? ticketsParam : 1;
  const requested = Math.min(Math.max(Number(params.get("paso")) || 1, 1), 4);
  const step = session ? requested : 1; // without a valid session, start again from the first step

  const go = (changes: Record<string, string | number>, replace = false) => {
    const next = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(changes)) next.set(key, String(value));
    navigate({ pathname: location.pathname, search: `?${next.toString()}` }, { replace });
  };

  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    // Moving between steps: focus goes to the new step's heading (WCAG 2.4.3) and screen readers announce it.
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus();
  }, [step]);

  const longDate = new Intl.DateTimeFormat(locales[language], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const sessionLabel = (key: string) => `${longDate.format(new Date(`${key}T12:00:00`))} · ${/^\d{1,2}:\d{2}$/.test(event.time) ? event.time : text.timeTbc}`;
  const priceMatch = event.price.match(/(\d+(?:[.,]\d{1,2})?)\s*€/);
  const total = priceMatch ? new Intl.NumberFormat(locales[language], { style: "currency", currency: "EUR" }).format(Number(priceMatch[1].replace(",", ".")) * tickets) : null;
  const eventPath = `/event/${event.id}?city=${encodeURIComponent(venue.city)}`;

  const banner = <div className="booking-demo" role="note"><Icon name="ticket" /><p><strong>{text.demo}</strong> {text.demoDetail}</p></div>;

  if (soldOut || !sessions.length) {
    return <main id="main-content" tabIndex={-1} className="subpage booking-page">
      <h1>{text.title}</h1>{banner}
      <p className="booking-unavailable">{soldOut ? text.soldOut : text.unavailable}</p>
      <Link className="button button--secondary" to={eventPath}>{text.backToEvent}</Link>
    </main>;
  }

  return <main id="main-content" tabIndex={-1} className="subpage booking-page">
    <Link className="booking-back-link" to={eventPath}><Icon name="arrow" />{event.title}</Link>
    <h1>{text.title}</h1>
    {banner}
    <ol className="booking-steps" aria-label={text.stepsLabel}>{text.steps.map((label, index) => <li key={label} aria-current={step === index + 1 ? "step" : undefined} className={step > index + 1 ? "done" : step === index + 1 ? "current" : ""}><span aria-hidden="true">{step > index + 1 ? "✓" : index + 1}</span>{label}</li>)}</ol>

    <section className="booking-panel" aria-labelledby="booking-step-title">
      <p className="booking-step-count">{text.stepOf(step, 4)}</p>
      {step === 1 && <>
        <h2 id="booking-step-title" ref={heading} tabIndex={-1}>{text.sessionTitle}</h2>
        <fieldset className="booking-sessions"><legend className="sr-only">{text.sessionTitle}</legend>
          <p className="booking-hint">{text.sessionHint}</p>
          {sessions.map((key) => <label key={key} className="booking-option"><input type="radio" name="sesion" value={key} checked={session === key} onChange={() => go({ sesion: key }, true)} /><span>{sessionLabel(key)}</span></label>)}
        </fieldset>
        <div className="booking-actions"><button type="button" className="button button--primary" disabled={!session} onClick={() => go({ paso: 2, entradas: tickets })}>{text.next}</button></div>
      </>}
      {step === 2 && <>
        <h2 id="booking-step-title" ref={heading} tabIndex={-1}>{text.ticketsTitle}</h2>
        <div className="booking-tickets">
          <span id="ticket-type">{text.ticketType}</span>
          <div className="booking-stepper" role="group" aria-labelledby="ticket-type">
            <button type="button" aria-label={text.fewer} disabled={tickets <= 1} onClick={() => go({ entradas: tickets - 1 }, true)}>−</button>
            <output aria-live="polite">{text.ticketCount(tickets)}</output>
            <button type="button" aria-label={text.more} disabled={tickets >= MAX_TICKETS} onClick={() => go({ entradas: tickets + 1 }, true)}>+</button>
          </div>
        </div>
        <p className="booking-hint">{text.maxHint} {total ? text.priceGuide(total) : text.noPrice}</p>
        <div className="booking-actions"><button type="button" className="button button--secondary" onClick={() => navigate(-1)}>{text.back}</button><button type="button" className="button button--primary" onClick={() => go({ paso: 3 })}>{text.next}</button></div>
      </>}
      {step === 3 && <>
        <h2 id="booking-step-title" ref={heading} tabIndex={-1}>{text.reviewTitle}</h2>
        <dl className="booking-summary">
          <div><dt>{text.event}</dt><dd>{event.title}</dd></div>
          <div><dt>{text.venue}</dt><dd>{venue.name}, {venue.city}</dd></div>
          <div><dt>{text.session}</dt><dd>{sessionLabel(session!)}</dd></div>
          <div><dt>{text.tickets}</dt><dd>{text.ticketCount(tickets)}{total ? ` · ${text.priceGuide(total)}` : ""}</dd></div>
        </dl>
        <p className="booking-hint">{text.noData}</p>
        <div className="booking-actions"><button type="button" className="button button--secondary" onClick={() => navigate(-1)}>{text.back}</button><button type="button" className="button button--primary" onClick={() => go({ paso: 4 }, true)}>{text.confirm}</button></div>
      </>}
      {step === 4 && <>
        <h2 id="booking-step-title" ref={heading} tabIndex={-1}><Icon name="check" />{text.doneTitle}</h2>
        <p>{text.doneText}</p>
        <p className="booking-code">{text.code}: <strong>{demoCode(event, session!, tickets)}</strong></p>
        <dl className="booking-summary">
          <div><dt>{text.session}</dt><dd>{sessionLabel(session!)}</dd></div>
          <div><dt>{text.tickets}</dt><dd>{text.ticketCount(tickets)}</dd></div>
        </dl>
        <div className="booking-actions">
          <button type="button" className="button button--secondary" onClick={() => onAddToCalendar({ ...event, startDate: session!, endDate: undefined })}><Icon name="calendar" />{text.addToCalendar}</button>
          <a className="button button--primary" href={event.ticketUrl} target="_blank" rel="noreferrer"><Icon name="ticket" />{text.realTickets(event.organizer)}</a>
          <Link className="button button--ghost" to={eventPath}>{text.backToEvent}</Link>
        </div>
      </>}
    </section>
  </main>;
}
