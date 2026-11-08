import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Language } from "../data/language";
import { STORAGE_REGISTRY } from "../data/storage-keys";
import { legalCopy, LEGAL_PATHS } from "./legal-copy";
import { legalData } from "./legal-data";

const d = legalData;

export function DraftNotice({ language }: { language: Language }) {
  if (!d.esEjemplo) return null;
  const text = legalCopy[language];
  return <div className="legal-draft" role="note"><strong>{text.draftTitle}</strong><p>{text.draftText}</p></div>;
}

export function LegalLayout({ title, language, children }: { title: string; language: Language; children: ReactNode }) {
  const text = legalCopy[language];
  useEffect(() => { document.title = `${title} · ${d.sitio.nombre}`; }, [title]);
  return <main id="main-content" tabIndex={-1} className="subpage legal-page">
    <DraftNotice language={language} />
    {text.spanishOnly && <p className="legal-language-note">{text.spanishOnly}</p>}
    {/* Legal texts are Spanish only: lang="es" keeps screen readers pronouncing them correctly. */}
    <article lang="es" className="legal-article">
      <h1>{title}</h1>
      <p className="legal-updated">Última actualización: {d.fechaActualizacion} · Versión {d.versionTextos}</p>
      {children}
    </article>
  </main>;
}

const Mail = ({ to }: { to: string }) => <a href={`mailto:${to}`}>{to}</a>;

export function LegalNoticePage({ language }: { language: Language }) {
  return <LegalLayout title="Aviso legal" language={language}>
    <h2>Titular del sitio web</h2>
    <p>Datos del responsable de {d.sitio.dominio}, en la línea de lo que pide el artículo 10 de la Ley 34/2002 (LSSI-CE):</p>
    <dl className="legal-facts">
      <dt>Responsable</dt><dd>{d.titular.nombre}</dd>
      <dt>Condición</dt><dd>{d.titular.condicion}</dd>
      <dt>Naturaleza</dt><dd>{d.titular.proyecto}</dd>
      <dt>Correo electrónico</dt><dd><Mail to={d.titular.email} /></dd>
    </dl>
    <h2>Objeto</h2>
    <p>{d.sitio.nombre} es una agenda informativa y gratuita de eventos culturales, deportivos y de ocio, creada como proyecto académico. No vende entradas, no cobra a los usuarios ni tiene publicidad: cada evento enlaza a la web del organizador o del vendedor.</p>
    <h2>Propiedad intelectual e industrial</h2>
    <p>El diseño y el código de la web pertenecen a su autor. Los nombres, logotipos, carteles y fotografías de artistas, recintos y eventos pertenecen a sus respectivos titulares y se muestran solo para identificar el evento. Si eres titular de algún contenido y quieres que lo retiremos o corrijamos, escríbenos a <Mail to={d.contacto.emailErrores} />.</p>
    <h2>Enlaces a otras webs</h2>
    <p>La web contiene enlaces a sitios de terceros (venta de entradas, mapas, calendarios, webs de recintos y artistas). No controlamos su contenido ni sus políticas de privacidad, que se aplican desde que entras en ellos.</p>
    <h2>Responsabilidad</h2>
    <p>Las condiciones sobre la información de los eventos y quién responde de ella están en los <Link to={LEGAL_PATHS.terms}>términos de uso</Link>.</p>
    <h2>Ley aplicable</h2>
    <p>Este sitio se rige por la {d.leyAplicable.toLocaleLowerCase("es")}.</p>
  </LegalLayout>;
}

export function PrivacyPolicyPage({ language }: { language: Language }) {
  const vercel = d.proveedores[0];
  return <LegalLayout title="Política de privacidad" language={language}>
    <section className="legal-summary" aria-labelledby="privacy-summary">
      <h2 id="privacy-summary">Resumen en 5 puntos</h2>
      <ol>
        <li><strong>No tenemos cuentas ni formularios.</strong> No te pedimos nombre, email ni teléfono, así que no sabemos quién eres.</li>
        <li><strong>Lo que eliges se queda en tu navegador.</strong> Favoritos, idioma y ciudad se guardan solo en tu dispositivo. Puedes descargarlos o borrarlos en <Link to={LEGAL_PATHS.yourData}>Tus datos</Link>.</li>
        <li><strong>Tu ubicación no sale de tu dispositivo.</strong> Solo se usa si la pides: para elegir la ciudad más cercana o, en «Cerca de mí», para ordenar los eventos por distancia. No la enviamos ni la guardamos: como mucho recordamos el nombre de la ciudad, y la posición para ordenar se olvida al cerrar la página.</li>
        <li><strong>Sin cookies, analítica ni publicidad.</strong> Las fuentes y las imágenes se sirven desde nuestro propio dominio. El único tercero que recibe tu IP es nuestro proveedor de alojamiento, {vercel.nombre}, para poder mostrarte la web.</li>
        <li><strong>Tus derechos.</strong> Escríbenos a <Mail to={d.titular.email} /> para cualquier consulta. Si no quedas satisfecho, puedes reclamar ante la {d.autoridadControl.nombre}.</li>
      </ol>
    </section>

    <h2>Responsable del tratamiento</h2>
    <p>{d.titular.nombre}, {d.titular.condicion.charAt(0).toLocaleLowerCase("es") + d.titular.condicion.slice(1)}. {d.titular.proyecto} Contacto: <Mail to={d.titular.email} />.</p>

    <h2>Qué datos tratamos, para qué y durante cuánto tiempo</h2>
    <div className="legal-table-wrap" role="region" aria-label="Tabla de tratamientos" tabIndex={0}>
      <table className="legal-table">
        <caption className="sr-only">Datos, finalidad, base legal, plazo, encargados y transferencias</caption>
        <thead><tr><th scope="col">Datos</th><th scope="col">Finalidad</th><th scope="col">Base legal</th><th scope="col">Plazo</th><th scope="col">Encargados</th><th scope="col">Transferencias fuera de la UE</th></tr></thead>
        <tbody>
          <tr>
            <th scope="row">Datos técnicos de conexión: {vercel.datos.toLocaleLowerCase("es")}</th>
            <td>Mostrarte la web y protegerla frente a abusos</td>
            <td>Interés legítimo en prestar un servicio seguro (art. 6.1.f RGPD)</td>
            <td>{d.plazos.registrosServidor}</td>
            <td>{vercel.nombre} ({vercel.finalidad.toLocaleLowerCase("es")})</td>
            <td>{vercel.transferenciaFueraUE ? `Sí: ${vercel.region}. Garantía: ${vercel.garantiaTransferencia}` : "No"}</td>
          </tr>
          <tr>
            <th scope="row">Preferencias guardadas en tu navegador (favoritos, idioma, ciudad, artistas seguidos y perfil: avatar y categorías favoritas)</th>
            <td>Recordar lo que eliges entre visitas</td>
            <td>Prestar la función que pides (art. 6.1.b RGPD); almacenamiento estrictamente necesario (art. 22.2 LSSI)</td>
            <td>{d.plazos.datosNavegador}</td>
            <td>Ninguno: no salen de tu dispositivo</td>
            <td>No</td>
          </tr>
          <tr>
            <th scope="row">Ubicación aproximada (solo si la pides con «Usar mi ubicación»)</th>
            <td>Proponerte la ciudad con eventos más cercana y, en «Cerca de mí», ordenar los eventos por distancia</td>
            <td>Tu consentimiento, dado con el permiso del navegador (art. 6.1.a RGPD)</td>
            <td>{d.plazos.ubicacion}</td>
            <td>Ninguno: el cálculo se hace en tu dispositivo</td>
            <td>No</td>
          </tr>
          <tr>
            <th scope="row">Lo que nos escribas por correo (por ejemplo, para avisar de un error o ejercer tus derechos)</th>
            <td>Responderte</td>
            <td>Interés legítimo en atender tu mensaje (art. 6.1.f RGPD) y obligación legal en el caso de los derechos (art. 6.1.c RGPD)</td>
            <td>{d.plazos.comunicaciones}</td>
            <td>Nuestro proveedor de correo, si lo hay</td>
            <td>Depende del proveedor de correo</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Lo que no hacemos</h2>
    <ul>
      <li>No usamos cookies, analítica, píxeles de seguimiento ni publicidad. Detalle en la <Link to={LEGAL_PATHS.cookies}>política de cookies</Link>.</li>
      <li>No cargamos nada de otros dominios: fuentes, imágenes y código se sirven desde {d.sitio.dominio}.</li>
      <li>No vendemos ni cedemos datos, ni tomamos decisiones automatizadas sobre ti.</li>
      <li>No pedimos la edad porque no recogemos datos que la requieran.</li>
    </ul>

    <h2>Enlaces a otras webs</h2>
    <p>Cuando pulsas un enlace externo (comprar entradas, abrir un mapa, añadir al calendario), sales de {d.sitio.nombre}. Desde ese momento, el responsable de tus datos es esa web y se aplica su política de privacidad.</p>

    <h2>Tus derechos</h2>
    <p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo a <Mail to={d.titular.email} />. Como no tenemos cuentas, no guardamos datos que te identifiquen; los de tu navegador los controlas tú desde <Link to={LEGAL_PATHS.yourData}>Tus datos</Link>. Si crees que no hemos atendido bien tu petición, puedes reclamar ante la <a href={d.autoridadControl.url} target="_blank" rel="noreferrer">{d.autoridadControl.nombre}</a>.</p>

    <h2>Proveedores</h2>
    <ul>{d.proveedores.map((p) => <li key={p.nombre}><strong>{p.nombre}</strong>: {p.finalidad}. Región: {p.region}. <a href={p.dpa} target="_blank" rel="noreferrer">Acuerdo de tratamiento de datos (DPA)</a>.</li>)}</ul>

    <h2>Cambios en esta política</h2>
    <p>Si cambiamos algo importante, lo indicaremos en esta página con una nueva fecha y versión.</p>
  </LegalLayout>;
}

export function CookiePolicyPage({ language }: { language: Language }) {
  return <LegalLayout title="Política de cookies" language={language}>
    <p><strong>{d.sitio.nombre} no usa cookies</strong>, ni propias ni de terceros. Tampoco usa analítica, píxeles ni publicidad. Por eso no te mostramos un aviso de cookies.</p>
    <h2>Lo que sí guardamos en tu navegador</h2>
    <p>Para recordar tus preferencias usamos el almacenamiento local del navegador (<span lang="en">localStorage</span>). Es información técnica o que tú pides guardar, nunca sale de tu dispositivo y no se usa para seguirte. Estas son todas las entradas:</p>
    <div className="legal-table-wrap" role="region" aria-label="Tabla de almacenamiento local" tabIndex={0}>
      <table className="legal-table">
        <caption className="sr-only">Entradas del almacenamiento local</caption>
        <thead><tr><th scope="col">Nombre</th><th scope="col">Para qué</th><th scope="col">Qué guarda</th><th scope="col">Cuándo se crea</th><th scope="col">Duración</th></tr></thead>
        <tbody>{STORAGE_REGISTRY.map((entry) => <tr key={entry.key}><th scope="row"><code>{entry.key}</code></th><td>{entry.purpose}</td><td>{entry.content}</td><td>{entry.createdWhen}</td><td>Hasta que lo borres</td></tr>)}</tbody>
      </table>
    </div>
    <h2>Cómo borrarlo</h2>
    <p>Puedes descargarlo o borrarlo todo de una vez en <Link to={LEGAL_PATHS.yourData}>Tus datos</Link>, o desde la configuración de tu navegador (borrar datos del sitio {d.sitio.dominio}).</p>
    <h2>Webs a las que enlazamos</h2>
    <p>Las webs de venta de entradas, mapas o calendarios a las que te llevan nuestros enlaces pueden usar sus propias cookies cuando entras en ellas. Consulta sus políticas.</p>
  </LegalLayout>;
}

export function TermsPage({ language }: { language: Language }) {
  return <LegalLayout title="Términos de uso" language={language}>
    <h2>Qué es {d.sitio.nombre}</h2>
    <p>Una agenda informativa y gratuita de eventos culturales, deportivos y de ocio en varias ciudades de España. Usarla no requiere registro ni pago. Al navegar por ella aceptas estos términos.</p>
    <h2>La información de los eventos es de terceros</h2>
    <p>Fechas, horarios, precios, disponibilidad, carteles y descripciones proceden de las webs oficiales de organizadores, recintos y vendedores, y <strong>pueden cambiar sin aviso</strong>: un concierto puede aplazarse, agotarse o cambiar de hora. Antes de comprar o desplazarte, comprueba siempre la información en la web oficial enlazada en cada ficha.</p>
    <h2>Quién responde de qué</h2>
    <ul>
      <li><strong>El organizador y el vendedor</strong> responden del evento, de la venta de entradas, de los precios, de las devoluciones y de cualquier cambio o cancelación.</li>
      <li><strong>{d.titular.nombre}</strong> responde de actuar con diligencia al recopilar la información y de corregir o retirar cuanto antes lo que sea erróneo cuando lo sepamos.</li>
      <li>No intervenimos en la compra: se hace siempre en la web del vendedor y con sus condiciones.</li>
    </ul>
    <h2>Cómo avisar de un error</h2>
    <p>Si ves un dato incorrecto, un evento cancelado o un contenido que te pertenece y no debería estar, escríbenos a <Mail to={d.contacto.emailErrores} /> indicando el enlace de la ficha. Responderemos en un plazo de {d.contacto.plazoRespuestaErrores.toLocaleLowerCase("es")}.</p>
    <h2>Uso permitido</h2>
    <p>Puedes consultar y compartir las fichas para uso personal. No está permitido copiar el catálogo de forma masiva ni usar la web para fines ilícitos o que la dañen.</p>
    <h2>Contenido de usuarios</h2>
    <p>{d.sitio.nombre} no permite publicar comentarios, reseñas ni otros contenidos de usuarios.</p>
    <h2>Cambios</h2>
    <p>Podemos actualizar estos términos; la versión vigente es siempre la publicada en esta página, con su fecha.</p>
    <h2>Ley aplicable</h2>
    <p>Se rigen por la {d.leyAplicable.toLocaleLowerCase("es")}. Si eres consumidor, puedes acudir a los tribunales de tu domicilio.</p>
  </LegalLayout>;
}

export function AccessibilityPage({ language }: { language: Language }) {
  return <LegalLayout title="Declaración de accesibilidad" language={language}>
    <p>{d.titular.nombre} quiere que {d.sitio.nombre} pueda usarlo cualquier persona, también con lector de pantalla, solo con teclado, con zoom o con preferencias de movimiento reducido.</p>
    <h2>Situación de cumplimiento</h2>
    <p>Esta web es <strong>parcialmente conforme</strong> con las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA, debido a las excepciones que se indican abajo.</p>
    <h2>Contenido no accesible</h2>
    <ul>
      <li><strong>Carteles de eventos.</strong> Muchos carteles son imágenes con texto (fechas, artistas, lugares). Su texto alternativo indica el evento, pero no transcribe todo el cartel. La información esencial (fecha, hora, lugar, precio) está siempre como texto en la ficha.</li>
      <li><strong>Webs de terceros.</strong> Las páginas de venta de entradas, mapas y calendarios a las que enlazamos no dependen de nosotros.</li>
      <li><strong>Textos legales.</strong> Solo están en español; en inglés y francés se indica que la versión que hace fe es la española.</li>
    </ul>
    <h2>Qué hemos comprobado</h2>
    <ul>
      <li>Análisis automático con axe-core (reglas WCAG 2.0, 2.1 y 2.2, niveles A y AA) en todas las páginas y en sus estados con datos, vacíos y de error, en móvil y en escritorio.</li>
      <li>Reajuste del contenido con zoom al 200 % sin desplazamiento horizontal.</li>
      <li>Navegación completa con teclado, foco visible, enlace para saltar al contenido y diálogos que retienen el foco.</li>
      <li>Resultados de búsqueda y avisos anunciados a los lectores de pantalla, idioma de cada página declarado y animaciones desactivadas con «reducir movimiento».</li>
      <li>Objetivos táctiles de al menos 24 × 24 píxeles y contraste de texto suficiente, también sobre las imágenes de portada.</li>
    </ul>
    <h2>Preparación de esta declaración</h2>
    <p>Declaración preparada el {d.fechaActualizacion} mediante una autoevaluación de su autor. No ha sido revisada por una entidad externa.</p>
    <h2>Observaciones y contacto</h2>
    <p>Si encuentras una barrera de accesibilidad o necesitas un contenido en otro formato, escríbenos a <Mail to={d.titular.email} />. Responderemos en un plazo de {d.contacto.plazoRespuestaErrores.toLocaleLowerCase("es")}.</p>
    <p>Si la respuesta no te satisface, puedes presentar una reclamación ante la autoridad de consumo o de accesibilidad competente.</p>
  </LegalLayout>;
}
