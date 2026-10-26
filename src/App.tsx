import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useNavigationType, useParams } from "react-router-dom";
import { entityFor, relatedEntities } from "./data/entities";
import { cityEventCounts, cityImages, endedEvents, events, relatedEventsByEntity } from "./data/event-catalog";
import { getArtistPreference, setArtistPreference, type ArtistPreferenceState } from "./data/artist-preferences";
import { entityKindCopy, copy, eventActionCopy, interfaceText, venueLinkCopy } from "./data/translations";
import { venueFor, venues } from "./data/venue-catalog";
import CityOnboardingDialog from "./components/CityOnboardingDialog";
import CitySelector from "./components/CitySelector";
import FallbackImage from "./components/FallbackImage";
import Icon, { type IconName } from "./components/Icon";
import StatusPage from "./components/StatusPage";
import { usePreferredCity } from "./context/PreferredCityContext";
import { cities, eventCategories, type City, type EventCategory, type EventItem, type RelatedEntity, type Venue } from "./types/Event";

type Page = "home" | "search" | "detail" | "favorites" | "venues" | "venue-detail" | "entity" | "not-found";
type Language = "es" | "en" | "fr";
function BrandMark({ className = "" }: { className?: string }) {
  return <span className={`brand-mark ${className}`} aria-hidden="true"><Icon name="location" /></span>;
}

function LanguageSelect({ value, onChange, light = false }: { value: Language; onChange: (language: Language) => void; light?: boolean }) {
  const labels = interfaceText[value];
  return <label className={`language-select ${light ? "light" : ""}`}><span className="sr-only">{labels.languageLabel}</span><select name="language" value={value} onChange={(e) => onChange(e.target.value as Language)} aria-label={labels.languageSelect}><option value="es">Español</option><option value="en">English</option><option value="fr">Français</option></select><span className="language-code" aria-hidden="true">{value.toUpperCase()}</span><Icon name="chevron" /></label>;
}

// "1 evento" / "2 eventos": el singular tiene su propia palabra en cada idioma.
const eventCountLabel = (count: number, labels: typeof interfaceText.es) => `${count} ${count === 1 ? labels.eventCountOne : labels.eventCount}`;

const venueAlt = (name: string, language: Language) => interfaceText[language].venueAlt.replace("{name}", name);

const cityPath = (path: string, city: City) => `${path}${path.includes("?") ? "&" : "?"}city=${encodeURIComponent(city)}`;

function Logo({ to, label }: { to: string; label: string }) {
  return <Link className="logo" to={to} aria-label={label}><BrandMark className="logo-mark" /><span>Plan</span>{" "}<span>Cerca</span></Link>;
}

function Button({ children, onClick, variant = "primary", disabled = false }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; disabled?: boolean }) {
  return <button className={`button button--${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Nav({ page, city, language, setLanguage, searchQuery, setSearchQuery, onSearch, t }: { page: Page; city: City; language: Language; setLanguage: (language: Language) => void; searchQuery: string; setSearchQuery: (query: string) => void; onSearch: (query: string) => void; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const activePage = page === "detail" || page === "search" ? "home" : page === "venue-detail" ? "venues" : page;
  const item = (target: Page, path: string, icon: IconName, label: string) => <Link className={`primary-nav-item ${activePage === target ? "active" : ""}`} to={cityPath(path, city)} aria-current={activePage === target ? "page" : undefined} key={target}><Icon name={icon} /><span>{label}</span></Link>;
  return <header className={`site-header ${page === "detail" ? "site-header--event-detail" : ""}`}><div className="site-header-inner">
    <Logo to={cityPath("/", city)} label={labels.logoHome} />
    <form className="global-search" role="search" onSubmit={(event) => { event.preventDefault(); onSearch(searchQuery); }}><Icon name="search" /><input name="q" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />{searchQuery && <button type="button" className="global-search-clear" aria-label={labels.clearSearch} title={labels.clearSearch} onClick={(event) => { const input = event.currentTarget.form?.querySelector("input"); onSearch(""); input?.focus(); }}><Icon name="close" /></button>}<button type="submit" aria-label={labels.searchResults}><Icon name="search" /></button></form>
    <nav className="primary-nav" aria-label={labels.events}>{item("home", "/", "calendar", labels.events)}{item("venues", "/venues", "location", labels.venues)}{item("favorites", "/favorites", "heart", labels.favourites)}</nav>
    <div className="header-actions"><CitySelector language={language} /><div className="header-language"><LanguageSelect value={language} onChange={setLanguage} /></div><div className="guest-profile"><span><Icon name="profile" /></span><strong>{labels.guest}</strong></div></div>
  </div></header>;
}

const categoryKeys: Record<string, string> = { Música: "music", Ópera: "opera", Danza: "dance", Deportes: "sports", Teatro: "theatre", Exposiciones: "exhibitions", Museos: "museums" };
const venueCategoryKey = (kind: string) => /museo/i.test(kind) ? "museums" : /estadio|pabell|arena/i.test(kind) ? "sports" : /teatro/i.test(kind) ? "theatre" : /ópera/i.test(kind) ? "opera" : /concierto|música|auditorio/i.test(kind) ? "music" : undefined;
const categoryIcons: Record<string, IconName> = { music: "music", opera: "mic", dance: "wind", sports: "trophy", theatre: "mask", exhibitions: "frame", museums: "museum" };
const eventFallbackIcon = (event: EventItem): IconName => categoryIcons[categoryKeys[event.category]] ?? "calendar";
// Etiquetas que no aportan: la categoría (ya va en el chip), la ciudad, el año y "Recomendado".
const visibleTags = (event: EventItem, city: string) => event.tags.filter((tag) => tag !== event.category && tag !== city && tag !== "Recomendado" && !/^\d{4}$/.test(tag));
// Verde solo cuando hay entradas: "Consultar…" es neutro y lo no confirmado, pendiente.
const availabilityTone = (event: EventItem) => !event.confirmed ? "pending" : /^consult/i.test(event.availability) ? "neutral" : "";

function SaveButton({ active, onClick, t, compact = false }: { active: boolean; onClick: () => void; t: typeof copy.es; compact?: boolean }) {
  const label = active ? t.savedLabel : t.save;
  return <button className={`save-button ${active ? "active" : ""} ${compact ? "compact" : ""}`} onClick={onClick} aria-label={label} aria-pressed={active} title={label}><Icon name="heart" filled={active} /><span>{label}</span></button>;
}

function EventCard({ event, saved, onSave, t, featured = false }: { event: EventItem; saved: boolean; onSave: () => void; t: typeof copy.es; featured?: boolean }) {
  const venue = venueFor(event.venueId);
  const eventPath = cityPath(`/event/${event.id}`, venue.city);
  return <article className={`event-card ${featured ? "featured" : ""}`} data-cat={categoryKeys[event.category]}>
    <Link className="event-image" to={eventPath} aria-hidden="true" tabIndex={-1}><FallbackImage src={event.image} alt="" icon={eventFallbackIcon(event)} category={categoryKeys[event.category]} width={640} height={360} /><span className="category">{t.categoryNames[event.category]}</span>{event.rating !== undefined && <span className="rating"><Icon name="star" filled />{event.rating.toFixed(1)}</span>}</Link>
    <div className="event-body"><div className="event-title-row"><Link className="event-title" to={eventPath}>{event.title}</Link><SaveButton active={saved} onClick={onSave} t={t} compact /></div>
      <p className="event-description">{event.description}</p>
      <div className="event-facts"><span><Icon name="calendar" />{event.date} · {event.time}</span><span><Icon name="location" />{venue.name}</span><span><Icon name="time" />{event.duration}</span></div>
      <div className="tag-row">{visibleTags(event, venue.city).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="event-footer"><div><small>{event.organizer}</small><strong className={/\d/.test(event.price) ? "" : "price--none"}>{event.price}</strong></div><Link className="button button--secondary" to={eventPath}>{t.details}<Icon name="chevron" /></Link></div>
      <div className={`availability ${availabilityTone(event)}`}><i />{event.availability}{event.popularity ? ` · ${t.popularityValue.replace("{value}", event.popularity)}` : ""}</div>
    </div>
  </article>;
}

function RelatedEventCard({ event }: { event: EventItem }) {
  const venue = venueFor(event.venueId);
  const eventPath = `/event/${event.id}?city=${encodeURIComponent(venue.city)}`;
  return <Link className="artist-event-card" to={eventPath}>
    <FallbackImage className="artist-event-image" src={event.image} alt="" icon={eventFallbackIcon(event)} category={categoryKeys[event.category]} width={320} height={200} />
    <div className="artist-event-body">
      <h3 className="artist-event-title">{event.title}</h3>
      <p><Icon name="calendar" />{event.date}</p>
      <p><Icon name="location" />{venue.city} · {venue.name}</p>
    </div>
  </Link>;
}

function RelatedEventsSection({ entity, relatedEvents, title, t, showCount = true, showProfileLink = true }: { entity: RelatedEntity; relatedEvents: EventItem[]; title: string; t: typeof copy.es; showCount?: boolean; showProfileLink?: boolean }) {
  if (!relatedEvents.length) return null;
  const countTemplate = relatedEvents.length === 1 ? t.oneRelatedEvent : t.manyRelatedEvents;
  const countLabel = countTemplate.replace("{count}", String(relatedEvents.length));
  return <section className="artist-events-section">
    <div className="artist-events-heading"><div><span className="kicker">{title}</span>{showCount && <h2>{countLabel}</h2>}</div>{showProfileLink && <Link to={`/entity/${entity.id}`} className="artist-profile-link">{t.viewEntity}<Icon name="chevron" /></Link>}</div>
    <div className="artist-events-grid">{relatedEvents.map((relatedEvent) => <RelatedEventCard key={relatedEvent.id} event={relatedEvent} />)}</div>
  </section>;
}

function ArtistActions({ entity, language }: { entity: RelatedEntity; language: Language }) {
  const [preference, setPreference] = useState(() => getArtistPreference(entity.id));
  const t = copy[language];
  if (entity.kind !== "artist") return null;
  const updatePreference = (key: keyof ArtistPreferenceState) => {
    const nextValue = !preference[key];
    const savedPreference = setArtistPreference(entity.id, key, nextValue);
    setPreference(savedPreference);
  };
  const iconForLink = (url: string): IconName => {
    if (/spotify/i.test(url)) return "spotify";
    if (/youtube/i.test(url)) return "play";
    if (/instagram/i.test(url)) return "instagram";
    return "globe";
  };
  return <div className="artist-actions">
    <div className="artist-actions-primary">
      <button type="button" className={`artist-action ${preference.following ? "active" : ""}`} onClick={() => updatePreference("following")} aria-pressed={preference.following}>
        <Icon name={preference.following ? "check" : "heart"} filled={preference.following} />{preference.following ? t.followingArtist : t.followArtist}
      </button>
      <button type="button" className={`artist-action ${preference.eventAlerts ? "active" : ""}`} onClick={() => updatePreference("eventAlerts")} aria-pressed={preference.eventAlerts}>
        <Icon name={preference.eventAlerts ? "check" : "bell"} />{preference.eventAlerts ? t.notificationsOn : t.notifyArtist}
      </button>
    </div>
    {entity.links.length > 0 && <nav className="artist-actions-links" aria-label={t.externalLinks}>
      {entity.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer"><Icon name={iconForLink(link.url)} />{link.label[language]}</a>)}
    </nav>}
  </div>;
}

function NotFound({ t }: { t: typeof copy.es }) {
  return <StatusPage kicker="404" title={t.notFoundTitle} text={t.notFoundText} homeLabel={t.goHome} />;
}

function EndedEvent({ event, t }: { event: EventItem; t: typeof copy.es }) {
  const city = venueFor(event.venueId).city;
  const sameCategory = events.filter((item) => item.category === event.category);
  const sameCity = sameCategory.filter((item) => venueFor(item.venueId).city === city);
  const similar = (sameCity.length ? sameCity : sameCategory).slice(0, 3);
  return <StatusPage kicker={`${t.categoryNames[event.category]} · ${event.date}`} title={t.eventPastTitle} text={t.eventPastText.replace("{title}", event.title)} homeLabel={t.goHome}>
    {similar.length > 0 && <section className="artist-events-section"><div className="artist-events-heading"><h2>{t.similarEvents}</h2></div><div className="artist-events-grid">{similar.map((item) => <RelatedEventCard key={item.id} event={item} />)}</div></section>}
  </StatusPage>;
}

function EntityRoute({ back, language, t }: { back: () => void; language: Language; t: typeof copy.es }) {
  const { slug } = useParams();
  const entity = entityFor(slug);
  if (!entity) return <NotFound t={t} />;
  const entityEvents = relatedEventsByEntity(entity.id);
  return <main id="main-content" tabIndex={-1} className="subpage artist-page">
    <div className="subpage-top"><button type="button" onClick={back}><Icon name="arrow" />{t.back}</button></div>
    <section className="artist-page-profile"><span className="kicker">{entityKindCopy[language][entity.kind]}</span><div className="artist-page-heading"><FallbackImage src={entity.image} alt={entity.name} icon="profile" width={320} height={320} lazy={false} /><div><h1>{entity.name}</h1><p>{entity.description}</p><ArtistActions key={entity.id} entity={entity} language={language} /></div></div></section>
    <RelatedEventsSection entity={entity} relatedEvents={entityEvents} title={entity.profileEventsTitle[language]} t={t} showCount={false} showProfileLink={false} />
  </main>;
}

function SectionTitle({ kicker, title, action, onAction, level = 2 }: { kicker: string; title: string; action?: string; onAction?: () => void; level?: 1 | 2 }) {
  const Heading = level === 1 ? "h1" : "h2";
  return <div className="section-title"><div><span>{kicker}</span><Heading>{title}</Heading></div>{action && <button onClick={onAction}>{action}<Icon name="chevron" /></button>}</div>;
}

// Rejilla de tarjetas que en móvil se desliza en horizontal, con contador y botones anterior/siguiente.
function CardCarousel({ className, count, labels, children }: { className: string; count: number; labels: typeof interfaceText.es; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const closestCard = (track: HTMLDivElement) => {
    const left = track.getBoundingClientRect().left;
    return Array.from(track.children).reduce((closest, card, current, cards) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[closest].getBoundingClientRect().left - left) ? current : closest, 0);
  };
  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const target = track.children[Math.max(0, Math.min(track.children.length - 1, closestCard(track) + direction))];
    track.scrollBy({ left: target.getBoundingClientRect().left - track.getBoundingClientRect().left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <>{count > 1 && <div className="mobile-carousel-controls"><span aria-live="polite">{index + 1} / {count}</span><div><button type="button" aria-label={labels.previousEvent} title={labels.previousEvent} disabled={index === 0} onClick={() => move(-1)}><Icon name="arrow" /></button><button type="button" aria-label={labels.nextEvent} title={labels.nextEvent} disabled={index >= count - 1} onClick={() => move(1)}><Icon name="chevron" /></button></div></div>}<div className={className} ref={trackRef} onScroll={(event) => setIndex(closestCard(event.currentTarget))}>{children}</div></>;
}

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

function eventHasEnded(event: EventItem): boolean {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const lastDate = event.endDate ?? event.startDate;
  return Boolean(lastDate && lastDate < todayKey);
}

type CalendarTiming = { start: string; end: string; allDay: boolean };

function madridDateTime(date: string, hour: number, minute: number): Date {
  const [year, month, day] = date.split("-").map(Number);
  const desiredUtc = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  let instant = desiredUtc;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = formatter.formatToParts(new Date(instant));
    const partValue = (type: string) => Number(parts.find((part) => part.type === type)?.value);
    const representedUtc = Date.UTC(partValue("year"), partValue("month") - 1, partValue("day"), partValue("hour"), partValue("minute"), partValue("second"));
    instant += desiredUtc - representedUtc;
  }
  return new Date(instant);
}

function formatCalendarTimestamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function formatCalendarDate(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function calendarTimingFor(event: EventItem): CalendarTiming | null {
  if (!event.startDate || event.time === "Varias funciones") return null;
  const dateParts = event.startDate.split("-").map(Number);
  if (dateParts.length !== 3 || dateParts.some((part) => !part)) return null;
  const timeMatch = event.time.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const start = madridDateTime(event.startDate, Number(timeMatch[1]), Number(timeMatch[2]));
    const durationMatch = event.duration.match(/(?:(\d+)\s*h)?(?:\s*(\d+)\s*min)?/);
    const durationMinutes = Number(durationMatch?.[1] ?? 0) * 60 + Number(durationMatch?.[2] ?? 0) || 120;
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    return { start: formatCalendarTimestamp(start), end: formatCalendarTimestamp(end), allDay: false };
  }
  // Día completo: en iCalendar el final es exclusivo, así que se suma un día al último (endDate si lo hay).
  const lastParts = (event.endDate ?? event.startDate).split("-").map(Number);
  const endDate = new Date(Date.UTC(lastParts[0], lastParts[1] - 1, lastParts[2] + 1));
  return { start: event.startDate.replace(/-/g, ""), end: formatCalendarDate(endDate), allDay: true };
}

function eventStructuredData(event: EventItem, venue: Venue): Record<string, unknown> | null {
  if (!event.startDate || event.time === "Varias funciones" || !/^\d{4}-\d{2}-\d{2}$/.test(event.startDate)) return null;

  const timeMatch = event.time.match(/^(\d{1,2}):(\d{2})$/);
  const startDate = timeMatch
    ? madridDateTime(event.startDate, Number(timeMatch[1]), Number(timeMatch[2])).toISOString()
    : event.startDate;
  const priceMatch = event.price.match(/(\d+(?:[.,]\d{1,2})?)\s*€/);
  const availability = event.availability.toLocaleLowerCase("es");
  const offerAvailability = availability.includes("agotad")
    ? "https://schema.org/SoldOut"
    : availability.includes("disponible")
      ? "https://schema.org/InStock"
      : availability.includes("próxim")
        ? "https://schema.org/PreOrder"
        : undefined;
  const eventUrl = new URL(`/event/${event.id}`, window.location.origin).href;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${eventUrl}#event`,
    name: event.title,
    description: event.description,
    startDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [new URL(event.image, window.location.origin).href],
    url: eventUrl,
    location: {
      "@type": "Place",
      name: venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: venue.address,
        addressLocality: venue.city,
        addressCountry: "ES",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
    },
    ...(event.ticketUrl && {
      offers: {
        "@type": "Offer",
        url: event.ticketUrl,
        ...(offerAvailability && { availability: offerAvailability }),
        ...(priceMatch && {
          price: priceMatch[1].replace(",", "."),
          priceCurrency: "EUR",
        }),
      },
    }),
  };
}

function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function downloadEventCalendar(event: EventItem, venue: ReturnType<typeof venueFor>, timing: CalendarTiming) {
  const dateFields = timing.allDay
    ? [`DTSTART;VALUE=DATE:${timing.start}`, `DTEND;VALUE=DATE:${timing.end}`]
    : [`DTSTART:${timing.start}`, `DTEND:${timing.end}`];
  const calendar = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Plan Cerca//Event Calendar//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${event.id}-${event.startDate}@plancerca`, `DTSTAMP:${formatCalendarTimestamp(new Date())}`,
    ...dateFields,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(`${event.description}\n\n${window.location.href}`)}`,
    `LOCATION:${escapeCalendarText(`${venue.name}, ${venue.address}, ${venue.city}`)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const fileUrl = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.download = `${normalizeSearch(event.title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.ics`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
}

function googleCalendarUrl(event: EventItem, venue: ReturnType<typeof venueFor>, timing: CalendarTiming) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${timing.start}/${timing.end}`,
    details: `${event.description}\n\n${window.location.href}`,
    location: `${venue.name}, ${venue.address}, ${venue.city}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

async function copyTextToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    if (!copied) throw new Error("Clipboard access is unavailable");
  }
}

function DetailActionButton({ icon, label, onClick, active, disabled = false, title }: { icon: IconName; label: string; onClick: () => void; active?: boolean; disabled?: boolean; title?: string }) {
  return <button type="button" className={`detail-action ${active ? "active" : ""}`} onClick={onClick} aria-label={label} aria-pressed={active} disabled={disabled} title={title ?? label}><span className="detail-action-icon"><Icon name={icon} filled={active} /></span><span className="detail-action-label">{label}</span></button>;
}

function CalendarAction({ labels, url, onDownload }: { labels: typeof eventActionCopy.es; url: string | null; onDownload: () => void }) {
  if (!url) return null;
  return <details className="detail-calendar"><summary className="detail-action" aria-label={labels.addToCalendar} title={labels.addToCalendar}><span className="detail-action-icon"><Icon name="calendar" /></span><span className="detail-action-label">{labels.addToCalendar}</span><Icon name="chevron" /></summary><div className="detail-calendar-menu" role="group" aria-label={labels.addToCalendar}><a className="detail-calendar-option" href={url} target="_blank" rel="noreferrer"><span className="detail-action-icon"><Icon name="calendar" /></span>{labels.googleCalendar}</a><button className="detail-calendar-option" type="button" onClick={onDownload}><span className="detail-action-icon"><Icon name="download" /></span>{labels.outlookIcs}</button></div></details>;
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const whenOptions = ["today", "tomorrow", "week", "month"] as const;

// Valor de ?when= → rango de fechas [desde, hasta]; "week" llega hasta el domingo.
function dateRangeFor(when: string | null): [string, string] | null {
  if (!when) return null;
  const today = new Date();
  const dayKey = (offset: number) => localDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset));
  if (when === "today") return [dayKey(0), dayKey(0)];
  if (when === "tomorrow") return [dayKey(1), dayKey(1)];
  if (when === "week") return [dayKey(0), dayKey((7 - today.getDay()) % 7)];
  if (when === "month") return [dayKey(0), dayKey(30)];
  return /^\d{4}-\d{2}-\d{2}$/.test(when) ? [when, when] : null;
}

function eventInRange(event: EventItem, range: [string, string] | null): boolean {
  if (!range) return true;
  if (!event.startDate) return false;
  return event.startDate <= range[1] && (event.endDate ?? event.startDate) >= range[0];
}

// El catálogo se muestra por tandas; el número visible se recuerda al volver atrás.
const PAGE_SIZE = 12;
const visibleCounts = new Map<string, number>();

function Home({ selectedCity, saved, toggleSaved, categories, when, setWhen, toggleCategory, goFilters, resetSearch, searchQuery, language, t }: { selectedCity: City; saved: number[]; toggleSaved: (id: number) => void; categories: string[]; when: string | null; setWhen: (when: string | null) => void; toggleCategory: (category: string | null) => void; goFilters: () => void; resetSearch: () => void; searchQuery: string; language: Language; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const dateRange = dateRangeFor(when);
  const activeFilterCount = categories.length + (dateRange ? 1 : 0);
  const cityEvents = events.filter((event) => venueFor(event.venueId).city === selectedCity);
  const query = normalizeSearch(searchQuery.trim());
  const matchesSearch = (event: EventItem) => {
    const venue = venueFor(event.venueId);
    const matchesCategory = !categories.length || categories.includes(event.category);
    const matchesQuery = !query || normalizeSearch([event.title, event.category, event.description, event.organizer, venue.name, venue.address, ...event.tags].join(" ")).includes(query);
    return matchesCategory && matchesQuery && eventInRange(event, dateRange);
  };
  const filtered = cityEvents.filter(matchesSearch);
  const listKey = [selectedCity, categories.join(","), when ?? "", query].join("|");
  const [shown, setShown] = useState({ key: listKey, count: visibleCounts.get(listKey) ?? PAGE_SIZE });
  const visibleCount = shown.key === listKey ? shown.count : visibleCounts.get(listKey) ?? PAGE_SIZE;
  const showMore = () => {
    const count = visibleCount + PAGE_SIZE;
    visibleCounts.set(listKey, count);
    setShown({ key: listKey, count });
  };
  const otherCityResults = query && !filtered.length
    ? cities.filter((city) => city !== selectedCity).map((city) => [city, events.filter((event) => venueFor(event.venueId).city === city && matchesSearch(event)).length] as const).filter(([, count]) => count > 0)
    : [];
  const searchPathIn = (city: City) => {
    const params = new URLSearchParams({ q: searchQuery.trim(), city });
    if (categories.length) params.set("cat", categories.join(","));
    if (when) params.set("when", when);
    return `/search?${params.toString()}`;
  };
  const recommendationCandidates = [...cityEvents.filter((event) => event.featured), ...cityEvents.filter((event) => !event.featured)];
  const seenRecommendationArtists = new Set<string>();
  const highlightedEvents = recommendationCandidates.filter((event) => {
    if (!event.title?.trim()) return false;
    const artistName = event.title.split(/\s+[—–-]\s+/)[0];
    const artistKey = event.relatedEntityId ?? normalizeSearch(artistName);
    if (seenRecommendationArtists.has(artistKey)) return false;
    seenRecommendationArtists.add(artistKey);
    return true;
  }).slice(0, 3);
  const recommendations = <section><SectionTitle kicker={`${labels.cityScope} ${selectedCity}`} title={t.recommended} action={t.seeAll} onAction={() => document.getElementById("catalogue")?.scrollIntoView()} /><CardCarousel className="featured-grid" count={highlightedEvents.length} labels={labels}>{highlightedEvents.map((event) => <EventCard featured key={event.id} event={event} saved={saved.includes(event.id)} onSave={() => toggleSaved(event.id)} t={t} />)}</CardCarousel></section>;
  const topCategories = eventCategories.map((item) => [item, cityEvents.filter((event) => event.category === item).length] as const).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const weekRange = dateRangeFor("week");
  const weekCount = cityEvents.filter((event) => eventInRange(event, weekRange)).length;
  const topRated = cityEvents.reduce<EventItem | undefined>((best, event) => event.rating !== undefined && (best?.rating === undefined || event.rating > best.rating) ? event : best, undefined);
  const discovery = topCategories.length > 0 && <section className="discovery-strip"><div><Icon name="trending" /><span><small>{t.trending.replace("{city}", selectedCity)}</small><strong>{topCategories.map(([item]) => t.categoryNames[item]).join(" · ")}</strong></span></div>{weekCount > 0 && <div><Icon name="calendar" /><span><small>{t.thisWeek}</small><strong>{eventCountLabel(weekCount, labels)}</strong></span></div>}{topRated && <div><Icon name="star" /><span><small>{t.topRated}</small><strong>{topRated.title.split(/\s+[—–-]\s+/)[0]} · {topRated.rating?.toFixed(1)}</strong></span></div>}</section>;
  const catalogue = <section id="catalogue"><SectionTitle kicker={`${selectedCity.toLocaleUpperCase()} · ${filtered.length}`} title={query ? `${labels.searchResults}: ${searchQuery.trim()}` : t.all} level={query ? 1 : 2} /><div className="catalogue-toolbar"><div className="category-tabs">{["Todos", ...eventCategories].map((item) => { const active = item === "Todos" ? !categories.length : categories.includes(item); return <button className={active ? "active" : ""} aria-pressed={active} data-cat={categoryKeys[item]} onClick={() => toggleCategory(item === "Todos" ? null : item)} key={item}>{item === "Todos" ? t.allCategories : t.categoryNames[item as EventCategory]}</button>; })}</div><button className={`filter-control ${activeFilterCount ? "active" : ""}`} onClick={goFilters}><Icon name="filter" />{t.filters}{activeFilterCount ? ` · ${activeFilterCount}` : ""}</button></div>{filtered.length ? <><div className="event-grid">{filtered.slice(0, visibleCount).map((event) => <EventCard key={event.id} event={event} saved={saved.includes(event.id)} onSave={() => toggleSaved(event.id)} t={t} />)}</div>{filtered.length > visibleCount && <div className="catalogue-more"><p role="status">{t.showingCount.replace("{shown}", String(visibleCount)).replace("{total}", String(filtered.length))}</p><Button variant="secondary" onClick={showMore}>{t.showMore}</Button></div>}</> : otherCityResults.length > 0 ? <div className="city-empty-state" role="status"><h2>{labels.searchOtherCitiesTitle.replace("{query}", searchQuery.trim()).replace("{city}", selectedCity)}</h2><p>{labels.searchOtherCitiesText}</p><div className="search-other-cities">{otherCityResults.map(([city, count]) => <Link key={city} className="button button--secondary" to={searchPathIn(city)}>{city} · {count}</Link>)}</div></div> : query || activeFilterCount ? <div className="city-empty-state" role="status"><h2>{labels.noSearchResults}</h2><div className="search-other-cities"><Button variant="secondary" onClick={resetSearch}>{labels.viewAllEvents}</Button></div></div> : <p className="city-empty">{t.noCityEvents}</p>}</section>;
  const isSearching = query.length > 0;
  // Atajos de fecha del hero: cada uno muestra cuántos eventos hay y se desactiva si no hay ninguno.
  const whenNames: Record<(typeof whenOptions)[number], string> = { today: labels.whenToday, tomorrow: labels.whenTomorrow, week: t.thisWeek, month: labels.whenMonth };
  const quickWhen = whenOptions.map((option) => [option, cityEvents.filter((event) => eventInRange(event, dateRangeFor(option))).length] as const);
  const pickWhen = (option: (typeof whenOptions)[number]) => {
    const next = when === option ? null : option;
    setWhen(next);
    if (next) document.getElementById("catalogue")?.scrollIntoView();
  };
  return <main id="main-content" tabIndex={-1}>
    {!isSearching && <section className="hero"><img src={cityImages[selectedCity]} alt={selectedCity} width={1600} height={900} fetchPriority="high" /><div className="hero-shade" /><div className="hero-copy"><div className="hero-meta"><div className="hero-city-group"><span className="hero-city-copy"><strong className="hero-city-name">{selectedCity}</strong><small className="hero-city-count">{cityEventCounts[selectedCity]} {labels.availableEvents}</small></span></div></div><h1>{t.hero}</h1><p>{t.heroText}</p><div className="hero-quick" role="group" aria-label={t.when}>{quickWhen.map(([option, count]) => <button type="button" key={option} className={`hero-chip ${when === option ? "active" : ""}`} aria-pressed={when === option} disabled={count === 0 && when !== option} onClick={() => pickWhen(option)}>{whenNames[option]}<span>{count}</span></button>)}</div></div></section>}
    <div className="home-content">
      {isSearching ? <>{catalogue}{recommendations}{discovery}</> : <>{recommendations}{discovery}{catalogue}</>}
    </div>
  </main>;
}

const normalizeCity = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const extraCitySuggestions = ["Cuenca", "Albacete", "Toledo", "Segovia", "Salamanca"];

function Filters({ selectedCity, initialCategories, initialWhen, onApply, back, language, t }: { selectedCity: City; initialCategories: string[]; initialWhen: string | null; onApply: (city: City, categories: string[], when: string | null) => void; back: () => void; language: Language; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const [selected, setSelected] = useState(initialCategories);
  const [when, setWhen] = useState(initialWhen);
  const [cityInput, setCityInput] = useState<string>(selectedCity);
  const typedCity = cityInput.trim();
  const matchedCity = cities.find((city) => normalizeCity(city) === normalizeCity(typedCity));
  const hasEvents = !typedCity || (matchedCity !== undefined && cityEventCounts[matchedCity] > 0);
  const resultCity = matchedCity ?? selectedCity;
  const dateRange = dateRangeFor(when);
  const resultCount = events.filter((event) => venueFor(event.venueId).city === resultCity && (!selected.length || selected.includes(event.category)) && eventInRange(event, dateRange)).length;
  const suggestions = cities.filter((city) => city !== matchedCity && cityEventCounts[city] > 0);
  const pickCity = (city: City) => setCityInput(city);
  const toggle = (value: string) => setSelected((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const whenLabels: Record<(typeof whenOptions)[number], string> = { today: labels.whenToday, tomorrow: labels.whenTomorrow, week: t.thisWeek, month: labels.whenMonth };
  const customDate = when !== null && !(whenOptions as readonly string[]).includes(when);
  return <main id="main-content" tabIndex={-1} className="subpage"><div className="subpage-top"><button onClick={back}><Icon name="arrow" />{t.back}</button><button onClick={() => { setSelected([]); setWhen(null); }}>{t.clear}</button></div><div className="filter-shell"><span className="kicker">{t.search}</span><h1>{t.filters}</h1><section><h2>{t.city}</h2><label className="filter-city-search"><BrandMark /><input type="text" name="city" list="filter-city-list" value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder={labels.cityPlaceholder} aria-label={t.city} autoComplete="off" /></label><datalist id="filter-city-list">{[...new Set([...cities, ...extraCitySuggestions])].map((city) => <option key={city} value={city} />)}</datalist></section>{!hasEvents && <section className="city-empty-state" role="status"><h2>{labels.cityEmptyTitle.replace("{city}", typedCity)}</h2><p>{labels.cityEmptyText}</p><h3>{labels.citySuggestions}</h3><div className="option-grid">{suggestions.map((city) => <button key={city} type="button" onClick={() => pickCity(city)}>{city}<small>{cityEventCounts[city]} {labels.availableEvents}</small></button>)}</div></section>}<section><h2>{t.categories}</h2><div className="option-grid">{eventCategories.map((item) => <button className={selected.includes(item) ? "active" : ""} aria-pressed={selected.includes(item)} onClick={() => toggle(item)} key={item}>{t.categoryNames[item]}{selected.includes(item) && <Icon name="check" />}</button>)}</div></section><section><h2>{t.when}</h2><div className="option-grid dates">{whenOptions.map((item) => <button className={when === item ? "active" : ""} aria-pressed={when === item} onClick={() => setWhen(when === item ? null : item)} key={item}>{whenLabels[item]}</button>)}<button className={customDate ? "active" : ""} aria-pressed={customDate} onClick={() => setWhen(customDate ? null : localDateKey(new Date()))}>{labels.pickDate}</button></div>{customDate && <input className="new-list-input filter-date-input" type="date" name="when" value={when ?? ""} min={localDateKey(new Date())} onChange={(e) => setWhen(e.target.value || null)} aria-label={labels.pickDate} />}</section><Button disabled={!hasEvents} onClick={() => onApply(resultCity, selected, when)}>{t.results} · {hasEvents ? resultCount : 0}</Button></div></main>;
}

function VenuesPage({ selectedCity, language, t }: { selectedCity: City; language: Language; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const cityVenues = venues.filter((venue) => venue.city === selectedCity).sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
  return <main id="main-content" tabIndex={-1} className="venue-directory"><div className="venue-directory-heading"><span className="kicker">{selectedCity}</span><h1>{labels.venueHeading} {selectedCity}</h1><p>{labels.venueIntro}</p></div>{cityVenues.length ? <div className="venue-directory-grid">{cityVenues.map((venue) => {
    const venueEvents = events.filter((event) => event.venueId === venue.id);
    return <article className="venue-directory-card" key={venue.id}><Link className={`venue-directory-image ${venue.image ? "" : "venue-directory-image--placeholder"}`} to={cityPath(`/venues/${venue.id}`, venue.city)} aria-label={venue.name}>{venue.image ? <FallbackImage src={venue.image} alt={venueAlt(venue.name, language)} icon="location" category={venueCategoryKey(venue.kind.es)} width={640} height={360} /> : <BrandMark className="venue-placeholder-mark" />}</Link><span className="venue-directory-kind" data-cat={venueCategoryKey(venue.kind.es)}><Icon name="location" />{venue.kind[language]}</span><h2><Link className="venue-name-link" to={cityPath(`/venues/${venue.id}`, venue.city)}>{venue.name}</Link></h2><p>{venue.description[language]}</p><address>{venue.address}</address><div className="venue-directory-footer"><span>{eventCountLabel(venueEvents.length, labels)}</span><Link className="button button--secondary" to={cityPath(`/venues/${venue.id}`, venue.city)}>{labels.viewEvents}<Icon name="chevron" /></Link></div></article>;
  })}</div> : <p className="city-empty">{t.noCityEvents}</p>}</main>;
}

function upcomingEventsAtVenue(venueId: string, excludedEventId?: number): EventItem[] {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return events
    .filter((item) => item.venueId === venueId && item.id !== excludedEventId && item.confirmed && item.startDate && item.startDate >= todayKey)
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}

function VenueRoute({ saved, toggleSaved, goBack, language, t }: { saved: number[]; toggleSaved: (id: number) => void; goBack: () => void; language: Language; t: typeof copy.es }) {
  const { id } = useParams();
  const venue = venues.find((item) => item.id === id);
  if (!venue) return <NotFound t={t} />;
  const upcoming = upcomingEventsAtVenue(venue.id).slice(0, 6);
  return <main id="main-content" tabIndex={-1} className="detail-page venue-detail-page"><div className="detail-top"><button onClick={goBack}><Icon name="arrow" />{t.back}</button></div><section className={`detail-hero venue-detail-hero ${venue.image ? "" : "venue-detail-hero--placeholder"}`} data-cat={venueCategoryKey(venue.kind.es)}><div className="detail-intro venue-detail-copy"><span className="category">{venue.city} · {venue.kind[language]}</span><h1>{venue.name}</h1><p className="detail-lead">{venue.description[language]}</p><div className="detail-intro-facts venue-detail-address"><span><Icon name="location" />{venue.address}</span><a href={venue.mapsUrl} target="_blank" rel="noreferrer"><Icon name="location" />{t.map}<Icon name="chevron" /></a></div></div><div className="detail-gallery venue-detail-gallery">{venue.image ? <FallbackImage className="gallery-main" src={venue.image} alt={venueAlt(venue.name, language)} icon="location" category={venueCategoryKey(venue.kind.es)} width={1200} height={675} lazy={false} /> : <div className="venue-detail-placeholder" aria-hidden="true"><BrandMark className="venue-detail-placeholder-mark" /></div>}</div></section><section className="venue-upcoming"><div className="venue-upcoming-inner"><SectionTitle kicker={`${venue.city} · ${venue.name}`} title={t.venueEvents} />{upcoming.length ? <div className="venue-event-grid">{upcoming.map((event) => <EventCard key={event.id} event={event} saved={saved.includes(event.id)} onSave={() => toggleSaved(event.id)} t={t} />)}</div> : <p className="venue-empty">{t.venueEmpty}</p>}</div></section></main>;
}

function Detail({ event, savedIds, toggleSavedId, back, language, t }: { event: EventItem; savedIds: number[]; toggleSavedId: (id: number) => void; back: () => void; language: Language; t: typeof copy.es }) {
  const venue = venueFor(event.venueId);
  const saved = savedIds.includes(event.id);
  const toggleSaved = () => toggleSavedId(event.id);
  const tags = visibleTags(event, venue.city);
  const structuredEvent = eventStructuredData(event, venue);
  const ended = eventHasEnded(event);
  const actionLabels = eventActionCopy[language];
  const [copyConfirmed, setCopyConfirmed] = useState(false);
  const calendarTiming = calendarTimingFor(event);
  const calendarUrl = calendarTiming ? googleCalendarUrl(event, venue, calendarTiming) : null;
  const entity = event.relatedEntityId ? relatedEntities[event.relatedEntityId] : undefined;
  const entityEvents = event.relatedEntityId ? relatedEventsByEntity(event.relatedEntityId, event.id) : [];
  const venueLinkLabels = venueLinkCopy[language];
  const venueEvents = upcomingEventsAtVenue(event.venueId, event.id).slice(0, 6);
  const related = events.filter((item) => item.category === event.category && item.id !== event.id && venueFor(item.venueId).city === venue.city).slice(0, 3);
  const copyEventLink = async () => {
    try {
      await copyTextToClipboard(window.location.href);
      setCopyConfirmed(true);
      window.setTimeout(() => setCopyConfirmed(false), 1800);
    } catch {
      setCopyConfirmed(false);
    }
  };
  const shareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text: event.description, url: window.location.href });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyEventLink();
  };
  return <main id="main-content" tabIndex={-1} className="detail-page">{structuredEvent && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredEvent).replace(/</g, "\\u003c") }} />}<div className="detail-top detail-top--event"><button onClick={back}><Icon name="arrow" /><span>{t.back}</span></button><div className="detail-actions"><DetailActionButton icon="share" label={actionLabels.share} onClick={() => { void shareEvent(); }} /><DetailActionButton icon="heart" label={saved ? t.savedLabel : t.save} onClick={toggleSaved} active={saved} /><DetailActionButton icon={copyConfirmed ? "check" : "copy"} label={copyConfirmed ? actionLabels.copied : actionLabels.copyLink} onClick={() => { void copyEventLink(); }} /><CalendarAction labels={actionLabels} url={calendarUrl} onDownload={() => { if (calendarTiming) downloadEventCalendar(event, venue, calendarTiming); }} /></div></div>
    <section className="detail-hero" data-cat={categoryKeys[event.category]}><div className="detail-gallery"><FallbackImage className="gallery-main" src={event.image} alt={interfaceText[language].eventImageAlt.replace("{title}", event.title)} icon={eventFallbackIcon(event)} category={categoryKeys[event.category]} width={1200} height={675} lazy={false} /></div><div className="detail-intro"><span className="category">{t.categoryNames[event.category]}</span><h1>{event.title}</h1><div className="detail-intro-facts"><span><Icon name="calendar" />{event.date} · {event.time}</span><span><Icon name="location" />{venue.name} · {venue.city}</span><span><Icon name="time" />{event.duration}</span></div><div className="detail-social">{event.rating !== undefined && <span><Icon name="star" filled />{event.rating.toFixed(1)}{event.popularity ? ` · ${t.popularityValue.replace("{value}", event.popularity)}` : ""}</span>}{tags.length > 0 && <span>{tags.join(" · ")}</span>}</div><p className="detail-lead">{event.description}</p>{!ended && <div className="detail-cta">{/\d/.test(event.price) && <strong className="detail-cta-price">{event.price}</strong>}<a className="button button--primary" href={event.ticketUrl} target="_blank" rel="noreferrer"><Icon name="ticket" />{t.buy}</a></div>}</div></section>
    <div className="detail-content"><div className="detail-main">
      <section><h2>{t.description}</h2><p>{event.fullDescription}</p></section>
      {entity && <section className="artist-profile"><h2>{entity.aboutTitle[language]}</h2><Link className="artist-profile-main" to={`/entity/${entity.id}`}><FallbackImage src={entity.image} alt="" icon="profile" width={124} height={124} /><div className="artist-profile-copy"><div className="artist-profile-head"><h3>{entity.name}</h3><span className="artist-profile-cta">{t.viewEntity}<Icon name="chevron" /></span></div><p>{entity.description}</p></div></Link>{entity.links.length > 0 && <div className="artist-profile-links">{entity.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label[language]}</a>)}</div>}</section>}
      <section><h2>{t.practical}</h2><div className="info-grid"><div className="info-item info-item--location"><span><Icon name="location" /></span><div><small>{t.location}</small><strong>{venue.name}</strong><p>{venue.address}</p>{venue.mapsUrl && <a href={venue.mapsUrl} target="_blank" rel="noreferrer">{t.openInMaps}<Icon name="chevron" /></a>}</div></div><Info icon="profile" label={t.organizer} value={event.organizer} /></div></section>
    </div><aside className="purchase-card"><span className="kicker">{t.availability}</span><div className="stock"><i />{event.availability}</div>{ended ? <p className="purchase-provider">{t.eventEnded}</p> : <>{/\d/.test(event.price) ? <p className="purchase-price">{event.price}</p> : <p className="purchase-provider">{t.ticketsAt.replace("{provider}", event.organizer)}</p>}<p>{event.confirmed ? (event.time === "Por confirmar" ? t.confirmedTimePending : t.confirmed) : t.pending}</p><a className="button button--primary" href={event.ticketUrl} target="_blank" rel="noreferrer"><Icon name="ticket" />{t.buy}</a><small><Icon name="check" />{t.external}</small></>}<SaveButton active={saved} onClick={toggleSaved} t={t} /></aside></div>
    <section className="venue-overview"><div className={`venue-info-card ${venue.image ? "" : "venue-info-card--text-only"}`}>{venue.image && <FallbackImage className="venue-about-image" src={venue.image} alt={venueAlt(venue.name, language)} icon="location" category={venueCategoryKey(venue.kind.es)} width={640} height={360} />}<div className="venue-about-copy"><span className="kicker">{t.venueAbout}</span><span className="venue-kind"><BrandMark className="venue-kind-mark" />{venue.city} · {venue.kind[language]}</span><h2><Link className="venue-name-link" to={cityPath(`/venues/${venue.id}`, venue.city)}>{venue.name}</Link></h2><p>{venue.description[language]}</p>{(venue.websiteUrl || venue.programmeUrl) && <div className="venue-info-footer">{venue.websiteUrl && <a href={venue.websiteUrl} target="_blank" rel="noreferrer">{venueLinkLabels.website}<Icon name="chevron" /></a>}{venue.programmeUrl && venue.programmeLabel && <a href={venue.programmeUrl} target="_blank" rel="noreferrer">{venue.programmeLabel[language]}<Icon name="chevron" /></a>}</div>}</div></div></section>
    {entity && <RelatedEventsSection entity={entity} relatedEvents={entityEvents} title={entity.relatedEventsTitle[language]} t={t} />}
    {venueEvents.length > 0 && <section className="venue-upcoming"><div className="venue-upcoming-inner"><SectionTitle kicker={`${venue.city} · ${venue.name}`} title={t.venueEvents} /><div className="venue-event-grid">{venueEvents.map((item) => <EventCard key={item.id} event={item} saved={savedIds.includes(item.id)} onSave={() => toggleSavedId(item.id)} t={t} />)}</div></div></section>}
    {related.length > 0 && <section className="related"><SectionTitle kicker={t.categoryNames[event.category]} title={t.related} /><CardCarousel className="related-grid" count={related.length} labels={interfaceText[language]}>{related.map((item) => <EventCard key={item.id} event={item} saved={savedIds.includes(item.id)} onSave={() => toggleSavedId(item.id)} t={t} />)}</CardCarousel></section>}
  </main>;
}

function Info({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <div className="info-item"><span><Icon name={icon} /></span><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function Saved({ saved, toggleSaved, explore, title, t }: { saved: number[]; toggleSaved: (id: number) => void; explore: () => void; title: string; t: typeof copy.es }) {
  const savedEvents = events.filter((event) => saved.includes(event.id));
  return <main id="main-content" tabIndex={-1} className="subpage saved-page"><div className="saved-heading"><h1>{title}</h1></div>{savedEvents.length ? <div className="event-grid">{savedEvents.map((event) => <EventCard key={event.id} event={event} saved onSave={() => toggleSaved(event.id)} t={t} />)}</div> : <div className="empty"><Icon name="heart" /><h2>{t.favouritesEmptyTitle}</h2><p>{t.favouritesEmptyText}</p><Button onClick={explore}>{t.discover}</Button></div>}</main>;
}

function EventRoute({ saved, toggleSaved, goBack, language, t }: { saved: number[]; toggleSaved: (id: number) => void; goBack: () => void; language: Language; t: typeof copy.es }) {
  const { id } = useParams();
  const event = events.find((item) => item.id === Number(id));
  if (!event) {
    const endedEvent = endedEvents.find((item) => item.id === Number(id));
    return endedEvent ? <EndedEvent event={endedEvent} t={t} /> : <NotFound t={t} />;
  }
  return <Detail event={event} savedIds={saved} toggleSavedId={toggleSaved} back={goBack} language={language} t={t} />;
}

function SiteFooter({ language }: { language: Language }) {
  const labels = interfaceText[language];
  const [aboutOpen, setAboutOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aboutOpen) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setAboutOpen(false); return; }
      if (e.key !== "Tab") return;
      // Tab recorre solo los controles del modal mientras está abierto.
      const controls = [...(modalRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? [])];
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      const inside = modalRef.current?.contains(document.activeElement);
      if (!inside || (e.shiftKey && document.activeElement === first)) { e.preventDefault(); (inside ? last : first).focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); trigger?.focus(); };
  }, [aboutOpen]);
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <div><strong>Plan Cerca</strong><p>{labels.footerTagline}</p><p>{labels.footerAcademic}</p></div>
      <div className="site-footer-meta"><button ref={triggerRef} type="button" className="site-footer-link" onClick={() => setAboutOpen(true)}>{labels.aboutLink}</button><small>© 2026 Plan Cerca</small></div>
    </div>
    {aboutOpen && <div className="about-backdrop" onClick={() => setAboutOpen(false)}><div ref={modalRef} className="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={(e) => e.stopPropagation()}>
      <h2 id="about-title">{labels.aboutTitle}</h2>
      <p>{labels.aboutText1}</p>
      <p>{labels.aboutText2}</p>
      <p>{labels.aboutText3}</p>
      <button ref={closeRef} type="button" className="button button--primary" onClick={() => setAboutOpen(false)}>{labels.close}</button>
    </div></div>}
  </footer>;
}

const scrollPositions = new Map<string, number>();

const SAVED_EVENTS_KEY = "plan-cerca.saved-events";

// Favoritos guardados en este navegador; si el almacenamiento no está disponible, duran lo que la sesión.
function readSavedEvents(): number[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(SAVED_EVENTS_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

const LANGUAGE_KEY = "plan-cerca.language";

// Idioma elegido en este navegador; sin elección guardada se usa el español.
function readLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return stored === "en" || stored === "fr" ? stored : "es";
  } catch {
    return "es";
  }
}

// Lleva el foco al contenido principal: lo usan el enlace de salto y cada cambio de página.
function focusMain(scrollIntoView: boolean) {
  const main = document.querySelector<HTMLElement>("main");
  if (!main) return;
  main.focus({ preventScroll: !scrollIntoView });
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCity } = usePreferredCity();
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);
  const navigationType = useNavigationType();
  const scrollKey = useRef(location.key);
  useEffect(() => {
    const savePosition = () => scrollPositions.set(scrollKey.current, window.scrollY);
    window.addEventListener("scroll", savePosition, { passive: true });
    return () => window.removeEventListener("scroll", savePosition);
  }, []);
  useLayoutEffect(() => {
    scrollKey.current = location.key;
    // Atrás/adelante recupera la posición de esa entrada; una página nueva empieza arriba.
    if (navigationType === "POP") window.scrollTo({ top: scrollPositions.get(location.key) ?? 0, behavior: "instant" });
    else if (navigationType === "PUSH") window.scrollTo({ top: 0, behavior: "instant" });
    scrollPositions.set(location.key, window.scrollY);
  }, [location.key, navigationType]);
  const pathname = location.pathname.toLowerCase().replace(/(.)\/+$/, "$1");
  const isEntityPath = pathname.startsWith("/entity/") || pathname.startsWith("/artist/");
  const focusedPath = useRef(pathname);
  useEffect(() => {
    if (focusedPath.current === pathname) return;
    focusedPath.current = pathname;
    focusMain(false);
  }, [pathname]);
  const page: Page = pathname === "/" ? "home" : pathname === "/search" ? "search" : pathname === "/favorites" ? "favorites" : pathname === "/venues" ? "venues" : pathname.startsWith("/venues/") ? "venue-detail" : pathname.startsWith("/event/") ? "detail" : isEntityPath ? "entity" : "not-found";
  const [language, setLanguage] = useState<Language>(readLanguage);
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Sin almacenamiento disponible la sesión sigue funcionando.
    }
  }, [language]);
  const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "");
  const [saved, setSaved] = useState<number[]>(readSavedEvents);
  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(saved));
    } catch {
      // Sin almacenamiento disponible la sesión sigue funcionando.
    }
  }, [saved]);
  const t = copy[language];
  const event = useMemo(() => [...events, ...endedEvents].find((item) => pathname === `/event/${item.id}`), [pathname]);
  const activeVenue = useMemo(() => venues.find((item) => pathname === `/venues/${item.id}`), [pathname]);
  const activeEntity = useMemo(() => {
    const prefix = pathname.startsWith("/entity/") ? "/entity/" : "/artist/";
    return isEntityPath ? entityFor(pathname.slice(prefix.length)) : undefined;
  }, [isEntityPath, pathname]);
  useEffect(() => {
    if (page === "home") document.title = `Plan Cerca · ${selectedCity}`;
    else if (page === "detail" && event) document.title = `${event.title} · Plan Cerca`;
    else if (page === "venue-detail" && activeVenue) document.title = `${activeVenue.name} · Plan Cerca`;
    else if (page === "entity" && activeEntity) document.title = `${activeEntity.name} · Plan Cerca`;
    else if (page === "venues") document.title = `${interfaceText[language].venues} · ${selectedCity} · Plan Cerca`;
    else if (page === "favorites") document.title = `${interfaceText[language].favourites} · Plan Cerca`;
    else if (page === "search") document.title = `${t.search} · Plan Cerca`;
    else document.title = `${t.notFoundTitle} · Plan Cerca`;
  }, [activeEntity, activeVenue, event, language, page, selectedCity, t.notFoundTitle, t.search]);
  useEffect(() => {
    setSearchQuery(new URLSearchParams(location.search).get("q") ?? "");
  }, [location.pathname, location.search]);
  const navigateWithCity = (path: string, city = selectedCity) => {
    const separator = path.indexOf("?");
    const targetPath = separator === -1 ? path : path.slice(0, separator);
    const params = new URLSearchParams(separator === -1 ? "" : path.slice(separator + 1));
    params.set("city", city);
    navigate({ pathname: targetPath, search: `?${params.toString()}` });
  };
  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);
    // Vacía: no hay nada que buscar; si se estaba en resultados, se vuelve al listado.
    if (!trimmed) { if (page === "search") navigateWithCity("/"); return; }
    navigateWithCity(`/search?q=${encodeURIComponent(trimmed)}`);
  };
  const goToEvents = () => { setSearchQuery(""); navigateWithCity("/"); };
   const toggleSaved = (id: number) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const goBack = () => {
    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) navigate(-1);
    else navigateWithCity("/", selectedCity);
  };
  const searchParams = new URLSearchParams(location.search);
  const activeCategories = (searchParams.get("cat") ?? "").split(",").filter((item) => (eventCategories as readonly string[]).includes(item));
  const activeWhen = dateRangeFor(searchParams.get("when")) ? searchParams.get("when") : null;
  // "Todos" (null) vacía la selección; cada categoría se suma o se quita, igual que en Filtros.
  const toggleCategory = (category: string | null) => {
    const params = new URLSearchParams(location.search);
    const next = category === null ? [] : activeCategories.includes(category) ? activeCategories.filter((item) => item !== category) : [...activeCategories, category];
    if (next.length) params.set("cat", next.join(","));
    else params.delete("cat");
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
  };
  const setWhen = (when: string | null) => {
    const params = new URLSearchParams(location.search);
    if (when) params.set("when", when);
    else params.delete("when");
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
  };
  const goFilters = () => {
    const params = new URLSearchParams(location.search);
    params.set("filters", "1");
    navigate({ pathname: "/search", search: `?${params.toString()}` });
  };
  const applyFilters = (city: City, categories: string[], when: string | null) => {
    const params = new URLSearchParams(location.search);
    params.delete("filters");
    params.set("city", city);
    if (categories.length) params.set("cat", categories.join(","));
    else params.delete("cat");
    if (when) params.set("when", when);
    else params.delete("when");
    navigate({ pathname: params.has("q") ? "/search" : "/", search: `?${params.toString()}` });
  };
  const homePage = <Home selectedCity={selectedCity} saved={saved} toggleSaved={toggleSaved} categories={activeCategories} when={activeWhen} setWhen={setWhen} toggleCategory={toggleCategory} goFilters={goFilters} resetSearch={goToEvents} searchQuery={searchParams.get("q") ?? ""} language={language} t={t} />;
  const showFilters = searchParams.has("filters") || !searchParams.has("q");
  return <div className="app-shell"><a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); focusMain(true); }}>{interfaceText[language].skipToContent}</a><CityOnboardingDialog language={language} /><Nav page={page} city={selectedCity} language={language} setLanguage={setLanguage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={submitSearch} t={t} /><div className="main-shell">
    <Routes>
      <Route path="/" element={homePage} />
      <Route path="/search" element={showFilters ? <Filters selectedCity={selectedCity} initialCategories={activeCategories} initialWhen={activeWhen} onApply={applyFilters} back={goBack} language={language} t={t} /> : homePage} />
      <Route path="/favorites" element={<Saved saved={saved} toggleSaved={toggleSaved} explore={goToEvents} title={interfaceText[language].favourites} t={t} />} />
      <Route path="/venues" element={<VenuesPage selectedCity={selectedCity} language={language} t={t} />} />
      <Route path="/venues/:id" element={<VenueRoute saved={saved} toggleSaved={toggleSaved} goBack={goBack} language={language} t={t} />} />
      <Route path="/event/:id" element={<EventRoute saved={saved} toggleSaved={toggleSaved} goBack={goBack} language={language} t={t} />} />
      <Route path="/entity/:slug" element={<EntityRoute back={goBack} language={language} t={t} />} />
      <Route path="/artist/:slug" element={<EntityRoute back={goBack} language={language} t={t} />} />
      <Route path="*" element={<NotFound t={t} />} />
    </Routes>
    <SiteFooter language={language} />
  </div></div>;
}
