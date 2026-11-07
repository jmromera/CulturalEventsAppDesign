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
