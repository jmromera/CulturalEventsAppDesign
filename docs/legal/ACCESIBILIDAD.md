# Accesibilidad

> Objetivo: WCAG 2.2 nivel AA y los requisitos de la Ley Europea de Accesibilidad.
> Estado declarado: **parcialmente conforme** (ver la declaración pública en `/accesibilidad`).
> Esto no es asesoramiento jurídico; la revisión es una autoevaluación técnica, no una auditoría externa.

## Resultado actual (7 de noviembre de 2026)

| Comprobación | Resultado |
|---|---|
| axe-core, reglas WCAG 2.0 / 2.1 / 2.2 A y AA, 23 páginas y estados × móvil (390 px) y escritorio (1440 px) | ✅ 0 problemas |
| Estados abiertos: selector de ciudad, menú de calendario, confirmación de borrado, «Acerca de» | ✅ 0 problemas |
| Zoom al 200 % (equivalente a 640 px de ancho) sin desplazamiento horizontal, 23 páginas | ✅ |
| Contraste del texto de portada sobre las 6 fotos de ciudad (percentil 98 de brillo), móvil y escritorio | ✅ todas ≥ 4,5:1 (la peor, Bilbao en escritorio: 4,8:1) |
| Objetivos táctiles ≥ 24 px (regla `target-size` de axe) | ✅ |
| `prefers-reduced-motion` (las pruebas se ejecutan con movimiento reducido) | ✅ |

El detalle de la última ejecución está en `docs/legal/accesibilidad-informe.json`.

## Qué se arregló

- El diálogo de bienvenida aparecía encima de las páginas legales y de «Tus datos» en la primera visita: ya no se muestra en esas páginas.
- La tabla de «Tus datos» se desplazaba en móvil sin poder enfocarse con teclado: ahora es una región con nombre y `tabindex`.
- El menú de ciudades abierto en móvil tapaba a medias la pestaña «Eventos» (objetivo táctil < 24 px visible): ahora se abre a todo el ancho, bajo la cabecera.
- El número de resultados no se anunciaba al cambiar categoría, fecha o filtros: ahora hay regiones `aria-live` en el catálogo y en la pantalla de filtros.
- El texto de portada no llegaba a 4,5:1 sobre las fotos de Madrid y Bilbao en escritorio: el degradado se oscureció en la zona del texto.

## Lo que ya cumplía

Enlace «Saltar al contenido», foco llevado al contenido principal al cambiar de página, foco visible en todos los controles, diálogos con foco atrapado y cierre con Escape, `aria-pressed` en botones de alternar, contador del carrusel con `aria-live`, atributo `lang` sincronizado con el idioma (y `lang="es"` en los textos legales), imágenes con texto alternativo o marcadas como decorativas, e imagen de reserva si una foto falla.

## No aplica

- **Mapa**: la app no tiene mapas embebidos; solo enlaza a Google Maps. No hace falta una lista alternativa al mapa.
- **Formularios con validación**: no hay formularios que envíen datos.

## Cómo repetir las pruebas

```bash
pnpm install
pnpm exec playwright install chromium   # solo la primera vez
pnpm check:a11y        # axe + zoom 200 % en todas las páginas y estados (construye la web)
pnpm check:contraste   # contraste del texto sobre las portadas de ciudad
```

Las páginas y estados que se recorren están en `scripts/lib/routes.mjs`; añade ahí cualquier página nueva.

## Revisión manual pendiente (recomendada antes de abrir)

Lo automático no lo cubre todo. Conviene que una persona compruebe:

- Recorrer la web con un lector de pantalla real (NVDA en Windows, VoiceOver en iPhone).
- Que los textos alternativos de los carteles describen bien el evento.
- Usar la app con el teclado de principio a fin: elegir ciudad, buscar, filtrar, guardar un favorito, añadir al calendario y borrar los datos.
