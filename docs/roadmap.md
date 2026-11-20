 Hecho y comprobado | Hecho y comprobado  Captura de la cabecera en modo noche; axe en los dos modos sin problemas || Hecho y comprobado  `check:contraste`: peor caso Madrid 390 px, 5,55:1 || Hecho y comprobado  Cabecera medida a 320, 360, 390, 430 y 700 px sin solapes; `check:responsive` || Hecho y comprobado  Captura de la ficha; la prueba de reserva sigue encontrando el enlace ||# Roadmap: Plan Cerca

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
**Estado:** Decidida: A (20/11/2026)

### D2. ¿Dónde va «Probar la reserva (demostración)»?

Hoy es un segundo botón en la tarjeta de compra, justo debajo de «Comprar en la web oficial».

- **A. Pasarlo a un enlace de texto bajo la compra** (mi propuesta): la reserva de demostración (P1.5) se sigue pudiendo enseñar, pero no compite con la compra real.
- B. Dejarlo como botón secundario: es lo que pedía el enunciado de P1.5, si exige que se vea como botón.
- C. Quitarlo de la ficha y enlazarlo solo desde «Acerca de»: se limpia la ficha, pero la demostración queda escondida.

**Bloquea:** nada (mejora opcional)
**Estado:** Decidida: A (20/11/2026)

### D3. ¿Cambiamos también los colores de la página «Próximamente»?

`src/components/ComingSoonPage.css` es la página que hoy ve el público.

- **A. Pasarla a grafito y ámbar en una rama aparte, y publicarla cuando lo apruebes** (mi propuesta): la página pública coincide con la web que se lanzará en diciembre.
- B. Dejarla como está hasta el lanzamiento: es temporal y ya funciona.

**Bloquea:** nada
**Estado:** Descartada (12/11/2026): la premisa era errónea. La página ya es clara y usa el azul `#1d4ed8` del logo, que coincide con el nuevo modo azul.

## Tus manos

Lo que solo puedes hacer tú:

- [ ] Completar `datos-legales.json` (`[TU NOMBRE]`, `[UNIVERSIDAD]`) y revisar `docs/legal/PENDIENTE.md` y `docs/legal/TEXTOS-A-REVISAR.md` (desbloquea P3).
- [ ] En diciembre, decidir el día del lanzamiento (desbloquea P4).

## Pasos

 `tests/hero.test.tsx` (falla sin el cambio) || #  | Paso | Estado | Depende de | Comprobación |
|----|------|--------|------------|--------------|
| P1 | Pulido «cartelera de noche» (grafito, ámbar, categorías como punto, textos rotos) | Hecho y comprobado | – | typecheck, 281 tests, build, axe sin problemas (112 comprobaciones), contraste de portada ≥ 5,19:1 y capturas a 1440 y 390 |
| P1b | Modo azul por defecto y modo noche con interruptor que se recuerda | Hecho y comprobado | P1 | 289 tests, axe sin problemas en los dos modos (194 comprobaciones), responsive, pie y contraste de portada |
| P2 | Fusionar `feat/unslop` en `develop` y en `main` | En curso | P1 | En `develop` (PR #21). Falta `main`: Vercel publica y plancerca.com sigue mostrando «Próximamente» |
| P5 | D1: ocultar los atajos de fecha a 0 de la portada | Hecho y comprobado | D1 | `tests/hero.test.tsx` (falla sin el cambio) |
| P6 | D2: «Probar la reserva» como enlace de texto | Hecho y comprobado | D2 | Captura de la ficha; la prueba de reserva sigue encontrando el enlace |
| P7 | El interruptor de modo noche no desaparece al estrechar la ventana (también en móvil) | Hecho y comprobado | – | Cabecera medida a 320, 360, 390, 430 y 700 px sin solapes; `check:responsive` |
| P8 | Modo azul: fotos de ciudad menos oscuras, manteniendo el texto de la portada ≥ 4,5:1 | Hecho y comprobado | – | `check:contraste`: peor caso Madrid 390 px, 5,55:1 |
| P9 | Botón de modo día (sol) en ámbar, como la lupa del buscador | Hecho y comprobado | – | Captura de la cabecera en modo noche; axe en los dos modos sin problemas |
| P10 | Más eventos entre el 10/12/2026 y el 30/01/2027 | No empezado | – | |
| P11 | Documentar las limitaciones no implementadas (avisos por correo, cuentas de usuario) en el documento del trabajo | No empezado | – | |
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

### 2026-11-20

- Decisiones: D1 y D2 decididas (A). Las funciones sin implementar («Avisarme», cuentas) se quedan y se explican como limitaciones de un trabajo universitario (P11).
- Siguiente: P5 a P9 en la rama `feat/ajustes-portada`, luego P2 (`main`) y P10.
