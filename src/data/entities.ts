import entityData from "./related-entities.json";
import type { RelatedEntity } from "../types/Event";

export const relatedEntities = entityData as Record<string, RelatedEntity>;

// Solo claves propias: un slug como "constructor" no debe resolver a Object.prototype.
export function entityFor(id: string | undefined): RelatedEntity | undefined {
  return id && Object.prototype.hasOwnProperty.call(relatedEntities, id) ? relatedEntities[id] : undefined;
}