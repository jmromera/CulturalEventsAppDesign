# Roadmap: Plan Cerca

## Objetivo

Lanzar en diciembre de 2026 la agenda de conciertos, teatro, ópera, exposiciones y deporte de seis ciudades españolas, como proyecto de la asignatura «HCI: Desarrollo web y móvil». Hasta entonces, plancerca.com muestra la página de «Próximamente».

## Orden del plan

1. Pulido visual «cartelera de noche»: va primero porque cambia todas las pantallas y las capturas de la memoria.
2. Revisión y fusión en `develop` y `main`: `main` es producción, pero la portada pública sigue tapada por «Próximamente».
3. Datos legales reales y `esEjemplo: false`: sin esto no se puede abrir la web.
4. Lanzamiento: `LAUNCHED = true` en `src/main.tsx`.

## Tus decisiones

### D1. ¿Qué hacemos con los atajos de fecha que salen a 0 en la portada?

En Madrid, «Hoy 0 · Mañana 0 · Esta semana 0» aparecen desactivados, con el aviso «No hay planes para estos días» debajo.

- **A. Ocultar los atajos con 0 y dejar solo el aviso con su enlace** (mi propuesta): la portada deja de enseñar tres botones que no llevan a nada, y el aviso ya evita el callejón sin salida.
- B. Dejarlos como están: muestran con sinceridad que esos días no hay nada, pero ocupan el primer pantallazo.
- C. Mostrar siempre los dos atajos con eventos más cercanos («Este fin de semana», «Próximos 30 días»): requiere cambiar la lógica y sus pruebas.

**Bloquea:** nada (mejora opcional)
**Estado:** Abierta

### D2. ¿Dónde va «Probar la reserva (demostración)»?

Hoy es un segundo botón en la tarjeta de compra, justo debajo de «Comprar en la web oficial».

- **A. Pasarlo a un enlace de texto bajo la compra** (mi propuesta): la reserva de demostración (P1.5) se sigue pudiendo enseñar, pero no compite con la compra real.
- B. Dejarlo como botón secundario: es lo que pedía el enunciado de P1.5, si exige que se vea como botón.
- C. Quitarlo de la ficha y enlazarlo solo desde «Acerca de»: se limpia la ficha, pero la demostración queda escondida.

**Bloquea:** nada (mejora opcional)
**Estado:** Abierta

### D3. ¿Cambiamos también los colores de la página «Próximamente»?

`src/components/ComingSoonPage.css` es la página que hoy ve el público.

- **A. Pasarla a grafito y ámbar en una rama aparte, y publicarla cuando lo apruebes** (mi propuesta): la página pública coincide con la web que se lanzará en diciembre.
- B. Dejarla como está hasta el lanzamiento: es temporal y ya funciona.

**Bloquea:** nada
**Estado:** Descartada (12/11/2026): la premisa era errónea. La página ya es clara y usa el azul `#1d4ed8` del logo, que coincide con el nuevo modo azul.

## Tus manos

Lo que solo puedes hacer tú:

- [ ] Revisar la rama `feat/unslop` en local (`pnpm dev`, http://localhost:8443) y aprobar la fusión (desbloquea P2).
- [ ] Completar `datos-legales.json` (`[TU NOMBRE]`, `[UNIVERSIDAD]`) y revisar `docs/legal/PENDIENTE.md` y `docs/legal/TEXTOS-A-REVISAR.md` (desbloquea P3).
- [ ] En diciembre, decidir el día del lanzamiento (desbloquea P4).

## Pasos

| #  | Paso | Estado | Depende de | Comprobación |
|----|------|--------|------------|--------------|
| P1 | Pulido «cartelera de noche» (grafito, ámbar, categorías como punto, textos rotos) | Hecho y comprobado | – | typecheck, 281 tests, build, axe sin problemas (112 comprobaciones), contraste de portada ≥ 5,19:1 y capturas a 1440 y 390 |
| P1b | Modo azul por defecto y modo noche con interruptor que se recuerda | Hecho y comprobado | P1 | 289 tests, axe sin problemas en los dos modos (194 comprobaciones), responsive, pie y contraste de portada |
| P2 | Fusionar `feat/unslop` en `develop` y en `main` | Esperando tus manos | P1 | PR revisado; Vercel publica y plancerca.com sigue mostrando «Próximamente» |
| P3 | Datos legales reales y `esEjemplo: false` | Esperando tus manos | – | `tests/legal-data.test.ts` pasa con `esEjemplo: false` |
| P4 | Lanzamiento: `LAUNCHED = true` | No empezado | P2, P3 | plancerca.com muestra la app |

Estados: `No empezado` · `Esperando <Dn / tus manos>` · `En curso` · `Hecho y comprobado`

## Definición de terminado

- [ ] plancerca.com muestra la app en modo azul, con el modo noche disponible.
- [ ] axe sin problemas y contraste de la portada ≥ 4,5:1 en las seis ciudades.
- [ ] Páginas legales sin el aviso rojo de ejemplo.

## Después

Ideas y trabajo fuera del alcance actual:

- Unificar las capas superpuestas de `src/index.css` en un solo juego de tokens (punto 3.1 de `docs/PLAN-UI.md`).

## Log

### 2026-11-12

- Hecho: instalada la skill `unslop`, auditoría de la web y pulido con la dirección «cartelera de noche» en la rama `feat/unslop`.
- Comprobado: typecheck, 281 tests y build; capturas de la portada (1440 y 390) y de la ficha de evento.
- Decisiones nuevas: D1, D2 y D3.
- Siguiente: terminar las comprobaciones de P1 y pedir la revisión de la rama.

### 2026-11-12 (tarde)

- Hecho: a petición del autor, el modo por defecto pasa a azul (tipo Ticketmaster) con tarjetas claras; el grafito con ámbar queda como modo noche, con interruptor en la cabecera y en el menú de perfil. El logo es siempre el azul del favicon.
- Comprobado: 289 tests, axe en los dos modos (194 comprobaciones sin problemas), responsive, pie y contraste de portada; capturas de portada, ficha y menú en móvil.
- Decisiones: D3 descartada (la página «Próximamente» ya usa el azul del logo).
- Siguiente: revisión de la rama `feat/unslop` por el autor (P2).
