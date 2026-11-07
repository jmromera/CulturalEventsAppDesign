export type Language = "es" | "en" | "fr";

import { STORAGE_KEYS } from "./storage-keys";

export const LANGUAGE_KEY = STORAGE_KEYS.language;

// Idioma elegido en este navegador; sin elección guardada se usa el español.
export function readLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return stored === "en" || stored === "fr" ? stored : "es";
  } catch {
    return "es";
  }
}
