"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "el" : "en")}
      className="text-gold hover:text-navy hover:bg-gold transition-colors text-xs font-semibold uppercase tracking-widest border border-gold/40 hover:border-gold rounded px-3 py-1.5"
      aria-label="Toggle language"
    >
      {locale === "en" ? "EL" : "EN"}
    </button>
  );
}
