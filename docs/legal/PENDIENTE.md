# Pendiente: lo que tienes que hacer tú

> Tareas fuera del código, agrupadas. Cada una dice por qué hace falta.
> **No es asesoramiento jurídico.** Antes de abrir al público, que lo revise un profesional.
> **No publiques hasta que `esEjemplo` sea `false` en `datos-legales.json` y lo hayas confirmado.** Mientras sea `true`, las páginas legales muestran un aviso rojo.

## 1. Datos del titular (bloquea el lanzamiento)

| Tarea | Por qué |
|---|---|
| Rellenar en `datos-legales.json`: nombre o razón social, NIF, domicilio, email de privacidad y datos registrales (o «No aplica» si eres persona física sin inscripción) | La LSSI (art. 10) obliga a identificar al titular. Hoy son datos de ejemplo. |
| Crear y vigilar los buzones `privacidad@` y `errores@` (o los que pongas) | La política de privacidad y los términos prometen responder por email; el código no puede cumplir esa promesa por ti. |
| Decidir el plazo real de respuesta a errores y reclamaciones (hoy: «10 días hábiles», de ejemplo) | Se publica en los términos y en la declaración de accesibilidad. |
| Poner `esEjemplo` a `false` y ejecutar `pnpm test` | Una prueba falla si queda algún dato de ejemplo o proveedor sin verificar. |

## 2. Dominio y despliegue

| Tarea | Por qué |
|---|---|
| Confirmar que `plancerca.com` es el dominio definitivo (aparece en `datos-legales.json`, sitemap, robots, canonical y Open Graph) | Si cambia, hay que cambiarlo en `datos-legales.json`, `.figma/make/site.json`, `public/robots.txt`, `public/llms.txt` y `public/ai-catalog.json`. |
| Comprobar en Vercel que el proyecto usa **pnpm** y que `vercel.json` aplica las cabeceras (abre la web publicada y mira las cabeceras de respuesta) | Se eliminó `package-lock.json`; la CSP y HSTS solo existen si Vercel lee `vercel.json`. |
| Revisar que Vercel **no** tiene activados Web Analytics, Speed Insights ni la barra de comentarios en producción | Pondrían scripts de terceros que la CSP bloquearía y que no están declarados en la privacidad. |
| Decidir si `main` sigue con la página de «Próximamente» o se lanza la app | Hoy `main` (producción) no tiene nada de este trabajo. |

## 3. Contratos y DPA con proveedores

| Proveedor | Tarea | Por qué |
|---|---|---|
| Vercel Inc. | Aceptar o firmar su acuerdo de tratamiento de datos (DPA), confirmar la región y el mecanismo de transferencia (Marco UE-EE. UU. o cláusulas tipo) y cuánto guarda los registros en tu plan. Después, poner `verificado: true` | Vercel recibe la IP de cada visitante; es encargado del tratamiento (art. 28 RGPD) y hay transferencia a EE. UU. |
| Proveedor de email (si usas uno para los buzones) | Añadirlo a `proveedores` en `datos-legales.json` con su DPA | Tratará los mensajes que te envíen. |

## 4. Licencias de datos e imágenes

| Tarea | Por qué |
|---|---|
| Revisar el origen de las 210 imágenes en `docs/legal/ORIGEN-IMAGENES.json` | Son carteles y fotos promocionales de terceros sin licencia documentada. **58 eran miniaturas de Google Imágenes**, cuya licencia real es desconocida. Ahora se sirven desde tu dominio, lo que no cambia quién tiene los derechos. Lo prudente: pedir permiso o usar material de prensa con autorización, o sustituirlas. |
| Mantener los créditos de las portadas de ciudad (README) y añadirlos también en la web si lo ves necesario | Las fotos de Valencia (CC BY 2.0) y Albacete (CC BY-SA 4.0) exigen atribución; hoy está en el README. |
| Revisar las descripciones de eventos (`description`, `fullDescription`) | Si alguna se copió literalmente de la web del organizador, puede tener derechos de autor. Mejor redactarlas con palabras propias. |
| Decidir qué hacer con valoraciones y «% de popularidad» | No tienen fuente. Ver `TEXTOS-A-REVISAR.md`. |

## 5. EIPD (evaluación de impacto)

| Tarea | Por qué |
|---|---|
| Probablemente **no** hace falta. Confírmalo con tu asesor | No hay datos sensibles, perfiles, seguimiento a gran escala ni decisiones automatizadas. La ubicación se procesa en el dispositivo y no se guarda. Si añades cuentas, analítica o geolocalización en servidor, revisarlo de nuevo. |

## 6. Revisión por abogado o DPO

| Tarea | Por qué |
|---|---|
| Revisar aviso legal, privacidad, cookies, términos y declaración de accesibilidad | Son borradores técnicos coherentes con el código, no textos validados jurídicamente. |
| Confirmar si te aplica la Ley Europea de Accesibilidad y qué autoridad es competente para reclamaciones | Exime a microempresas que prestan servicios; la declaración no nombra autoridad hasta saberlo. |
| Confirmar la base legal de los registros del servidor (interés legítimo) y el plazo | Depende de lo que contrates con Vercel. |

## 7. Decisiones de producto

| Decisión | Por qué |
|---|---|
| «Seguir artista» y «Avisarme» solo guardan una preferencia local y **no envían avisos** | Si se mantienen así, valora quitar «Avisarme» o explicar que aún no avisa: el usuario puede esperar notificaciones. |
| Mantener o quitar el perfil «Invitado» de la cabecera | Es decorativo; puede sugerir que hay cuentas. |
| Rendimiento en móvil (Lighthouse 81) | Para pasar de ~90 haría falta pre-renderizar las páginas o sacar el catálogo del JavaScript inicial. Es un cambio de arquitectura. |
| Revisión manual de accesibilidad con lector de pantalla | Ver `ACCESIBILIDAD.md`; lo automático no lo cubre todo. |
