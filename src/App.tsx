import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { relatedEntities } from "./data/entities";
import { cityEventCounts, cityImages, events, relatedEventsByEntity } from "./data/event-catalog";
import { getArtistPreference, setArtistPreference, type ArtistPreferenceState } from "./data/artist-preferences";
import { entityKindCopy, copy, eventActionCopy, interfaceText, venueLinkCopy } from "./data/translations";
import { venueFor, venues } from "./data/venue-catalog";
import CityOnboardingDialog from "./components/CityOnboardingDialog";
import CitySelector from "./components/CitySelector";
import { usePreferredCity } from "./context/PreferredCityContext";
import { cities, eventCategories, type City, type EventItem, type RelatedEntity, type Venue } from "./types/Event";

type Page = "home" | "search" | "detail" | "favorites" | "venues" | "venue-detail" | "entity";
type Language = "es" | "en" | "fr";
type IconName = "arrow" | "bell" | "bookmark" | "calendar" | "check" | "chevron" | "copy" | "download" | "filter" | "globe" | "heart" | "home" | "instagram" | "location" | "play" | "profile" | "search" | "share" | "spark" | "spotify" | "star" | "ticket" | "time" | "trending";

const icons: Record<IconName, ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18s-3-2-3-9" /><path d="M10 21h4" /></>,
  bookmark: <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4Z" />,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></>,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r=".8" fill="currentColor" /></>,
  play: <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" /></>,
  spotify: <><path d="M5 8c4-1 10 0 14 2" /><path d="M6 12c3-1 8 0 11 2" /><path d="M7 16c2-.5 5 0 7 1.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  filter: <path d="M4 5h16M7 12h10M10 19h4" />, arrow: <path d="m15 18-6-6 6-6" />, chevron: <path d="m9 18 6-6-6-6" />,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5a5.5 5.5 0 0 0 1-8.9Z" />,
  spark: <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" />,
  share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
  ticket: <path d="M3 8a2 2 0 0 0 0 4v5h18v-5a2 2 0 0 0 0-4V3H3Z" />,
  check: <path d="m5 12 4 4L19 6" />, star: <path d="m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3-5.9 3 1.1-6.5L2.5 9 9 8Z" />,
  time: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, trending: <path d="m3 17 6-6 4 4 8-9M15 6h6v6" />,
};

function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  return <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

function BrandMark({ className = "" }: { className?: string }) {
  return <span className={`brand-mark ${className}`} aria-hidden="true"><Icon name="location" /></span>;
}

function LanguageSelect({ value, onChange, light = false }: { value: Language; onChange: (language: Language) => void; light?: boolean }) {
  return <label className={`language-select ${light ? "light" : ""}`}><span className="sr-only">Idioma</span><select value={value} onChange={(e) => onChange(e.target.value as Language)} aria-label="Seleccionar idioma"><option value="es">Español</option><option value="en">English</option><option value="fr">Français</option></select><Icon name="chevron" /></label>;
}

function Logo({ goHome }: { goHome: () => void }) {
  return <button className="logo" onClick={goHome} aria-label="Plan Cerca, inicio"><BrandMark className="logo-mark" /><span>Plan</span><span>Cerca</span></button>;
}

function Button({ children, onClick, variant = "primary" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={`button button--${variant}`} onClick={onClick}>{children}</button>;
}

function Nav({ page, navigate, language, setLanguage, searchQuery, setSearchQuery, onSearch, t }: { page: Page; navigate: (path: string) => void; language: Language; setLanguage: (language: Language) => void; searchQuery: string; setSearchQuery: (query: string) => void; onSearch: (query: string) => void; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const activePage = page === "detail" || page === "search" ? "home" : page === "venue-detail" ? "venues" : page;
  const item = (target: Page, path: string, icon: IconName, label: string) => <button className={`primary-nav-item ${activePage === target ? "active" : ""}`} onClick={() => navigate(path)} key={target}><Icon name={icon} /><span>{label}</span></button>;
  return <header className={`site-header ${page === "detail" ? "site-header--event-detail" : ""}`}><div className="site-header-inner">
    <Logo goHome={() => navigate("/")} />
    <form className="global-search" role="search" onSubmit={(event) => { event.preventDefault(); onSearch(searchQuery); }}><Icon name="search" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} /><button type="submit" aria-label={labels.searchResults}><Icon name="search" /></button></form>
    <nav className="primary-nav" aria-label={labels.events}>{item("home", "/", "calendar", labels.events)}{item("venues", "/venues", "location", labels.venues)}{item("favorites", "/favorites", "heart", labels.favourites)}</nav>
    <div className="header-actions"><CitySelector language={language} /><div className="header-language"><LanguageSelect value={language} onChange={setLanguage} /></div><div className="guest-profile"><span><Icon name="profile" /></span><strong>{labels.guest}</strong></div></div>
  </div></header>;
}

const categoryKeys: Record<string, string> = { Música: "music", Ópera: "opera", Danza: "dance", Deportes: "sports", Teatro: "theatre", Museos: "museums", Arte: "art" };
const venueCategoryKey = (kind: string) => /museo/i.test(kind) ? "museums" : /estadio|pabell|arena/i.test(kind) ? "sports" : /teatro/i.test(kind) ? "theatre" : /ópera/i.test(kind) ? "opera" : /concierto|música|auditorio/i.test(kind) ? "music" : undefined;

function SaveButton({ active, onClick, t, compact = false }: { active: boolean; onClick: () => void; t: typeof copy.es; compact?: boolean }) {
  const label = active ? t.savedLabel : t.save;
  return <button className={`save-button ${active ? "active" : ""} ${compact ? "compact" : ""}`} onClick={onClick} aria-label={label} aria-pressed={active} title={label}><Icon name={active ? "heart" : "bookmark"} filled={active} /><span>{label}</span></button>;
}

function EventCard({ event, saved, onSave, onOpen, t, featured = false }: { event: EventItem; saved: boolean; onSave: () => void; onOpen: () => void; t: typeof copy.es; featured?: boolean }) {
  const venue = venueFor(event.venueId);
  return <article className={`event-card ${featured ? "featured" : ""}`} data-cat={categoryKeys[event.category]}>
    <button className="event-image" onClick={onOpen} aria-label={`${t.details}: ${event.title}`}><img src={event.image} alt={`Imagen promocional de ${event.title}`} /><span className="category">{event.category}</span><span className="rating"><Icon name="star" filled />{event.rating.toFixed(1)}</span></button>
    <div className="event-body"><div className="event-title-row"><button className="event-title" onClick={onOpen}>{event.title}</button><SaveButton active={saved} onClick={onSave} t={t} compact /></div>
      <p className="event-description">{event.description}</p>
      <div className="event-facts"><span><Icon name="calendar" />{event.date} · {event.time}</span><span><Icon name="location" />{venue.name} · {event.distance}</span><span><Icon name="time" />{event.duration}</span></div>
      <div className="tag-row">{event.tags.slice(0, 3).map((tag, index) => <span key={tag} className={index === 0 ? "tag-category" : undefined}>{tag}</span>)}</div>
      <div className="event-footer"><div><small>{event.organizer}</small><strong>{event.price}</strong></div><Button variant="secondary" onClick={onOpen}>{t.details}<Icon name="chevron" /></Button></div>
      <div className={`availability ${event.confirmed ? "" : "pending"}`}><i />{event.availability} · {event.popularity} de popularidad</div>
    </div>
  </article>;
}

function RelatedEventCard({ event }: { event: EventItem }) {
  const venue = venueFor(event.venueId);
  const eventPath = `/event/${event.id}?city=${encodeURIComponent(venue.city)}`;
  return <Link className="artist-event-card" to={eventPath}>
    <img className="artist-event-image" src={event.image} alt="" />
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
    <div className="artist-events-grid">{relatedEvents.slice(0, 6).map((relatedEvent) => <RelatedEventCard key={relatedEvent.id} event={relatedEvent} />)}</div>
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

function EntityRoute({ back, language, t }: { back: () => void; language: Language; t: typeof copy.es }) {
  const { slug } = useParams();
  const entity = slug ? relatedEntities[slug] : undefined;
  if (!entity) return <Navigate to="/" replace />;
  const entityEvents = relatedEventsByEntity(entity.id);
  return <main className="subpage artist-page">
    <div className="subpage-top"><button type="button" onClick={back}><Icon name="arrow" />{t.back}</button></div>
    <section className="artist-page-profile"><span className="kicker">{entityKindCopy[language][entity.kind]}</span><div className="artist-page-heading">{entity.image && <img src={entity.image} alt={entity.name} />}<div><h1>{entity.name}</h1><p>{entity.description}</p><ArtistActions key={entity.id} entity={entity} language={language} /></div></div></section>
    <RelatedEventsSection entity={entity} relatedEvents={entityEvents} title={entity.profileEventsTitle[language]} t={t} showCount={false} showProfileLink={false} />
  </main>;
}

function SectionTitle({ kicker, title, action, onAction }: { kicker: string; title: string; action?: string; onAction?: () => void }) {
  return <div className="section-title"><div><span>{kicker}</span><h2>{title}</h2></div>{action && <button onClick={onAction}>{action}<Icon name="chevron" /></button>}</div>;
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
  const endDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2] + 1));
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
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [event.image],
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

function Home({ selectedCity, saved, toggleSaved, openEvent, goFilters, searchQuery, language, t }: { selectedCity: City; saved: number[]; toggleSaved: (id: number) => void; openEvent: (id: number) => void; goFilters: () => void; searchQuery: string; language: Language; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const [category, setCategory] = useState("Todos");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredRef = useRef<HTMLDivElement>(null);
  const cityEvents = events.filter((event) => venueFor(event.venueId).city === selectedCity);
  const query = normalizeSearch(searchQuery.trim());
  const filtered = cityEvents.filter((event) => {
    const venue = venueFor(event.venueId);
    const matchesCategory = category === "Todos" || event.category === category;
    const matchesQuery = !query || normalizeSearch([event.title, event.category, event.description, event.organizer, venue.name, venue.address, ...event.tags].join(" ")).includes(query);
    return matchesCategory && matchesQuery;
  });
  const highlightedEvents = [...cityEvents.filter((event) => event.featured), ...cityEvents.filter((event) => !event.featured)].slice(0, 3);
  const updateFeaturedIndex = (container: HTMLDivElement) => {
    const cards = Array.from(container.children);
    if (!cards.length) return;
    const left = container.getBoundingClientRect().left;
    const index = cards.reduce((closest, card, current) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[closest].getBoundingClientRect().left - left) ? current : closest, 0);
    setFeaturedIndex(index);
  };
  const moveFeatured = (direction: -1 | 1) => {
    const container = featuredRef.current;
    if (!container) return;
    const cards = Array.from(container.children);
    if (!cards.length) return;
    const left = container.getBoundingClientRect().left;
    const current = cards.reduce((closest, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[closest].getBoundingClientRect().left - left) ? index : closest, 0);
    const target = cards[Math.max(0, Math.min(cards.length - 1, current + direction))];
    container.scrollBy({ left: target.getBoundingClientRect().left - left, behavior: "smooth" });
  };
  const recommendations = <section><SectionTitle kicker={`${labels.cityScope} ${selectedCity}`} title={t.recommended} action={t.all} onAction={() => document.getElementById("catalogue")?.scrollIntoView()} />{highlightedEvents.length > 1 && <div className="mobile-carousel-controls"><span aria-live="polite">{featuredIndex + 1} / {highlightedEvents.length}</span><div><button type="button" aria-label={labels.previousEvent} title={labels.previousEvent} disabled={featuredIndex === 0} onClick={() => moveFeatured(-1)}><Icon name="arrow" /></button><button type="button" aria-label={labels.nextEvent} title={labels.nextEvent} disabled={featuredIndex >= highlightedEvents.length - 1} onClick={() => moveFeatured(1)}><Icon name="chevron" /></button></div></div>}<div className="featured-grid" ref={featuredRef} onScroll={(event) => updateFeaturedIndex(event.currentTarget)}>{highlightedEvents.map((event) => <EventCard featured key={event.id} event={event} saved={saved.includes(event.id)} onSave={() => toggleSaved(event.id)} onOpen={() => openEvent(event.id)} t={t} />)}</div></section>;
  const discovery = <section className="discovery-strip"><div><Icon name="trending" /><span><small>{t.trending.replace("Madrid", selectedCity)}</small><strong>Ópera · Folk · Fútbol</strong></span></div><div><Icon name="location" /><span><small>{t.nearby}</small><strong>6 planes a menos de 5 km</strong></span></div><div><Icon name="star" /><span><small>{t.popular}</small><strong>Norma · 4,8</strong></span></div></section>;
  const catalogue = <section id="catalogue"><SectionTitle kicker={`${selectedCity.toLocaleUpperCase()} · ${filtered.length}`} title={query ? `${labels.searchResults}: ${searchQuery.trim()}` : t.all} /><div className="catalogue-toolbar"><div className="category-tabs">{["Todos", ...eventCategories].map((item) => <button className={category === item ? "active" : ""} data-cat={categoryKeys[item]} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><button className="filter-control" onClick={goFilters}><Icon name="filter" />{t.filters}</button></div>{filtered.length ? <div className="event-grid">{filtered.map((event) => <EventCard key={event.id} event={event} saved={saved.includes(event.id)} onSave={() => toggleSaved(event.id)} onOpen={() => openEvent(event.id)} t={t} />)}</div> : <p className="city-empty">{query ? labels.noSearchResults : t.noCityEvents}</p>}</section>;
  const isSearching = query.length > 0;
  return <main>
    {!isSearching && <section className="hero"><img src={cityImages[selectedCity]} alt={selectedCity} /><div className="hero-shade" /><div className="hero-copy"><div className="hero-meta"><span className="hero-brand-label"><Icon name="spark" />PLAN CERCA</span><div className="hero-city-group"><span className="hero-city-copy"><strong className="hero-city-name">{selectedCity}</strong><small className="hero-city-count">{cityEventCounts[selectedCity]} {labels.availableEvents}</small></span></div></div><h1>{t.hero}</h1><p>{t.heroText}</p></div></section>}
    <div className="home-content">
      {isSearching ? <>{catalogue}{recommendations}{discovery}</> : <>{recommendations}{discovery}{catalogue}</>}
    </div>
  </main>;
}

const normalizeCity = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const extraCitySuggestions = ["Cuenca", "Albacete", "Toledo", "Segovia", "Salamanca"];

function Filters({ selectedCity, setSelectedCity, back, language, t }: { selectedCity: City; setSelectedCity: (city: City) => void; back: () => void; language: Language; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const [selected, setSelected] = useState(["Música", "Ópera"]);
  const [cityInput, setCityInput] = useState<string>(selectedCity);
  const typedCity = cityInput.trim();
  const matchedCity = cities.find((city) => normalizeCity(city) === normalizeCity(typedCity));
  const hasEvents = !typedCity || (matchedCity !== undefined && cityEventCounts[matchedCity] > 0);
  const cityResultCount = matchedCity ? cityEventCounts[matchedCity] : 0;
  const suggestions = cities.filter((city) => city !== matchedCity && cityEventCounts[city] > 0);
  const pickCity = (city: City) => { setCityInput(city); setSelectedCity(city); };
  const showResults = () => { if (matchedCity && matchedCity !== selectedCity) setSelectedCity(matchedCity); back(); };
  const toggle = (value: string) => setSelected((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  return <main className="subpage"><div className="subpage-top"><button onClick={back}><Icon name="arrow" />{t.back}</button><button onClick={() => setSelected([])}>{t.clear}</button></div><div className="filter-shell"><span className="kicker">{t.search}</span><h1>{t.filters}</h1><section><h2>{t.city}</h2><label className="filter-city-search"><BrandMark /><input type="text" list="filter-city-list" value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder={labels.cityPlaceholder} aria-label={t.city} autoComplete="off" /></label><datalist id="filter-city-list">{[...cities, ...extraCitySuggestions].map((city) => <option key={city} value={city} />)}</datalist></section>{!hasEvents && <section className="city-empty-state" role="status"><h2>{labels.cityEmptyTitle.replace("{city}", typedCity)}</h2><p>{labels.cityEmptyText}</p><h3>{labels.citySuggestions}</h3><div className="option-grid">{suggestions.map((city) => <button key={city} type="button" onClick={() => pickCity(city)}>{city}<small>{cityEventCounts[city]} {labels.availableEvents}</small></button>)}</div></section>}<section><h2>{t.categories}</h2><div className="option-grid">{eventCategories.map((item) => <button className={selected.includes(item) ? "active" : ""} onClick={() => toggle(item)} key={item}>{item}{selected.includes(item) && <Icon name="check" />}</button>)}</div></section><section><h2>{t.when}</h2><div className="option-grid dates">{["Hoy", "Mañana", t.thisWeek, "Elegir fecha"].map((item) => <button key={item}>{item}</button>)}</div></section>{hasEvents && <Button onClick={showResults}>{t.results}{typedCity ? ` · ${cityResultCount}` : ""}</Button>}</div></main>;
}

function VenuesPage({ selectedCity, language, openVenue, t }: { selectedCity: City; language: Language; openVenue: (id: string) => void; t: typeof copy.es }) {
  const labels = interfaceText[language];
  const cityVenues = venues.filter((venue) => venue.city === selectedCity).sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
  return <main className="venue-directory"><div className="venue-directory-heading"><span className="kicker">{selectedCity}</span><h1>{labels.venueHeading} {selectedCity}</h1><p>{labels.venueIntro}</p></div>{cityVenues.length ? <div className="venue-directory-grid">{cityVenues.map((venue) => {
    const venueEvents = events.filter((event) => event.venueId === venue.id);
    return <article className="venue-directory-card" key={venue.id}><button className={`venue-directory-image ${venue.image ? "" : "venue-directory-image--placeholder"}`} onClick={() => openVenue(venue.id)} aria-label={venue.name}>{venue.image ? <img src={venue.image} alt={`Recinto: ${venue.name}`} /> : <BrandMark className="venue-placeholder-mark" />}</button><span className="venue-directory-kind" data-cat={venueCategoryKey(venue.kind.es)}><Icon name="location" />{venue.kind[language]}</span><h2><button className="venue-name-link" onClick={() => openVenue(venue.id)}>{venue.name}</button></h2><p>{venue.description[language]}</p><address>{venue.address}</address><div className="venue-directory-footer"><span>{venueEvents.length} {labels.eventCount}</span><Button variant="secondary" onClick={() => openVenue(venue.id)}>{labels.viewEvents}<Icon name="chevron" /></Button></div></article>;
  })}</div> : <p className="city-empty">{t.noCityEvents}</p>}</main>;
}

function upcomingEventsAtVenue(venueId: string, excludedEventId?: number): EventItem[] {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return events
    .filter((item) => item.venueId === venueId && item.id !== excludedEventId && item.confirmed && item.startDate && item.startDate >= todayKey)
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
}

function VenueRoute({ openEvent, goBack, language, t }: { openEvent: (id: number) => void; goBack: () => void; language: Language; t: typeof copy.es }) {
  const { id } = useParams();
  const venue = venues.find((item) => item.id === id);
  if (!venue) return <Navigate to="/venues" replace />;
  const upcoming = upcomingEventsAtVenue(venue.id).slice(0, 6);
  return <main className="detail-page venue-detail-page"><div className="detail-top"><button onClick={goBack}><Icon name="arrow" />{t.back}</button></div><section className={`detail-hero venue-detail-hero ${venue.image ? "" : "venue-detail-hero--placeholder"}`} data-cat={venueCategoryKey(venue.kind.es)}><div className="detail-intro venue-detail-copy"><span className="category">{venue.city} · {venue.kind[language]}</span><h1>{venue.name}</h1><p className="detail-lead">{venue.description[language]}</p><div className="detail-intro-facts venue-detail-address"><span><Icon name="location" />{venue.address}</span><a href={venue.mapsUrl} target="_blank" rel="noreferrer"><Icon name="location" />{t.map}<Icon name="chevron" /></a></div></div><div className="detail-gallery venue-detail-gallery">{venue.image ? <img className="gallery-main" src={venue.image} alt={`Recinto: ${venue.name}`} /> : <div className="venue-detail-placeholder" aria-hidden="true"><BrandMark className="venue-detail-placeholder-mark" /></div>}</div></section><section className="venue-upcoming"><div className="venue-upcoming-inner"><SectionTitle kicker={`${venue.city} · ${venue.name}`} title={t.venueEvents} />{upcoming.length ? <div className="venue-event-grid">{upcoming.map((event) => <EventCard key={event.id} event={event} saved={false} onSave={() => {}} onOpen={() => openEvent(event.id)} t={t} />)}</div> : <p className="venue-empty">{t.venueEmpty}</p>}</div></section></main>;
}

function Detail({ event, saved, toggleSaved, back, openEvent, openVenue, language, t }: { event: EventItem; saved: boolean; toggleSaved: () => void; back: () => void; openEvent: (id: number) => void; openVenue: (id: string) => void; language: Language; t: typeof copy.es }) {
  const venue = venueFor(event.venueId);
  const structuredEvent = eventStructuredData(event, venue);
  const ended = eventHasEnded(event);
  const actionLabels = eventActionCopy[language];
  const [copyConfirmed, setCopyConfirmed] = useState(false);
  const [relatedIndex, setRelatedIndex] = useState(0);
  const relatedRef = useRef<HTMLDivElement>(null);
  const calendarTiming = calendarTimingFor(event);
  const calendarUrl = calendarTiming ? googleCalendarUrl(event, venue, calendarTiming) : null;
  const entity = event.relatedEntityId ? relatedEntities[event.relatedEntityId] : undefined;
  const entityEvents = event.relatedEntityId ? relatedEventsByEntity(event.relatedEntityId, event.id) : [];
  const venueLinkLabels = venueLinkCopy[language];
  const venueEvents = upcomingEventsAtVenue(event.venueId, event.id).slice(0, 6);
  const related = events.filter((item) => item.category === event.category && item.id !== event.id).slice(0, 3);
  const updateRelatedIndex = (container: HTMLDivElement) => {
    const cards = Array.from(container.children);
    if (!cards.length) return;
    const left = container.getBoundingClientRect().left;
    const index = cards.reduce((closest, card, current) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[closest].getBoundingClientRect().left - left) ? current : closest, 0);
    setRelatedIndex(index);
  };
  const moveRelated = (direction: -1 | 1) => {
    const container = relatedRef.current;
    if (!container) return;
    const cards = Array.from(container.children);
    if (!cards.length) return;
    const left = container.getBoundingClientRect().left;
    const current = cards.reduce((closest, card, index) => Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[closest].getBoundingClientRect().left - left) ? index : closest, 0);
    const target = cards[Math.max(0, Math.min(cards.length - 1, current + direction))];
    container.scrollBy({ left: target.getBoundingClientRect().left - left, behavior: "smooth" });
  };
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
  return <main className="detail-page">{structuredEvent && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredEvent).replace(/</g, "\\u003c") }} />}<div className="detail-top detail-top--event"><button onClick={back}><Icon name="arrow" /><span>{t.back}</span></button><div className="detail-actions"><DetailActionButton icon="share" label={actionLabels.share} onClick={() => { void shareEvent(); }} /><DetailActionButton icon={saved ? "heart" : "bookmark"} label={saved ? t.savedLabel : t.save} onClick={toggleSaved} active={saved} /><DetailActionButton icon={copyConfirmed ? "check" : "copy"} label={copyConfirmed ? actionLabels.copied : actionLabels.copyLink} onClick={() => { void copyEventLink(); }} /><CalendarAction labels={actionLabels} url={calendarUrl} onDownload={() => { if (calendarTiming) downloadEventCalendar(event, venue, calendarTiming); }} /></div></div>
    <section className="detail-hero" data-cat={categoryKeys[event.category]}><div className="detail-gallery"><img className="gallery-main" src={event.image} alt={`Imagen principal de ${event.title}`} /></div><div className="detail-intro"><span className="category">{event.category}</span><h1>{event.title}</h1><div className="detail-intro-facts"><span><Icon name="calendar" />{event.date} · {event.time}</span><span><Icon name="location" />{venue.name} · {venue.city}</span><span><Icon name="time" />{event.duration}</span></div><div className="detail-social"><span><Icon name="star" filled />{event.rating.toFixed(1)} · {event.popularity}</span><span>{event.tags.join(" · ")}</span></div><p className="detail-lead">{event.description}</p></div></section>
    <div className="detail-content"><div className="detail-main">
      <section><h2>{t.description}</h2><p>{event.fullDescription}</p><p>{event.description}</p></section>
      {entity && <section className="artist-profile"><h2>{entity.aboutTitle[language]}</h2><Link className="artist-profile-main" to={`/entity/${entity.id}`}>{entity.image && <img src={entity.image} alt="" />}<div className="artist-profile-copy"><h3>{entity.name}<span className="artist-profile-cta">{t.viewEntity}<Icon name="chevron" /></span></h3><p>{entity.description}</p></div></Link>{entity.links.length > 0 && <div className="artist-profile-links">{entity.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label[language]}</a>)}</div>}</section>}
      <section><h2>{t.practical}</h2><div className="info-grid"><Info icon="calendar" label={t.date} value={`${event.date} · ${event.time}`} /><Info icon="time" label={t.duration} value={event.duration} /><Info icon="location" label={t.location} value={venue.address} /><Info icon="profile" label={t.organizer} value={event.organizer} /></div></section>
      <section><h2>{t.map}</h2><div className="map-card"><div className="map-lines" aria-hidden="true"><i /><i /><i /><i /><span><Icon name="location" /></span></div><div><strong>{venue.name}</strong><p>{venue.address} · {venue.city}</p><a href={venue.mapsUrl} target="_blank" rel="noreferrer">{t.map}<Icon name="chevron" /></a></div></div></section>
    </div><aside className="purchase-card"><span className="kicker">{t.availability}</span><div className="stock"><i />{event.availability}</div>{ended ? <><h2>{t.eventEnded}</h2><p>{t.eventEnded}</p></> : <><h2>{event.price}</h2><p>{event.confirmed ? t.confirmed : t.pending}</p><a className="button button--primary" href={event.ticketUrl} target="_blank" rel="noreferrer"><Icon name="ticket" />{t.buy}</a><small><Icon name="check" />{t.external}</small></>}<SaveButton active={saved} onClick={toggleSaved} t={t} /></aside></div>
    <section className="venue-overview"><div className={`venue-info-card ${venue.image ? "" : "venue-info-card--text-only"}`}>{venue.image && <img className="venue-about-image" src={venue.image} alt={`Recinto: ${venue.name}`} />}<div className="venue-about-copy"><span className="kicker">{t.venueAbout}</span><span className="venue-kind"><BrandMark className="venue-kind-mark" />{venue.city} · {venue.kind[language]}</span><h2><button className="venue-name-link" onClick={() => openVenue(venue.id)}>{venue.name}</button></h2><p>{venue.description[language]}</p>{(venue.websiteUrl || venue.programmeUrl) && <div className="venue-info-footer">{venue.websiteUrl && <a href={venue.websiteUrl} target="_blank" rel="noreferrer">{venueLinkLabels.website}<Icon name="chevron" /></a>}{venue.programmeUrl && venue.programmeLabel && <a href={venue.programmeUrl} target="_blank" rel="noreferrer">{venue.programmeLabel[language]}<Icon name="chevron" /></a>}</div>}</div></div></section>
    {entity && <RelatedEventsSection entity={entity} relatedEvents={entityEvents} title={entity.relatedEventsTitle[language]} t={t} />}
    <section className="venue-upcoming"><div className="venue-upcoming-inner"><SectionTitle kicker={`${venue.city} · ${venue.name}`} title={t.venueEvents} />{venueEvents.length > 0 ? <div className="venue-event-grid">{venueEvents.map((item) => <EventCard key={item.id} event={item} saved={false} onSave={() => {}} onOpen={() => openEvent(item.id)} t={t} />)}</div> : <p className="venue-empty">{t.venueEmpty}</p>}</div></section>
    {related.length > 0 && <section className="related"><SectionTitle kicker={event.category} title={t.related} />{related.length > 1 && <div className="mobile-carousel-controls"><span aria-live="polite">{relatedIndex + 1} / {related.length}</span><div><button type="button" aria-label={interfaceText[language].previousEvent} title={interfaceText[language].previousEvent} disabled={relatedIndex === 0} onClick={() => moveRelated(-1)}><Icon name="arrow" /></button><button type="button" aria-label={interfaceText[language].nextEvent} title={interfaceText[language].nextEvent} disabled={relatedIndex >= related.length - 1} onClick={() => moveRelated(1)}><Icon name="chevron" /></button></div></div>}<div className="related-grid" ref={relatedRef} onScroll={(event) => updateRelatedIndex(event.currentTarget)}>{related.map((item) => <EventCard key={item.id} event={item} saved={false} onSave={() => {}} onOpen={() => openEvent(item.id)} t={t} />)}</div></section>}
  </main>;
}

function Info({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <div className="info-item"><span><Icon name={icon} /></span><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function Saved({ saved, lists, createList, toggleSaved, openEvent, explore, title, t }: { saved: number[]; lists: string[]; createList: () => void; toggleSaved: (id: number) => void; openEvent: (id: number) => void; explore: () => void; title: string; t: typeof copy.es }) {
  const savedEvents = events.filter((event) => saved.includes(event.id));
  return <main className="subpage saved-page"><span className="kicker">{t.yourLists}</span><div className="saved-heading"><div><h1>{title}</h1><p>{t.mail}</p></div><Button onClick={createList}>+ {t.createList}</Button></div><div className="list-tabs">{lists.map((list, index) => <button className={index === 0 ? "active" : ""} key={list}>{list}<span>{index === 0 ? saved.length : 0}</span></button>)}</div>{savedEvents.length ? <div className="event-grid">{savedEvents.map((event) => <EventCard key={event.id} event={event} saved onSave={() => toggleSaved(event.id)} onOpen={() => openEvent(event.id)} t={t} />)}</div> : <div className="empty"><Icon name="heart" /><h2>{title}</h2><Button onClick={explore}>{t.discover}</Button></div>}</main>;
}

function EventRoute({ saved, toggleSaved, goBack, openEvent, openVenue, language, t }: { saved: number[]; toggleSaved: (id: number) => void; goBack: () => void; openEvent: (id: number) => void; openVenue: (id: string) => void; language: Language; t: typeof copy.es }) {
  const { id } = useParams();
  const event = events.find((item) => item.id === Number(id));
  if (!event) return <Navigate to="/" replace />;
  return <Detail event={event} saved={saved.includes(event.id)} toggleSaved={() => toggleSaved(event.id)} back={goBack} openEvent={openEvent} openVenue={openVenue} language={language} t={t} />;
}

function SiteFooter() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!aboutOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAboutOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aboutOpen]);
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <div><strong>Plan Cerca</strong><p>Descubre conciertos, teatro, exposiciones, deporte y eventos culturales cerca de ti.</p><p>Proyecto académico desarrollado para la asignatura de Interacción Persona-Ordenador (HCI).</p></div>
      <div className="site-footer-meta"><button type="button" className="site-footer-link" onClick={() => setAboutOpen(true)}>Acerca de</button><small>© 2026 Plan Cerca</small></div>
    </div>
    {aboutOpen && <div className="about-backdrop" onClick={() => setAboutOpen(false)}><div className="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={(e) => e.stopPropagation()}>
      <h2 id="about-title">Acerca de Plan Cerca</h2>
      <p>Plan Cerca es una aplicación web desarrollada como proyecto académico para la asignatura de Interacción Persona-Ordenador (HCI).</p>
      <p>Su objetivo es facilitar el descubrimiento de eventos culturales, deportivos y de ocio mediante una experiencia de usuario sencilla, accesible y centrada en el usuario.</p>
      <p>La aplicación ha sido desarrollada utilizando React, TypeScript, React Router y Vercel, aplicando principios de usabilidad, accesibilidad y diseño responsive.</p>
      <button ref={closeRef} type="button" className="button button--primary" onClick={() => setAboutOpen(false)}>Cerrar</button>
    </div></div>}
  </footer>;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCity, selectCity } = usePreferredCity();
  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const pathname = location.pathname;
  const isEntityPath = pathname.startsWith("/entity/") || pathname.startsWith("/artist/");
  const page: Page = pathname === "/" ? "home" : pathname === "/search" ? "search" : pathname === "/favorites" ? "favorites" : pathname === "/venues" ? "venues" : pathname.startsWith("/venues/") ? "venue-detail" : pathname.startsWith("/event/") ? "detail" : isEntityPath ? "entity" : "home";
  const [language, setLanguage] = useState<Language>("es");
  const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "");
  const [saved, setSaved] = useState([1, 8]);
  const [lists, setLists] = useState(["Favoritos", "Con amigos"]);
  const t = copy[language];
  const event = useMemo(() => events.find((item) => pathname === `/event/${item.id}`), [pathname]);
  const activeVenue = useMemo(() => venues.find((item) => pathname === `/venues/${item.id}`), [pathname]);
  const activeEntity = useMemo(() => {
    const prefix = pathname.startsWith("/entity/") ? "/entity/" : "/artist/";
    return isEntityPath ? relatedEntities[pathname.slice(prefix.length)] : undefined;
  }, [isEntityPath, pathname]);
  useEffect(() => {
    if (page === "home") document.title = `Plan Cerca · ${selectedCity}`;
    else if (page === "detail" && event) document.title = `${event.title} · Plan Cerca`;
    else if (page === "venue-detail" && activeVenue) document.title = `${activeVenue.name} · Plan Cerca`;
    else if (page === "entity" && activeEntity) document.title = `${activeEntity.name} · Plan Cerca`;
    else if (page === "venues") document.title = `${interfaceText[language].venues} · ${selectedCity} · Plan Cerca`;
    else if (page === "favorites") document.title = `${interfaceText[language].favourites} · Plan Cerca`;
    else document.title = `${t.search} · Plan Cerca`;
  }, [activeEntity, activeVenue, event, language, page, selectedCity, t.search]);
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
  const setSelectedCity = selectCity;
  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);
    navigateWithCity(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };
  const goToEvents = () => { setSearchQuery(""); navigateWithCity("/"); };
  const openEvent = (id: number) => navigateWithCity(`/event/${id}`);
  const openVenue = (id: string) => navigateWithCity(`/venues/${id}`);
   const toggleSaved = (id: number) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const goBack = () => {
    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) navigate(-1);
    else navigateWithCity("/", selectedCity);
  };
  const homePage = <Home selectedCity={selectedCity} saved={saved} toggleSaved={toggleSaved} openEvent={openEvent} goFilters={() => navigateWithCity("/search?filters=1")} searchQuery={searchQuery} language={language} t={t} />;
  const searchParams = new URLSearchParams(location.search);
  const showFilters = searchParams.has("filters") || !searchParams.has("q");
  const createList = () => { const name = window.prompt(t.listPrompt); if (name?.trim()) setLists((current) => [...current, name.trim()]); };
  return <div className="app-shell"><CityOnboardingDialog /><Nav page={page} navigate={(path) => path === "/" ? goToEvents() : navigateWithCity(path)} language={language} setLanguage={setLanguage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={submitSearch} t={t} /><div className="main-shell">
    <Routes>
      <Route path="/" element={homePage} />
      <Route path="/search" element={showFilters ? <Filters selectedCity={selectedCity} setSelectedCity={setSelectedCity} back={goBack} language={language} t={t} /> : homePage} />
      <Route path="/favorites" element={<Saved saved={saved} lists={lists} createList={createList} toggleSaved={toggleSaved} openEvent={openEvent} explore={goToEvents} title={interfaceText[language].favourites} t={t} />} />
      <Route path="/venues" element={<VenuesPage selectedCity={selectedCity} language={language} openVenue={openVenue} t={t} />} />
      <Route path="/venues/:id" element={<VenueRoute openEvent={openEvent} goBack={goBack} language={language} t={t} />} />
      <Route path="/event/:id" element={<EventRoute saved={saved} toggleSaved={toggleSaved} goBack={goBack} openEvent={openEvent} openVenue={openVenue} language={language} t={t} />} />
      <Route path="/entity/:slug" element={<EntityRoute back={goBack} language={language} t={t} />} />
      <Route path="/artist/:slug" element={<EntityRoute back={goBack} language={language} t={t} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <SiteFooter />
  </div></div>;
}
