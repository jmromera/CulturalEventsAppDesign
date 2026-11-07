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
