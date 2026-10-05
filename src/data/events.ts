import { cities, type City, type EventItem, type EventCategory } from "../types/Event";
import { venueFor, venueIdFor } from "./venues";

export const imgs = {
  city: "https://images.unsplash.com/photo-1707770902294-cfc240892588?auto=format&fit=crop&w=2000&q=85",
  karmento: "https://www.surefolk.es/wp-content/uploads/karmento-c.jpg",
  barcelonaHelena: "https://www.palaumusica.cat/images/1623931/facebook.jpg",
  barcelonaGuitar: "https://www.palaumusica.cat/images/980625/facebook.webp",
  barcelonaFiveElements: "https://www.palaumusica.cat/images/1632289/facebook.jpg",
  barcelonaQueyras: "https://www.palaumusica.cat/images/1641007/facebook.jpeg",
  barcelonaCadell: "https://www.tnc.cat/img-tnc-cat/uploads/2026-05/espectacles/740x740-EL%20CADELL.jpg",
  barcelonaUltimaNoche: "https://www.tnc.cat/img-tnc-cat/uploads/2026-05/espectacles/740x740-LA%20%C3%9ALTIMA%20NOCHE%20CON%20MI%20HERMANO.jpg",
  barcelonaGota: "https://www.tnc.cat/img-tnc-cat/uploads/2026-09/espectacles/740x740-GOTA%20%281%29.jpg",
  barcelonaJulia: "https://www.teatrelliure.com/uploads/20260603/Julia_thumbnail-(4).jpg",
  barcelonaMacbaExterior: "https://upload.wikimedia.org/wikipedia/commons/6/67/Barcelona_Museum_of_Contemporary_Art.jpg",
  barcelonaMacbaFacade: "https://upload.wikimedia.org/wikipedia/commons/b/ba/MACBA_BCN.JPG",
  barcelonaPicasso: "https://commons.wikimedia.org/wiki/Special:FilePath/Museo_PIcasso_._Palau_Berenguer_._Barcelona.JPG?width=1200",
  barcelonaCampNou: "https://images.unsplash.com/photo-1585170236738-aadfce97f025?auto=format&fit=crop&w=1400&q=85",
  barcelonaMatch: "https://images.unsplash.com/photo-1629217855633-79a6925d6c47?auto=format&fit=crop&w=1400&q=85",
  barcelonaBasketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=85",
  barcelonaAida: "https://www.liceubarcelona.cat/sites/default/files/2026-04/Cap%C3%A7alera%20Aida.png",
  barcelonaJoveAida: "https://www.liceubarcelona.cat/sites/default/files/2026-01/Cap%C3%A7alera%20Jove%20Aida.jpg",
  barcelonaSaraBaras: "https://www.liceubarcelona.cat/sites/default/files/2026-07/Cap%C3%A7alera%20sara%20baras%202.png",
  barcelonaOperaTresRals: "https://www.teatrelliure.com/uploads/20260603/Lopera_thumbnail-(4).jpg",
  barcelonaDance: "https://images.unsplash.com/photo-1551186839-9e4a19b27812?auto=format&fit=crop&w=1400&q=85",
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
  Barcelona: "https://images.unsplash.com/photo-1578095172812-dcc191c5aed8?auto=format&fit=crop&w=2000&q=85",
  Valencia: "https://images.unsplash.com/photo-1719401542194-95139aed215c?auto=format&fit=crop&w=2000&q=85",
  Sevilla: "https://images.unsplash.com/photo-1698452036816-e65fb6cb88d8?auto=format&fit=crop&w=2000&q=85",
  Bilbao: "https://images.unsplash.com/photo-1663844234274-7089dd2d8243?auto=format&fit=crop&w=2000&q=85",
};

const spanishMonths: Record<string, string> = {
  enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
  julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12",
};

function eventStartDate(label: string): string | null {
  const value = label.toLocaleLowerCase("es");
  const range = value.match(/del (\d{1,2}) de ([a-záéíóúñ]+) de (20\d{2}) al \d{1,2} de [a-záéíóúñ]+ de 20\d{2}/)
    ?? value.match(/del (\d{1,2}) de ([a-záéíóúñ]+) al \d{1,2} de [a-záéíóúñ]+ de (20\d{2})/)
    ?? value.match(/del (\d{1,2}) al \d{1,2} de ([a-záéíóúñ]+) de (20\d{2})/);
  const single = value.match(/^(\d{1,2}) y \d{1,2} de ([a-záéíóúñ]+) de (20\d{2})/)
    ?? value.match(/(\d{1,2}) de ([a-záéíóúñ]+) de (20\d{2})/);
  const match = range ?? single;
  if (!match) return null;

  const month = spanishMonths[match[2]];
  if (!month) return null;
  return `${match[3]}-${month}-${match[1].padStart(2, "0")}`;
}

const make = (id: number, category: EventCategory, title: string, date: string, time: string, venue: string, image: string, url: string, extra: Partial<EventItem> = {}, city: City = "Madrid"): EventItem => ({
  id, category, title, date, startDate: eventStartDate(date), time, venueId: venueIdFor(city, venue), image, ticketUrl: url, duration: category === "Deportes" ? "2 h aprox." : "2 h 15 min aprox.",
  distance: `${(1.2 + id * .35).toFixed(1).replace(".", ",")} km`, price: "Precio pendiente de publicación",
  availability: id > 12 ? "Calendario pendiente" : "Disponible próximamente", organizer: venue.includes("Teatro Real") ? "Teatro Real" : category === "Deportes" ? title.split("—")[0].trim() : "Ticketmaster España",
  rating: 4.5 + (id % 5) / 10, popularity: `${82 + id}%`, tags: [category, id < 7 ? "Recomendado" : "2027"],
  description: `Una propuesta destacada de ${category.toLowerCase()} en ${venue}, seleccionada por su calidad y relevancia en la agenda de ${city}.`,
  fullDescription: `${title} forma parte de la programación cultural y de ocio de ${city}. La ficha reúne la información práctica disponible para que puedas valorar el plan antes de comprar. Consulta horarios, ubicación, disponibilidad y condiciones actualizadas del organizador.`,
  confirmed: id < 13, ...extra,
});

export const events: EventItem[] = [
  make(16, "Música", "Karmento — Fin de gira La Serrana", "Jueves, 29 de octubre de 2026", "20:00", "Lula Club", imgs.karmento, "https://www.entradas.com/event/karmento-en-jaguar-lula-club-22001536/", {
    artistId: "karmento", distance: "1,0 km", price: "Desde 22 €", availability: "Entradas disponibles",
    organizer: "Ciclo Jaguar Madrid", tags: ["Música", "Folk", "Neofolclore", "Madrid", "Recomendado"],
    description: "Karmento es una de las voces más destacadas del neofolclore español. Este concierto especial cierra su gira La Serrana.",
    fullDescription: "Karmento llega a Lula Club para el concierto especial de cierre de su gira La Serrana. Una de las principales voces del neofolclore español, presenta un repertorio que enlaza la raíz manchega con una mirada contemporánea. La cita forma parte del Ciclo Jaguar Madrid y tendrá lugar en Lula Club, Gran Vía 54. Las entradas se venden a través del proveedor oficial.",
    confirmed: true,
  }, "Madrid"),
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
  make(17, "Música", "Helena Ressurreição & Mar Compte — Lied", "Lunes, 5 de octubre de 2026", "19:30", "Palau de la Música Catalana · Petit Palau", imgs.barcelonaHelena, "https://www.palaumusica.cat/en/helena-ressurreicao-mar-compte_1623932", {
    distance: "1,1 km", price: "18 €", availability: "Entradas disponibles",
    organizer: "Fundació Orfeó Català-Palau de la Música", duration: "70 min", confirmed: true,
    description: "La mezzosoprano Helena Ressurreição y la pianista Mar Compte recorren el repertorio del lied en un concierto con programa comentado y subtítulos en catalán.",
  }, "Barcelona"),
  make(18, "Música", "Barcelona Guitar Trio & Dance — Tributo a Paco de Lucía", "Lunes, 5 de octubre de 2026", "20:00", "Palau de la Música Catalana · Sala de Concerts", imgs.barcelonaGuitar, "https://www.palaumusica.cat/en/barcelona-guitar-trio-dance_1018227", {
    distance: "1,1 km", price: "Desde 39 €", availability: "Entradas disponibles",
    organizer: "Poema, SL", duration: "90 min", confirmed: true,
    description: "Alí Arango, Xavier Coll y Luis Robisco homenajean a Paco de Lucía junto a los bailarines José Manuel Álvarez y Carolina Morgado, con guitarra flamenca y percusión en directo.",
  }, "Barcelona"),
  make(19, "Música", "5 Elements — Schubert, Brahms, Rossini y Guastavino", "Martes, 6 de octubre de 2026", "19:30", "Palau de la Música Catalana · Petit Palau", imgs.barcelonaFiveElements, "https://www.palaumusica.cat/en/5-elements-matheu-pinto-padulles-olive-bronevetzky_1623041", {
    distance: "1,1 km", price: "18 €", availability: "Entradas disponibles",
    organizer: "Fundació Orfeó Català-Palau de la Música", duration: "85 min", confirmed: true,
    description: "Marta Mathéu, Mireia Pintó, Roger Padullés y Josep-Ramon Olivé, acompañados al piano por Vladislav Bronevetzky, exploran el lied y el repertorio vocal a varias voces.",
  }, "Barcelona"),
  make(20, "Música", "Jean-Guihen Queyras — Suites para violonchelo de Bach", "Miércoles, 7 de octubre de 2026", "19:00", "Palau de la Música Catalana · Sala de Concerts", imgs.barcelonaQueyras, "https://www.palaumusica.cat/en/jean-guihen-queyras_1624032", {
    distance: "1,1 km", price: "Desde 25 €", availability: "Entradas disponibles",
    organizer: "Fundació Orfeó Català-Palau de la Música", duration: "155 min con pausa", confirmed: true,
    description: "El violonchelista Jean-Guihen Queyras interpreta el ciclo completo de las Suites para violonchelo solo de Johann Sebastian Bach.",
  }, "Barcelona"),
  make(21, "Teatro", "El Cadell", "Del 30 de septiembre al 1 de noviembre de 2026", "Según función", "Teatre Nacional de Catalunya · Sala Petita", imgs.barcelonaCadell, "https://entrades.tnc.cat/en/el-cadell", {
    distance: "1,7 km", price: "Consultar precio oficial", availability: "Entradas disponibles",
    organizer: "Teatre Nacional de Catalunya", confirmed: true,
    description: "Una tragedia rural contemporánea de Josep Maria Miró sobre memoria, tradición y los silencios que atraviesan una familia.",
  }, "Barcelona"),
  make(22, "Teatro", "La última noche con mi hermano", "Del 15 de octubre al 1 de noviembre de 2026", "Según función", "Teatre Nacional de Catalunya · Sala Gran", imgs.barcelonaUltimaNoche, "https://entrades.tnc.cat/en/la-ultima-noche-con-mi-hermano", {
    distance: "1,7 km", price: "Consultar precio oficial", availability: "Entradas disponibles",
    organizer: "Teatre Nacional de Catalunya", confirmed: true,
    description: "Alfredo Sanzol escribe y dirige este nuevo montaje de la Sala Gran del TNC, con una mirada íntima a los vínculos familiares.",
  }, "Barcelona"),
  make(23, "Teatro", "Gota", "Del 15 de octubre al 1 de noviembre de 2026", "Según función", "Teatre Nacional de Catalunya · Sala Tallers", imgs.barcelonaGota, "https://entrades.tnc.cat/en/gota", {
    distance: "1,7 km", price: "Consultar precio oficial", availability: "Entradas disponibles",
    organizer: "Teatre Nacional de Catalunya", confirmed: true,
    description: "Txema Muñoz y el director Leandre Ribera presentan una propuesta escénica visual en la Sala Tallers del TNC.",
  }, "Barcelona"),
  make(24, "Teatro", "Júlia — 15 anys més tard", "Del 22 de octubre al 15 de noviembre de 2026", "Según función", "Teatre Lliure de Gràcia", imgs.barcelonaJulia, "https://entrades.teatrelliure.com/selection/event/date?productId=10229820879575&gtmStepTracking=true&lang=en", {
    distance: "1,8 km", price: "Consultar precio oficial", availability: "Entradas disponibles",
    organizer: "Teatre Lliure", confirmed: true,
    description: "Christiane Jatahy retoma la obra de Strindberg desde el presente en una nueva adaptación sobre identidad, poder y relaciones.",
  }, "Barcelona"),
  make(25, "Museos", "Counter-Information: Video-Nou / Servei de Vídeo Comunitari", "Del 9 de julio de 2026 a junio de 2027", "Horario del museo", "MACBA", imgs.barcelonaMacbaExterior, "https://www.macba.cat/en/exhibitions/counter-information-video-nou-servei-de-video-comunitari/", {
    distance: "0,7 km", price: "Consultar tarifa del museo", availability: "Exposición en curso",
    organizer: "MACBA", duration: "Visita libre", confirmed: true,
    description: "Una exposición del MACBA sobre el colectivo Video-Nou y el Servei de Vídeo Comunitari, que usaron el vídeo como herramienta de intervención social y debate.",
    fullDescription: "La muestra recorre la práctica de Video-Nou y el Servei de Vídeo Comunitari en Cataluña entre 1977 y 1983, junto con materiales audiovisuales y de archivo. Crédito de la imagen del edificio: Graham Rogers, Wikimedia Commons, CC BY-SA 2.5 (https://commons.wikimedia.org/wiki/File:Barcelona_Museum_of_Contemporary_Art.jpg).",
  }, "Barcelona"),
  make(26, "Museos", "Anna Moreno — The Third Twist", "Del 5 de febrero de 2026 al 17 de enero de 2027", "Horario del museo", "MACBA", imgs.barcelonaMacbaFacade, "https://www.macba.cat/en/exhibitions/anna-moreno-the-third-twist/", {
    distance: "0,7 km", price: "Consultar tarifa del museo", availability: "Exposición en curso",
    organizer: "MACBA", duration: "Visita libre", confirmed: true,
    description: "Anna Moreno explora la arquitectura utópica, el paso del tiempo y la imaginación especulativa mediante instalaciones y obras audiovisuales.",
    fullDescription: "The Third Twist reúne trabajos recientes de Anna Moreno y sitúa en su centro el film The Terminal Beach, codirigido con Bernardo Zanotta. Crédito de la imagen del edificio: Canaan, Wikimedia Commons, CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:MACBA_BCN.JPG).",
  }, "Barcelona"),
  make(27, "Museos", "Aurèlia Muñoz — Beings", "Del 5 de noviembre de 2026 al 29 de marzo de 2027", "Horario del museo", "MACBA", imgs.barcelonaMacbaExterior, "https://www.macba.cat/en/exhibitions/aurelia-munoz-beings/", {
    distance: "0,7 km", price: "Consultar tarifa del museo", availability: "Próxima exposición",
    organizer: "MACBA", duration: "Visita libre", confirmed: true,
    description: "Una exposición dedicada a la obra de Aurèlia Muñoz y a sus exploraciones de la escultura textil, las formas orgánicas y el espacio.",
    fullDescription: "La muestra recorre el trabajo de Aurèlia Muñoz a través de piezas textiles, escultóricas y documentales. Crédito de la imagen del edificio: Graham Rogers, Wikimedia Commons, CC BY-SA 2.5 (https://commons.wikimedia.org/wiki/File:Barcelona_Museum_of_Contemporary_Art.jpg).",
  }, "Barcelona"),
  make(28, "Museos", "Colección permanente — Museu Picasso", "Todo el año", "Horario del museo", "Museu Picasso de Barcelona", imgs.barcelonaPicasso, "https://www.museupicassobcn.cat/en/visit", {
    distance: "0,9 km", price: "Consultar tarifa del museo", availability: "Visita disponible",
    organizer: "Museu Picasso de Barcelona", duration: "Visita libre", confirmed: true,
    description: "Un recorrido por la colección permanente del Museu Picasso, con especial atención a la formación del artista y su relación con Barcelona.",
    fullDescription: "La colección permite seguir los años de formación de Pablo Picasso y sus vínculos con la ciudad a través de obras, series y espacios históricos. Crédito de la imagen del edificio: Tassilirosmar, Wikimedia Commons, CC BY-SA 3.0 ES (https://commons.wikimedia.org/wiki/File:Museo_PIcasso_._Palau_Berenguer_._Barcelona.JPG).",
  }, "Barcelona"),
  make(29, "Deportes", "FC Barcelona — Próximo partido en casa", "Temporada 2026/27", "Por confirmar", "Spotify Camp Nou", imgs.barcelonaCampNou, "https://www.fcbarcelona.com/en/tickets/football", {
    distance: "5,2 km", price: "Precio pendiente de publicación", availability: "Calendario pendiente",
    organizer: "FC Barcelona", duration: "2 h aprox.", description: "Consulta la agenda del FC Barcelona en el Spotify Camp Nou y la publicación de las próximas entradas oficiales.", confirmed: false,
  }, "Barcelona"),
  make(30, "Deportes", "FC Barcelona Femení — Próximo partido en casa", "Temporada 2026/27", "Por confirmar", "Estadi Johan Cruyff", imgs.barcelonaMatch, "https://www.fcbarcelona.com/en/tickets/womens-football", {
    distance: "5,2 km", price: "Precio pendiente de publicación", availability: "Calendario pendiente",
    organizer: "FC Barcelona Femení", duration: "2 h aprox.", description: "Sigue los próximos partidos del FC Barcelona Femení y consulta la disponibilidad cuando el club publique el calendario.", confirmed: false,
  }, "Barcelona"),
  make(31, "Deportes", "FC Barcelona Bàsquet — Partido en casa", "Temporada 2026/27", "Por confirmar", "Palau Blaugrana", imgs.barcelonaBasketball, "https://www.fcbarcelona.com/en/tickets/basketball", {
    distance: "5,2 km", price: "Precio pendiente de publicación", availability: "Calendario pendiente",
    organizer: "FC Barcelona Bàsquet", duration: "2 h aprox.", description: "El equipo azulgrana disputa sus partidos como local en el Palau Blaugrana; fechas y entradas se publicarán en la agenda oficial.", confirmed: false,
  }, "Barcelona"),
  make(32, "Ópera", "Aida — Giuseppe Verdi", "Martes, 6 de octubre de 2026", "19:30", "Gran Teatre del Liceu", imgs.barcelonaAida, "https://www.liceubarcelona.cat/en/aida", {
    distance: "0,8 km", price: "Consultar tarifa oficial", availability: "Entradas disponibles",
    organizer: "Gran Teatre del Liceu", duration: "3 h 20 min", confirmed: true,
    description: "La producción de Aida dirigida por Shirin Neshat abre la temporada del Liceu con un montaje visual sobre identidad, exilio y poder.",
  }, "Barcelona"),
  make(33, "Ópera", "La jove Aïda", "Sábado, 10 de octubre de 2026", "11:00", "Gran Teatre del Liceu · Sala Gran", imgs.barcelonaJoveAida, "https://www.liceubarcelona.cat/en/jove-aida", {
    distance: "0,8 km", price: "Consultar tarifa oficial", availability: "Entradas disponibles",
    organizer: "Gran Teatre del Liceu", duration: "1 h", confirmed: true,
    description: "Una producción del Petit Liceu que reinterpreta la ópera de Verdi con escenografía audiovisual y una mirada dirigida a nuevos públicos.",
  }, "Barcelona"),
  make(34, "Ópera", "L’Òpera de tres rals — Bertolt Brecht y Kurt Weill", "Del 17 de septiembre al 11 de octubre de 2026", "Según función", "Teatre Lliure de Montjuïc · Sala Fabià Puigserver", imgs.barcelonaOperaTresRals, "https://entrades.teatrelliure.com/selection/event/date?productId=10229820879571&lang=en", {
    distance: "2,2 km", price: "Consultar precio oficial", availability: "Entradas disponibles",
    organizer: "Teatre Lliure", confirmed: true,
    description: "Marta Pazos dirige la opereta de Brecht y Weill en una nueva producción del Teatre Lliure con dirección musical de Dani Espasa.",
  }, "Barcelona"),
  make(35, "Danza", "Sara Baras — Infinita", "Lunes, 5 de octubre de 2026", "20:30", "Gran Teatre del Liceu", imgs.barcelonaSaraBaras, "https://www.liceubarcelona.cat/en/sara-baras-2026", {
    distance: "0,8 km", price: "Consultar precio oficial", availability: "Entradas disponibles",
    organizer: "Clipper's Musical Events", duration: "Según función", confirmed: true,
    description: "Sara Baras presenta Infinita, una creación flamenca que reúne ocho perspectivas femeninas en un espectáculo sobre legado, tierra y movimiento.",
  }, "Barcelona"),
  make(36, "Danza", "Spiegelneuronen — Sasha Waltz & Guests", "23 y 24 de octubre de 2026", "Según función", "Teatre Lliure de Montjuïc · Sala Fabià Puigserver", imgs.barcelonaDance, "https://entrades.teatrelliure.com/selection/event/date?productId=10229820879576&lang=en", {
    distance: "2,2 km", price: "Consultar precio oficial", availability: "Entradas disponibles",
    organizer: "Teatre Lliure", confirmed: true,
    description: "Una velada de danza documental con público, concebida por Stefan Kaegi y Sasha Waltz & Guests para el Teatre Lliure.",
  }, "Barcelona"),
];

export const cityEventCounts: Record<City, number> = Object.fromEntries(
  cities.map((city) => [city, events.filter((event) => venueFor(event.venueId).city === city).length]),
) as Record<City, number>;