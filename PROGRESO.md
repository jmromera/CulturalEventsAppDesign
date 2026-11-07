# Progreso

## 7 de noviembre de 2026 · Preparación para el lanzamiento (rama `chore/lanzamiento-legal`)

- [x] **Auditoría** (`docs/legal/AUDITORIA.md`): sin backend, cuentas ni cookies; 37 dominios externos de imágenes (58 miniaturas de Google) y Google Fonts reciben la IP del visitante.
- [x] **Bloque legal**: `datos-legales.json`, aviso legal, privacidad, cookies y términos, enlaces en el pie, aviso rojo mientras `esEjemplo` sea `true`, pruebas de campos obligatorios.
- [x] **Consentimiento y borrado**: página «Tus datos» (descargar y borrar), explicación antes de pedir la ubicación, nada se guarda solo por visitar; pruebas de borrado, de ubicación y de primera visita.
- [x] **Cookies y terceros**: fuentes e imágenes autoalojadas (210 imágenes de 37 dominios), cero peticiones a terceros y cero cookies, comprobado con pruebas y en navegador real.
