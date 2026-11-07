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
