# Decisiones

Decisiones tomadas sin consultar durante la preparación para el lanzamiento (7 de noviembre de 2026). Cada línea dice qué se decidió y por qué. Revísalas y cambia las que no te encajen.

> Nada de esto es asesoramiento jurídico.

## Generales
- **Trabajo en la rama `chore/lanzamiento-legal`, creada desde `develop`, sin push.** `develop` es donde está la app real; `main` solo tiene la página de «Próximamente».
- **pnpm 10 como gestor de paquetes** (el fijado en `.mise.toml`). Se reinstaló `node_modules` porque estaba enlazado al almacén de otra versión de pnpm.
- **Pruebas con Vitest 4 + Testing Library + jsdom** (`pnpm test`) y comprobación de tipos (`pnpm typecheck`). No había pruebas; es lo más ligero que encaja con Vite 8.

## Legal
- **Textos legales solo en español**; en inglés y francés se muestra una nota de que la versión que hace fe es la española. Traducir textos legales sin revisión profesional es arriesgado.
- **Rutas legales en español** (`/aviso-legal`, `/privacidad`, `/cookies`, `/terminos`, `/accesibilidad`, `/tus-datos`): es el idioma principal y el de los textos.
- **Vercel aparece como único encargado del tratamiento**, con `verificado: false`. Es el único proveedor que recibe datos del visitante (la IP) una vez autoalojadas fuentes e imágenes; su región, garantía y plazo de registros no se han podido verificar desde el código.
- **Las páginas legales leen de `datos-legales.json`** y un registro central (`src/data/storage-keys.ts`) alimenta la tabla de cookies, para que texto y código no se separen.
- **Promesas que el código no puede cumplir por ti**: el plazo de conservación de los emails recibidos (`plazos.comunicaciones`) y el de los registros de Vercel (`plazos.registrosServidor`) dependen de cómo gestiones tu correo y de tu plan de Vercel. Quedan como ejemplo en `datos-legales.json` y en `PENDIENTE.md`.
- **Plazo de respuesta a errores: 10 días hábiles (ejemplo).** Es una decisión de negocio; queda marcada como ejemplo.

## Consentimiento, derechos y borrado
- **Sin registro, edad mínima, casillas de consentimiento ni emails**: la app no tiene cuentas, formularios ni envíos. No se añaden; si algún día los hay, habrá que hacer este bloque.
- **«Tus datos» (`/tus-datos`) en lugar de Ajustes de cuenta**: descarga en JSON y borrado de todo lo guardado en el navegador. No pide contraseña porque no hay cuenta; pide confirmación con «Sí, borrar» y «Cancelar» del mismo peso.
- **Tras borrar, se recarga la página**, para que la app no vuelva a escribir los datos que tenía en memoria.
- **La app ya no guarda nada solo por visitarla**: idioma y favoritos se escriben únicamente cuando la persona los cambia. Antes se guardaban el idioma y una lista vacía de favoritos en la primera visita.
- **La ciudad que llega en un enlace (`?city=`) se usa solo en memoria**: antes se guardaba en el navegador al abrir cualquier enlace compartido. Ahora solo se guarda cuando la persona elige ciudad (diálogo de bienvenida o selector). Elegir ciudad en Filtros tampoco la guarda: vale para esa visita.
- **El diálogo de bienvenida no aparece en las páginas legales ni en «Tus datos»**: tapaba la política a quien llegaba desde un buscador y el aviso de «datos borrados» tras borrar.
- **Geolocalización**: se mantiene como estaba (solo al pulsar «Usar mi ubicación», cálculo en el dispositivo, se guarda solo el nombre de la ciudad) y se añade una explicación junto al botón antes de pedir el permiso.
- **Sin búsqueda por código postal**: la lista de seis ciudades ya permite usar la app sin ubicación; un buscador por código postal no aporta y necesitaría datos de geocodificación.

## Cookies y terceros
- **Sin banner de cookies**: la app no pone cookies ni usa analítica, píxeles ni publicidad. Solo usa almacenamiento local técnico o pedido por el usuario (exento según el art. 22.2 LSSI). Hay página de cookies con la tabla real y pruebas que la comparan con el código.
- **Fuentes autoalojadas** (paquetes `@fontsource` de DM Sans y Manrope, licencia OFL) en lugar de Google Fonts, que recibía la IP de cada visitante.
- **Las 210 imágenes autoalojadas — esto cambia un riesgo por otro.** Resuelve la privacidad (la IP ya no va a 37 dominios), pero servir copias de carteles y miniaturas de Google sin licencia puede aumentar el riesgo de derechos de autor frente a enlazarlas. Alternativa: quitar las imágenes sin licencia (`"image": null`). Está en `PENDIENTE.md` §4.
- **Detalle de las imágenes:** las 210 (portadas, carteles, recintos y artistas), convertidas a WebP. Antes se cargaban desde 37 dominios, entre ellos 58 miniaturas de Google Imágenes, y cada visita les enviaba la IP. El origen de cada una queda en `docs/legal/ORIGEN-IMAGENES.json` para revisar licencias.
- **Las imágenes de la web no van por Git LFS** (`.gitattributes`): así el despliegue funciona aunque el alojamiento no descargue objetos LFS.
- **Lista de terceros declarados vacía** (`src/legal/third-parties.ts`): una prueba sobre el código y un script en navegador real (`pnpm check:terceros`) fallan si aparece cualquier dominio externo.
- **Los enlaces externos se mantienen** (comprar entradas, Google Maps, Google Calendar, webs oficiales): no envían nada hasta que la persona los pulsa, y la política de privacidad lo explica.

## Accesibilidad
- **Declaración «parcialmente conforme»**, no «plenamente»: la revisión es una autoevaluación con herramientas y pruebas manuales básicas, sin auditoría externa, y los carteles con texto no se transcriben completos.
- **Menú de ciudades a todo el ancho en móvil**, debajo de la cabecera: así no deja pestañas tapadas a medias (WCAG 2.5.8).
- **Degradado de portada más oscuro en escritorio** en la zona del texto: Madrid y Bilbao no llegaban a 4,5:1 por las luces de la foto.
- **Autoridad de reclamación sin nombrar**: no he podido confirmar qué organismo es competente ni si la Ley Europea de Accesibilidad te aplica (exime a microempresas que prestan servicios). Queda en `PENDIENTE.md`.

## Seguridad
- **Sin login, registro, formularios ni servidor propio**: no aplican límites de peticiones, CSRF, SSRF, inyección SQL, subidas de archivos ni autorización por identificador. Si se añade un backend, habrá que hacer este bloque entero.
- **CSP estricta sin `'unsafe-inline'`** ni para scripts ni para estilos; solo se permite `data:` en fuentes (Vite incrusta las más pequeñas) e imágenes. Se comprueba en navegador real con `pnpm check:terceros`. Las vistas previas de Vercel con la barra de comentarios activada podrían bloquearse por la CSP; producción no la usa.
- **HSTS de 2 años con subdominios, sin `preload`**: `preload` es difícil de deshacer y exige inscribir el dominio en una lista; mejor decidirlo cuando el dominio sea definitivo.
- **Dependencias**: Vite actualizado a 8.1.6 y versiones mínimas forzadas para PostCSS, nanoid y source-map-js. Las 15 vulnerabilidades eran de herramientas de desarrollo, no del código que llega al navegador. `pnpm audit`: 0.
- **Se elimina `package-lock.json`**: estaba desactualizado y podía hacer que el despliegue usara npm con versiones viejas. El gestor oficial es pnpm (`packageManager` en `package.json`).
- **Registros**: la app solo escribe en la consola del navegador cuando falla el renderizado (sin datos personales) y muestra al usuario un mensaje genérico. No hay registros de servidor propios.

## Calidad y rendimiento
- **Imagen Open Graph propia** (`public/images/og-image.jpg`), recortada de la captura de la portada: no depende de terceros.
- **`canonical` por página con la ciudad solo en los listados** (portada y recintos); en las fichas, sin parámetros, para no duplicar URL.
- **`noindex` en búsqueda, favoritos, «Tus datos» y páginas que no existen**: son personales, infinitas o errores. Como Vercel responde 200 a cualquier ruta (SPA), la 404 se marca con `noindex`.
- **Sitemap generado en cada `pnpm build`** a partir de los datos y no guardado en git (se ignora), para que nunca liste eventos pasados.
- **Copias de imágenes de 640 px (y 1024 px las portadas) con `srcset`**: Lighthouse móvil pasó de 78 a 81 y el peso de la portada de 758 a 666 KB.
- **No se pre-renderizan las páginas**: subiría el rendimiento en móvil por encima de 90, pero cambia la arquitectura de la app. Queda como decisión de producto en `PENDIENTE.md`.
- **Botones de la confirmación de borrado con el mismo estilo**, para cumplir lo de «sin patrones oscuros».

## Interfaz y catálogo (rama `feat/ui-hci`)
- **Carteles y fotos de artistas, aceptando el riesgo de derechos de autor** (decisión expresa del autor: proyecto universitario sin carácter comercial). Se autoalojan para no enviar la IP a terceros. La foto libre del recinto solo se usa cuando no hay otra.
- **Sin filtro «Gratis / De pago»**: casi ningún evento publica su precio y ninguno es gratuito con certeza.
- **Recomendados con mayoría de conciertos y como mucho un evento deportivo**, sin repetir artista, equipo ni recinto (criterio en `docs/CHANGELOG-UI.md`).
- **«Gran evento» = recinto con aforo ≥ 10.000 personas**, con el aforo tomado de Wikidata o de la web oficial del recinto.
- **Pulido «cartelera de noche» (12/11/2026, rama `feat/unslop`)**: fondos en grafito casi neutro en lugar de azul marino, y ámbar de marquesina (`#f2a93b`, texto oscuro encima, 9,2:1) como único acento en lugar del morado, por decisión del autor. El color lo ponen los carteles. Las categorías pasan a ser un punto de color con texto neutro, «Gran evento» se queda como dato pero sin amarillo y desaparecen las mayúsculas espaciadas. Detalle en `docs/CHANGELOG-UI.md` (P3.1).
