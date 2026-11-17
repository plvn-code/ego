"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/lib/catalog/types";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/ui/Icons";

/** Fired by ProductPurchase when a colour is picked; detail = that colour's first photo index. */
export const GALLERY_EVENT = "ego:gallery";

/**
 * Shows only the photos of the selected colour. Colour photos are stored back to back,
 * so a colour owns the range from its first photo (`starts`) up to the next colour's first photo.
 */
export function ProductGallery({ images, starts, initial = 0 }: { images: ProductImage[]; starts: number[]; initial?: number }) {
  const [start, setStart] = useState(initial);
  const [switched, setSwitched] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const end = starts.filter((s) => s > start).sort((a, b) => a - b)[0] ?? images.length;
  const visible = images.slice(start, end);

  const step = useCallback(
    (dir: 1 | -1) => setLightbox((i) => (i === null ? i : (i + dir + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    const onPick = (e: Event) => {
      const next = (e as CustomEvent<number>).detail;
      setStart(next);
      setSwitched(true);
      setActive(0);
      if (trackRef.current) trackRef.current.scrollLeft = 0;
      // Desktop: bring the gallery back into view if it scrolled away above the header.
      const root = rootRef.current;
      if (root && root.getBoundingClientRect().top < 0) root.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(GALLERY_EVENT, onPick);
    return () => window.removeEventListener(GALLERY_EVENT, onPick);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, step]);

  function onScroll() {
    const el = trackRef.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div ref={rootRef} className="gallery-root">
      <div key={start} className={`gallery ${switched ? "gallery--switched" : ""}`}>
        {visible.map((img, i) => (
          <button key={img.src} className="gallery__item" onClick={() => setLightbox(i)} aria-label={`Збільшити фото ${i + 1}`}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i < 2}
              quality={85}
              sizes="(max-width: 960px) 100vw, 29vw"
              style={{ objectFit: "cover" }}
            />
          </button>
        ))}
      </div>

      <div className="gallery-mobile">
        <div key={start} className={`gallery-mobile__track ${switched ? "gallery--switched" : ""}`} ref={trackRef} onScroll={onScroll}>
          {visible.map((img, i) => (
            <div key={img.src} className="gallery-mobile__slide" onClick={() => setLightbox(i)}>
              <Image src={img.src} alt={img.alt} fill priority={i === 0} quality={85} sizes="100vw" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
        {visible.length > 1 && (
          <div className="gallery-mobile__dots" aria-hidden="true">
            {visible.map((img, i) => (
              <i key={img.src} data-active={i === active} />
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Перегляд фото">
          <div className="lightbox__img">
            <Image src={visible[lightbox].src} alt={visible[lightbox].alt} fill quality={90} sizes="92vw" style={{ objectFit: "contain" }} />
          </div>
          <button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Закрити">
            <CloseIcon width={20} height={20} />
          </button>
          {visible.length > 1 && (
            <>
              <button className="lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Попереднє фото">
                <ChevronLeft />
              </button>
              <button className="lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Наступне фото">
                <ChevronRight />
              </button>
            </>
          )}
          <span className="lightbox__count">
            {lightbox + 1} / {visible.length}
          </span>
        </div>
      )}
    </div>
  );
}
