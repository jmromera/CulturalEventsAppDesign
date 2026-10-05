import type { City, EventItem } from "../types/Event";

export const imgs = {
  city: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1800&q=85",
  amble: "https://prismic-images.tmol.io/ticketmaster-tm-global/ahaT0LK9tuLqEK_f_TKM2426x1365a150-4-.jpg?auto=format%2Ccompress&rect=0%2C0%2C2426%2C1023&w=1600&h=900",
  blanco: "https://prismic-images.tmol.io/ticketmaster-tm-global/afGs8MBOoF08xaBs_2426x1365.jpg?auto=format%2Ccompress&rect=0%2C0%2C2426%2C1023&w=1600&h=900",
  fedora: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_OPERA_FEDORA.jpg",
  cnd: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_DANZA_CND06.jpg",
  jaho: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_CONCIERTOS_ERMONELAJAHO.jpg",
  katia: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_OPERA_KATIAKABANOVA.jpg",
  bodas: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_OPERA_BODASDESANGRE.jpg",
  norma: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_OPERA_NORMA%20%281%29.jpg",
  bernheim: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_CONCIERTOS_BENJAMINBERNHEIM.jpg",
  pina: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_DANZA_PINABAUSCH.jpg",
  barbero: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_OPERA_ELBARBERODESEVILLA.jpg",
  camara: "https://www.teatroreal.es/sites/default/files/espectaculos/CabeceraWeb_1920x550_DOMINGOS_Concierto6.jpg",
  real: "https://images.unsplash.com/photo-1522778034537-20a2486be803?auto=format&fit=crop&w=1400&q=85",
  atleti: "https://www.atleticodemadrid.com/img/ENTRADAS_ESP.jpg",
  rayo: "https://statics-maker.llt-services.com/ray/images/2026/10/03/xlarge/21ea1f3d-f8c1-4c87-8a43-c06822d810bd-685.jpg",
};

export const cityImages: Record<City, string> = {
  Madrid: imgs.city,
  Barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1800&q=85",
  Valencia: "https://images.unsplash.com/photo-1593081891731-fda0877988da?auto=format&fit=crop&w=1800&q=85",
  Sevilla: "https://images.unsplash.com/photo-1559386484-97dfc0e15539?auto=format&fit=crop&w=1800&q=85",
  Bilbao: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?auto=format&fit=crop&w=1800&q=85",
};

const make = (id: number, category: string, title: string, date: string, time: string, venue: string, image: string, url: string, extra: Partial<EventItem> = {}, city: City = "Madrid"): EventItem => ({
  id, city, category, title, date, time, venue, image, ticketUrl: url, duration: category === "Deportes" ? "2 h aprox." : "2 h 15 min aprox.",
  address: venue.includes("Teatro Real") ? "Plaza de Isabel II, s/n, Madrid" : `${venue}, Madrid`,
  distance: `${(1.2 + id * .35).toFixed(1).replace(".", ",")} km`, price: "Precio pendiente de publicación",
  availability: id > 12 ? "Calendario pendiente" : "Disponible próximamente", organizer: venue.includes("Teatro Real") ? "Teatro Real" : category === "Deportes" ? title.split("—")[0].trim() : "Ticketmaster España",
  rating: 4.5 + (id % 5) / 10, popularity: `${82 + id}%`, tags: [category, "Madrid", id < 7 ? "Recomendado" : "2027"],
  description: `Una propuesta destacada de ${category.toLowerCase()} en ${venue}, seleccionada por su calidad y relevancia en la agenda de Madrid.`,
  fullDescription: `${title} forma parte de la programación cultural y de ocio de Madrid. La ficha reúne la información práctica disponible para que puedas valorar el plan antes de comprar. Consulta horarios, ubicación, disponibilidad y condiciones actualizadas del organizador.`,
  confirmed: id < 13, ...extra,
});

export const events: EventItem[] = [
  make(1, "Música", "Amble — Europe 2027", "Martes, 9 de febrero de 2027", "20:30", "Sala But", imgs.amble, "https://www.ticketmaster.es/event/amble-europe-2027-entradas/440505152", { duration: "1 h 45 min", price: "Tarifa oficial por confirmar", availability: "Entradas disponibles", description: "El trío irlandés Amble presenta en Madrid su folk íntimo y luminoso dentro de la gira europea 2027." }),
  make(2, "Música", "Blanco White — Europe 2027", "Martes, 23 de marzo de 2027", "20:30", "Teatro Eslava", imgs.blanco, "https://www.ticketmaster.es/event/blanco-white-uk--europe-2027-tour-entradas/2062353983", { duration: "1 h 40 min", price: "Tarifa oficial por confirmar", availability: "Entradas disponibles", description: "Blanco White fusiona folk andaluz, sonidos latinoamericanos y sensibilidad británica en un directo envolvente." }),
  make(3, "Ópera", "Fedora", "Del 7 al 10 de enero de 2027", "19:30", "Teatro Real", imgs.fedora, "https://www.teatroreal.es/es/espectaculo/fedora", { description: "El drama de Umberto Giordano llega al Teatro Real con pasión, intriga y una poderosa partitura verista." }),
  make(4, "Danza", "Compañía Nacional de Danza", "Del 15 al 18 de enero de 2027", "19:30", "Teatro Real", imgs.cnd, "https://www.teatroreal.es/es/espectaculo/compania-nacional-danza", { description: "Una cita con la danza española contemporánea y el talento de la Compañía Nacional de Danza." }),
  make(5, "Música", "Ermonela Jaho", "Sábado, 23 de enero de 2027", "19:30", "Teatro Real", imgs.jaho, "https://www.teatroreal.es/es/espectaculo/ermonela-jaho", { description: "La reconocida soprano Ermonela Jaho protagoniza un recital de gran intensidad expresiva." }),
  make(6, "Ópera", "Katia Kabanová", "Del 13 de febrero al 5 de marzo de 2027", "19:30", "Teatro Real", imgs.katia, "https://www.teatroreal.es/es/espectaculo/katia-kabanova", { description: "La obra maestra de Janáček retrata el deseo, la culpa y la libertad con una música de enorme fuerza teatral." }),
  make(7, "Ópera", "Bodas de sangre", "Del 9 al 14 de marzo de 2027", "19:30", "Teatro Real", imgs.bodas, "https://www.teatroreal.es/es/espectaculo/bodas-sangre", { description: "El universo de Lorca se transforma en ópera en una producción intensa sobre amor, destino y tradición." }),
  make(8, "Ópera", "Norma", "Del 9 al 30 de abril de 2027", "19:30", "Teatro Real", imgs.norma, "https://www.teatroreal.es/es/espectaculo/norma", { description: "La gran ópera de Bellini regresa con su célebre Casta diva y uno de los papeles más exigentes del repertorio." }),
  make(9, "Música", "Benjamin Bernheim", "Lunes, 31 de mayo de 2027", "19:30", "Teatro Real", imgs.bernheim, "https://www.teatroreal.es/es/espectaculo/benjamin-bernheim", { description: "Una velada con una de las voces de tenor más celebradas de su generación." }),
  make(10, "Danza", "Tanztheater Wuppertal Pina Bausch", "Del 11 al 16 de junio de 2027", "20:00", "Teatro Real", imgs.pina, "https://www.teatroreal.es/es/espectaculo/tanztheater-wuppertal-pina-bausch", { description: "La legendaria compañía de Pina Bausch visita Madrid con su lenguaje escénico radical y poético." }),
  make(11, "Ópera", "El barbero de Sevilla", "Del 3 al 21 de julio de 2027", "19:30", "Teatro Real", imgs.barbero, "https://www.teatroreal.es/es/espectaculo/barbero-sevilla", { description: "La comedia de Rossini despliega virtuosismo vocal, ritmo y humor en el cierre de temporada." }),
  make(12, "Música", "Domingos de Cámara VI", "Domingo, 4 de julio de 2027", "12:00", "Teatro Real", imgs.camara, "https://www.teatroreal.es/es/espectaculo/domingos-camara-vi", { duration: "1 h 20 min", price: "Desde 13 €", availability: "Entradas disponibles", description: "Música de cámara en formato cercano, interpretada por artistas de la Orquesta Titular del Teatro Real." }),
  make(13, "Deportes", "Real Madrid — próximo partido en casa", "Temporada 2026/27", "Por confirmar", "Estadio Santiago Bernabéu", imgs.real, "https://www.realmadrid.com/es-ES/entradas", { distance: "3,8 km", description: "Consulta el próximo partido del Real Madrid en el Bernabéu y activa el aviso cuando se publique la fecha.", confirmed: false }),
  make(14, "Deportes", "Atlético de Madrid — próximo partido", "Temporada 2026/27", "Por confirmar", "Riyadh Air Metropolitano", imgs.atleti, "https://www.atleticodemadrid.com/entradas", { distance: "9,6 km", description: "Próximos partidos del Atlético de Madrid y disponibilidad oficial en el Metropolitano.", confirmed: false }),
  make(15, "Deportes", "Rayo Vallecano — próximo partido", "Temporada 2026/27", "Por confirmar", "Estadio de Vallecas", imgs.rayo, "https://www.rayovallecano.es/entradas", { distance: "5,4 km", description: "Vive el fútbol de barrio en Vallecas y recibe un aviso cuando el club publique nuevas entradas.", confirmed: false }),
];