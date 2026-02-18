"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function CheckoutCancelPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-navy min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-heading text-3xl text-cream mb-4">{t.cancel.title}</h1>
        <p className="text-cream/60 mb-8">
          {t.cancel.description}
        </p>
        <Link
          href="/cart"
          className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
        >
          {t.cancel.returnToCart}
        </Link>
      </div>
    </div>
  );
}
