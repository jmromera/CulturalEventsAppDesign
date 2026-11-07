import { describe, expect, it } from "vitest";
import { legalData, REQUIRED_LEGAL_FIELDS, REQUIRED_PROVIDER_FIELDS } from "../src/legal/legal-data";

const valueAt = (path: string) => path.split(".").reduce<unknown>((value, key) => (value as Record<string, unknown> | undefined)?.[key], legalData);
const isFilled = (value: unknown) => value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "");

describe("datos-legales.json", () => {
  it.each(REQUIRED_LEGAL_FIELDS)("has the required field %s", (path) => {
    expect(isFilled(valueAt(path)), `Missing or empty: ${path}`).toBe(true);
  });

  it("lists at least one provider, each with every required field", () => {
    expect(legalData.proveedores.length).toBeGreaterThan(0);
    for (const provider of legalData.proveedores) {
      for (const field of REQUIRED_PROVIDER_FIELDS) {
        expect(isFilled(provider[field]), `${provider.nombre}: missing ${field}`).toBe(true);
      }
    }
  });

  it("keeps esEjemplo as a boolean", () => {
    expect(typeof legalData.esEjemplo).toBe("boolean");
  });

  it("does not leave sample markers once esEjemplo is false", () => {
    if (legalData.esEjemplo) return;
    const text = JSON.stringify(legalData);
    expect(text).not.toMatch(/EJEMPLO|ejemplo\.invalid|B00000000|\[TU NOMBRE\]|\[UNIVERSIDAD\]/);
    expect(legalData.proveedores.every((provider) => provider.verificado)).toBe(true);
  });
});
