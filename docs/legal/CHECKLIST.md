# Checklist de lanzamiento

> ✅ hecho · ⚠️ pendiente de datos o revisión · ❌ no aplica
> Estado a 7 de noviembre de 2026, rama `chore/lanzamiento-legal`. **No es asesoramiento jurídico.**

## 1. Auditoría

| Punto | Estado | Explicación |
|---|---|---|
| Datos personales y dónde se guardan | ✅ | `AUDITORIA.md`: IP en registros de Vercel; preferencias solo en el navegador; ubicación nunca guardada. |
| Terceros con región y transferencias | ✅ | Solo Vercel (EE. UU.) tras autoalojar fuentes e imágenes. |
| Origen y licencia de los eventos | ⚠️ | Datos manuales de webs oficiales; imágenes sin licencia documentada (`PENDIENTE.md` §4). |
| Registro, pagos, geolocalización, contenido de usuarios, menores, IA | ✅ | Solo hay geolocalización (en el dispositivo). |
| Inventario de cookies y almacenamiento | ✅ | 0 cookies; 7 claves de `localStorage`, todas en `src/data/storage-keys.ts`. |

## 2. Legal

| Punto | Estado | Explicación |
|---|---|---|
| `datos-legales.json` con titular, proveedores y plazos | ⚠️ | Creado con datos de ejemplo (`esEjemplo: true`). Faltan tus datos reales. |
| Aviso rojo mientras `esEjemplo` sea `true` | ✅ | En todas las páginas legales; probado. |
| Prueba de campos obligatorios | ✅ | `tests/legal-data.test.ts`; también falla si quedan datos de ejemplo con `esEjemplo: false`. |
| Aviso legal (LSSI-CE) | ⚠️ | `/aviso-legal`. Pendiente de datos reales y revisión. |
| Privacidad (RGPD/LOPDGDD), resumen de 5 puntos y tabla | ⚠️ | `/privacidad`. Pendiente de datos de Vercel y revisión. |
| Política de cookies | ✅ | `/cookies`, tabla generada desde el registro real. |
| Términos de uso (información de terceros, responsabilidad, avisar de errores) | ⚠️ | `/terminos`. Pendiente de revisión. |
| Contenido de usuarios: moderación y canal DSA | ❌ | No hay contenido de usuarios; los términos lo dicen. |
| Enlaces en el pie de todas las páginas | ✅ | Aviso legal, privacidad, cookies, términos, accesibilidad y tus datos. |
| Enlaces en el registro | ❌ | No hay registro. |

## 3. Consentimiento, derechos y borrado

| Punto | Estado | Explicación |
|---|---|---|
| Casillas de consentimiento sin marcar, botón desactivado, servidor que lo exige, prueba de consentimiento | ❌ | No hay formularios ni cuentas. |
| Edad mínima | ❌ | No se recogen datos que la requieran. |
| Descargar mis datos (JSON) | ✅ | `/tus-datos`; probado. |
| Borrar mis datos, sin patrones oscuros | ✅ | Confirmación con botones del mismo peso; borra todas las claves del registro; probado. No pide contraseña porque no hay cuenta. |
| Emails solo de servicio y baja en un clic | ❌ | La app no envía emails. |
| Geolocalización: solo al pulsar, explicación previa, funciona sin ella, sin guardar la ubicación exacta | ✅ | Probado: no se pide hasta pulsar, no se guardan coordenadas ni se envían; lista de ciudades siempre disponible. |
| Búsqueda por código postal | ❌ | La lista de seis ciudades cubre el uso sin ubicación (`DECISIONES.md`). |
| Nada se guarda solo por visitar | ✅ | Probado (`tests/storage-on-visit.test.tsx`). |

## 4. Cookies y terceros

| Punto | Estado | Explicación |
|---|---|---|
| Sin banner porque solo hay almacenamiento técnico | ✅ | 0 cookies, sin analítica ni píxeles. |
| Página de cookies con tabla real y prueba de que coincide con el código | ✅ | `tests/storage-registry.test.ts` y `tests/legal-pages.test.tsx`. |
| Analítica, mapas con cookies, píxeles | ❌ | No hay. |
| Fuentes, iconos y librerías autoalojados | ✅ | Fuentes con `@fontsource`; iconos SVG propios; librerías en el bundle. |
| Imágenes autoalojadas | ✅ | 210 imágenes de 37 dominios (incluidas 58 de Google Imágenes) copiadas y optimizadas. |
| Prueba que falla ante dominios externos no declarados | ✅ | `tests/no-third-party.test.ts` y `pnpm check:terceros` en navegador real. |

## 5. Accesibilidad

| Punto | Estado | Explicación |
|---|---|---|
| axe-core en todas las páginas, móvil y escritorio, con datos, vacío y error | ✅ | `pnpm check:a11y`: 71 comprobaciones, 0 problemas. |
| Contraste (también sobre imágenes) | ✅ | `pnpm check:contraste`: las 6 portadas ≥ 4,5:1. |
| Textos alternativos, etiquetas, encabezados, `lang` | ✅ | Revisado por axe; `lang="es"` en textos legales. |
| Foco visible y «saltar al contenido» | ✅ | Ya existían; verificados. |
| Objetivos táctiles de 24 px | ✅ | Arreglado el menú de ciudades en móvil. |
| Zoom al 200 % | ✅ | Sin scroll horizontal en 21 páginas. |
| `prefers-reduced-motion` | ✅ | Las pruebas se ejecutan con movimiento reducido. |
| Mapa usable sin ratón con lista equivalente | ❌ | No hay mapa embebido. |
| Filtros y fechas con teclado; resultados y errores con `aria-live` | ✅ | Añadido el anuncio de resultados en catálogo y filtros. |
| Declaración en `/accesibilidad` y `ACCESIBILIDAD.md` | ⚠️ | Hecha. Falta revisión manual con lector de pantalla y confirmar la autoridad competente. |

## 6. Seguridad

| Punto | Estado | Explicación |
|---|---|---|
| Secretos fuera del código y del historial | ✅ | Revisado el historial: no hay; prueba automática. |
| `.env` ignorado y `.env.example` | ✅ | |
| Auditoría de dependencias | ✅ | `pnpm audit`: 0 vulnerabilidades (había 15, todas de herramientas de desarrollo). |
| CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors | ✅ | En `vercel.json`; probado y verificado en navegador sin violaciones. ⚠️ Comprobar en producción. |
| HTTPS forzado | ✅ | Vercel redirige a HTTPS; HSTS de 2 años. |
| Cookies Secure/HttpOnly/SameSite | ❌ | No hay cookies. |
| XSS en descripciones | ✅ | React escapa todo; el único HTML insertado (JSON-LD) pasa por un serializador probado. |
| Validación en servidor, inyección, CSRF, SSRF, subidas | ❌ | No hay servidor propio, formularios ni subidas. |
| Límites de peticiones | ❌ | No hay login, registro, formularios ni geocodificación en servidor. |
| Autorización por id | ❌ | No hay datos de usuarios en servidor. |
| Logs sin datos personales; errores sin información interna | ✅ | Solo consola del navegador en fallos de renderizado; mensaje genérico al usuario. |

## 7. Calidad y rendimiento

| Punto | Estado | Explicación |
|---|---|---|
| Lighthouse móvil y escritorio | ⚠️ | Escritorio 97/100/100/100; móvil 81/100/100/100 (rendimiento/accesibilidad/buenas prácticas/SEO). Mejorar el 81 exige pre-renderizar. |
| Metadatos y Open Graph | ✅ | Descripción única, imagen OG propia, `og:url` por página. |
| Sitemap y robots.txt | ✅ | `sitemap.xml` generado en cada build (257 URL); robots con sitemap y sin páginas personales. |
| Canonical | ✅ | Por página; `noindex` en búsqueda, favoritos, tus datos y 404. |
| schema.org/Event | ✅ | Ya existía; ahora con imagen local. |
| Imágenes optimizadas y diferidas | ✅ | WebP, versiones de 640/1024 px con `srcset`, carga diferida. |
| Páginas 404 y de error | ✅ | Ya existían; la 404 ahora es `noindex`. |
| 360, 390 y 768 px; conexión lenta; sin ubicación | ✅ | `node scripts/responsive.mjs`: sin scroll horizontal, portada en 4,9 s con 3G lenta, funciona con la ubicación denegada. |
