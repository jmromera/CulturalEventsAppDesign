# Progreso

## 7 de noviembre de 2026 · Preparación para el lanzamiento (rama `chore/lanzamiento-legal`)

- [x] **Auditoría** (`docs/legal/AUDITORIA.md`): sin backend, cuentas ni cookies; 37 dominios externos de imágenes (58 miniaturas de Google) y Google Fonts reciben la IP del visitante.
- [x] **Bloque legal**: `datos-legales.json`, aviso legal, privacidad, cookies y términos, enlaces en el pie, aviso rojo mientras `esEjemplo` sea `true`, pruebas de campos obligatorios.
- [x] **Consentimiento y borrado**: página «Tus datos» (descargar y borrar), explicación antes de pedir la ubicación, nada se guarda solo por visitar; pruebas de borrado, de ubicación y de primera visita.
- [x] **Cookies y terceros**: fuentes e imágenes autoalojadas (210 imágenes de 37 dominios), cero peticiones a terceros y cero cookies, comprobado con pruebas y en navegador real.
- [x] **Accesibilidad**: axe en 21 páginas y estados (móvil y escritorio) sin problemas, zoom 200 %, contraste sobre portadas, resultados anunciados con aria-live y declaración en `/accesibilidad`.
- [x] **Seguridad**: cabeceras (CSP estricta, HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors), 0 vulnerabilidades, JSON-LD a prueba de XSS, sin secretos; pruebas automáticas.
- [x] **Calidad**: canonical, noindex, Open Graph, sitemap, imágenes responsive; Lighthouse escritorio 97/100/100/100 y móvil 81/100/100/100; 360/390/768 px, 3G lenta y sin ubicación comprobados.
- [x] **Entregables**: `docs/legal/` (AUDITORIA, CHECKLIST, PENDIENTE, TEXTOS-A-REVISAR, ACCESIBILIDAD, capturas).

**Siguiente paso (tuyo)**: completar `datos-legales.json`, revisar `docs/legal/PENDIENTE.md` y `TEXTOS-A-REVISAR.md`, y no publicar hasta poner `esEjemplo: false`.
