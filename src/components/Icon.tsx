import type { ReactNode } from "react";

export type IconName = "arrow" | "bell" | "bookmark" | "calendar" | "check" | "chevron" | "close" | "copy" | "download" | "filter" | "frame" | "globe" | "heart" | "home" | "instagram" | "location" | "mask" | "mic" | "museum" | "music" | "play" | "profile" | "search" | "share" | "spark" | "spotify" | "star" | "ticket" | "time" | "trending" | "trophy" | "wind";

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
  close: <path d="M6 6l12 12M18 6 6 18" />,
  // Reserva de imagen por categoría
  music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" /></>,
  wind: <path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" />,
  trophy: <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0ZM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />,
  mask: <><path d="M4 4h16v7a8 8 0 0 1-16 0Z" /><path d="M8 9h2M14 9h2M9 14c1.5 1.3 4.5 1.3 6 0" /></>,
  frame: <><rect x="3" y="4" width="18" height="14" rx="1" /><path d="m7 14 3-4 3 3 2-2 2 3M9 21h6" /></>,
  museum: <path d="m3 9 9-6 9 6M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 18h18M3 21h18" />,
};

export default function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  return <svg className="icon" aria-hidden="true" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}
