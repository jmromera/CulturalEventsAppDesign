export type ArtistPreferenceState = {
  following: boolean;
  eventAlerts: boolean;
};

type PreferenceDocument = {
  version: 1;
  artists: Record<string, ArtistPreferenceState>;
};

type PreferenceKey = keyof ArtistPreferenceState;

const storageKey = "plancerca.artist-preferences";
const defaultPreference: ArtistPreferenceState = { following: false, eventAlerts: false };

function readDocument(): PreferenceDocument {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { version: 1, artists: {} };
    const document = JSON.parse(stored) as PreferenceDocument;
    return document.version === 1 && document.artists ? document : { version: 1, artists: {} };
  } catch {
    return { version: 1, artists: {} };
  }
}

export function getArtistPreference(artistId: string): ArtistPreferenceState {
  return readDocument().artists[artistId] ?? defaultPreference;
}

export function setArtistPreference(artistId: string, key: PreferenceKey, value: boolean): ArtistPreferenceState {
  const document = readDocument();
  const preference = { ...defaultPreference, ...document.artists[artistId], [key]: value };
  document.artists[artistId] = preference;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(document));
  } catch {
    return preference;
  }
  return preference;
}