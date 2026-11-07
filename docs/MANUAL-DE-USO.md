# 📖 Manual de uso

> Cómo sacarle partido a Plan Cerca y cómo mantener su catálogo. Para la visión general y la parte técnica, mira el [README](../README.md); para ver la app, la [guía visual](GUIA-VISUAL.md).

**Para quien usa la app**

1. [Empezar](#empezar)
2. [Encontrar un plan](#encontrar-un-plan)
3. [Antes de ir: la ficha del evento](#antes-de-ir-la-ficha-del-evento)
4. [Guardar lo que te interesa](#guardar-lo-que-te-interesa)
5. [Recintos y artistas](#recintos-y-artistas)
6. [Idioma](#idioma)
7. [Qué se guarda en tu navegador](#qué-se-guarda-en-tu-navegador)
8. [Preguntas frecuentes](#preguntas-frecuentes)

**[Para quien mantiene la app](#para-quien-mantiene-la-app)**

9. [Arrancar en local](#arrancar-en-local)
10. [Añadir un evento](#añadir-un-evento)
11. [Añadir un recinto](#añadir-un-recinto)
12. [Añadir un artista o espectáculo](#añadir-un-artista-o-espectáculo)
13. [Añadir una ciudad](#añadir-una-ciudad)
14. [Publicar](#publicar)
15. [Rehacer las capturas](#rehacer-las-capturas)

---

## Empezar

Entra en **[plancerca.com](https://plancerca.com)**. No hay registro ni nada que instalar.

La primera vez te pregunta **qué ciudad quieres explorar**:

- **Elige una de la lista** y pulsa «Ver eventos de…».
- O pulsa **«Usar mi ubicación»**. El navegador te pedirá permiso; si estás a menos de 65–80 km de alguna de las seis ciudades, te la propone. Si no das permiso o estás lejos, vuelves a la lista.
- **«Ahora no»** cierra el diálogo y muestra Madrid. No volverá a salir.

Para cambiar de ciudad más tarde, pulsa su nombre en la cabecera (junto al número de eventos).

## Encontrar un plan

**Para este fin de semana o esta semana.** En la portada, pulsa **«Esta semana»** (llega hasta el domingo) o **«Próximos 30 días»**. El número de cada botón dice cuántos planes hay; si es 0, el botón está desactivado.

**Por tipo de plan.** Debajo de los recomendados está **«Explorar todos»**, con pestañas por categoría: Música, Ópera, Danza, Deportes, Teatro, Exposiciones y Museos. Puedes marcar varias a la vez; **«Todos»** las quita.

**Por nombre.** Escribe en la barra de arriba un artista, un recinto o lo que buscas («rock», «flamenco», «ópera») y pulsa Intro. No hace falta poner tildes. Si en tu ciudad no hay nada pero sí en otra, te aparece un botón para ver los resultados allí.

**Con varios criterios.** Pulsa **«Filtros»** para combinar ciudad, categorías y fecha. Con **«Elegir fecha»** puedes buscar un día concreto. El botón de abajo («Ver resultados · 12») te dice cuántos resultados vas a ver antes de aplicarlo, y **«Limpiar»** lo deja todo como estaba.

**Mostrar más.** El catálogo enseña 12 eventos cada vez. Pulsa **«Mostrar más eventos»** para seguir; si entras en una ficha y vuelves atrás, sigues donde estabas.

> 💡 Todo lo que eliges queda en la dirección de la página. Si copias el enlace y se lo mandas a alguien, verá la misma búsqueda con los mismos filtros.

## Antes de ir: la ficha del evento

Pulsa cualquier tarjeta para abrir su ficha. Arriba tienes fecha, hora, recinto y duración, y estos botones:

| Botón | Qué hace |
|---|---|
| **Comprar en la web oficial** | Abre la venta oficial (Ticketmaster, la web del recinto…). Plan Cerca no vende entradas |
| **Compartir** | Abre el menú de compartir del dispositivo (WhatsApp, mensajes…). Si el navegador no tiene ese menú, copia el enlace |
| **Guardar** ♥ | Lo añade a tus favoritos |
| **Copiar enlace** | Copia la dirección de la ficha y confirma con «Enlace copiado» |
| **Añadir al calendario** | **Google Calendar** abre el evento listo para guardar. **Outlook / archivo .ics** descarga un archivo que abren Outlook, Apple Calendar y casi cualquier calendario |

Al añadirlo al calendario, la hora es la de España aunque estés en otro país. Si la hora aún no está confirmada, se guarda como evento de día completo.

Más abajo verás:

- **Disponibilidad**, con un punto de color: verde si hay entradas, rojo si está agotado (entonces no aparece el botón de compra), gris si hay que consultarlo en la web oficial.
- **Información práctica**: dirección, enlace a Google Maps y quién organiza.
- **Sobre el artista o el recinto**, otras fechas del mismo artista, más eventos en esa sala y eventos parecidos.

> ⚠️ Precios y disponibilidad pueden cambiar. Lo que diga la web oficial es lo que vale.

## Guardar lo que te interesa

Pulsa el **corazón** de una tarjeta o de una ficha. La pestaña **Favoritos** los muestra ordenados por fecha, lo más cercano primero. Para quitar uno, vuelve a pulsar el corazón.

Los favoritos se guardan **en este navegador**. Si cambias de móvil u ordenador, o borras los datos del navegador, no estarán allí.

## Recintos y artistas

**Recintos.** En la pestaña **Recintos** tienes las salas, teatros, estadios y museos de tu ciudad. Cada ficha trae la dirección, el botón **«Cómo llegar»** (Google Maps), la web oficial y sus próximos eventos.

**Artistas.** Si un evento tiene ficha de artista, verás **«Ver ficha completa»** en la sección «Sobre…» de la ficha del evento (por ejemplo, «Sobre la banda» o «Sobre Amaral»). Ahí aparecen todas sus fechas, en cualquier ciudad, y sus enlaces oficiales.

Los botones **«Seguir artista»** y **«Avisarme de nuevos eventos»** guardan tu preferencia en el navegador, pero **por ahora no envían ningún aviso**.

## Idioma

Cambia entre **Español**, **English** y **Français** con el selector de la cabecera (en el móvil pone ES, EN o FR). La app lo recuerda la próxima vez. Los títulos y descripciones de los eventos se quedan en español, como los publican los organizadores.

## Qué se guarda en tu navegador

Plan Cerca no tiene cuentas ni servidor propio: no envía tus datos a ningún sitio. Lo que recuerda lo guarda tu navegador (`localStorage`):

| Dato | Para qué |
|---|---|
| Favoritos | Los eventos con corazón |
| Idioma | El último que elegiste |
| Ciudad | La que elegiste, y la que detectó la ubicación si la usaste |
| Diálogo de bienvenida | Para no volver a mostrarlo |
| Artistas seguidos | Tus preferencias de «Seguir» y «Avisarme» |

**Para borrarlo todo:** en la configuración del navegador, borra los datos del sitio `plancerca.com` (en Chrome: candado de la barra de direcciones → «Configuración del sitio» → «Eliminar datos»). La próxima vez la app empezará de cero.

En modo incógnito, o si el navegador bloquea el almacenamiento, la app funciona igual, pero olvida todo al cerrar.

## Preguntas frecuentes

**No veo un evento que sé que existe.** El catálogo se mantiene a mano y no incluye todo lo que pasa en cada ciudad. Los eventos que ya han terminado también se ocultan.

**Abrí un enlace y dice «Este evento ya ha pasado».** Ese evento ya se celebró. La ficha te propone otros parecidos.

**«Usar mi ubicación» no encuentra mi ciudad.** Solo funciona si estás cerca de una de las seis ciudades. Si no, elígela de la lista.

**El precio dice «Consultar precio oficial».** El organizador no ha publicado un precio fijo, o varía según la zona. Pulsa «Comprar en la web oficial» para verlo.

---

## Para quien mantiene la app

### Arrancar en local

Necesitas **Node 22** y **pnpm 10** (o `mise install`, que lee [`.mise.toml`](../.mise.toml)).

```bash
pnpm install
pnpm dev          # http://localhost:8443
pnpm build        # comprueba que todo compila antes de publicar
```

### Añadir un evento

Añade un objeto a [`src/data/events.json`](../src/data/events.json). Un ejemplo real:

```jsonc
{
  "id": 89,                                   // número único: usa el mayor + 1
  "category": "Música",                       // Música, Ópera, Danza, Deportes, Teatro, Exposiciones o Museos
  "title": "Muse – The Wow! Signal Europa Tour",
  "date": "Sábado, 23 de enero de 2027",      // texto que se muestra
  "startDate": "2027-01-23",                  // AAAA-MM-DD: ordena, filtra y oculta lo pasado
  "endDate": null,                            // opcional, para eventos de varios días
  "time": "Por confirmar",                    // "20:30", o texto: "Por confirmar", "Varias funciones"…
  "duration": "2 h aprox.",                   // "2 h 15 min" se usa para la hora de fin en el calendario
  "venueId": "valencia-roig-arena",           // debe existir en venues.json
  "relatedEntityId": "muse",                  // opcional: ficha en related-entities.json
  "featured": true,                           // opcional: candidato a «Recomendados»
  "image": "https://…",
  "ticketUrl": "https://…",                   // venta oficial
  "price": "Consultar precio oficial",        // o "Desde 35 €"
  "availability": "Próximamente",             // "Entradas disponibles", "Agotado", "Consultar…"
  "confirmed": true,                          // false = fecha pendiente de confirmar
  "organizer": "Live Nation",
  "rating": 4.8,                              // opcional
  "popularity": "95%",                        // opcional
  "tags": ["Música", "Rock", "2027"],         // la categoría, la ciudad y el año no se muestran
  "description": "Una o dos frases para la tarjeta.",
  "fullDescription": "El texto largo de la ficha."
}
```

**Cuidado con:**

- **`venueId` tiene que existir** en `venues.json`. Si no, la app no carga (pantalla en blanco). Abre la app después de cada cambio.
- **`availability` se interpreta por su texto.** Si contiene «agotad», se oculta el botón de compra y sale en rojo. Si empieza por «Consult», sale en gris.
- **`startDate`** es lo que decide cuándo se oculta el evento. Sin ella, el evento va al final de la lista y no aparece en los filtros de fecha.
- El JSON no se valida al compilar: un campo mal escrito no da error, simplemente no se verá bien.

### Añadir un recinto

Añade un objeto a [`src/data/venues.json`](../src/data/venues.json). El `id` es la ciudad y el nombre en minúsculas, sin tildes y con guiones: `valencia-roig-arena`, `madrid-teatro-real`.

```jsonc
{
  "id": "valencia-roig-arena",
  "city": "Valencia",                          // una de las ciudades de city-images.json
  "name": "Roig Arena",
  "address": "C/ Bomber Ramón Duart, 12, Quatre Carreres, 46013 Valencia",
  "kind":        { "es": "Arena multiusos", "en": "Multi-purpose arena", "fr": "Arène polyvalente" },
  "description": { "es": "…", "en": "…", "fr": "…" },
  "image": "https://…",                         // o null: se muestra el logo
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=…",
  "websiteUrl": "https://…",                    // o null
  "programmeUrl": "https://…",                  // o null
  "programmeLabel": { "es": "Eventos", "en": "Events", "fr": "Événements" }
}
```

El texto de `kind` decide el color de la etiqueta: «museo», «estadio/pabellón/arena», «teatro», «ópera» o «concierto/música/auditorio».

### Añadir un artista o espectáculo

Añade una entrada a [`src/data/related-entities.json`](../src/data/related-entities.json) con su `id` como clave, y pon ese `id` en el `relatedEntityId` de sus eventos. Copia la de `muse` como plantilla: `kind` puede ser `artist`, `musical`, `play` o `show`, y los títulos de sección (`aboutTitle`, `relatedEventsTitle`, `profileEventsTitle`) van en los tres idiomas. Los botones «Seguir» y «Avisarme» solo aparecen en los de tipo `artist`.

La ficha estará en `/artist/<id>` y solo lista los eventos con `confirmed: true`.

### Añadir una ciudad

1. **[`city-images.json`](../src/data/city-images.json):** añade `"Nombre": "url-de-la-foto"`. Con esto la ciudad aparece en el selector, los contadores y los filtros. Mejor una foto alojada en un sitio estable (Unsplash, o dentro del repo en `public/`).
2. **[`city-coordinates.json`](../src/data/city-coordinates.json):** latitud, longitud y `radiusKm` del centro, para la ubicación.
3. **`venues.json`** y **`events.json`:** sus recintos y eventos.
4. **[`public/llms.txt`](../public/llms.txt)** y **[`public/ai-catalog.json`](../public/ai-catalog.json):** añade la ciudad a las listas, y a la descripción de `.figma/make/site.json`.

### Publicar

Las ramas de trabajo se fusionan en `develop` mediante PR, y de ahí a `main`. Vercel crea una vista previa de cada rama que se sube y publica en [plancerca.com](https://plancerca.com) lo que llega a `main`. Antes de fusionar:

- [ ] `pnpm build` termina sin errores.
- [ ] La app abre en local y la ficha de algún evento nuevo se ve bien.
- [ ] Las imágenes nuevas cargan (algunas webs bloquean que otras usen sus imágenes).

### Rehacer las capturas

Las capturas de [`docs/screenshots/`](screenshots/) se hicieron con la app en local, Valencia seleccionada y tres favoritos guardados. Cuando pasen esos eventos, conviene rehacerlas con:

- Ventana de **1440 × 900** para escritorio y **390 × 844** para móvil.
- Formato **JPG** de calidad 85, para que el repositorio no pese (el repo guarda las imágenes con Git LFS).
- Los mismos nombres de archivo, para no tener que cambiar los enlaces de la guía visual.

---

[← Volver al README](../README.md) · [📸 Guía visual](GUIA-VISUAL.md)
