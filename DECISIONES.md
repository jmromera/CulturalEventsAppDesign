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
- **Plazo de respuesta a errores: 10 días hábiles (ejemplo).** Es una decisión de negocio; queda marcada como ejemplo.

## Consentimiento, derechos y borrado
- **Sin registro, edad mínima, casillas de consentimiento ni emails**: la app no tiene cuentas, formularios ni envíos. No se añaden; si algún día los hay, habrá que hacer este bloque.
- **«Tus datos» (`/tus-datos`) en lugar de Ajustes de cuenta**: descarga en JSON y borrado de todo lo guardado en el navegador. No pide contraseña porque no hay cuenta; pide confirmación con «Sí, borrar» y «Cancelar» del mismo peso.
- **Tras borrar, se recarga la página**, para que la app no vuelva a escribir los datos que tenía en memoria.
- **La app ya no guarda nada solo por visitarla**: idioma y favoritos se escriben únicamente cuando la persona los cambia. Antes se guardaban el idioma y una lista vacía de favoritos en la primera visita.
- **Geolocalización**: se mantiene como estaba (solo al pulsar «Usar mi ubicación», cálculo en el dispositivo, se guarda solo el nombre de la ciudad) y se añade una explicación junto al botón antes de pedir el permiso.
- **Sin búsqueda por código postal**: la lista de seis ciudades ya permite usar la app sin ubicación; un buscador por código postal no aporta y necesitaría datos de geocodificación.

## Cookies y terceros
- **Sin banner de cookies**: la app no pone cookies ni usa analítica, píxeles ni publicidad. Solo usa almacenamiento local técnico o pedido por el usuario (exento según el art. 22.2 LSSI). Hay página de cookies con la tabla real y pruebas que la comparan con el código.
- **Fuentes autoalojadas** (paquetes `@fontsource` de DM Sans y Manrope, licencia OFL) en lugar de Google Fonts, que recibía la IP de cada visitante.
- **Las 210 imágenes autoalojadas** (portadas, carteles, recintos y artistas), convertidas a WebP. Antes se cargaban desde 37 dominios, entre ellos 58 miniaturas de Google Imágenes, y cada visita les enviaba la IP. El origen de cada una queda en `docs/legal/ORIGEN-IMAGENES.json` para revisar licencias.
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
