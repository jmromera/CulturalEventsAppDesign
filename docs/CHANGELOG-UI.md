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
