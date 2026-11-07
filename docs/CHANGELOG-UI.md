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
