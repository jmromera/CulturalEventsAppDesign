import { useState } from "react";
import { Link } from "react-router-dom";
import { usePreferredCity } from "../context/PreferredCityContext";
import type { Language } from "../data/language";
import { AVATARS, type Avatar, type Profile } from "../data/profile";
import { cities, eventCategories, type City, type EventCategory } from "../types/Event";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";

const languageNames: Record<Language, string> = { es: "Español", en: "English", fr: "Français" };

export const profileCopy: Record<Language, {
  title: string; intro: string; avatar: string; avatarNames: Record<Avatar, string>; city: string; cityHint: string; categories: string; categoriesHint: string;
  language: string; saved: string; privacy: string; yourData: string; navLabel: string;
}> = {
  es: {
    title: "Tu perfil", intro: "Ajusta Plan Cerca a tus gustos. No hace falta cuenta: todo se guarda solo en este navegador.",
    avatar: "Avatar", avatarNames: { profile: "Persona", music: "Nota musical", mic: "Micrófono", mask: "Máscaras de teatro", trophy: "Trofeo", frame: "Cuadro", museum: "Museo", spark: "Destello" },
    city: "Ciudad por defecto", cityHint: "Es la ciudad que verás al abrir la web.",
    categories: "Categorías favoritas", categoriesHint: "«Recomendados para ti» mostrará solo estas categorías, alternándolas. Sin ninguna marcada, se recomiendan sobre todo conciertos.",
    language: "Idioma", saved: "Cambios guardados en este navegador.",
    privacy: "No pedimos nombre, correo ni foto: el avatar es un dibujo de la propia web. Puedes descargar o borrar estos datos cuando quieras en", yourData: "Tus datos", navLabel: "Tu perfil",
  },
  en: {
    title: "Your profile", intro: "Tailor Plan Cerca to your taste. No account needed: everything is stored only in this browser.",
    avatar: "Avatar", avatarNames: { profile: "Person", music: "Musical note", mic: "Microphone", mask: "Theatre masks", trophy: "Trophy", frame: "Painting", museum: "Museum", spark: "Sparkle" },
    city: "Default city", cityHint: "The city you will see when you open the site.",
    categories: "Favourite categories", categoriesHint: "“Recommended for you” will show only these categories, taking turns. With none selected, it recommends mostly concerts.",
    language: "Language", saved: "Changes saved in this browser.",
    privacy: "We never ask for your name, email or a photo: the avatar is one of the site’s own drawings. You can download or delete this data at any time in", yourData: "Your data", navLabel: "Your profile",
  },
  fr: {
    title: "Votre profil", intro: "Adaptez Plan Cerca à vos goûts. Pas besoin de compte : tout est enregistré uniquement dans ce navigateur.",
    avatar: "Avatar", avatarNames: { profile: "Personne", music: "Note de musique", mic: "Micro", mask: "Masques de théâtre", trophy: "Trophée", frame: "Tableau", museum: "Musée", spark: "Étincelle" },
    city: "Ville par défaut", cityHint: "La ville affichée à l’ouverture du site.",
    categories: "Catégories préférées", categoriesHint: "« Recommandé pour vous » n’affichera que ces catégories, en alternance. Sans sélection, ce sont surtout des concerts.",
    language: "Langue", saved: "Modifications enregistrées dans ce navigateur.",
    privacy: "Nous ne demandons ni nom, ni e-mail, ni photo : l’avatar est un dessin du site. Vous pouvez télécharger ou supprimer ces données à tout moment dans", yourData: "Vos données", navLabel: "Votre profil",
  },
};

export default function ProfilePage({ profile, setProfile, language, setLanguage, categoryNames }: {
  profile: Profile; setProfile: (profile: Profile) => void; language: Language; setLanguage: (language: Language) => void; categoryNames: Record<EventCategory, string>;
}) {
  const text = profileCopy[language];
  const { selectedCity, selectCity } = usePreferredCity();
  const [status, setStatus] = useState("");
  const confirm = () => setStatus(text.saved);
  const update = (next: Profile) => { setProfile(next); confirm(); };
  const toggleCategory = (category: EventCategory) => update({ ...profile, categories: profile.categories.includes(category) ? profile.categories.filter((item) => item !== category) : [...profile.categories, category] });

  return <main id="main-content" tabIndex={-1} className="subpage profile-page">
    <div className="profile-heading">
      <span className="profile-avatar profile-avatar--large" aria-hidden="true"><Icon name={profile.avatar} /></span>
      <div><h1>{text.title}</h1><p>{text.intro}</p></div>
    </div>
    <p className="profile-status" role="status" aria-live="polite">{status}</p>

    <fieldset className="profile-section">
      <legend>{text.avatar}</legend>
      <div className="profile-avatars">{AVATARS.map((avatar) => <label key={avatar} className="profile-avatar-option">
        <input type="radio" name="avatar" value={avatar} checked={profile.avatar === avatar} onChange={() => update({ ...profile, avatar })} />
        <span className="profile-avatar" aria-hidden="true"><Icon name={avatar} /></span>
        <span className="sr-only">{text.avatarNames[avatar]}</span>
      </label>)}</div>
    </fieldset>

    <div className="profile-section">
      <label className="profile-label" htmlFor="profile-city">{text.city}</label>
      <p className="profile-hint" id="profile-city-hint">{text.cityHint}</p>
      <select id="profile-city" className="drawer-select" aria-describedby="profile-city-hint" value={selectedCity} onChange={(event) => { selectCity(event.target.value as City); confirm(); }}>
        {cities.map((city) => <option key={city} value={city}>{city}</option>)}
      </select>
    </div>

    <fieldset className="profile-section" aria-describedby="profile-categories-hint">
      <legend>{text.categories}</legend>
      <p className="profile-hint" id="profile-categories-hint">{text.categoriesHint}</p>
      <div className="drawer-chips">{eventCategories.map((category) => <button key={category} type="button" aria-pressed={profile.categories.includes(category)} onClick={() => toggleCategory(category)}>{categoryNames[category]}</button>)}</div>
    </fieldset>

    <div className="profile-section">
      <label className="profile-label" htmlFor="profile-language">{text.language}</label>
      <select id="profile-language" className="drawer-select" value={language} onChange={(event) => { setLanguage(event.target.value as Language); setStatus(profileCopy[event.target.value as Language].saved); }}>
        {(Object.keys(languageNames) as Language[]).map((code) => <option key={code} value={code} lang={code}>{languageNames[code]}</option>)}
      </select>
    </div>

    {/* Also here because on very narrow phones the header hides the profile menu */}
    <div className="profile-section profile-theme"><ThemeToggle language={language} /></div>

    <p className="profile-privacy">{text.privacy} <Link to="/tus-datos">{text.yourData}</Link>.</p>
  </main>;
}
