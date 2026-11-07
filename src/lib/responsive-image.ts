import variants from "../data/image-variants.json";

type VariantInfo = { width: number; variants: number[] };
const manifest = variants as Record<string, VariantInfo>;

/** srcset listing the smaller copies made by scripts/image-variants.mjs, or undefined if there are none. */
export function srcSetFor(src: string | null | undefined): string | undefined {
  if (!src) return undefined;
  const info = manifest[src];
  if (!info) return undefined;
  const smaller = info.variants.map((width) => `${src.replace(/\.webp$/, `-${width}.webp`)} ${width}w`);
  return [...smaller, `${src} ${info.width}w`].join(", ");
}
