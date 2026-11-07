import rawLegalData from "../../datos-legales.json";

export type Provider = {
  nombre: string;
  finalidad: string;
  datos: string;
  region: string;
  transferenciaFueraUE: boolean;
  garantiaTransferencia: string;
  dpa: string;
  verificado: boolean;
};

export type LegalData = {
  esEjemplo: boolean;
  versionTextos: string;
  fechaActualizacion: string;
  sitio: { nombre: string; dominio: string; url: string };
  titular: { nombre: string; nif: string; direccion: string; email: string; datosRegistrales: string };
  contacto: { emailErrores: string; plazoRespuestaErrores: string };
  proveedores: Provider[];
  plazos: { registrosServidor: string; datosNavegador: string; ubicacion: string; comunicaciones: string };
  autoridadControl: { nombre: string; url: string };
  leyAplicable: string;
};

export const legalData = rawLegalData as LegalData;

/** Required fields (dot paths). The test suite fails if any is missing or empty. */
export const REQUIRED_LEGAL_FIELDS = [
  "esEjemplo",
  "versionTextos",
  "fechaActualizacion",
  "sitio.nombre",
  "sitio.dominio",
  "sitio.url",
  "titular.nombre",
  "titular.nif",
  "titular.direccion",
  "titular.email",
  "titular.datosRegistrales",
  "contacto.emailErrores",
  "contacto.plazoRespuestaErrores",
  "proveedores",
  "plazos.registrosServidor",
  "plazos.datosNavegador",
  "plazos.ubicacion",
  "plazos.comunicaciones",
  "autoridadControl.nombre",
  "autoridadControl.url",
  "leyAplicable",
] as const;

export const REQUIRED_PROVIDER_FIELDS = ["nombre", "finalidad", "datos", "region", "transferenciaFueraUE", "garantiaTransferencia", "dpa", "verificado"] as const;
