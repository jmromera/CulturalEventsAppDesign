// Single source of truth for everything the app stores in the browser.
// The cookie policy table, the "your data" export/delete tools and the tests all read this list,
// so any new key must be added here (a test fails if code uses a key that is not listed).

export const STORAGE_KEYS = {
  savedEvents: "plan-cerca.saved-events",
  language: "plan-cerca.language",
  preferredCity: "plan-cerca.preferred-city",
  detectedCity: "plan-cerca.detected-city",
  geolocationStatus: "plan-cerca.geolocation-status",
  onboardingDismissed: "plan-cerca.city-onboarding-dismissed",
  artistPreferences: "plancerca.artist-preferences",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export type StorageEntry = {
  key: StorageKey;
  /** User-facing description (Spanish: legal texts are published in Spanish). */
  purpose: string;
  /** What is stored, in plain words. */
  content: string;
  /** When the entry is created. */
  createdWhen: string;
};

export const STORAGE_REGISTRY: StorageEntry[] = [
  { key: STORAGE_KEYS.savedEvents, purpose: "Recordar tus favoritos", content: "Números de los eventos que has guardado", createdWhen: "Al pulsar el corazón de un evento" },
  { key: STORAGE_KEYS.language, purpose: "Recordar el idioma", content: "Código del idioma (es, en o fr)", createdWhen: "Al abrir la web" },
  { key: STORAGE_KEYS.preferredCity, purpose: "Recordar tu ciudad", content: "Nombre de la ciudad elegida", createdWhen: "Al elegir una ciudad" },
  { key: STORAGE_KEYS.detectedCity, purpose: "Proponerte la ciudad más cercana", content: "Nombre de la ciudad detectada (nunca las coordenadas)", createdWhen: "Al usar «Usar mi ubicación»" },
  { key: STORAGE_KEYS.geolocationStatus, purpose: "Saber si ya elegiste ciudad o usaste la ubicación", content: "Un estado: ciudad elegida, ubicación detectada o sin ciudad cercana", createdWhen: "Al elegir ciudad o usar la ubicación" },
  { key: STORAGE_KEYS.onboardingDismissed, purpose: "No volver a mostrar el diálogo de bienvenida", content: "El valor «true»", createdWhen: "Al pulsar «Ahora no» en el diálogo de bienvenida" },
  { key: STORAGE_KEYS.artistPreferences, purpose: "Recordar los artistas que sigues", content: "Por cada artista: si lo sigues y si quieres avisos", createdWhen: "Al pulsar «Seguir artista» o «Avisarme»" },
];

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Everything Plan Cerca has stored in this browser, parsed when it is JSON. */
export function exportStoredData(): Record<string, unknown> {
  const store = storage();
  const data: Record<string, unknown> = {};
  if (!store) return data;
  for (const { key } of STORAGE_REGISTRY) {
    const raw = store.getItem(key);
    if (raw === null) continue;
    try {
      data[key] = JSON.parse(raw);
    } catch {
      data[key] = raw;
    }
  }
  return data;
}

/** Removes every key listed in the registry. Returns how many entries were removed. */
export function clearStoredData(): number {
  const store = storage();
  if (!store) return 0;
  let removed = 0;
  for (const { key } of STORAGE_REGISTRY) {
    if (store.getItem(key) !== null) removed += 1;
    store.removeItem(key);
  }
  return removed;
}
