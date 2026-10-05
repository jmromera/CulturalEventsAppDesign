import type { City, LocalizedText, Venue } from "../types/Event";

const venueProfiles = {
  musicClub: {
    kind: { es: "Sala de conciertos", en: "Live music venue", fr: "Salle de concerts" },
    description: {
      es: "Un espacio madrileño para conciertos y programación musical en directo.",
      en: "A Madrid venue for concerts and live music programming.",
      fr: "Une salle madrilène dédiée aux concerts et à la musique live.",
    },
  },
  theatre: {
    kind: { es: "Teatro", en: "Theatre", fr: "Théâtre" },
    description: {
      es: "Un espacio escénico con programación de teatro, danza y música.",
      en: "A performing arts venue presenting theatre, dance and music.",
      fr: "Un lieu de spectacle avec du théâtre, de la danse et de la musique.",
    },
  },
  operaHouse: {
    kind: { es: "Ópera y música", en: "Opera and music", fr: "Opéra et musique" },
    description: {
      es: "Un escenario dedicado a la ópera y a la programación musical en directo.",
      en: "A stage dedicated to opera and live music programming.",
      fr: "Une scène consacrée à l’opéra et aux concerts.",
    },
  },
  stadium: {
    kind: { es: "Estadio", en: "Stadium", fr: "Stade" },
    description: {
      es: "Un estadio que acoge los partidos como local y la agenda deportiva del club.",
      en: "A stadium hosting home fixtures and the club’s sports calendar.",
      fr: "Un stade qui accueille les matchs à domicile et l’agenda sportif du club.",
    },
  },
  concertHall: {
    kind: { es: "Sala de conciertos", en: "Concert hall", fr: "Salle de concerts" },
    description: {
      es: "Un espacio de Barcelona para conciertos y propuestas musicales en directo.",
      en: "A Barcelona venue for concerts and live music performances.",
      fr: "Un lieu barcelonais consacré aux concerts et à la musique live.",
    },
  },
  contemporaryArtMuseum: {
    kind: { es: "Museo de arte contemporáneo", en: "Contemporary art museum", fr: "Musée d’art contemporain" },
    description: {
      es: "Un museo barcelonés dedicado al arte contemporáneo y a sus exposiciones.",
      en: "A Barcelona museum devoted to contemporary art and exhibitions.",
      fr: "Un musée barcelonais consacré à l’art contemporain et aux expositions.",
    },
  },
  artMuseum: {
    kind: { es: "Museo de arte", en: "Art museum", fr: "Musée d’art" },
    description: {
      es: "Un museo de Barcelona para recorrer la obra de Picasso y su relación con la ciudad.",
      en: "A Barcelona museum exploring Picasso’s work and his connection to the city.",
      fr: "Un musée barcelonais consacré à l’œuvre de Picasso et à son lien avec la ville.",
    },
  },
  sportsArena: {
    kind: { es: "Pabellón deportivo", en: "Sports arena", fr: "Salle omnisports" },
    description: {
      es: "Un pabellón de Barcelona para competiciones y eventos deportivos.",
      en: "A Barcelona arena for sports competitions and events.",
      fr: "Une salle barcelonaise accueillant des compétitions et événements sportifs.",
    },
  },
  conferenceCentre: {
    kind: { es: "Palacio de congresos", en: "Conference centre", fr: "Palais des congrès" },
    description: {
      es: "Un centro de congresos y conciertos junto a la ría de Bilbao, en un edificio de arquitectura contemporánea.",
      en: "A conference and concert centre beside the Bilbao estuary in a striking contemporary building.",
      fr: "Un centre de congrès et de concerts au bord de la ria de Bilbao, dans un bâtiment contemporain remarquable.",
    },
  },
  guggenheim: {
    kind: { es: "Museo de arte contemporáneo", en: "Contemporary art museum", fr: "Musée d’art contemporain" },
    description: {
      es: "Un museo de Bilbao dedicado al arte moderno y contemporáneo, junto a la ría.",
      en: "A Bilbao museum devoted to modern and contemporary art beside the river.",
      fr: "Un musée de Bilbao consacré à l’art moderne et contemporain, au bord de la ria.",
    },
  },
} satisfies Record<string, { kind: LocalizedText; description: LocalizedText }>;

export function venueIdFor(city: City, venueName: string): string {
  const mainVenueName = venueName.split(" · ")[0].trim();
  return `${city}-${mainVenueName}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type VenueRecord = Omit<Venue, "id" | "mapsUrl" | "kind" | "description" | "image" | "websiteUrl" | "programmeUrl" | "programmeLabel"> & {
  profile: keyof typeof venueProfiles;
  image?: string | null;
  websiteUrl?: string | null;
  programmeUrl?: string | null;
  programmeLabel?: LocalizedText | null;
};

const venueData: VenueRecord[] = [
  { city: "Madrid", name: "Lula Club", address: "Gran Vía 54, Madrid", profile: "musicClub" },
  { city: "Madrid", name: "Sala But", address: "Sala But, Madrid", profile: "musicClub" },
  { city: "Madrid", name: "Teatro Eslava", address: "Teatro Eslava, Madrid", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Madrid_-_Teatro_Joy_Eslava_3.jpg", profile: "theatre" },
  { city: "Madrid", name: "Teatro Real", address: "Plaza de Isabel II, s/n, Madrid", image: "https://www.teatroreal.es/sites/default/files/2019-02/teatro-real.jpg", websiteUrl: "https://www.teatroreal.es/es", programmeUrl: "https://www.teatroreal.es/es/temporada-actual", programmeLabel: { es: "Programa oficial", en: "Official programme", fr: "Programme officiel" }, profile: "operaHouse" },
  { city: "Madrid", name: "Estadio Santiago Bernabéu", address: "Estadio Santiago Bernabéu, Madrid", image: "https://assets.realmadrid.com/is/image/realmadrid/Bernabeu?$Desktop$&fit=wrap&wid=1024", profile: "stadium" },
  { city: "Madrid", name: "Riyadh Air Metropolitano", address: "Riyadh Air Metropolitano, Madrid", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Wanda-Metropolitano.jpg/1280px-Wanda-Metropolitano.jpg", profile: "stadium" },
  { city: "Madrid", name: "Estadio de Vallecas", address: "Estadio de Vallecas, Madrid", profile: "stadium" },
  { city: "Barcelona", name: "Palau de la Música Catalana", address: "Carrer del Palau de la Música, 4-6, 08003 Barcelona", image: "https://www.palaumusica.cat/images/1479156/full_inner_page.jpg", websiteUrl: "https://www.palaumusica.cat/en", programmeUrl: "https://www.palaumusica.cat/en/programme_1158636", programmeLabel: { es: "Programa de conciertos", en: "Concert programme", fr: "Programme des concerts" }, profile: "concertHall" },
  { city: "Barcelona", name: "Teatre Nacional de Catalunya", address: "Plaça de les Arts, 1, 08013 Barcelona", image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Teatre_Nacional_de_Catalunya.jpg", profile: "theatre" },
  { city: "Barcelona", name: "Teatre Lliure de Gràcia", address: "Carrer de Montseny, 47, 08012 Barcelona", profile: "theatre" },
  { city: "Barcelona", name: "MACBA", address: "Plaça dels Àngels, 1, 08001 Barcelona", websiteUrl: "https://www.macba.cat/en/", programmeUrl: "https://www.macba.cat/en/exhibitions/", programmeLabel: { es: "Exposiciones", en: "Exhibitions", fr: "Expositions" }, profile: "contemporaryArtMuseum" },
  { city: "Barcelona", name: "Museu Picasso de Barcelona", address: "Carrer de Montcada, 15-23, 08003 Barcelona", profile: "artMuseum" },
  { city: "Barcelona", name: "Spotify Camp Nou", address: "Carrer d'Arístides Maillol, 12, 08028 Barcelona", image: "https://www.fcbarcelona.com/photo-resources/2021/08/09/c4f2dddd-2152-4b8b-acf8-826b4377e29d/Camp-Nou-4.jpg?width=1600", websiteUrl: "https://www.fcbarcelona.com/en/club/facilities/spotify-camp-nou", programmeUrl: "https://www.fcbarcelona.com/en/tickets/camp-nou-experience", programmeLabel: { es: "Visita al estadio", en: "Stadium visits", fr: "Visite du stade" }, profile: "stadium" },
  { city: "Barcelona", name: "Estadi Johan Cruyff", address: "Carrer d'Arístides Maillol, 12, 08028 Barcelona", profile: "stadium" },
  { city: "Barcelona", name: "Palau Blaugrana", address: "Carrer d'Arístides Maillol, 12, 08028 Barcelona", profile: "sportsArena" },
  { city: "Barcelona", name: "Gran Teatre del Liceu", address: "La Rambla, 51-59, 08002 Barcelona", image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Gran_Teatre_del_Liceu%2C_fa%C3%A7ana_Rambla.jpg", profile: "operaHouse" },
  { city: "Barcelona", name: "Teatre Lliure de Montjuïc", address: "Plaça de Margarida Xirgu, 1, 08004 Barcelona", profile: "theatre" },
  { city: "Bilbao", name: "Guggenheim Bilbao", address: "Avenida Abandoibarra, 2, 48009 Bilbao", image: "https://cms.guggenheim-bilbao.eus/uploads/2019/03/edificio-tulipanes-guggenheim-bilbao-museoa.jpeg", profile: "guggenheim" },
  { city: "Bilbao", name: "Euskalduna", address: "Abandoibarra Etorbidea, 4, 48011 Bilbao", image: "https://www.euskaldunabilbao.com/src/uploads/2015/06/palacio_1B.jpg?x72554", profile: "conferenceCentre" },
  { city: "Bilbao", name: "San Mamés", address: "Rafael Moreno Pitxitxi Kalea, s/n, 48013 Bilbao", image: "https://upload.wikimedia.org/wikipedia/commons/2/24/San_Mames_stadium.jpg", profile: "stadium" },
];

export const venues: Venue[] = venueData.map(({ profile, image, ...venue }) => ({
  ...venue,
  websiteUrl: venue.websiteUrl ?? null,
  programmeUrl: venue.programmeUrl ?? null,
  programmeLabel: venue.programmeLabel ?? null,
  image: image ?? (venue.name === "MACBA"
    ? "https://upload.wikimedia.org/wikipedia/commons/6/67/Barcelona_Museum_of_Contemporary_Art.jpg"
    : venue.name === "Museu Picasso de Barcelona"
      ? "https://upload.wikimedia.org/wikipedia/commons/1/1e/Museo_PIcasso_._Palau_Berenguer_._Barcelona.JPG"
      : null),
  ...venueProfiles[profile],
  id: venueIdFor(venue.city, venue.name),
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.name}, ${venue.address}`)}`,
}));

export function venueFor(id: string): Venue {
  const venue = venues.find((item) => item.id === id);
  if (!venue) throw new Error(`Unknown venue: ${id}`);
  return venue;
}