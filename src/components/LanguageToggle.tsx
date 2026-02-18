"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "el" : "en")}
      className="text-cream/70 hover:text-gold transition-colors text-xs uppercase tracking-widest border border-gold/20 hover:border-gold/50 rounded px-2 py-1"
      aria-label="Toggle language"
    >
      {locale === "en" ? "EL" : "EN"}
    </button>
  );
}
