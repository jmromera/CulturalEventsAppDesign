# Registro de cambios de UI/UX y accesibilidad

Registro de cada iteración: qué cambió, por qué (principio de usabilidad o criterio WCAG 2.1 AA) y qué problemas aparecieron. Alimenta las secciones de metodología, justificación y problemas encontrados del PDF.

## Metodología

1. **Auditoría inicial** (7/11/2026): axe-core con `@axe-core/playwright` (reglas WCAG 2.0/2.1/2.2 A y AA más buenas prácticas) sobre las 4 pantallas clave, en móvil (390 × 844) y escritorio (1440 × 900); medición de encabezados, objetivos táctiles y alto de tarjetas; análisis de la cobertura de datos para el periodo de evaluación. Resultado en `docs/PLAN-UI.md`.
2. **Capturas «antes»** con Playwright en `docs/capturas/antes/` (`node scripts/capture-screens.mjs docs/capturas/antes`).
3. **Iteraciones pequeñas**, una mejora o grupo coherente por vez, con un commit cada una. Tras cada iteración: pruebas automáticas (`pnpm test`), axe en todas las páginas (`pnpm check:a11y`), comprobación de terceros y CSP (`pnpm check:terceros`) y recorrido completo con teclado.

---

## P0 · Datos válidos hasta el 31/01/2027 y despliegue

### Iteración 1 · Nombre correcto de la asignatura

- **Qué:** «Interacción Persona-Ordenador (HCI)» pasa a «HCI: Desarrollo web y móvil» en el pie, el diálogo «Acerca de» (español, inglés y francés) y el README. En inglés y francés se conserva el nombre oficial y se traduce solo la parte descriptiva entre paréntesis.
- **Por qué:** exactitud del contenido; el nombre oficial de la asignatura no se traduce.

### Iteración 2 · Datos legales de proyecto académico

- **Qué:** `datos-legales.json` pasa de una empresa ficticia a los datos mínimos de un proyecto académico: nombre, condición de estudiante, asignatura, contacto (`jmromera@hotmail.com`) y «proyecto académico sin actividad comercial». Se eliminan NIF, domicilio y datos registrales. Plazo de respuesta: «un mes» (el máximo del art. 12.3 RGPD). Los datos de Vercel se redactan sin cifras inventadas.
- **Por qué:** minimización de datos (art. 5.1.c RGPD): no se publica nada que no haga falta. La web tiene que poder publicarse para la evaluación.
- **Pendiente:** `[TU NOMBRE]` y `[UNIVERSIDAD]` siguen como marcadores. Mientras estén, `esEjemplo` sigue en `true` y las páginas legales muestran el aviso rojo. Una prueba impide poner `esEjemplo: false` con marcadores o con el proveedor sin verificar.

### Iteración 3 · Catálogo calculado con la fecha del visitante

- **Qué:**
  - El catálogo pasa a ser una función de la fecha (`catalogAt(now)`) en lugar de calcularse una sola vez.
  - Recomendados sale de una función probada (`recommendedEvents`): primero los grandes eventos, luego los destacados y luego el resto, cada grupo por fecha. Las exposiciones van al final y hay una sola entrada por artista.
  - Si Hoy, Mañana y Esta semana están a 0, el hero muestra «No hay planes para estos días» con un botón a «Próximos 30 días», o a todo el catálogo si tampoco hay nada en el mes.
- **Por qué:**
  - Prevención de errores y visibilidad del estado del sistema (heurísticas de Nielsen 5 y 1): la web se evalúa entre el 20/12/2026 y el 31/01/2027 y nunca debe mostrar una pantalla vacía ni botones muertos sin salida.
- **Problema encontrado:** la prueba con fechas simuladas falla el 31/01/2027 con los datos actuales: Albacete se queda sin eventos y Bilbao sin tres recomendados. Se resuelve en la iteración del catálogo.

### Iteración 4 · Fuera valoraciones y popularidad; etiqueta «Gran evento»

- **Qué:**
  - Se eliminan la valoración («★ 4.8»), el «% de popularidad» y la tarjeta «Mejor valorado», también de los datos.
  - En su lugar, la etiqueta **«Gran evento»**.
- **Criterio de «Gran evento»:** el recinto tiene aforo para **10.000 personas o más** (estadios, pabellones y arenas: Movistar Arena, Palau Sant Jordi, Roig Arena, Metropolitano, Bernabéu, Mestalla, San Mamés…). Es un dato objetivo y comprobable: el aforo de cada recinto se guarda en `venues.json` con su fuente. La misma regla ordena Recomendados (grandes eventos primero).
- **Por qué:** las cifras no tenían fuente y no podían demostrarse (veracidad de la información comercial; ver `docs/legal/TEXTOS-A-REVISAR.md`). Una etiqueta basada en un dato verificable es honesta y además resume de un vistazo la escala del evento (reconocer antes que recordar, heurística 6).

### Iteración 5 · Recintos con coordenadas, aforo y foto libre

- **Qué:** `scripts/enrich-venues.mjs` añade a los 44 recintos:
  - **coordenadas**: de Wikidata o, si falta, de OpenStreetMap Nominatim;
  - **aforo** con su fuente: Wikidata, o la web oficial del BEC;
  - **foto con licencia libre** de Wikimedia Commons, con autor y licencia guardados para la atribución.

  Se consulta una sola vez y se guarda en el repo: la web no depende de ninguna API.
- **Resultado:** 15 recintos superan los 10.000 de aforo («Gran evento»); 36 de 44 tienen foto libre; los 8 restantes (salas pequeñas y los dos Lliure) usan el fondo con el icono de la categoría.
- **Por qué:**
  - Las coordenadas permiten el mapa y «Cerca de mí», que pide el enunciado.
  - El aforo da un criterio objetivo para «Gran evento».
  - Las fotos de recintos sustituyen a carteles con personas famosas y sin licencia.
- **Problemas encontrados:**
  - **Coordenadas erróneas:** Nominatim situó el Teatre Lliure de Gràcia en Sabadell, porque confundió la calle Montseny. Se detectó con una comprobación de distancia al centro de la ciudad (> 8 km) y se corrigió buscando por el nombre del teatro.
  - **Aforo ausente:** el BEC no tenía aforo en Wikidata. Se tomó el de su web oficial (20.000), más prudente que los 26.000 que dan otras fuentes para conciertos.

### Iteración 6 · Catálogo del 20/12/2026 al 31/03/2027 y nuevas reglas de Recomendados

**Catálogo.** `scripts/add-events-2027.py` añade **111 eventos reales** (350 en total), cada uno con `sourceUrl`. Se puede volver a ejecutar sin duplicar: compara recinto, fecha (±2 días) y protagonista.

| Tipo | Fuente | Qué se añadió |
|---|---|---|
| Fútbol | Calendario oficial de cada club en laliga.com | Partidos en casa de Real Madrid, Atlético, Rayo, Barça, Valencia, Sevilla, Betis, Athletic y Albacete (Hypermotion), incluidos los de Champions League con hora oficial. LaLiga fija el día exacto y la hora unas semanas antes: se muestran como «Jornada del fin de semana del 9-10 de enero (día por confirmar)». |
| Baloncesto | Calendarios de EuroLeague de realmadrid.com y fcbarcelona.com | Real Madrid en el Movistar Arena y el Clásico del 5/3 en el Palau Blaugrana. |
| Conciertos | Listados por recinto de conciertos.club y escenaensevilla.es, que enlazan a la venta oficial | Movistar Arena, Palau Sant Jordi, Roig Arena, Palacio de Congresos y La Rambleta (Valencia), BEC, Euskalduna y Kafe Antzokia (Bilbao) y Cartuja Center (Sevilla). |
| Albacete | GlobalEntradas, la taquilla oficial de Cultural Albacete | FEMUBA 2027, *El Cascanueces*, *Aida*, el 20.º Festival Internacional de Circo, Víctor Manuel, Israel Fernández, Catherine Russell… |
| Recintos nuevos | Wikidata / Commons / OpenStreetMap | Estadio Carlos Belmonte, Kafe Antzokia, Palacio de Congresos de Valencia, La Rambleta y Museo de la Cuchillería. |

**Problemas encontrados y cómo se resolvieron:**
- **Recinto equivocado.** El Real Betis juega la temporada 2026-27 en **La Cartuja** mientras se reconstruye el Villamarín, y cuatro partidos estaban situados en el Villamarín. Se corrigieron.
- **Programación de invierno sin publicar.** La del Teatro Circo no aparecía en su web; se encontró completa en GlobalEntradas, su taquilla oficial.
- **Semana sin eventos confirmados.** Del 28/12 al 3/1 Albacete no tenía nada: se añadió la colección permanente del Museo de la Cuchillería, abierta todo el periodo.
- **Partidos descartados.** Los del Albacete Basket quedan fuera porque no se encontró la dirección del Pabellón del Parque, necesaria para el mapa.
- **Filtro de precio:** solo 33 de 350 eventos publican un precio en cifras y ninguno es gratuito con certeza. El filtro «Gratis / De pago» no se puede ofrecer con datos fiables y se descarta.

**Imágenes.** Cada evento muestra su cartel o una foto del artista, sacados de su propia página de venta (`og:image`) y autoalojados. A los partidos sin imagen se les asigna la de otro partido del mismo club. La foto libre del recinto (Wikimedia Commons, con autor y licencia al pie) solo aparece como **último recurso**: en 7 de 350 eventos. Por indicación expresa, se asume el riesgo de derechos de autor de los carteles, al ser un proyecto universitario sin carácter comercial.

**Reglas de Recomendados.** Antes, Barcelona, Madrid y Sevilla recomendaban solo partidos de fútbol, porque el criterio era «gran evento primero» y los estadios son los recintos más grandes. Ahora `recommendedEvents` aplica estas reglas:

1. **Mayoría de conciertos.** Al menos 2 de cada 3 recomendados son de Música, con los grandes conciertos y giras (recinto de ≥ 10.000 personas) primero, después los destacados y luego por fecha.
2. **Deporte limitado.** Como máximo 1 evento deportivo de cada 3, así que nunca hay dos deportivos seguidos.
3. **Variedad.** No se repiten artista, equipo (el local) ni recinto.
4. **Huecos.** Si faltan conciertos, se completa con un musical, teatro, ópera o danza antes que con deporte. Las exposiciones solo entran como último recurso y nunca encabezan.

Por qué: la agenda es cultural (el enunciado habla de «conciertos, teatro, exposiciones») y la variedad ayuda a descubrir planes nuevos. Que no se repita el recinto obliga a mostrar escenarios distintos de la ciudad. `tests/catalog-dates.test.ts` comprueba las cuatro reglas en las 6 ciudades simulando el 20/12/2026, el 01/01/2027 y el 31/01/2027. También comprueba que cada ciudad tiene eventos futuros y que «Próximos 30 días» nunca está vacío.

### Iteración 7 · Cobertura hasta marzo y despliegue

- **Qué:**
  - 19 eventos más para febrero y marzo: temporada del Teatro de la Maestranza, FIBES, ABAO en el Euskalduna, Sala BBK y Palau de la Música Catalana.
  - Dos recintos nuevos: Auditorio FIBES y Sala BBK.
  - Instrucciones de publicación y mantenimiento en el README.
- **Cobertura** (eventos activos por semana · 🎵 conciertos · ⚽ deporte):

| Semana | Madrid | Barcelona | Valencia | Sevilla | Bilbao | Albacete |
|---|---:|---:|---:|---:|---:|---:|
| 20/12–20/12 | 2 (0 🎵 · 1 ⚽) | 4 (0 🎵 · 0 ⚽) | 3 (0 🎵 · 2 ⚽) | 3 (1 🎵 · 1 ⚽) | 2 (0 🎵 · 1 ⚽) | 4 (1 🎵 · 1 ⚽) |
| 21/12–27/12 | 3 (2 🎵 · 0 ⚽) | 5 (1 🎵 · 1 ⚽) | 5 (2 🎵 · 0 ⚽) | 4 (2 🎵 · 0 ⚽) | 5 (4 🎵 · 0 ⚽) | 4 (2 🎵 · 0 ⚽) |
| 28/12–03/01 | 5 (2 🎵 · 2 ⚽) | 4 (0 🎵 · 1 ⚽) | 8 (6 🎵 · 0 ⚽) | 4 (1 🎵 · 1 ⚽) | 3 (2 🎵 · 0 ⚽) | 1 (0 🎵 · 0 ⚽) |
| 04/01–10/01 | 7 (3 🎵 · 2 ⚽) | 5 (1 🎵 · 1 ⚽) | 9 (4 🎵 · 4 ⚽) | 3 (0 🎵 · 1 ⚽) | 6 (4 🎵 · 1 ⚽) | 3 (1 🎵 · 1 ⚽) |
| 11/01–17/01 | 7 (3 🎵 · 2 ⚽) | 7 (1 🎵 · 3 ⚽) | 7 (5 🎵 · 1 ⚽) | 4 (1 🎵 · 1 ⚽) | 5 (4 🎵 · 0 ⚽) | 5 (2 🎵 · 0 ⚽) |
| 18/01–24/01 | 9 (5 🎵 · 2 ⚽) | 5 (3 🎵 · 0 ⚽) | 10 (7 🎵 · 2 ⚽) | 4 (2 🎵 · 1 ⚽) | 5 (2 🎵 · 1 ⚽) | 5 (2 🎵 · 1 ⚽) |
| 25/01–31/01 | 10 (5 🎵 · 4 ⚽) | 6 (2 🎵 · 2 ⚽) | 5 (4 🎵 · 0 ⚽) | 5 (0 🎵 · 2 ⚽) | 3 (1 🎵 · 0 ⚽) | 5 (3 🎵 · 0 ⚽) |
| 01/02–07/02 | 3 (1 🎵 · 1 ⚽) | 2 (0 🎵 · 0 ⚽) | 5 (3 🎵 · 1 ⚽) | 4 (1 🎵 · 1 ⚽) | 5 (2 🎵 · 1 ⚽) | 3 (0 🎵 · 1 ⚽) |
| 08/02–14/02 | 4 (1 🎵 · 1 ⚽) | 2 (0 🎵 · 0 ⚽) | 3 (1 🎵 · 1 ⚽) | 4 (2 🎵 · 1 ⚽) | 3 (2 🎵 · 0 ⚽) | 4 (0 🎵 · 1 ⚽) |
| 15/02–21/02 | 7 (3 🎵 · 2 ⚽) | 4 (1 🎵 · 1 ⚽) | 1 (0 🎵 · 0 ⚽) | 4 (2 🎵 · 1 ⚽) | 4 (1 🎵 · 1 ⚽) | 3 (1 🎵 · 0 ⚽) |
| 22/02–28/02 | 5 (2 🎵 · 1 ⚽) | 2 (0 🎵 · 0 ⚽) | 1 (0 🎵 · 0 ⚽) | 4 (2 🎵 · 1 ⚽) | 2 (0 🎵 · 1 ⚽) | 2 (0 🎵 · 1 ⚽) |
| 01/03–07/03 | 5 (1 🎵 · 2 ⚽) | 4 (0 🎵 · 2 ⚽) | 2 (0 🎵 · 1 ⚽) | 4 (2 🎵 · 1 ⚽) | 2 (1 🎵 · 0 ⚽) | 4 (1 🎵 · 0 ⚽) |
| 08/03–14/03 | 6 (1 🎵 · 3 ⚽) | 4 (1 🎵 · 1 ⚽) | 4 (3 🎵 · 0 ⚽) | 1 (0 🎵 · 1 ⚽) | 3 (2 🎵 · 1 ⚽) | 2 (0 🎵 · 1 ⚽) |
| 15/03–21/03 | 3 (0 🎵 · 3 ⚽) | 2 (0 🎵 · 0 ⚽) | 2 (0 🎵 · 1 ⚽) | 3 (2 🎵 · 1 ⚽) | **0** | 1 (0 🎵 · 0 ⚽) |
| 22/03–28/03 | 1 (1 🎵 · 0 ⚽) | 3 (1 🎵 · 0 ⚽) | 2 (1 🎵 · 0 ⚽) | **0** | **0** | 2 (0 🎵 · 1 ⚽) |
| 29/03–31/03 | **0** | 2 (0 🎵 · 0 ⚽) | 1 (0 🎵 · 0 ⚽) | 2 (2 🎵 · 0 ⚽) | **0** | 1 (0 🎵 · 0 ⚽) |

- **Lectura:** en el periodo de evaluación (20/12–31/01) todas las ciudades tienen eventos todas las semanas. La única semana floja es la de Navidad en Albacete (28/12–3/1), cubierta con la colección permanente del Museo de la Cuchillería.
- **Pendiente:** quedan a 0 Bilbao desde el 15/03, Sevilla del 22 al 28/03 y Madrid del 29 al 31/03. Coinciden con el parón de selecciones y con programación que los recintos aún no han publicado. Se recomienda repetir la búsqueda a mediados de enero y ampliar con `scripts/add-events-2027.py`.

---

## P1 · Lo que pide el enunciado y accesibilidad

### Iteración P1.1 · «Cerca de mí»: ordenar y filtrar por distancia

- **Qué:**
  - Botón «Cerca de mí» junto a Filtros. Abre un panel que **explica antes** para qué se usa la ubicación y solo después la pide.
  - Con la ubicación: los eventos se ordenan por distancia, cada tarjeta muestra «a 2,3 km» y se puede limitar el radio (sin límite, 1, 5, 10 o 25 km).
  - «Dejar de usar mi ubicación» la olvida al momento.
  - Si se deniega el permiso o no responde en 10 s, un aviso (`role="alert"`) explica cómo seguir: por ciudad o buscando un recinto o barrio.
- **Por qué:**
  - El enunciado pide filtrar por ubicación.
  - Control y libertad del usuario y prevención de errores (heurísticas 3 y 5).
  - Privacidad desde el diseño: la posición se redondea a unos 100 m, se usa solo en memoria, no se envía ni se guarda, y la política de privacidad se actualizó para decirlo.
- **Accesibilidad:**
  - El botón indica su estado con `aria-expanded`.
  - El panel recibe el foco al abrirse y se cierra con Esc, devolviendo el foco al botón.
  - Los radios son botones con `aria-pressed`.
  - Todos los objetivos miden 44 px o más.
- **Barrio o distrito:** no hay datos de barrio; el radio de distancia lo sustituye, como se acordó.
- **Pruebas:** `tests/near-me.test.tsx` comprueba cinco cosas: que no se pide la ubicación antes de aceptar, el orden por distancia, el radio, que no se guarda ni se envía nada, y el permiso denegado.
- **Problema encontrado:** en móvil, una regla existente reducía los botones de la barra a un icono de 44 px (`font-size:0`), y «Cerca de mí» se veía como una caja vacía. Se le devolvió la etiqueta solo a ese botón.

### Iteración P1.2 · Mapa (Leaflet + OpenStreetMap) cargado solo a petición

- **Qué:**
  - Selector «Lista / Mapa» en el catálogo, con un marcador por recinto que lleva el número de eventos y un globo con sus eventos enlazados.
  - En el detalle, «Ver en el mapa» abre un mini mapa del recinto, además del enlace a Google Maps.
  - El mapa respeta los filtros activos y «Cerca de mí»: se centra en la persona si compartió su ubicación.
- **Por qué Leaflet:**
  - Es la librería de mapas más ligera: 44 KB comprimida, en un fragmento aparte que **solo se descarga al pulsar «Mapa»**.
  - No necesita clave de API ni tiene cuotas, así que nada puede caducar antes del 31/01.
  - Los marcadores son HTML, sin imágenes extra, y se manejan con teclado.
- **Privacidad:**
  - Las teselas vienen de `tile.openstreetmap.org` y solo se piden tras pulsar.
  - Un aviso junto al mapa lo explica, la política de privacidad lo declara (nueva fila en la tabla y OpenStreetMap Foundation en `datos-legales.json`) y la CSP solo abre `img-src` a ese dominio.
  - El modo mapa no se guarda en la URL, para que un enlace compartido nunca lo abra sin clic.
  - `pnpm check:terceros` falla si alguna página contacta OpenStreetMap sin pulsar «Mapa».
- **Accesibilidad:**
  - **Alternativa equivalente:** la lista sigue debajo del mapa con los mismos filtros (WCAG 1.1.1 y 2.1.1).
  - **Marcadores:** son focusables, tienen `role="button"` y un nombre como «Roig Arena: 50 eventos».
  - **Globos:**
    - Enter abre el globo y lleva el foco a su primer evento.
    - Esc lo cierra y devuelve el foco al marcador (2.4.3, orden del foco).
    - Los enlaces del globo miden 44 px de alto.
  - **Selector:** «Lista / Mapa» usa `aria-pressed` y «Ver en el mapa» usa `aria-expanded`.
- **Problemas encontrados:**
  - Tras abrir un globo con Enter, el Tab saltaba al marcador siguiente en vez de entrar en el globo; se movió el foco al abrir y al cerrar.
  - El número del marcador salía girado 45° con la forma de chincheta; se contrarrotó.
- **Pruebas:**
  - `tests/map.test.tsx`: el mapa no se carga hasta pulsar, un marcador por recinto, la lista sigue disponible y el mini mapa del detalle se abre y se cierra.
  - En navegador real: 83 comprobaciones de axe con el mapa abierto, recorrido con teclado (marcador → globo → ficha) y teselas cargadas con estado 200.

### Iteración P1.3 · Filtros en panel lateral (escritorio) y hoja inferior (móvil)

- **Qué:**
  - «Filtros» ya no lleva a otra página: abre un panel sobre la lista, a la derecha en escritorio y desde abajo en móvil.
  - Dentro: ciudad, atajos de fecha («Hoy», «Mañana», «Esta semana», «Próximos 30 días»), un **calendario del mes siempre visible** y la **franja horaria** (mañana antes de 14:00, tarde 14:00–20:00, noche desde 20:00).
  - El botón principal dice cuántos resultados saldrán («Ver 44 resultados») y se actualiza al tocar cualquier opción. Con 0 resultados se desactiva y dice «Sin resultados con estos filtros».
  - Los filtros aplicados aparecen como chips encima de la lista («Música ×», «Por la noche ×», «≤ 5 km ×») y «Quitar todos» los borra de una vez.
  - La franja va en la URL (`franja=tarde,noche`), así que un enlace compartido conserva el filtro. La página antigua de filtros se ha eliminado; `/search` sin búsqueda abre el panel.
- **Por qué:**
  - **Visibilidad del estado del sistema (Nielsen 1):** el recuento en vivo y los chips enseñan qué está filtrado y qué va a salir antes de aplicar.
  - **Control y libertad (Nielsen 3):** cada filtro se quita con un toque, sin volver a abrir el panel. El botón Atrás del navegador también cierra el panel.
  - **Prevención de errores (Nielsen 5):** no se puede aplicar una combinación vacía, y en el calendario cada día lleva un punto si tiene eventos.
  - **Reconocer mejor que recordar (Nielsen 6):** el calendario a la vista sustituye a escribir o adivinar fechas.
  - El chip de franja dice «Por la mañana» y no «Mañana», para no confundirlo con el atajo de fecha «Mañana».
- **Accesibilidad:**
  - **Panel modal:** `role="dialog"`, `aria-modal` y título. El foco entra en «Cerrar filtros», Tab y Mayús+Tab no salen del panel, Esc lo cierra y el foco vuelve al botón «Filtros» (WCAG 2.1.2, 2.4.3). «Filtros» lleva `aria-haspopup="dialog"`.
  - **Calendario:** patrón *grid* de WAI-ARIA con un único día tabulable. Flechas mueven por días y semanas, Inicio/Fin al principio y final de la semana, RePág/AvPág cambian de mes. Cada día se anuncia con su fecha completa y su número de eventos («domingo, 27 de diciembre, 3 eventos»). Los días pasados están desactivados.
  - **Recuento:** se anuncia en una región `aria-live` (WCAG 4.1.3, mensajes de estado).
  - **Tamaños:** chips, días y botones miden 44 px en móvil (2.5.5). Los chips de opción usan `aria-pressed`. La animación de entrada se quita con «reducir movimiento».
- **Problemas encontrados:**
  - La trampa de foco contaba como tabulables los días del calendario con `tabindex="-1"`, así que el Tab recorría los 42 días. Se excluyen del selector.
  - El mes salía como «Noviembre De 2026» por el `text-transform: capitalize`; ahora solo se pone en mayúscula la primera letra.
  - «Quitar todos» encadenaba dos navegaciones y la segunda pisaba la primera; ahora es una sola.
  - Con «Cerca de mí» activo, el recuento del panel no aplicaba el radio: podía prometer «Ver 44 resultados» y la lista mostrar 12. Ahora la lista, el recuento y los puntos del calendario usan la misma función de filtrado, y un test comprueba que el número prometido es el que sale.
  - Cerrar el panel con × o Esc dejaba una entrada repetida en el historial y el primer «Atrás» no hacía nada. Ahora, si el panel se abrió con el botón, al cerrarlo se vuelve atrás en el historial.
  - El mes del calendario era un `h4` dentro de un diálogo con `h2`; ahora es `h3`, sin saltos de nivel.
- **Pruebas:**
  - `tests/filters-drawer.test.tsx`: franjas (límites 14:00 y 20:00, horas sin confirmar), lectura de `franja`, trampa de foco y Esc, recuento en vivo, chip que se quita, «Quitar todos», botón desactivado con 0 resultados (día posterior al catálogo), número prometido igual al de la lista con radio de 1 km, calendario con flechas y AvPág.
  - En navegador real: 89 comprobaciones de axe sin problemas (panel abierto, calendario con teclado y chips aplicados), sin peticiones a terceros, responsive y contraste correctos.
  - Capturas: `docs/capturas/despues/filtros-panel-390.jpg`, `filtros-panel-1440.jpg`, `filtros-chips-390.jpg`, `filtros-chips-1440.jpg`.

### Iteración P1.4a · Favoritos: próximos y pasados, deshacer, calendario y lista compartida

- **Qué:**
  - Los favoritos se separan en **Próximos** (tarjetas, por fecha) y **Pasados** (filas sencillas con enlace a la ficha y botón para quitarlas, más «Quitar todos los pasados»). Antes los eventos pasados desaparecían sin más de la lista.
  - Al quitar un favorito aparece «"X" quitado de favoritos · Deshacer».
  - **«Añadir todos al calendario»** descarga un único `.ics` con todos los próximos. Cada evento enlaza a su propia ficha, no a la página de favoritos. Los que no tienen fecha cerrada («Varias funciones») se dejan fuera, y el aviso dice cuántos.
  - **«Compartir lista»** usa el menú de compartir del móvil o copia un enlace `/favorites?lista=89,99,104`. Quien lo abre ve «Lista compartida» y puede pulsar «Guardar en mis favoritos (N)».
  - El generador de calendario pasa a `src/lib/ics.ts` y lo usan tanto la ficha como los favoritos.
- **Por qué:**
  - **Control y libertad (Nielsen 3):** quitar se puede deshacer, así que un toque por error no cuesta nada.
  - **Visibilidad del estado (Nielsen 1):** cada acción confirma lo que ha hecho («Descargado un calendario con 3 eventos»).
  - **Eficiencia (Nielsen 7):** añadir o compartir todo con un clic en vez de evento a evento.
- **Privacidad:**
  - Abrir una lista compartida **no guarda nada**. Solo se escribe al pulsar «Guardar en mis favoritos», y hay un test que lo comprueba.
  - El enlace solo lleva números de evento. Se aceptan como mucho 50, sin repetir, y se ignora cualquier valor que no sea un número.
  - No hay clave de almacenamiento nueva.
- **Accesibilidad:**
  - **Encabezados:** un solo `h1` y un `h2` por grupo, y cada grupo es una región con nombre.
  - **Aviso:** el aviso de cada acción está en una región `role="status"` (WCAG 4.1.3).
  - **Foco al quitar (2.4.3):**
    - Cuando la tarjeta desaparece, el foco pasa a «Deshacer» en vez de perderse en la página.
    - Al deshacer, el foco vuelve al título del evento recuperado.
  - **Tamaños y nombres:** los botones de las filas de pasados miden 44 px y su nombre incluye el evento («Quitar "Karmento — Fin de gira La Serrana" de favoritos»).
- **Problemas encontrados:**
  - El texto de cada evento en el `.ics` usaba la URL de la página actual. En un archivo descargado desde favoritos, todos los eventos habrían enlazado a `/favorites`, así que ahora cada uno lleva la URL de su ficha.
  - Para devolver el foco tras deshacer, un selector `href^="/event/12"` también habría encontrado `/event/123`. Ahora se compara la ruta exacta.
  - Quien abría por primera vez un enlace de lista compartida (sin `city` en la URL ni nada guardado) la veía tapada por el diálogo de bienvenida. Ahora ese diálogo no aparece sobre una lista compartida, igual que no aparece sobre las páginas legales; una lista puede mezclar ciudades. Hay un test y una ruta de axe con exactamente el enlace que se comparte.
- **Pruebas:**
  - `tests/favourites.test.tsx`: grupos y encabezados, deshacer con foco, quitar un pasado, `.ics` con 3 eventos, UID distintos, URL propias y sin pasados, lectura segura de `lista`, lista compartida que no guarda nada hasta pulsar, escape de texto en iCalendar.
  - `storage-on-visit`: añadida `/favorites?lista=…`.
  - En navegador real: 94 comprobaciones de axe sin problemas (nuevas rutas: favoritos con pasados, lista compartida y favorito quitado), sin peticiones a terceros.
  - Capturas: `docs/capturas/despues/favoritos-390.jpg`, `favoritos-1440.jpg`, `favoritos-deshacer-390.jpg`, `favoritos-deshacer-1440.jpg`.

### Iteración P1.4b · «Tu perfil»: avatar, ciudad, categorías favoritas e idioma

- **Qué:**
  - Nueva página `/perfil`, enlazada desde la cabecera (sustituye al rótulo «Invitado», que no hacía nada) y desde el pie. Por debajo de 375 px el enlace de la cabecera cede el sitio a la ciudad, como antes, y el del pie sigue disponible.
  - **Avatar:** se elige entre ocho dibujos de la propia web. Sale en la cabecera.
  - **Ciudad por defecto:** es la misma preferencia que ya existía.
  - **Categorías favoritas:** alimentan «Recomendados para ti».
  - **Idioma:** el mismo selector de la cabecera, también aquí.
  - Cada cambio se confirma con «Cambios guardados en este navegador».
- **Recomendados con categorías favoritas** (regla decidida por el autor):
  - **Sin nada marcado**, todo sigue igual, sobre todo conciertos:
    - al menos 2 de cada 3 son conciertos;
    - como mucho 1 evento deportivo y nunca dos seguidos;
    - sin repetir artista, equipo ni recinto;
    - los huecos se rellenan con musical o teatro antes que con deporte.
  - **Con categorías marcadas, manda la elección de la persona:**
    - Recomendados muestra solo esas categorías y las alterna, para que todas aparezcan. Quien marca solo Teatro ve solo teatro, y quien marca solo Deportes ve solo deporte.
    - Se mantiene no repetir artista, equipo ni recinto. Por eso, en Madrid, Danza y Ópera no salen juntas cuando las dos son en el Teatro Real.
    - Solo si la ciudad no tiene suficientes eventos de esas categorías, los huecos restantes se completan con la regla general.
  - **Pruebas:**
    - Se comprueba con 5 combinaciones de favoritas en 3 fechas y 6 ciudades: primero solo favoritas, otras categorías solo cuando ya no cabe ninguna favorita, y cada categoría marcada aparece salvo choque de recinto o artista.
    - Sin favoritas, el resultado es idéntico al anterior (comparado con la versión previa en 4 fechas × 6 ciudades).
- **Por qué:**
  - **Flexibilidad y personalización (Nielsen 7):** ajustar la portada a los gustos de cada persona sin necesidad de cuenta.
  - **Consistencia (Nielsen 4):** la ciudad y el idioma son las mismas preferencias que en la cabecera, no una copia aparte.
- **Privacidad:**
  - **Sin datos personales:** no se piden nombre, correo ni foto, y la página lo dice.
  - **Almacenamiento:** se guarda en una sola clave nueva, `plan-cerca.profile` (avatar y categorías). Está en el registro, así que aparece en la tabla de la política de cookies y en «Tus datos» (descargar y borrar). También se han actualizado los textos que enumeran a mano lo que se guarda: privacidad y «Tus datos» en es, en y fr.
  - **Escritura:** solo al cambiar algo. Visitar `/perfil` no guarda nada, y hay un test que lo comprueba.
  - **Lectura segura:** un valor estropeado o desconocido vuelve a los valores por defecto.
  - `/perfil` lleva `noindex`.
- **Modo claro:** no hay selector de tema todavía, porque no haría nada. Llegará con el modo claro en P3.
- **Accesibilidad:**
  - **Avatar:** es un grupo de radios con nombre («Máscaras de teatro»…), manejable con las flechas.
  - **Categorías:** usan `aria-pressed`, y la ayuda va asociada con `aria-describedby`.
  - **Confirmación:** está en `role="status"`.
  - **Enlace de la cabecera:** `aria-current="page"` en el perfil y 44 px de área táctil.
- **Problemas encontrados:**
  - En móvil, el texto del enlace de la cabecera estaba oculto con `display:none` y el enlace se quedaba sin nombre (axe: `link-name`). Ahora se oculta solo de forma visual.
  - A 320 px el enlace de la cabecera volvía a aparecer y pisaba el logo. Se ha recuperado la ocultación por debajo de 375 px y se ha añadido el enlace en el pie.
- **Pruebas:**
  - `tests/profile.test.tsx`: no guarda nada al visitar, enlace de cabecera, avatar y categorías, ciudad e idioma, valores estropeados, exportación en «Tus datos».
  - En navegador real: 100 comprobaciones de axe sin problemas, sin peticiones a terceros, responsive correcto.
  - Capturas: `docs/capturas/despues/perfil-320.jpg`, `perfil-390.jpg`, `perfil-1440.jpg`, `recomendados-con-perfil-1440.jpg`.

### Iteración P1.4c · Se retira el mapa (OpenStreetMap bloqueaba las teselas) y se arregla la barra del catálogo en móvil

- **Qué pasó:**
  - Al abrir «Mapa» en «Explorar todos», OpenStreetMap devolvía en cada tesela una imagen de «403 Access blocked — App is not following the tile usage policy».
  - En nuestras pruebas automáticas cargaban bien, pero en el navegador de la persona que lo probó no.
  - Los servidores públicos de OpenStreetMap son de voluntarios y pueden bloquear según el navegador, la red o la cabecera `Referer`. Además, el navegador muestra la imagen de bloqueo como una tesela más, así que la web no puede detectarlo ni avisar.
- **Alternativas valoradas:**
  - **CARTO:** ahora exige clave de API. Sin ella pinta «API KEY REQUIRED» en cada tesela (comprobado).
  - **MapTiler, Stadia y similares:** necesitan registro y una clave ligada a una cuenta personal, con cuota mensual.
  - **Dejar OpenStreetMap con un aviso:** no evita la imagen rota.
- **Decisión** (acordada con el autor): quitar la vista Mapa del catálogo y el mini mapa de la ficha.
  - Se mantiene lo que pide el enunciado sobre cercanía: **«Cerca de mí»** ordena y filtra por distancia y muestra los kilómetros en cada tarjeta.
  - Cada ficha conserva «Abrir en Google Maps».
- **Efectos:**
  - **Sin terceros:** la web vuelve a no contactar con ningún tercero. La CSP vuelve a `img-src 'self' data: blob:`.
  - **Textos legales:** desaparecen la fila de OpenStreetMap de la política de privacidad y el proveedor de `datos-legales.json`.
  - **Peso:** fuera la dependencia Leaflet (44 KB comprimidos) y su CSS.
  - **Pruebas:** `pnpm check:terceros` vuelve a exigir cero peticiones externas en todas las páginas.
- **Barra del catálogo en móvil** (fallo previo, visto en las capturas):
  - Por debajo de 650 px, la fila de acciones ocupaba todo el ancho y dejaba las pestañas de categoría en unos 20 px: no se veían y la fila de «Cerca de mí» salía desplazada.
  - Ahora las categorías van en su propia fila deslizable encima de las acciones.
  - Principios: **Visibilidad del estado (Nielsen 1)** y **Reconocer mejor que recordar (Nielsen 6)**, porque el filtro principal vuelve a estar a la vista.
- **Pruebas:**
  - 255 tests: se retira `tests/map.test.tsx` y `security.test.ts` vuelve a exigir una CSP sin orígenes remotos.
  - En navegador real: 96 comprobaciones de axe sin problemas, sin peticiones a terceros, responsive correcto.
  - Capturas: `docs/capturas/despues/catalogo-barra-320.jpg`, `catalogo-barra-390.jpg`, `catalogo-barra-1440.jpg`.

### Iteración P1.5 · Reserva de demostración

- **Qué:**
  - En la ficha de cada evento con fechas disponibles aparece «Probar la reserva (demostración)», debajo del botón de compra real.
  - Lleva a `/event/:id/reservar`, un proceso de cuatro pasos:
    1. **Sesión:** cada día de la temporada desde hoy, con la hora.
    2. **Entradas:** de 1 a 6, con importe orientativo si la web oficial publica precio.
    3. **Revisar.**
    4. **Confirmación:** código de demostración, «Añadir al calendario» con la sesión elegida y enlace a la compra real.
  - En todo el proceso se ve el aviso «Reserva de demostración: no se realiza ningún pago».
  - **No se piden nombre, correo ni tarjeta.**
  - Los eventos agotados o ya pasados no ofrecen reserva.
  - Los términos de uso tienen una sección nueva, «Reservas de demostración».
- **Por qué:**
  - **Visibilidad del estado (Nielsen 1):** indicador de pasos con «Paso 2 de 4».
  - **Control y libertad (Nielsen 3):** el paso y las elecciones van en la URL, así que «Atrás» del navegador y el botón «Atrás» vuelven al paso anterior sin perder nada.
  - **Prevención de errores (Nielsen 5):**
    - no se puede continuar sin sesión;
    - el número de entradas está limitado;
    - un enlace con una sesión inválida vuelve al primer paso;
    - antes de confirmar se revisa todo.
  - **Honestidad:** el aviso y el texto de confirmación dejan claro que no hay pago ni reserva real.
- **Privacidad:**
  - No se guarda nada en el navegador; un test lo comprueba recorriendo los cuatro pasos.
  - El código de demostración se calcula a partir de lo elegido, sin datos aleatorios ni almacenados.
  - `/event/:id/reservar` lleva `noindex`.
- **Accesibilidad:**
  - **Pasos:** son una lista con `aria-current="step"`.
  - **Foco (2.4.3):** al cambiar de paso, el foco pasa al título del nuevo paso, que lector de pantalla anuncia.
  - **Sesiones:** son radios con la fecha completa.
  - **Contador de entradas:** botones «Una entrada más» y «Una entrada menos» de 44 px y un `output` con `aria-live`.
  - **Aviso:** tiene `role="note"`.
- **Otros arreglos vistos en las capturas:**
  - Los `h1` de reserva y perfil salían del tamaño del texto normal.
  - En el pie, «Tu perfil», «Acerca de» y el © quedaban escalonados porque la columna se alineaba a la derecha.
- **Pruebas:**
  - `tests/booking.test.tsx`: sesiones disponibles según la fecha, entrada desde la ficha, recorrido completo con foco y sin almacenamiento ni campos de datos, límite de entradas e importe orientativo, enlace con sesión inválida y evento agotado.
  - En navegador real: 108 comprobaciones de axe sin problemas (nuevas rutas: sesión, revisar y confirmación), sin peticiones a terceros, responsive correcto.
  - Capturas: `docs/capturas/despues/reserva-sesion-390.jpg`, `reserva-sesion-1440.jpg`, `reserva-confirmada-390.jpg`, `reserva-confirmada-1440.jpg`.

### Iteración P1.6 · Accesibilidad: encabezados, avisos, foco y áreas táctiles

- **Encabezados (WCAG 1.3.1 y 2.4.6):**
  - Hay un solo `h1` por página.
  - Los títulos de las tarjetas pasan a ser `h3` bajo el `h2` de su sección. En la búsqueda y en la lista compartida, donde la lista va justo debajo del `h1`, son `h2`.
  - En la ficha de artista, el rótulo de la sección de eventos es ahora un `h2`. Antes se saltaba del `h1` al `h3`.
  - `scripts/a11y.mjs` comprueba además las reglas `heading-order` y `page-has-heading-one` de axe en las 36 rutas y estados, así que un salto de nivel hace fallar la comprobación.
- **Corazón de favoritos (2.4.6, 4.1.2 y 2.5.3):**
  - Su nombre incluye el evento («Guardar: Fedora» / «Guardado: Fedora»). Antes, con varias tarjetas, el lector de pantalla oía «Guardar, Guardar, Guardar…».
  - Mantiene `aria-pressed`, y la palabra visible sigue formando parte del nombre.
- **Avisos al guardar (4.1.3):** al añadir o quitar un favorito desde cualquier tarjeta o ficha se anuncia «"Fedora" añadido a favoritos» en una región `role="status"`. En la página de favoritos se usa su propio aviso con «Deshacer», para no anunciar dos veces.
- **«Mostrar más» (2.4.3):** el foco pasa al título de la primera tarjeta nueva. Así, con teclado o lector de pantalla se sigue justo donde creció la lista, en vez de quedarse en el botón, que se ha desplazado hacia abajo.
- **Áreas táctiles en móvil (2.5.5):**
  - Se midieron con un navegador real a 390 px en todas las rutas.
  - Pasan a 44 px: enlace «Saltar al contenido», opciones del selector de ciudad, idioma, buscador, «Ahora no», opciones de calendario, enlaces de recinto y artista («Web oficial», «Eventos», «Cómo llegar», «Ver ficha completa»), «Seguir artista», «Volver» y «Ver eventos».
  - **Excepción documentada:** los títulos de tarjeta miden 25 px de alto, por encima de los 24 px del nivel AA (2.5.8). Cada tarjeta tiene además el botón «Ver detalle» de 44 px hacia la misma ficha, que cuenta como alternativa equivalente para 2.5.5. No se les añade relleno porque llevan un recorte a dos líneas y asomaría la tercera.
- **Paneles:**
  - Los modales (filtros, «Acerca de», bienvenida) atrapan el foco, se cierran con Esc y devuelven el foco al botón que los abrió.
  - Los desplegables no modales («Cerca de mí», ciudad) se cierran con Esc y devuelven el foco. A propósito no lo atrapan, porque no bloquean el resto de la página.
- **Pruebas:**
  - `tests/a11y-p16.test.tsx`: un `h1` y tarjetas `h3`, nombre del corazón con el evento y aviso hablado al añadir y quitar, foco tras «Mostrar más».
  - **Fecha fija en los tests:** `tests/setup.ts` fija el día en el 20/12/2026, el primer día de la evaluación, que se puede cambiar con `TEST_TODAY=AAAA-MM-DD pnpm test`. Antes, varios tests usaban la fecha real y habrían fallado en enero, cuando pasaran las sesiones que usan como ejemplo. Las demás fechas de la evaluación (01/01 y 31/01) las cubre `catalog-dates.test.ts` de forma explícita.
  - En navegador real: 108 comprobaciones de axe sin problemas (incluidas las nuevas reglas de estructura), sin peticiones a terceros, responsive y contraste correctos.
