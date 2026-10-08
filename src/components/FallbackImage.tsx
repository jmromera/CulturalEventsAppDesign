import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";

type FallbackImageProps = { src: string | null | undefined; alt: string; icon: IconName; category?: string; className?: string; width: number; height: number; lazy?: boolean };

// Imagen con reserva: si no hay URL o la imagen externa falla, se pinta un fondo del tema con el icono de la categoría.
export default function FallbackImage({ src, alt, icon, category, className = "", width, height, lazy = true }: FallbackImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Un fallo anterior al montaje no dispara onError.
  useEffect(() => {
    const image = imageRef.current;
    if (src && image?.complete && image.naturalWidth === 0) setFailedSrc(src);
  }, [src]);

  if (!src || failedSrc === src) {
    return <span className={`image-fallback ${className}`} data-cat={category} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}><Icon name={icon} /></span>;
  }
  return <img ref={imageRef} className={className || undefined} src={src} alt={alt} width={width} height={height} loading={lazy ? "lazy" : undefined} decoding={lazy ? "async" : undefined} fetchPriority={lazy ? undefined : "high"} onError={() => setFailedSrc(src)} />;
}
