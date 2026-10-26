export type Language = "es" | "en" | "fr";

export const LANGUAGE_KEY = "plan-cerca.language";

// Idioma elegido en este navegador; sin elección guardada se usa el español.
export function readLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return stored === "en" || stored === "fr" ? stored : "es";
  } catch {
    return "es";
  }
}
