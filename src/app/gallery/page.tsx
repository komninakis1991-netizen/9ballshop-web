"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { GALLERY_IMAGES } from "@/lib/gallery";

export default function GalleryPage() {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const count = GALLERY_IMAGES.length;

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen((i) => (i === null ? i : (i - 1 + count) % count)), [count]);
  const next = useCallback(() => setOpen((i) => (i === null ? i : (i + 1) % count)), [count]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  // Swipe support on phones
  const [touchX, setTouchX] = useState<number | null>(null);

  const altOf = (i: number) => {
    const img = GALLERY_IMAGES[i];
    return locale === "el" && img.altEl ? img.altEl : img.alt;
  };
  const captionOf = (i: number) => {
    const img = GALLERY_IMAGES[i];
    return locale === "el" && img.captionEl ? img.captionEl : img.caption;
  };

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.gallery.subtitle}</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">{t.gallery.title}</h1>
          <p className="text-cream/50 mt-4 max-w-2xl mx-auto">{t.gallery.description}</p>
        </div>

        {count === 0 ? (
          <p className="text-center text-cream/40">{t.gallery.empty}</p>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setOpen(i)}
                className="group relative block w-full mb-3 sm:mb-4 break-inside-avoid overflow-hidden rounded-lg border border-gold/10 hover:border-gold/40 transition-colors bg-slate-mid"
                aria-label={altOf(i)}
              >
                <img
                  src={img.src}
                  alt={altOf(i)}
                  width={img.width}
                  height={img.height}
                  loading={i < 4 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-500"
                />
                {captionOf(i) && (
                  <span className="absolute inset-x-0 bottom-0 p-3 text-left text-cream text-xs sm:text-sm bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {captionOf(i)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {open !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
            setTouchX(null);
          }}
        >
          <figure className="max-w-[92vw] max-h-[88vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY_IMAGES[open].src}
              alt={altOf(open)}
              className="max-w-[92vw] max-h-[80vh] object-contain rounded-md"
            />
            <figcaption className="mt-3 text-center text-cream/80 text-sm">
              {captionOf(open)}
              <span className="ml-2 text-cream/40">
                {open + 1} / {count}
              </span>
            </figcaption>
          </figure>

          <button onClick={close} aria-label={t.gallery.close} className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-cream/80 hover:text-gold text-3xl">
            ×
          </button>
          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label={t.gallery.previous}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-gold hover:text-navy text-cream text-2xl flex items-center justify-center transition-colors"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label={t.gallery.next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-gold hover:text-navy text-cream text-2xl flex items-center justify-center transition-colors"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
