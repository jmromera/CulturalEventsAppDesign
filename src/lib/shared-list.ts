/** Most events a shared favourites link can carry. */
export const SHARED_LIST_MAX = 50;

/**
 * Reads the `lista` URL parameter of a shared favourites link ("12,45,301").
 * Keeps whole numbers only, without repeats, up to SHARED_LIST_MAX. Unknown ids are dropped by the caller.
 */
export function parseSharedList(value: string | null): number[] {
  const ids = (value ?? "").split(",").map((item) => item.trim()).filter((item) => /^\d{1,6}$/.test(item)).map(Number);
  return [...new Set(ids)].slice(0, SHARED_LIST_MAX);
}

export function sharedListPath(ids: number[]): string {
  return `/favorites?lista=${ids.slice(0, SHARED_LIST_MAX).join(",")}`;
}
