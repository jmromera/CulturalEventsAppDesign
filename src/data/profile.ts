import type { IconName } from "../components/Icon";
import { eventCategories, type EventCategory } from "../types/Event";
import { STORAGE_KEYS } from "./storage-keys";

/** Avatars are drawings from the app's own icon set: no photo and no name, so the profile holds no personal data. */
export const AVATARS = ["profile", "music", "mic", "mask", "trophy", "frame", "museum", "spark"] as const satisfies readonly IconName[];
export type Avatar = (typeof AVATARS)[number];

export type Profile = { avatar: Avatar; categories: EventCategory[] };
export const DEFAULT_PROFILE: Profile = { avatar: "profile", categories: [] };

/** Reads the stored profile. Bad JSON or unknown values fall back to the defaults. */
export function readProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.profile);
    if (!raw) return DEFAULT_PROFILE;
    const value = JSON.parse(raw) as Partial<Record<keyof Profile, unknown>>;
    const avatar = (AVATARS as readonly unknown[]).includes(value.avatar) ? (value.avatar as Avatar) : DEFAULT_PROFILE.avatar;
    const categories = Array.isArray(value.categories)
      ? [...new Set(value.categories.filter((item): item is EventCategory => (eventCategories as readonly unknown[]).includes(item)))]
      : [];
    return { avatar, categories };
  } catch {
    return DEFAULT_PROFILE;
  }
}

/** Only called when the person changes something on the profile page. */
export function writeProfile(profile: Profile) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  } catch {
    // Without storage the profile still works for this visit.
  }
}
