<p align="center">
  <img src="./public/favicon.svg" alt="Logo de Plan Cerca" width="72">
</p>

<h1 align="center">Plan Cerca</h1>

<p align="center">
  Conciertos, teatro, ópera, danza, exposiciones y deporte en tu ciudad, en un solo sitio.
</p>

<p align="center">
  <a href="https://plancerca.com"><strong>plancerca.com</strong></a>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white">
  <img alt="TypeScript 5.7" src="https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white">
  <img alt="Desplegado en Vercel" src="https://img.shields.io/badge/Vercel-desplegado-000?logo=vercel&logoColor=white">
</p>

<p align="center">
  <img src="./docs/screenshots/home-desktop.jpg" alt="Portada de Plan Cerca con la agenda de Valencia" width="900">
</p>

Plan Cerca es una agenda cultural y deportiva para seis ciudades de España: **Madrid, Barcelona, Valencia, Sevilla, Bilbao y Albacete**. Eliges ciudad, ves qué hay hoy, mañana o este mes, y desde cada ficha llegas a la web oficial para comprar la entrada.

Nació como proyecto de la asignatura de **Interacción Persona-Ordenador (HCI)**, así que la usabilidad, la accesibilidad y la jerarquía visual han pesado tanto como las funcionalidades.

**Índice**

- [Para quien quiere usar la app](#para-quien-quiere-usar-la-app)
- [Capturas](#capturas)
- [Para quien quiere ver el código](#para-quien-quiere-ver-el-código)
- [Contexto académico](#contexto-académico)

---

## Para quien quiere usar la app

Entra en **[plancerca.com](https://plancerca.com)**. No hace falta registrarse.

| | Qué puedes hacer |
|---|---|
| 📍 **Tu ciudad** | La app te propone la ciudad más cercana (si das permiso de ubicación) o la eliges tú. Puedes cambiarla cuando quieras desde la cabecera. |
| 📅 **Atajos de fecha** | Hoy, Mañana, Esta semana o Próximos 30 días, con el número de planes de cada uno. |
| 🔍 **Búsqueda** | Busca por evento, artista o recinto y filtra por categoría: Música, Ópera, Danza, Deportes, Teatro, Exposiciones y Museos. |
| 🎟️ **Ficha del evento** | Fecha, hora, duración, recinto, descripción, disponibilidad y botón directo a la venta oficial. También puedes compartirla, copiar el enlace o añadirla a tu calendario. |
| 🏛️ **Recintos** | Directorio por ciudad con dirección, cómo llegar, web oficial y los próximos eventos de cada sala. |
| 🎤 **Artistas** | Ficha del artista con sus fechas en todas las ciudades y enlaces oficiales. Puedes seguirlo y pedir aviso de nuevos eventos. |
| ❤️ **Favoritos** | Guarda eventos con el corazón y encuéntralos agrupados en la pestaña Favoritos. Se quedan en tu navegador. |
| 🌍 **Idiomas** | Español, inglés y francés. |
| 📱 **Móvil** | Diseño pensado primero para el móvil, con carruseles y navegación a una mano. |

> Precios y disponibilidad cambian a menudo. La información definitiva es siempre la del vendedor oficial al que enlaza cada ficha.

## Capturas

### Escritorio

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/event-desktop.jpg" alt="Ficha de evento"><br><sub><b>Ficha de evento.</b> Datos clave arriba y compra en la web oficial.</sub></td>
    <td width="50%"><img src="./docs/screenshots/search-desktop.jpg" alt="Resultados de búsqueda"><br><sub><b>Búsqueda.</b> Resultados con filtros por categoría.</sub></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/venues-desktop.jpg" alt="Directorio de recintos"><br><sub><b>Recintos.</b> Los espacios de cada ciudad y cuántos eventos tienen.</sub></td>
    <td><img src="./docs/screenshots/venue-desktop.jpg" alt="Ficha de recinto"><br><sub><b>Ficha de recinto.</b> Dirección, cómo llegar y próximos eventos.</sub></td>
  </tr>
  <tr>
    <td><img src="./docs/screenshots/artist-desktop.jpg" alt="Ficha de artista"><br><sub><b>Artista.</b> Todas sus fechas, seguir y avisos.</sub></td>
    <td><img src="./docs/screenshots/favorites-desktop.jpg" alt="Favoritos"><br><sub><b>Favoritos.</b> Los planes que has guardado.</sub></td>
  </tr>
</table>

### Móvil

<p align="center">
  <img src="./docs/screenshots/home-mobile.jpg" alt="Portada en móvil" width="240">
  &nbsp;
  <img src="./docs/screenshots/event-mobile.jpg" alt="Ficha de evento en móvil" width="240">
  &nbsp;
  <img src="./docs/screenshots/filters-mobile.jpg" alt="Filtros en móvil" width="240">
</p>

---

## Para quien quiere ver el código

### Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + React Router 7 |
| Lenguaje | TypeScript 5.7 |
| Estilos | Tailwind CSS 4 (plugin `@tailwindcss/vite`) y CSS propio en `src/index.css` |
| Build | Vite 8 |
| Formato | oxfmt |
| Despliegue | Vercel (SPA con reescritura a `index.html`) |
| Origen | Prototipo iniciado en Figma Make |

No hay backend ni base de datos: los eventos, recintos y artistas son ficheros JSON dentro del repo, y las preferencias del usuario se guardan en `localStorage`.

### Arranque rápido

Requisitos: Node 22 y pnpm 10 (versiones fijadas en [.mise.toml](.mise.toml)).

```bash
pnpm install
pnpm dev        # http://localhost:8443 (o el puerto de la variable PORT)
```

| Script | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo con recarga en caliente |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm preview` | Sirve el build localmente |
| `pnpm format` | Formatea el código con oxfmt |

### Estructura

```text
src/
├── App.tsx                    # Rutas, páginas y componentes principales
├── main.tsx                   # Punto de entrada de React
├── index.css                  # Tailwind, tema y estilos globales
├── components/                # Selector y onboarding de ciudad, iconos, errores, imágenes con fallback
├── context/
│   └── PreferredCityContext.tsx   # Ciudad activa: URL, geolocalización y preferencia guardada
├── data/
│   ├── events.json            # Catálogo de eventos
│   ├── venues.json            # Recintos (textos en es/en/fr)
│   ├── related-entities.json  # Artistas, musicales y espectáculos
│   ├── city-images.json       # Ciudades disponibles e imagen de portada
│   ├── city-coordinates.json  # Centro y radio de cada ciudad para la geolocalización
│   ├── translations.json      # Textos de la interfaz en es/en/fr
│   └── *.ts                   # Acceso tipado a los datos anteriores
└── types/Event.ts             # Tipos de evento, recinto, ciudad y categoría
public/
├── llms.txt, ai-catalog.json  # Descripción del sitio para buscadores y agentes de IA
└── robots.txt, favicon.svg
```

### Rutas

| Ruta | Página |
|---|---|
| `/?city=Valencia` | Portada con la agenda de la ciudad |
| `/search?q=rock&city=Valencia` | Búsqueda y filtros |
| `/event/:id` | Ficha de evento |
| `/venues` · `/venues/:id` | Directorio y ficha de recinto |
| `/artist/:slug` · `/entity/:slug` | Ficha de artista, musical o espectáculo |
| `/favorites` | Favoritos |

La ciudad y la búsqueda viven en la URL, así que cualquier vista se puede compartir y el botón Atrás del navegador funciona como se espera.

### Datos

El catálogo tiene ahora **239 eventos en 44 recintos**. Cada evento de `events.json` apunta a un recinto por `venueId` y, si es de un artista o espectáculo con ficha propia, a `related-entities.json` por `relatedEntityId`.

```jsonc
{
  "id": 89,
  "category": "Música",
  "title": "Muse – The Wow! Signal Europa Tour",
  "startDate": "2027-01-23",
  "venueId": "valencia-roig-arena",
  "relatedEntityId": "muse",
  "ticketUrl": "https://…",
  "confirmed": true
  // …precio, disponibilidad, etiquetas, descripciones
}
```

Al cargar, `event-catalog.ts` ordena los eventos por fecha y deja fuera los que ya han terminado. Sus fichas siguen accesibles y avisan de que el evento ya pasó.

**Añadir una ciudad:** añade una entrada en `city-images.json` (de ahí sale la lista de ciudades y el tipo `City`) y otra en `city-coordinates.json`, y después sus recintos en `venues.json`.

### Lo que se guarda en el navegador

Todo en `localStorage` y protegido con `try/catch`. Si el almacenamiento está bloqueado (por ejemplo, en modo privado), la app sigue funcionando y las preferencias duran lo que dure la sesión.

| Clave | Contenido |
|---|---|
| `plan-cerca.saved-events` | IDs de eventos favoritos |
| `plan-cerca.language` | Idioma elegido |
| `plan-cerca.preferred-city` | Ciudad elegida |
| `plan-cerca.detected-city`, `plan-cerca.geolocation-status` | Resultado de la geolocalización |
| `plan-cerca.city-onboarding-dismissed` | Si ya se cerró el diálogo de bienvenida |
| `plancerca.artist-preferences` | Artistas seguidos y avisos activados |

### Accesibilidad

- Respeta `prefers-reduced-motion`: sin animaciones ni desplazamiento suave si el sistema lo pide.
- Carruseles con botones etiquetados y contador anunciado con `aria-live`.
- Atributo `lang` del documento sincronizado con el idioma elegido.
- Contraste revisado en el tema oscuro, sobre todo en móvil.
- Imágenes con texto alternativo y una imagen de reserva si falla la carga.

### Despliegue

[vercel.json](vercel.json) reescribe todas las rutas a `index.html` para que React Router resuelva la URL y sirve `llms.txt`, `ai-catalog.json` y `robots.txt` con su `Content-Type` correcto. Título, descripción e idioma del documento se configuran en `.figma/make/site.json`.

---

## Contexto académico

Proyecto de la asignatura de **Interacción Persona-Ordenador (HCI)**. El diseño se ha iterado a partir de revisiones de usabilidad, con estos objetivos:

- Encontrar un plan en pocos toques, empezando por la ciudad y la fecha.
- Una jerarquía visual clara: lo que más importa (cuándo, dónde, cuánto) siempre arriba.
- Accesibilidad desde el principio, no como parche final.
- La misma experiencia en móvil y en escritorio.

El historial de commits recoge esas iteraciones: el tema oscuro con acento violeta, las animaciones que respetan la reducción de movimiento, las traducciones completas, los atajos de fecha en la portada y los ajustes de contraste.
