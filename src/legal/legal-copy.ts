import type { Language } from "../data/language";

// Interface strings for the legal area. The legal texts themselves are published in Spanish.
export const legalCopy: Record<Language, {
  footerNav: string;
  legalNotice: string;
  privacy: string;
  cookies: string;
  terms: string;
  accessibility: string;
  yourData: string;
  draftTitle: string;
  draftText: string;
  spanishOnly: string;
  lastUpdated: string;
}> = {
  es: {
    footerNav: "Información legal",
    legalNotice: "Aviso legal",
    privacy: "Privacidad",
    cookies: "Cookies",
    terms: "Términos de uso",
    accessibility: "Accesibilidad",
    yourData: "Tus datos",
    draftTitle: "Borrador con datos de ejemplo",
    draftText: "Esta página usa datos de ejemplo y aún no tiene validez legal. No publiques la web hasta completarlos y revisarlos.",
    spanishOnly: "",
    lastUpdated: "Última actualización",
  },
  en: {
    footerNav: "Legal information",
    legalNotice: "Legal notice",
    privacy: "Privacy",
    cookies: "Cookies",
    terms: "Terms of use",
    accessibility: "Accessibility",
    yourData: "Your data",
    draftTitle: "Draft with sample data",
    draftText: "This page uses sample data and is not legally valid yet. Do not publish the site until it is completed and reviewed.",
    spanishOnly: "This legal text is published in Spanish, which is the binding version.",
    lastUpdated: "Last updated",
  },
  fr: {
    footerNav: "Informations légales",
    legalNotice: "Mentions légales",
    privacy: "Confidentialité",
    cookies: "Cookies",
    terms: "Conditions d’utilisation",
    accessibility: "Accessibilité",
    yourData: "Vos données",
    draftTitle: "Brouillon avec des données d’exemple",
    draftText: "Cette page utilise des données d’exemple et n’a pas encore de valeur juridique. Ne publiez pas le site avant de les compléter et de les faire vérifier.",
    spanishOnly: "Ce texte juridique est publié en espagnol, qui est la version qui fait foi.",
    lastUpdated: "Dernière mise à jour",
  },
};

export const LEGAL_PATHS = {
  legalNotice: "/aviso-legal",
  privacy: "/privacidad",
  cookies: "/cookies",
  terms: "/terminos",
  accessibility: "/accesibilidad",
  yourData: "/tus-datos",
} as const;
