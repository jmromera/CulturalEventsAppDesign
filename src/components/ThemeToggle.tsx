import type { Language } from "../data/language";
import { useTheme } from "../lib/theme";
import Icon from "./Icon";

const themeCopy: Record<Language, string> = { es: "Modo noche", en: "Night mode", fr: "Mode nuit" };

/** Night mode switch (toggle button). In the header it shows only the icon; in the profile menu, icon and text. */
export default function ThemeToggle({ language, compact = false }: { language: Language; compact?: boolean }) {
  const [theme, setTheme] = useTheme();
  const dark = theme === "dark";
  const label = themeCopy[language];
  return <button type="button" className={`theme-toggle ${compact ? "theme-toggle--compact" : ""}`} aria-pressed={dark} aria-label={compact ? label : undefined} title={compact ? label : undefined} onClick={() => setTheme(dark ? "light" : "dark")}>
    <Icon name={dark ? "sun" : "moon"} />{!compact && <span>{label}</span>}
  </button>;
}
