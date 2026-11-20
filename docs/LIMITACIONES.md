# Limitaciones conocidas

Plan Cerca es un trabajo universitario de la asignatura «HCI: Desarrollo web y móvil». Es una web estática, sin servidor propio ni base de datos. Estas son las funciones que se muestran en la interfaz o que cabría esperar, pero que no están implementadas, y los límites que hay que tener en cuenta al evaluarla.

## Funciones sin implementar

- **Avisos por correo o notificaciones.** «Seguir artista» y «Avisarme» guardan la preferencia en el navegador, pero no se envía ningún aviso: harían falta un servidor, una base de datos y un servicio de correo o de notificaciones.
- **Cuentas de usuario e inicio de sesión.** No hay registro ni login. El perfil («Tu perfil», avatar, categorías favoritas, idioma, modo noche) y los favoritos se guardan solo en el navegador del visitante. Si cambia de dispositivo o borra los datos del navegador, se pierden. Se pueden descargar o borrar desde «Tus datos».
- **Compra de entradas.** Plan Cerca no vende entradas: el botón «Comprar en la web oficial» lleva a la web del recinto o de la ticketera. «Probar la reserva» es una demostración del flujo de reserva, sin pago ni entrada real.
- **Precios y disponibilidad en tiempo real.** No hay conexión con las ticketeras. El precio aparece solo cuando es público; si no, se indica «Precio y entradas en la web oficial».

## Datos

- **Catálogo estático.** Los 369 eventos, los recintos y las imágenes están en el propio proyecto y se actualizan a mano. No hay una API que añada eventos nuevos.
- **Cobertura.** Seis ciudades (Madrid, Barcelona, Valencia, Sevilla, Bilbao y Albacete). Cada ciudad tiene al menos 25 eventos entre el 20 de noviembre de 2026 y el 31 de enero de 2027; los eventos pasados se ocultan solos.
- **Imágenes.** Los carteles y fotos oficiales se alojan en el propio proyecto para no enviar datos del visitante a terceros. Se usan con fines académicos, sin carácter comercial.

## Calidad y accesibilidad

- **Rendimiento en móvil.** Lighthouse da 81 en móvil (97 en escritorio). Para llegar a 90 haría falta pre-renderizar las páginas, que es un cambio de arquitectura.
- **Accesibilidad.** La revisión automática con axe (WCAG 2.2 A y AA) pasa sin problemas en todas las páginas, en móvil y escritorio y en los dos modos de color. No se ha hecho una prueba con un lector de pantalla real (NVDA o VoiceOver), que la revisión automática no sustituye.

## Aspectos legales

- **Datos del titular.** Mientras `datos-legales.json` tenga los datos de ejemplo, las páginas legales muestran un aviso rojo. Los textos legales están redactados para un proyecto académico y no los ha revisado un abogado.
