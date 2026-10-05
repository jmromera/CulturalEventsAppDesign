export const cities = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"] as const;
export type City = (typeof cities)[number];

export type EventItem = {
  id: number; city: City; category: string; title: string; date: string; time: string; duration: string;
  venue: string; address: string; distance: string; price: string; availability: string;
  organizer: string; rating: number; popularity: string; tags: string[]; image: string;
  description: string; fullDescription: string; ticketUrl: string; confirmed: boolean;
};