// Pages and states visited by the automated browser checks (accessibility and third-party requests).
// Each entry can prepare localStorage to reach a given state (with data, empty, error...).
const withCity = { "plan-cerca.preferred-city": "Valencia", "plan-cerca.city-onboarding-dismissed": "true" };
const withFavourites = { ...withCity, "plan-cerca.saved-events": "[89,99,104]" };

export const routes = [
  { name: "inicio", path: "/?city=Valencia", storage: withCity },
  { name: "bienvenida", path: "/", storage: {} },
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
  { name: "favoritos-vacio", path: "/favorites?city=Valencia", storage: withCity },
  { name: "404", path: "/no-existe", storage: withCity },
  { name: "aviso-legal", path: "/aviso-legal", storage: withCity },
  { name: "privacidad", path: "/privacidad", storage: withCity },
  { name: "cookies", path: "/cookies", storage: withCity },
  { name: "terminos", path: "/terminos", storage: withCity },
  { name: "tus-datos", path: "/tus-datos", storage: withFavourites },
  { name: "tus-datos-vacio", path: "/tus-datos", storage: withCity },
];

export const viewports = {
  movil: { width: 390, height: 844 },
  escritorio: { width: 1440, height: 900 },
};
