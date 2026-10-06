import artistData from "./artists.json";
import type { Artist } from "../types/Event";

export const artists = artistData as Record<string, Artist>;