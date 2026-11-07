# Auditoría previa al lanzamiento

> Fecha: 7 de noviembre de 2026 · Rama analizada: `develop` (commit `a5929d4`).
> **Esto no es asesoramiento jurídico.** Es un inventario técnico para que un profesional pueda revisarlo.

## 1. Qué es la app, técnicamente

Plan Cerca es una web estática (SPA de React) servida por Vercel. **No tiene backend, base de datos, cuentas, formularios, pagos, emails ni contenido de usuarios.** Todo el catálogo (eventos, recintos, artistas) viaja dentro del JavaScript. Lo que recuerda del usuario se guarda solo en su navegador.

## 2. Datos personales que se tratan

| Dato | Dónde | Quién lo recibe | Notas |
|---|---|---|---|
| Dirección IP, navegador, URL pedida | Registros del servidor de Vercel | Vercel (encargado) | Inevitable al servir una web. La app no los lee ni los guarda. |
| Favoritos, idioma, ciudad elegida, preferencias de artista | `localStorage` del navegador | Nadie: no salen del dispositivo | Ver inventario en el punto 6. |
| Ubicación aproximada (coordenadas) | Solo en memoria, en el navegador | Nadie | Se pide solo al pulsar «Usar mi ubicación». Se calcula la ciudad más cercana en el propio navegador y se descartan las coordenadas; solo se guarda el nombre de la ciudad. |
| IP del visitante al cargar imágenes externas | — | **37 dominios de terceros** (ver punto 3) | **Problema**: hoy cada visita envía la IP a esos dominios, entre ellos Google. |
| IP del visitante al cargar las fuentes | — | Google Fonts (EE. UU.) | **Problema**: transferencia a Google sin base legal clara (criterio de la AEPD y de tribunales de la UE). |

No hay: registro, cuentas, contraseñas, formularios, emails, pagos, comentarios ni reseñas de usuarios, cookies propias, analítica, píxeles ni publicidad.

## 3. Servicios de terceros

| Servicio | Uso | Región | ¿Transferencia fuera de la UE? | Estado |
|---|---|---|---|---|
| Vercel Inc. | Alojamiento y CDN | EE. UU., red global | Sí (EE. UU.) | Necesario. Falta firmar/aceptar el DPA y confirmar la región (ver `PENDIENTE.md`). |
| Google Fonts | Tipografías DM Sans y Manrope | EE. UU. | Sí | **Se elimina**: fuentes autoalojadas. |
| Unsplash / imgix | 4 portadas de ciudad | EE. UU. | Sí | **Se elimina**: imágenes autoalojadas. |
| Wikimedia Commons | 2 portadas de ciudad y fotos de recintos | EE. UU. | Sí | **Se elimina**: imágenes autoalojadas. |
| `encrypted-tbn0.gstatic.com` (miniaturas de Google Imágenes) | 58 imágenes de eventos | EE. UU. | Sí | **Se elimina**: imágenes autoalojadas. Licencia desconocida. |
| Otros 33 dominios (webs de recintos, ticketeras, prensa) | Carteles y fotos | Varias | Desconocido | **Se elimina**: imágenes autoalojadas. |
| Google Maps, Google Calendar, ticketeras | Solo **enlaces** que el usuario pulsa | — | Solo si el usuario pulsa | No se carga nada hasta el clic. Se avisa en la política. |
| Mapas embebidos, geocodificación, email, pagos, auth, APIs de eventos, CDN de librerías | — | — | — | **No existen.** |

## 4. De dónde salen los eventos y su licencia

- **Datos de eventos**: introducidos a mano en `src/data/events.json` a partir de las webs oficiales (recintos, Ticketmaster, Live Nation, ayuntamientos…). No hay API ni acuerdo con ningún proveedor. Los hechos (fecha, lugar, artista) no tienen derechos de autor, pero **las descripciones copiadas literalmente sí podrían**.
- **Imágenes**: carteles y fotos promocionales de terceros, **sin licencia documentada**; 58 son miniaturas de la búsqueda de Google. Las portadas de ciudad sí tienen licencia (Unsplash y CC BY / CC BY-SA, ver créditos del README).
- **Valoraciones y «% de popularidad»**: no se sabe de dónde salen. No hay código que las calcule. Ver `TEXTOS-A-REVISAR.md`.

## 5. Funciones sensibles

| Función | ¿Existe? | Detalle |
|---|---|---|
| Registro / cuentas | No | El perfil «Invitado» es decorativo. |
| Pagos | No | La compra ocurre en webs de terceros. |
| Geolocalización | Sí | Solo a petición; coordenadas no salen del navegador ni se guardan. |
| Contenido de usuarios | No | No hay comentarios, reseñas ni subidas. No aplica la DSA en su parte de moderación. |
| Menores | No hay tratamiento específico | Público general; no se recogen datos que requieran consentimiento (art. 7 LOPDGDD). |
| IA | No en la app | `llms.txt` y `ai-catalog.json` solo describen el sitio para agentes externos. |
| Emails / notificaciones | No | «Avisarme de nuevos eventos» solo guarda una preferencia local; no envía nada. |

## 6. Inventario real de cookies y almacenamiento local

**Cookies**: ninguna. Ni propias ni de terceros (comprobado en el código: no hay `document.cookie` ni librerías que las pongan).

**`localStorage`** (todo técnico o de preferencia del usuario, nunca sale del dispositivo):

| Clave | Contenido | Se crea cuando… |
|---|---|---|
| `plan-cerca.saved-events` | IDs de eventos favoritos | Pulsas el corazón |
| `plan-cerca.language` | Idioma | Al abrir la app (por defecto, `es`) |
| `plan-cerca.preferred-city` | Ciudad elegida | Eliges ciudad |
| `plan-cerca.detected-city` | Ciudad detectada por ubicación | Usas «Usar mi ubicación» |
| `plan-cerca.geolocation-status` | Resultado de la detección | Eliges ciudad o usas la ubicación |
| `plan-cerca.city-onboarding-dismissed` | Diálogo de bienvenida cerrado | Pulsas «Ahora no» |
| `plancerca.artist-preferences` | Artistas seguidos y avisos | Pulsas «Seguir» o «Avisarme» |

No hay `sessionStorage`, IndexedDB ni cookies.

## 7. Qué bloques aplican

| Bloque | ¿Aplica? | Por qué |
|---|---|---|
| Legal (aviso legal, privacidad, cookies, términos) | ✅ Sí | Toda web en España que ofrece un servicio necesita aviso legal (LSSI) y política de privacidad (RGPD) porque Vercel trata IPs. |
| Consentimiento, derechos y borrado | ⚠️ En parte | No hay cuentas, registro ni emails. Sí aplica: descargar y borrar los datos del navegador, y la geolocalización. |
| Cookies y terceros | ✅ Sí | No hay cookies, pero sí terceros que reciben la IP (fuentes e imágenes). Se autoalojan; sin banner. |
| Accesibilidad | ✅ Sí | Todas las páginas. No hay mapa embebido, así que no aplica la lista alternativa al mapa. |
| Seguridad | ⚠️ En parte | Sin servidor propio no aplican login, CSRF, SSRF, inyección SQL, subidas ni límites de peticiones. Sí: cabeceras, CSP, secretos, dependencias y XSS. |
| Calidad y rendimiento | ✅ Sí | Metadatos, sitemap, canonical, imágenes, Lighthouse. |
