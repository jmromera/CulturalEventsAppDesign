import { useMemo, useState, type ReactNode } from "react";
import { events, imgs } from "./data/events";
import { copy } from "./data/translations";
import type { EventItem } from "./types/Event";

type Page = "home" | "filters" | "detail" | "saved" | "about";
type Language = "es" | "en" | "fr";
type IconName = "arrow" | "bookmark" | "calendar" | "check" | "chevron" | "filter" | "heart" | "home" | "location" | "profile" | "search" | "share" | "spark" | "star" | "ticket" | "time" | "trending";

const icons: Record<IconName, ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  bookmark: <path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4Z" />,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></>,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  filter: <path d="M4 5h16M7 12h10M10 19h4" />, arrow: <path d="m15 18-6-6 6-6" />, chevron: <path d="m9 18 6-6-6-6" />,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5a5.5 5.5 0 0 0 1-8.9Z" />,
  spark: <path d="m12 2 1.4 5.6L19 9l-5.6 1.4L12 16l-1.4-5.6L5 9l5.6-1.4ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" />,
  share: <><circle cx="18" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="19" r="2" /><path d="m8 11 8-5M8 13l8 5" /></>,
  ticket: <path d="M3 8a2 2 0 0 0 0 4v5h18v-5a2 2 0 0 0 0-4V3H3Z" />,
  check: <path d="m5 12 4 4L19 6" />, star: <path d="m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3-5.9 3 1.1-6.5L2.5 9 9 8Z" />,
  time: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, trending: <path d="m3 17 6-6 4 4 8-9M15 6h6v6" />,
};

function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  return <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

function LanguageSelect({ value, onChange, light = false }: { value: Language; onChange: (language: Language) => void; light?: boolean }) {
  return <label className={`language-select ${light ? "light" : ""}`}><span className="sr-only">Idioma</span><select value={value} onChange={(e) => onChange(e.target.value as Language)} aria-label="Seleccionar idioma"><option value="es">Español</option><option value="en">English</option><option value="fr">Français</option></select><Icon name="chevron" /></label>;
}

function Logo({ goHome }: { goHome: () => void }) {
  return <button className="logo" onClick={goHome} aria-label="Plan Cerca, inicio"><span>Plan</span><span>Cerca</span></button>;
}

function Button({ children, onClick, variant = "primary" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={`button button--${variant}`} onClick={onClick}>{children}</button>;
}

function Nav({ page, navigate, language, setLanguage, t }: { page: Page; navigate: (page: Page) => void; language: Language; setLanguage: (language: Language) => void; t: typeof copy.es }) {
  const item = (target: Page, icon: IconName, label: string) => <button className={`nav-item ${page === target ? "active" : ""}`} onClick={() => navigate(target)}><Icon name={icon} /><span>{label}</span></button>;
  return <aside className="sidebar"><Logo goHome={() => navigate("home")} /><nav aria-label="Navegación principal">{item("home", "home", t.discover)}{item("filters", "search", t.search)}{item("saved", "heart", t.saved)}</nav><div className="sidebar-bottom"><LanguageSelect value={language} onChange={setLanguage} />{item("about", "spark", t.about)}<div className="profile"><span>LM</span><div><strong>Lucía Martín</strong><small>Madrid · Centro</small></div></div></div></aside>;
}

function MobileChrome({ page, navigate, language, setLanguage, t }: { page: Page; navigate: (page: Page) => void; language: Language; setLanguage: (language: Language) => void; t: typeof copy.es }) {
  return <><header className="mobile-header"><Logo goHome={() => navigate("home")} /><LanguageSelect value={language} onChange={setLanguage} light /></header><nav className="mobile-nav" aria-label="Navegación móvil">{[["home", "home", t.discover], ["filters", "search", t.search], ["saved", "heart", t.saved], ["about", "profile", t.about]].map(([target, icon, label]) => <button className={page === target ? "active" : ""} onClick={() => navigate(target as Page)} key={target}><Icon name={icon as IconName} /><span>{label}</span></button>)}</nav></>;
}

function SaveButton({ active, onClick, t, compact = false }: { active: boolean; onClick: () => void; t: typeof copy.es; compact?: boolean }) {
  return <button className={`save-button ${active ? "active" : ""} ${compact ? "compact" : ""}`} onClick={onClick} aria-pressed={active}><Icon name={active ? "heart" : "bookmark"} filled={active} /><span>{active ? t.savedLabel : t.save}</span></button>;
}

function EventCard({ event, saved, onSave, onOpen, t, featured = false }: { event: EventItem; saved: boolean; onSave: () => void; onOpen: () => void; t: typeof copy.es; featured?: boolean }) {
  return <article className={`event-card ${featured ? "featured" : ""}`}>
    <button className="event-image" onClick={onOpen} aria-label={`${t.details}: ${event.title}`}><img src={event.image} alt={`Imagen promocional de ${event.title}`} /><span className="category">{event.category}</span><span className="rating"><Icon name="star" filled />{event.rating.toFixed(1)}</span></button>
    <div className="event-body"><div className="event-title-row"><button className="event-title" onClick={onOpen}>{event.title}</button><SaveButton active={saved} onClick={onSave} t={t} compact /></div>
      <p className="event-description">{event.description}</p>
      <div className="event-facts"><span><Icon name="calendar" />{event.date} · {event.time}</span><span><Icon name="location" />{event.venue} · {event.distance}</span><span><Icon name="time" />{event.duration}</span></div>
      <div className="tag-row">{event.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="event-footer"><div><small>{event.organizer}</small><strong>{event.price}</strong></div><Button variant="secondary" onClick={onOpen}>{t.details}<Icon name="chevron" /></Button></div>
      <div className={`availability ${event.confirmed ? "" : "pending"}`}><i />{event.availability} · {event.popularity} de popularidad</div>
    </div>
  </article>;
}

function SectionTitle({ kicker, title, action, onAction }: { kicker: string; title: string; action?: string; onAction?: () => void }) {
  return <div className="section-title"><div><span>{kicker}</span><h2>{title}</h2></div>{action && <button onClick={onAction}>{action}<Icon name="chevron" /></button>}</div>;
}

function Home({ saved, toggleSaved, openEvent, goFilters, t }: { saved: number[]; toggleSaved: (id: number) => void; openEvent: (id: number) => void; goFilters: () => void; t: typeof copy.es }) {
  const [category, setCategory] = useState("Todos");
  const filtered = category === "Todos" ? events : events.filter((event) => event.category === category);
  return <main>
    <section className="hero"><img src={imgs.city} alt="Vista aérea de la Gran Vía de Madrid" /><div className="hero-shade" /><div className="hero-copy"><span><Icon name="spark" />{t.live}</span><h1>{t.hero}</h1><p>{t.heroText}</p><button className="hero-search" onClick={goFilters}><Icon name="search" /><span>{t.searchPlaceholder}</span><kbd>⌘ K</kbd></button></div><div className="hero-note"><Icon name="location" /><span><small>Tu ubicación</small><strong>Madrid · Centro</strong></span></div></section>
    <div className="home-content">
      <section><SectionTitle kicker={t.recommendedSub} title={t.recommended} action={t.all} onAction={() => document.getElementById("catalogue")?.scrollIntoView()} /><div className="featured-grid">{events.slice(0, 3).map((event) => <EventCard featured key={event.id} event={event} saved={saved.includes(event.id)} onSave={() => toggleSaved(event.id)} onOpen={() => openEvent(event.id)} t={t} />)}</div></section>
      <section className="discovery-strip"><div><Icon name="trending" /><span><small>{t.trending}</small><strong>Ópera · Folk · Fútbol</strong></span></div><div><Icon name="location" /><span><small>{t.nearby}</small><strong>6 planes a menos de 5 km</strong></span></div><div><Icon name="star" /><span><small>{t.popular}</small><strong>Norma · 4,8</strong></span></div></section>
      <section id="catalogue"><SectionTitle kicker="MADRID · 2027" title={t.all} /><div className="catalogue-toolbar"><div className="category-tabs">{["Todos", "Música", "Ópera", "Danza", "Deportes"].map((item) => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><button className="filter-control" onClick={goFilters}><Icon name="filter" />{t.filters}</button></div><div className="event-grid">{filtered.map((event) => <EventCard key={event.id} event={event} saved={saved.includes(event.id)} onSave={() => toggleSaved(event.id)} onOpen={() => openEvent(event.id)} t={t} />)}</div></section>
    </div>
  </main>;
}

function Filters({ back, t }: { back: () => void; t: typeof copy.es }) {
  const [selected, setSelected] = useState(["Música", "Ópera"]);
  const toggle = (value: string) => setSelected((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  return <main className="subpage"><div className="subpage-top"><button onClick={back}><Icon name="arrow" />{t.back}</button><button onClick={() => setSelected([])}>{t.clear}</button></div><div className="filter-shell"><span className="kicker">{t.search}</span><h1>{t.filters}</h1><section><h2>{t.categories}</h2><div className="option-grid">{["Música", "Ópera", "Danza", "Deportes", "Teatro", "Arte"].map((item) => <button className={selected.includes(item) ? "active" : ""} onClick={() => toggle(item)} key={item}>{item}{selected.includes(item) && <Icon name="check" />}</button>)}</div></section><section><h2>{t.when}</h2><div className="option-grid dates">{["Hoy", "Mañana", t.thisWeek, "Elegir fecha"].map((item) => <button key={item}>{item}</button>)}</div></section><Button onClick={back}>{t.results} · 15</Button></div></main>;
}

function Detail({ event, saved, toggleSaved, back, openEvent, t }: { event: EventItem; saved: boolean; toggleSaved: () => void; back: () => void; openEvent: (id: number) => void; t: typeof copy.es }) {
  const related = events.filter((item) => item.category === event.category && item.id !== event.id).slice(0, 3);
  return <main className="detail-page"><div className="detail-top"><button onClick={back}><Icon name="arrow" />{t.back}</button><div><button aria-label="Compartir"><Icon name="share" /></button><SaveButton active={saved} onClick={toggleSaved} t={t} /></div></div>
    <section className="detail-gallery"><img className="gallery-main" src={event.image} alt={`Imagen principal de ${event.title}`} /><img src={imgs.city} alt="Madrid, ciudad del evento" /><div className="gallery-card"><span>{t.gallery}</span><strong>2</strong><small>imágenes</small></div></section>
    <div className="detail-content"><div className="detail-main"><span className="category">{event.category}</span><h1>{event.title}</h1><div className="detail-social"><span><Icon name="star" filled />{event.rating.toFixed(1)} · {event.popularity}</span><span>{event.tags.join(" · ")}</span></div><p className="detail-lead">{event.description}</p>
      <section><h2>{t.description}</h2><p>{event.fullDescription}</p><p>{event.description}</p></section>
      <section><h2>{t.practical}</h2><div className="info-grid"><Info icon="calendar" label={t.date} value={`${event.date} · ${event.time}`} /><Info icon="time" label={t.duration} value={event.duration} /><Info icon="location" label={t.location} value={event.address} /><Info icon="profile" label={t.organizer} value={event.organizer} /></div></section>
      <section><h2>{t.map}</h2><div className="map-card"><div className="map-lines" aria-hidden="true"><i /><i /><i /><i /><span><Icon name="location" /></span></div><div><strong>{event.venue}</strong><p>{event.address} · {event.distance}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`} target="_blank" rel="noreferrer">{t.map}<Icon name="chevron" /></a></div></div></section>
    </div><aside className="purchase-card"><span className="kicker">{t.availability}</span><div className="stock"><i />{event.availability}</div><h2>{event.price}</h2><p>{event.confirmed ? t.confirmed : t.pending}</p><a className="button button--primary" href={event.ticketUrl} target="_blank" rel="noreferrer"><Icon name="ticket" />{t.buy}</a><small><Icon name="check" />{t.external}</small><SaveButton active={saved} onClick={toggleSaved} t={t} /></aside></div>
    {related.length > 0 && <section className="related"><SectionTitle kicker={event.category} title={t.related} /><div className="related-grid">{related.map((item) => <EventCard key={item.id} event={item} saved={false} onSave={() => {}} onOpen={() => openEvent(item.id)} t={t} />)}</div></section>}
  </main>;
}

function Info({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return <div className="info-item"><span><Icon name={icon} /></span><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function Saved({ saved, lists, createList, toggleSaved, openEvent, explore, t }: { saved: number[]; lists: string[]; createList: () => void; toggleSaved: (id: number) => void; openEvent: (id: number) => void; explore: () => void; t: typeof copy.es }) {
  const savedEvents = events.filter((event) => saved.includes(event.id));
  return <main className="subpage saved-page"><span className="kicker">{t.yourLists}</span><div className="saved-heading"><div><h1>{t.saved}</h1><p>{t.mail}</p></div><Button onClick={createList}>+ {t.createList}</Button></div><div className="list-tabs">{lists.map((list, index) => <button className={index === 0 ? "active" : ""} key={list}>{list}<span>{index === 0 ? saved.length : 0}</span></button>)}</div>{savedEvents.length ? <div className="event-grid">{savedEvents.map((event) => <EventCard key={event.id} event={event} saved onSave={() => toggleSaved(event.id)} onOpen={() => openEvent(event.id)} t={t} />)}</div> : <div className="empty"><Icon name="heart" /><h2>{t.saved}</h2><Button onClick={explore}>{t.discover}</Button></div>}</main>;
}

function About() {
  return <main className="subpage about-page"><span className="kicker">PLAN CERCA · PRODUCTO DIGITAL</span><h1>Descubrir Madrid<br />con otra mirada.</h1><p className="about-lead">Una plataforma cultural y turística para encontrar, comprender y valorar cada plan antes de comprar.</p><div className="about-grid"><section><span>01</span><h2>Curaduría</h2><p>Eventos reales, fuentes oficiales y contexto suficiente para decidir sin saltar entre plataformas.</p></section><section><span>02</span><h2>Accesibilidad</h2><p>Contraste AA, foco visible, navegación por teclado, etiquetas claras y áreas táctiles amplias.</p></section><section><span>03</span><h2>Confianza</h2><p>Las fechas pendientes se identifican con claridad y la compra final siempre se realiza con el proveedor oficial.</p></section></div></main>;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [language, setLanguage] = useState<Language>("es");
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved] = useState([1, 8]);
  const [lists, setLists] = useState(["Favoritos", "Con amigos"]);
  const t = copy[language];
  const event = useMemo(() => events.find((item) => item.id === selectedId) ?? events[0], [selectedId]);
  const navigate = (target: Page) => { setPage(target); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openEvent = (id: number) => { setSelectedId(id); navigate("detail"); };
  const toggleSaved = (id: number) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const createList = () => { const name = window.prompt(t.listPrompt); if (name?.trim()) setLists((current) => [...current, name.trim()]); };
  return <div className="app-shell"><Nav page={page} navigate={navigate} language={language} setLanguage={setLanguage} t={t} /><MobileChrome page={page} navigate={navigate} language={language} setLanguage={setLanguage} t={t} /><div className="main-shell">
    {page === "home" && <Home saved={saved} toggleSaved={toggleSaved} openEvent={openEvent} goFilters={() => navigate("filters")} t={t} />}
    {page === "filters" && <Filters back={() => navigate("home")} t={t} />}
    {page === "detail" && <Detail event={event} saved={saved.includes(event.id)} toggleSaved={() => toggleSaved(event.id)} back={() => navigate("home")} openEvent={openEvent} t={t} />}
    {page === "saved" && <Saved saved={saved} lists={lists} createList={createList} toggleSaved={toggleSaved} openEvent={openEvent} explore={() => navigate("home")} t={t} />}
    {page === "about" && <About />}
  </div></div>;
}
