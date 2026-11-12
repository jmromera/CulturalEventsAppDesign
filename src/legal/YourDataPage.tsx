import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Language } from "../data/language";
import { clearStoredData, exportStoredData, STORAGE_REGISTRY } from "../data/storage-keys";
import { applyTheme, systemTheme } from "../lib/theme";
import { legalCopy, LEGAL_PATHS } from "./legal-copy";

const copy: Record<Language, {
  intro: string;
  storedHeading: string;
  stored: string;
  notStored: string;
  nothingStored: string;
  locationNote: string;
  download: string;
  downloadHint: string;
  delete: string;
  deleteHint: string;
  confirmTitle: string;
  confirmText: string;
  confirmYes: string;
  confirmNo: string;
  deleted: string;
  rights: string;
  privacyLink: string;
  item: string;
  state: string;
}> = {
  es: {
    intro: "Plan Cerca no tiene cuentas: todo lo que recuerda de ti está guardado en este navegador y nunca sale de él. Aquí puedes verlo, descargarlo o borrarlo.",
    storedHeading: "Qué hay guardado en este navegador",
    stored: "Guardado",
    notStored: "No guardado",
    nothingStored: "No hay nada guardado en este navegador.",
    locationNote: "Tu ubicación exacta nunca se guarda: si usas «Usar mi ubicación», solo recordamos el nombre de la ciudad.",
    download: "Descargar mis datos (JSON)",
    downloadHint: "Un archivo con todo lo guardado, para que lo revises o lo lleves a otro sitio.",
    delete: "Borrar mis datos",
    deleteHint: "Borra favoritos, idioma, ciudad, artistas seguidos y perfil de este navegador.",
    confirmTitle: "¿Borrar tus datos de este navegador?",
    confirmText: "Se borrarán tus favoritos, el idioma, la ciudad, los artistas que sigues y tu perfil. No se puede deshacer.",
    confirmYes: "Sí, borrar mis datos",
    confirmNo: "Cancelar",
    deleted: "Hemos borrado tus datos de este navegador.",
    rights: "Para cualquier otro derecho (acceso, oposición, reclamación…), consulta la",
    privacyLink: "política de privacidad",
    item: "Dato",
    state: "Estado",
  },
  en: {
    intro: "Plan Cerca has no accounts: everything it remembers about you is stored in this browser and never leaves it. Here you can see it, download it or delete it.",
    storedHeading: "What is stored in this browser",
    stored: "Stored",
    notStored: "Not stored",
    nothingStored: "Nothing is stored in this browser.",
    locationNote: "Your exact location is never stored: if you use “Use my location”, we only remember the name of the city.",
    download: "Download my data (JSON)",
    downloadHint: "A file with everything stored, so you can check it or take it elsewhere.",
    delete: "Delete my data",
    deleteHint: "Deletes favourites, language, city, followed artists and profile from this browser.",
    confirmTitle: "Delete your data from this browser?",
    confirmText: "Your favourites, language, city, followed artists and profile will be deleted. This cannot be undone.",
    confirmYes: "Yes, delete my data",
    confirmNo: "Cancel",
    deleted: "Your data has been deleted from this browser.",
    rights: "For any other right (access, objection, complaints…), see the",
    privacyLink: "privacy policy",
    item: "Item",
    state: "Status",
  },
  fr: {
    intro: "Plan Cerca n’a pas de comptes : tout ce qu’il retient de vous est enregistré dans ce navigateur et n’en sort jamais. Vous pouvez ici le consulter, le télécharger ou le supprimer.",
    storedHeading: "Ce qui est enregistré dans ce navigateur",
    stored: "Enregistré",
    notStored: "Non enregistré",
    nothingStored: "Rien n’est enregistré dans ce navigateur.",
    locationNote: "Votre position exacte n’est jamais enregistrée : si vous utilisez « Utiliser ma position », nous ne retenons que le nom de la ville.",
    download: "Télécharger mes données (JSON)",
    downloadHint: "Un fichier avec tout ce qui est enregistré, pour le vérifier ou l’emporter ailleurs.",
    delete: "Supprimer mes données",
    deleteHint: "Supprime les favoris, la langue, la ville, les artistes suivis et le profil de ce navigateur.",
    confirmTitle: "Supprimer vos données de ce navigateur ?",
    confirmText: "Vos favoris, la langue, la ville, les artistes suivis et le profil seront supprimés. Cette action est irréversible.",
    confirmYes: "Oui, supprimer mes données",
    confirmNo: "Annuler",
    deleted: "Vos données ont été supprimées de ce navigateur.",
    rights: "Pour tout autre droit (accès, opposition, réclamation…), consultez la",
    privacyLink: "politique de confidentialité",
    item: "Donnée",
    state: "État",
  },
};

export const DELETED_PARAM = "borrado";

/** Full reload so the app's in-memory state (favourites, language, city) starts from scratch. */
function reloadAfterDelete() {
  window.location.assign(`${LEGAL_PATHS.yourData}?${DELETED_PARAM}=1`);
}

export default function YourDataPage({ language, onDeleted = reloadAfterDelete }: { language: Language; onDeleted?: () => void }) {
  const text = copy[language];
  const location = useLocation();
  const justDeleted = new URLSearchParams(location.search).has(DELETED_PARAM);
  const [stored, setStored] = useState(exportStoredData);
  const [confirming, setConfirming] = useState(false);
  const hasData = Object.keys(stored).length > 0;

  useEffect(() => { document.title = `${legalCopy[language].yourData} · Plan Cerca`; }, [language]);

  const download = () => {
    const payload = { exportadoEl: new Date().toISOString(), sitio: "Plan Cerca", datos: stored };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "plan-cerca-mis-datos.json";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const confirmDelete = () => {
    clearStoredData();
    applyTheme(systemTheme());
    setStored(exportStoredData());
    setConfirming(false);
    onDeleted();
  };

  return <main id="main-content" tabIndex={-1} className="subpage legal-page your-data-page">
    <article className="legal-article">
      <h1>{legalCopy[language].yourData}</h1>
      {justDeleted && <p className="your-data-done" role="status">{text.deleted}</p>}
      <p>{text.intro}</p>

      <h2>{text.storedHeading}</h2>
      {hasData ? <div className="legal-table-wrap" role="region" aria-label={text.storedHeading} tabIndex={0}>
        <table className="legal-table your-data-table">
          <thead><tr><th scope="col">{text.item}</th><th scope="col">{text.state}</th></tr></thead>
          <tbody>{STORAGE_REGISTRY.map((entry) => <tr key={entry.key}><th scope="row"><span lang="es">{entry.purpose}</span></th><td>{entry.key in stored ? text.stored : text.notStored}</td></tr>)}</tbody>
        </table>
      </div> : <p>{text.nothingStored}</p>}
      <p>{text.locationNote}</p>

      <div className="your-data-actions">
        <div>
          <button type="button" className="button button--secondary" onClick={download} aria-describedby="download-hint">{text.download}</button>
          <p id="download-hint" className="your-data-hint">{text.downloadHint}</p>
        </div>
        <div>
          <button type="button" className="button button--secondary" onClick={() => setConfirming(true)} disabled={!hasData} aria-describedby="delete-hint" aria-expanded={confirming} aria-controls="delete-confirm">{text.delete}</button>
          <p id="delete-hint" className="your-data-hint">{text.deleteHint}</p>
        </div>
      </div>

      {confirming && <section id="delete-confirm" className="your-data-confirm" role="alertdialog" aria-labelledby="delete-confirm-title" aria-describedby="delete-confirm-text">
        <h2 id="delete-confirm-title">{text.confirmTitle}</h2>
        <p id="delete-confirm-text">{text.confirmText}</p>
        <div className="your-data-confirm-actions">
          <button type="button" className="button button--secondary" onClick={confirmDelete}>{text.confirmYes}</button>
          <button type="button" className="button button--secondary" onClick={() => setConfirming(false)} autoFocus>{text.confirmNo}</button>
        </div>
      </section>}

      <p>{text.rights} <Link to={LEGAL_PATHS.privacy}>{text.privacyLink}</Link>.</p>
    </article>
  </main>;
}
