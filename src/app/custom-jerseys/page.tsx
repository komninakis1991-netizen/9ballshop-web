"use client";

import { useLanguage } from "@/components/LanguageProvider";

const CONFIGURATOR_URL =
  "https://www.vis-sportwear.it/configurator/c_49#/products/around-sleeve-shirt-biliards?basketIndex=1";

export default function CustomJerseysPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.customJerseys.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">
            {t.customJerseys.title}
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed mb-8">
            {t.customJerseys.heroDescription}
          </p>
          <a
            href={CONFIGURATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-block"
          >
            {t.customJerseys.designCta}
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl text-cream mb-4">
            {t.customJerseys.featuresTitle}
          </h2>
          <p className="text-cream/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.customJerseys.featuresDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sublimation Printing */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5 mx-auto">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <h3 className="font-heading text-lg text-cream mb-2">
              {t.customJerseys.featureSublimationTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.customJerseys.featureSublimationText}
            </p>
          </div>

          {/* Italian Fabric */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5 mx-auto">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="font-heading text-lg text-cream mb-2">
              {t.customJerseys.featureFabricTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.customJerseys.featureFabricText}
            </p>
          </div>

          {/* No Minimum Order */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5 mx-auto">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-lg text-cream mb-2">
              {t.customJerseys.featureNoMinimumTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.customJerseys.featureNoMinimumText}
            </p>
          </div>

          {/* Made in Italy */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5 mx-auto">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h3 className="font-heading text-lg text-cream mb-2">
              {t.customJerseys.featureMadeInItalyTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.customJerseys.featureMadeInItalyText}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-navy-light py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl text-cream mb-12 text-center">
            {t.customJerseys.howTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: t.customJerseys.howStep1Title, text: t.customJerseys.howStep1Text },
              { step: "2", title: t.customJerseys.howStep2Title, text: t.customJerseys.howStep2Text },
              { step: "3", title: t.customJerseys.howStep3Title, text: t.customJerseys.howStep3Text },
              { step: "4", title: t.customJerseys.howStep4Title, text: t.customJerseys.howStep4Text },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold font-heading text-lg">{item.step}</span>
                </div>
                <h3 className="font-heading text-lg text-cream mb-2">{item.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl text-cream mb-4">
            {t.customJerseys.ctaTitle}
          </h2>
          <p className="text-cream/50 text-lg mb-8 leading-relaxed">
            {t.customJerseys.ctaDescription}
          </p>
          <a
            href={CONFIGURATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-block"
          >
            {t.customJerseys.startDesigning}
          </a>
          <p className="text-cream/30 text-xs mt-4">
            {t.customJerseys.poweredBy}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-navy-light py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl text-cream mb-4">
            {t.customJerseys.contactTitle}
          </h2>
          <p className="text-cream/50 text-lg mb-8 leading-relaxed">
            {t.customJerseys.contactDescription}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://instagram.com/komninakis.m"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              {t.customJerseys.contactInstagram}
            </a>
            <a
              href="mailto:info@9ballshop.com"
              className="border border-gold/40 hover:border-gold text-gold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              {t.customJerseys.contactEmail}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
