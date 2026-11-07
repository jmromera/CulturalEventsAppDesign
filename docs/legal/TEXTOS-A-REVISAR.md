# Textos comerciales a revisar

> Afirmaciones de la web que **el código no puede demostrar**. Por indicación expresa, **no se han cambiado**: decide tú si las quitas, las reformulas o las respaldas con datos.
> No es asesoramiento jurídico. Como referencia, la normativa de consumo española y europea (prácticas comerciales desleales y reseñas falsas) exige que lo que se anuncia sea veraz y demostrable.

| Prioridad | Texto | Dónde aparece | Por qué no se puede demostrar | Sugerencia |
|---|---|---|---|---|
| 🔴 Alta | Valoraciones («★ 4.8») y «Mejor valorado: Muse · 4.8» | Tarjetas, ficha de evento y franja de la portada (`rating` en `events.json`) | No hay sistema de valoraciones ni fuente de esas cifras: están escritas a mano en los datos. Mostrar valoraciones sin origen real puede considerarse una práctica engañosa. | Quitarlas o citar su fuente (p. ej. «4,8 en Google») con fecha. |
| 🔴 Alta | «95% de popularidad» | Tarjetas y ficha (`popularity` en `events.json`) | Ninguna parte del código calcula popularidad; el dato es manual y sin fuente. | Quitarlo o explicar cómo se mide. |
| 🟠 Media | «Entradas disponibles», «Próximamente», «Agotado» | Tarjetas y ficha (`availability`) | Es un texto escrito a mano el día que se añadió el evento; no se actualiza solo. Puede estar desfasado. | Añadir «según la web oficial a fecha de…», o actualizarlo con frecuencia. |
| 🟠 Media | «La compra se completa de forma segura en la web del proveedor oficial» | Ficha de evento, bajo el botón de compra | No controlamos la seguridad de webs ajenas, y no todos los enlaces son del organizador: muchos llevan a ticketeras. | «La compra se hace en la web del vendedor enlazado». |
| 🟠 Media | «Comprar en la web oficial», «Proveedor oficial», «Enlaces oficiales», «Web oficial» | Botones y enlaces de fichas | No hay comprobación de que cada enlace sea el canal oficial. | Revisar los enlaces uno a uno o decir «web de venta». |
| 🟡 Baja | «Recomendados para ti» | Portada | No hay personalización: son los eventos marcados como destacados (`featured`) en los datos. | «Destacados» o «Recomendados». |
| 🟡 Baja | «… seleccionados cerca de ti», «Próximos cerca de ti», «eventos culturales cerca de ti» | Portada, pie y meta descripción | La app filtra por ciudad, no por distancia a la persona. | «… en tu ciudad». |
| 🟡 Baja | «Tendencias en {ciudad}» | Franja de la portada | Son las categorías con más eventos en el catálogo, no tendencias de interés. | «Lo que más hay en {ciudad}». |
| 🟡 Baja | «Estamos ampliando continuamente nuestro catálogo» | Ciudad sin eventos en filtros | Promesa de actividad futura que depende de ti. | Mantener solo si es cierto. |

## Afirmaciones que sí se pueden demostrar

| Texto | Prueba |
|---|---|
| «No usamos cookies, analítica ni publicidad» | `tests/storage-registry.test.ts`, `tests/storage-on-visit.test.tsx` y `pnpm check:terceros` (0 cookies en navegador real) |
| «Fuentes, imágenes y código se sirven desde nuestro dominio» | `tests/no-third-party.test.ts` y `pnpm check:terceros` |
| «Tu ubicación no sale de tu dispositivo; solo se guarda el nombre de la ciudad» | `tests/geolocation.test.tsx` |
| «Puedes descargar o borrar tus datos» | `tests/your-data.test.tsx` |
| «Agenda gratuita, sin registro» | No existe código de pagos, cuentas ni registro |
| Número de eventos por ciudad | Se calcula en `src/data/event-catalog.ts` a partir de los datos |
