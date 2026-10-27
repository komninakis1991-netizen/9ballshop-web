"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "el" : "en")}
      className="text-cream/80 hover:text-navy hover:bg-gold transition-colors text-xs font-bold uppercase tracking-[0.12em] border border-[#3e5a4e] hover:border-gold rounded-full px-3.5 min-h-[36px]"
      aria-label="Toggle language"
    >
      {locale === "en" ? "EL" : "EN"}
    </button>
  );
}
