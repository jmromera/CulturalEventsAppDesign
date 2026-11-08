# Plan de mejoras de UI/UX y accesibilidad

> Propuesta a 7 de noviembre de 2026, pendiente de aprobación. Rama `feat/ui-hci` (sale de `chore/lanzamiento-legal`, sin push).
> Esfuerzo: **S** ≈ 1–2 h · **M** ≈ medio día · **L** ≈ 1 día · **XL** ≈ 2 días o más.

## Auditoría propia (resumen)

**Medido** (axe-core con reglas WCAG 2.0/2.1/2.2 AA y buenas prácticas, 4 pantallas × móvil 390 px y escritorio 1440 px):

| Pantalla | axe | Encabezados en `main` | Controles < 44 px | Alto de tarjeta |
|---|---|---|---|---|
| Inicio | 0 | 1 H1, 2 H2 (las tarjetas no tienen encabezado) | 19 móvil / 38 escritorio | 540–614 px |
| Filtros | 0 | 1 H1, 3 H2 | 10 / 14 | — |
| Detalle | 0 | 1 H1, 7 H2, 3 H3 | 18 / 38 | 469–605 px |
| Favoritos | 0 | 1 H1 (tarjetas sin encabezado) | 12 / 20 | 519–604 px |

axe no encuentra errores, pero eso no basta: las tarjetas no son navegables por encabezados, y muchos objetivos táctiles miden menos de 44 px. WCAG 2.2 AA solo exige 24 px (2.5.8); 44 px es el nivel AAA (2.5.5) y lo que recomiendan Apple y Android, y lo adoptamos como objetivo.

**Datos para el periodo de evaluación (20/12/2026 – 31/01/2027):**

| Ciudad | Eventos en el periodo | Semanas flojas |
|---|---|---|
| Madrid | 25 | Navidad (1 evento) |
| Barcelona | 16 | — |
| Valencia | 33 | — |
| Sevilla | 17 | — |
| Bilbao | 9 | 4 semanas con 1 evento |
| Albacete | 10 | **0 eventos** en las semanas del 28/12 y del 4/1 |

Más hallazgos:
- Solo 33 de 239 eventos tienen precio en cifras.
- **Ningún recinto tiene coordenadas**, así que no hay mapa ni «cerca de mí».
- 23 imágenes se repiten.
- Muchos carteles muestran a personas famosas.

**Correcciones a tu lista:**
- «Recomendados» **sí** tiene corazón; lo que pasa es que es el mismo componente con otra variante.
- Favoritos **sí** tiene estado con contenido (ordenado por fecha, con contador), pero sin agrupar en próximos y pasados.
- El detalle **ya tiene** eventos similares, otras fechas del artista y más eventos del recinto.
- El contraste del hero ya se midió y cumple (≥ 4,5:1 en las 6 portadas).

**Añadidos a tu lista:**
- Las tarjetas no tienen encabezado tampoco en Favoritos ni en el detalle.
- El hueco entre «Mostrar más» y el pie se debe a un `min-height: 100vh` en la página.
- El catálogo calcula «hoy» al cargar el módulo, lo que impide probar con fechas simuladas.
- Las valoraciones y el «% de popularidad» no tienen fuente (ya estaba en `docs/legal/TEXTOS-A-REVISAR.md`).
- Producción (`main`) sigue mostrando «Próximamente».

## Conflictos que necesitan tu decisión

1. **Mapa y privacidad.** Leaflet con OpenStreetMap pide teselas a `tile.openstreetmap.org`, que recibe la IP del visitante. Hoy la web promete «ningún tercero» y la CSP lo bloquea. **Propuesta:** el mapa solo se carga al pulsar «Ver mapa», se declara en la privacidad y se abre la CSP solo a ese dominio. La lista sigue siendo la vista por defecto y la alternativa accesible.
2. **Publicar con datos legales de ejemplo.** Para que te evalúen hace falta que `main` muestre la app, y las páginas legales tienen hoy un aviso rojo porque `esEjemplo` es `true`. **Propuesta:** rellenar `datos-legales.json` con tus datos de estudiante (o los de la universidad) antes del 20/12, o aceptar el aviso rojo durante la evaluación.
3. **Valoraciones y popularidad.** No tienen fuente. **Propuesta:** quitarlas de tarjetas y detalle, y quitar «Mejor valorado» de la franja.
4. **Filtro de precio.** Hoy no funcionaría con 206 eventos sin precio. **Propuesta:** guardar el precio al rehacer el catálogo y entonces mostrar «Gratis / De pago». Mientras falte, no lo muestro.
5. **Barrio o distrito.** No hay datos. **Propuesta:** filtrar por radio de distancia (1, 5, 10 y 25 km) en lugar de por barrio.

## P0 · Datos válidos hasta el 31/01/2027 y despliegue público

| # | Tarea | Esfuerzo | Archivos |
|---|---|---|---|
| 0.1 | Rehacer el catálogo del 20/12/2026 a finales de marzo de 2027 en las 6 ciudades. Eventos reales buscados en webs oficiales, con `sourceUrl` en cada uno y «Por confirmar» donde falte un dato. Prioridad: grandes conciertos, LaLiga, Champions, Copa, Supercopa, Euroliga/ACB, Navidad y Fin de Año, musicales. Todas las semanas cubiertas; Albacete y Bilbao, que flojean, con su programación real de teatros y auditorios | **XL** | `src/data/events.json`, `venues.json`, `related-entities.json` |
| 0.2 | Imágenes sin personas famosas: foto del recinto con licencia libre (Wikimedia Commons, con atribución) o degradado con el icono de la categoría. Elimina además el riesgo de derechos de autor de los carteles | L | datos, `public/images/`, `docs/legal/ORIGEN-IMAGENES.json`, créditos |
| 0.3 | Coordenadas de los 44 recintos, buscadas una sola vez y guardadas en el repo (nada se consulta en tiempo real) | S | `venues.json`, `scripts/` |
| 0.4 | Catálogo calculado según la fecha del visitante (`getCatalog(now)`). Recomendados prioriza eventos grandes y próximos. Chip a 0 desactivado con enlace a «Próximos 30 días». Prueba que simula el 20/12/2026, el 01/01/2027 y el 31/01/2027: cada ciudad tiene eventos futuros y Recomendados no está vacío | M | `event-catalog.ts`, `App.tsx`, `tests/` |
| 0.5 | Despliegue: seguir en **Vercel**, que ya está conectado, tiene `vercel.json` con la regla que hace funcionar `/event/169` al recargar y no depende de ninguna API ni clave. Fusionar en `develop` y luego en `main`, sustituyendo «Próximamente». README con cómo volver a desplegar | S | `vercel.json`, `src/main.tsx` (en `main`), README |
| 0.6 | Nombre de la asignatura: «HCI: Desarrollo web y móvil» en el pie, «Acerca de» y README (9 menciones, en es/en/fr) | S | `translations.json`, `README.md` |

## P1 · Lo que pide el enunciado y accesibilidad

| # | Tarea | Esfuerzo | Archivos |
|---|---|---|---|
| 1.1 | **Ubicación:** «Cerca de mí» (permiso solo al pulsar, cálculo en el dispositivo, aviso y alternativa si se deniega), radio de distancia y orden por distancia | M | `App.tsx`, `PreferredCityContext.tsx`, `lib/geo.ts`, privacidad |
| 1.2 | ~~**Mapa:** botón Lista / Mapa en el listado y mini mapa en el detalle, con Leaflet y OpenStreetMap cargados al pulsar~~. **Retirado en P1.4c**: OpenStreetMap bloqueaba las teselas (ver CHANGELOG-UI) | L | — |
| 1.3 | **Filtros:** cajón lateral en escritorio y hoja inferior en móvil; filtros activos como chips con ×; horario (mañana, tarde, noche); calendario visible; contador «Ver X resultados» en vivo; sin duplicar las categorías | L | `App.tsx` (sacar `Filters` a `components/FiltersPanel.tsx`) |
| 1.4 | **Lista personal y perfil:** favoritos agrupados en Próximos y Pasados, quitar, añadir todos al calendario (un solo `.ics`), compartir la lista. Perfil con ciudad por defecto, categorías favoritas (que alimentan Recomendados), idioma y tema. Nuevas claves en el registro de almacenamiento y en la página de cookies | L | `pages/Favorites.tsx`, `pages/Profile.tsx`, `storage-keys.ts` |
| 1.5 | **Reserva de demostración:** sesión, número de entradas, resumen y confirmación, con el aviso «Reserva de demostración: no se realiza ningún pago». Sin datos de tarjeta | M | `components/DemoBooking.tsx`, términos |
| 1.6 | **Accesibilidad:** títulos de tarjeta como `<h3>` y un H1 por página; avisos con `aria-live` al guardar o quitar favoritos y al cargar más; foco en la primera tarjeta nueva tras «Mostrar más»; corazón con `aria-label` que incluye el evento; objetivos táctiles de 44 px en móvil; paneles nuevos con foco atrapado, cierre con Esc y foco devuelto al botón | M | `App.tsx`, CSS, pruebas |

## P2 · Consistencia y jerarquía

| # | Tarea | Esfuerzo |
|---|---|---|
| 2.1 | Tarjeta compacta única: imagen, fecha tipo calendario, categoría, título `<h3>` enlazado sobre toda la tarjeta, lugar · hora, precio solo si se conoce y corazón. Sin «Ver detalle», «Consultar precio oficial» ni la franja de disponibilidad | M |
| 2.2 | Paleta de categorías armónica con el morado, como tokens, con texto blanco ≥ 4,5:1 medido | S |
| 2.3 | Franja de stats convertida en accesos directos que aplican un filtro, o eliminada | S |
| 2.4 | Cabecera: ciudad e idioma agrupados; «Invitado» pasa a avatar con menú (perfil, favoritos, tema) | M |
| 2.5 | Detalle: un solo «Guardar»; estrella alineada; sin «Por confirmar» repetido; tarjeta de reserva fija al hacer scroll en escritorio y barra CTA fija en móvil | M |
| 2.6 | Pie: «Acerca de» alineado y sin hueco antes del pie | S |

## P3 · Estética y efecto «wow»

| # | Tarea | Esfuerzo |
|---|---|---|
| 3.1 | Tokens CSS para todo (color, espacio, radio, sombra, tipografía) con escala 1,25 y `clamp()`; modo claro y oscuro con interruptor y `prefers-color-scheme`. Es lo más costoso: el CSS actual (≈ 100 KB) superpone reglas de tema claro y oscuro | **XL** |
| 3.2 | Hero con buscador grande y chips con el estado activo bien marcado | S |
| 3.3 | Recomendados como carrusel con scroll-snap, flechas y tarjetas grandes con el título sobre la imagen | M |
| 3.4 | Secciones temáticas: «Este fin de semana», «Navidad y Fin de Año», «Cerca de ti» y «Gratis» si hay precio | M |
| 3.5 | Barra inferior en móvil (Inicio, Buscar, Favoritos, Perfil) y cabecera con efecto cristal al hacer scroll | M |
| 3.6 | Microinteracciones (corazón, elevación, zoom), transiciones con la View Transitions API (con alternativa y respetando «reducir movimiento») y estados vacíos ilustrados | M |
| 3.7 | Fuente display autoalojada solo para titulares grandes | S |
| 3.8 | Esqueletos de carga solo para imágenes: los datos se cargan con la página y no hay espera que mostrar | S |

## Dependencias nuevas

- ~~**Leaflet**~~: añadido en P1.2 y retirado en P1.4c junto con el mapa. El proyecto vuelve a no tener dependencias de mapas.
- **Una fuente display autoalojada** (`@fontsource`).
- Nada más: componentes, paneles y transiciones con React y CSS.

## Cómo trabajaré

- Iteraciones pequeñas: P0 y después P1 → P2 → P3.
- Tras cada una: `pnpm test`, `pnpm check:a11y`, `pnpm check:terceros` y recorrido completo con teclado.
- Registro en `docs/CHANGELOG-UI.md`; al final, capturas en `docs/capturas/despues/` y `docs/sistema-de-diseno.md`.
- Sin push hasta que lo pidas.
