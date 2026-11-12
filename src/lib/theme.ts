import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../data/storage-keys";

// Light is the default look; night mode is an option. public/theme-init.js sets the theme before the first
// paint (inline scripts are blocked by the CSP) and must read the same key as STORAGE_KEYS.theme.

export type Theme = "light" | "dark";

const THEME_EVENT = "plan-cerca:theme";
const THEME_COLOR: Record<Theme, string> = { light: "#ffffff", dark: "#0f0f10" };

export function systemTheme(): Theme {
  try {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function storedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEYS.theme);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/** Applies a theme to the page without storing it. */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  window.dispatchEvent(new CustomEvent(THEME_EVENT));
}

/** The visitor chose a theme: apply it and remember it (only ever on a click). */
export function chooseTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
  applyTheme(theme);
}

/** Startup fallback in case theme-init.js did not run. */
export function initTheme() {
  if (!document.documentElement.dataset.theme) applyTheme(storedTheme() ?? systemTheme());
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);
  return [theme, chooseTheme];
}
