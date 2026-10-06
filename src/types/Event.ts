import cityImages from "../data/city-images.json";

export type City = keyof typeof cityImages;
export const cities = Object.keys(cityImages) as City[];

export const eventCategories = ["Música", "Ópera", "Danza", "Deportes", "Teatro", "Museos", "Arte"] as const;
export type EventCategory = (typeof eventCategories)[number];

export type LocalizedText = { es: string; en: string; fr: string };

export type Venue = {
  id: string; city: City; name: string; address: string; description: LocalizedText; image: string | null; mapsUrl: string; kind: LocalizedText;
  websiteUrl: string | null; programmeUrl: string | null; programmeLabel: LocalizedText | null;
};

export type RelatedEntityKind = "artist" | "musical" | "play" | "show";

export type RelatedEntity = {
  id: string;
  name: string;
  kind: RelatedEntityKind;
  description: string;
  image: string | null;
  links: { label: LocalizedText; url: string }[];
  aboutTitle: LocalizedText;
  relatedEventsTitle: LocalizedText;
  profileEventsTitle: LocalizedText;
};

export type EventItem = {
  id: number; category: EventCategory; title: string; date: string; startDate: string | null; endDate?: string | null; featured?: boolean; time: string; duration: string;
  venueId: string; relatedEntityId?: string; distance: string; price: string; availability: string;
  organizer: string; rating?: number; popularity?: string; tags: string[]; image: string;
  description: string; fullDescription: string; ticketUrl: string; confirmed: boolean;
};