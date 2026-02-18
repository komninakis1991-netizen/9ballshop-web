"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function CollaboratePage() {
  const { t } = useLanguage();

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.collaborate.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">
            {t.collaborate.title}
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed">
            {t.collaborate.heroDescription}
          </p>
        </div>
      </section>

      {/* Why Partner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl text-cream mb-4">
            {t.collaborate.whyTitle}
          </h2>
          <p className="text-cream/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {t.collaborate.whyDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* International Exposure */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-3">
              {t.collaborate.benefitExposureTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.collaborate.benefitExposureText}
            </p>
          </div>

          {/* Active Social Media */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-3">
              {t.collaborate.benefitSocialTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.collaborate.benefitSocialText}
            </p>
          </div>

          {/* Authentic Connection */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-3">
              {t.collaborate.benefitCommunityTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.collaborate.benefitCommunityText}
            </p>
          </div>

          {/* Niche Audience */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-3">
              {t.collaborate.benefitNicheTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.collaborate.benefitNicheText}
            </p>
          </div>

          {/* Part of the Journey */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-3">
              {t.collaborate.benefitJourneyTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.collaborate.benefitJourneyText}
            </p>
          </div>

          {/* Consistent Visibility */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-cream mb-3">
              {t.collaborate.benefitVisibilityTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed">
              {t.collaborate.benefitVisibilityText}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-light py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl text-cream mb-10 text-center">
            {t.collaborate.statsTitle}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-navy border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">500K+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">
                {t.collaborate.statTiktokViews}
              </p>
            </div>
            <div className="bg-navy border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">200K+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">
                {t.collaborate.statYoutubeViews}
              </p>
            </div>
            <div className="bg-navy border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">10K+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">
                {t.collaborate.statFollowers}
              </p>
            </div>
            <div className="bg-navy border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">20+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">
                {t.collaborate.statCountries}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Options */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl text-cream mb-4">
            {t.collaborate.optionsTitle}
          </h2>
          <p className="text-cream/50 text-lg max-w-2xl mx-auto">
            {t.collaborate.optionsDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Jersey Logo */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors flex flex-col">
            <div className="text-4xl mb-4">&#127941;</div>
            <h3 className="font-heading text-2xl text-cream mb-3">
              {t.collaborate.jerseyTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed mb-6 flex-1">
              {t.collaborate.jerseyDescription}
            </p>
            <ul className="space-y-2 mb-6">
              {[t.collaborate.jerseyPoint1, t.collaborate.jerseyPoint2, t.collaborate.jerseyPoint3].map((point, i) => (
                <li key={i} className="text-cream/70 text-sm flex items-start gap-2">
                  <span className="text-gold mt-0.5 flex-shrink-0">&#10003;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Livestream Logo */}
          <div className="bg-navy-light border border-gold/20 rounded-lg p-8 hover:border-gold/40 transition-colors flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-semibold px-3 py-1 rounded uppercase tracking-wider">
              {t.collaborate.popular}
            </div>
            <div className="text-4xl mb-4">&#128250;</div>
            <h3 className="font-heading text-2xl text-cream mb-3">
              {t.collaborate.livestreamTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed mb-6 flex-1">
              {t.collaborate.livestreamDescription}
            </p>
            <ul className="space-y-2 mb-6">
              {[t.collaborate.livestreamPoint1, t.collaborate.livestreamPoint2, t.collaborate.livestreamPoint3].map((point, i) => (
                <li key={i} className="text-cream/70 text-sm flex items-start gap-2">
                  <span className="text-gold mt-0.5 flex-shrink-0">&#10003;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Full Partnership */}
          <div className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors flex flex-col">
            <div className="text-4xl mb-4">&#129309;</div>
            <h3 className="font-heading text-2xl text-cream mb-3">
              {t.collaborate.partnerTitle}
            </h3>
            <p className="text-cream/50 text-sm leading-relaxed mb-6 flex-1">
              {t.collaborate.partnerDescription}
            </p>
            <ul className="space-y-2 mb-6">
              {[t.collaborate.partnerPoint1, t.collaborate.partnerPoint2, t.collaborate.partnerPoint3, t.collaborate.partnerPoint4].map((point, i) => (
                <li key={i} className="text-cream/70 text-sm flex items-start gap-2">
                  <span className="text-gold mt-0.5 flex-shrink-0">&#10003;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-light py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl text-cream mb-4">
            {t.collaborate.ctaTitle}
          </h2>
          <p className="text-cream/50 text-lg mb-8 leading-relaxed">
            {t.collaborate.ctaDescription}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://instagram.com/komninakis.m"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              {t.collaborate.ctaInstagram}
            </a>
            <a
              href="mailto:info@9ballshop.com"
              className="border border-gold/40 hover:border-gold text-gold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              {t.collaborate.ctaEmail}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
