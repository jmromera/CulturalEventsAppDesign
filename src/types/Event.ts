export const cities = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"] as const;
export type City = (typeof cities)[number];

export const eventCategories = ["Música", "Ópera", "Danza", "Deportes", "Teatro", "Museos", "Arte"] as const;
export type EventCategory = (typeof eventCategories)[number];

export type LocalizedText = { es: string; en: string; fr: string };

export type Venue = {
  id: string; city: City; name: string; address: string; description: LocalizedText; image: string | null; mapsUrl: string; kind: LocalizedText;
  websiteUrl: string | null; programmeUrl: string | null; programmeLabel: LocalizedText | null;
};

export type Artist = {
  id: string;
  name: string;
  bio: string;
  image: string | null;
  website: string | null;
  youtube: string | null;
  spotify: string | null;
};

export type EventItem = {
  id: number; category: EventCategory; title: string; date: string; startDate: string | null; time: string; duration: string;
  venueId: string; artistId?: string; distance: string; price: string; availability: string;
  organizer: string; rating: number; popularity: string; tags: string[]; image: string;
  description: string; fullDescription: string; ticketUrl: string; confirmed: boolean;
};