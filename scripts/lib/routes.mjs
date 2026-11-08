// Pages and states visited by the automated browser checks (accessibility and third-party requests).
// Each entry can prepare localStorage to reach a given state (with data, empty, error...).
const withCity = { "plan-cerca.preferred-city": "Valencia", "plan-cerca.city-onboarding-dismissed": "true" };
const withFavourites = { ...withCity, "plan-cerca.saved-events": "[89,99,104,16]" };

export const routes = [
  { name: "inicio", path: "/?city=Valencia", storage: withCity },
  { name: "bienvenida", path: "/", storage: {} },
  // First visits through a shared link or the sitemap: nothing stored yet.
  { name: "enlace-compartido", path: "/event/89?city=Valencia", storage: {} },
  { name: "privacidad-primera-visita", path: "/privacidad", storage: {} },
  { name: "busqueda", path: "/search?q=rock&city=Valencia", storage: withCity },
  { name: "busqueda-sin-resultados", path: "/search?q=zzzz&city=Valencia", storage: withCity },
  { name: "busqueda-otra-ciudad", path: "/search?q=melendi&city=Barcelona", storage: withCity },
  { name: "filtros", path: "/search?city=Valencia", storage: withCity },
  { name: "evento", path: "/event/89?city=Valencia", storage: withFavourites },
  { name: "evento-pasado", path: "/event/16", storage: withCity },
  { name: "recintos", path: "/venues?city=Valencia", storage: withCity },
  { name: "recinto", path: "/venues/valencia-roig-arena?city=Valencia", storage: withCity },
  { name: "artista", path: "/artist/muse", storage: withCity },
  { name: "favoritos", path: "/favorites?city=Valencia", storage: withFavourites },
  { name: "favoritos-compartidos", path: "/favorites?lista=89,99,104&city=Valencia", storage: withCity },
  // Exactly the link "Compartir lista" creates, opened by someone who has never visited the site.
  { name: "lista-compartida-primera-visita", path: "/favorites?lista=89,99,104", storage: {} },
  { name: "perfil", path: "/perfil?city=Valencia", storage: { ...withFavourites, "plan-cerca.profile": JSON.stringify({ avatar: "mask", categories: ["Teatro", "Danza"] }) } },
  { name: "perfil-vacio", path: "/perfil", storage: withCity },
  { name: "favoritos-vacio", path: "/favorites?city=Valencia", storage: withCity },
  { name: "404", path: "/no-existe", storage: withCity },
  { name: "aviso-legal", path: "/aviso-legal", storage: withCity },
  { name: "privacidad", path: "/privacidad", storage: withCity },
  { name: "cookies", path: "/cookies", storage: withCity },
  { name: "terminos", path: "/terminos", storage: withCity },
  { name: "accesibilidad", path: "/accesibilidad", storage: withCity },
  { name: "tus-datos", path: "/tus-datos", storage: withFavourites },
  { name: "tus-datos-vacio", path: "/tus-datos", storage: withCity },
];

export const viewports = {
  movil: { width: 390, height: 844 },
  escritorio: { width: 1440, height: 900 },
};
