import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Language } from "../data/language";
import type { Avatar } from "../data/profile";
import Icon from "./Icon";

export const profileMenuCopy: Record<Language, { button: string; profile: string; favourites: (n: number) => string; yourData: string }> = {
  es: { button: "Tu perfil", profile: "Tu perfil", favourites: (n) => `Favoritos (${n})`, yourData: "Tus datos" },
  en: { button: "Your profile", profile: "Your profile", favourites: (n) => `Favourites (${n})`, yourData: "Your data" },
  fr: { button: "Votre profil", profile: "Votre profil", favourites: (n) => `Favoris (${n})`, yourData: "Vos données" },
};

/**
 * Avatar button with a small menu (disclosure pattern): profile, favourites and "your data".
 * Esc or a click outside closes it and focus returns to the button.
 */
export default function ProfileMenu({ avatar, language, savedCount, profilePath, favouritesPath, active }: {
  avatar: Avatar; language: Language; savedCount: number; profilePath: string; favouritesPath: string; active: boolean;
}) {
  const text = profileMenuCopy[language];
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); button.current?.focus(); } };
    const onClick = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  return <div ref={root} className="profile-menu">
    <button ref={button} type="button" className={`guest-profile ${active ? "active" : ""}`} aria-expanded={open} aria-controls="profile-menu-list" onClick={() => setOpen((value) => !value)}>
      <span><Icon name={avatar} /></span><strong>{text.button}</strong>
    </button>
    {open && <ul id="profile-menu-list" className="profile-menu-list">
      <li><Link to={profilePath} aria-current={active ? "page" : undefined}><Icon name="profile" />{text.profile}</Link></li>
      <li><Link to={favouritesPath}><Icon name="heart" />{text.favourites(savedCount)}</Link></li>
      <li><Link to="/tus-datos"><Icon name="download" />{text.yourData}</Link></li>
    </ul>}
  </div>;
}
