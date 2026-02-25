"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <svg className="w-3.5 h-3.5 ml-1.5 inline-block opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

export default function TournamentsPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.04)_0%,transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.tournaments.subtitle}</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">
            {t.tournaments.title}
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed">
            {t.tournaments.description}
          </p>
        </div>
      </section>

      {/* Live Scores & Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="font-heading text-2xl md:text-3xl text-cream">{t.tournaments.sectionLive}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CueScore */}
          <div className="group bg-navy-light border border-gold/10 rounded-lg p-6 hover:border-gold/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-xl text-gold mb-1">{t.tournaments.cuescoreTitle}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{t.tournaments.cuescoreDescription}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 ml-4">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <ExternalLink
                href="https://cuescore.com"
                className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
              >
                {t.tournaments.cuescoreLive}
              </ExternalLink>
              <span className="text-gold/20">|</span>
              <ExternalLink
                href="https://cuescore.com/tournaments"
                className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
              >
                {t.tournaments.cuescoreSearch}
              </ExternalLink>
            </div>
          </div>

          {/* AZBilliards */}
          <div className="group bg-navy-light border border-gold/10 rounded-lg p-6 hover:border-gold/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-xl text-gold mb-1">{t.tournaments.azTitle}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{t.tournaments.azDescription}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 ml-4">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <ExternalLink
                href="https://www.azbilliards.com/tournaments/"
                className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
              >
                {t.tournaments.azCalendar}
              </ExternalLink>
              <span className="text-gold/20">|</span>
              <ExternalLink
                href="https://www.azbilliards.com"
                className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
              >
                {t.tournaments.azNews}
              </ExternalLink>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Calendars */}
      <section className="bg-navy-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-5 h-5 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="font-heading text-2xl md:text-3xl text-cream">{t.tournaments.sectionCalendars}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* EPBF */}
            <div className="bg-navy border border-gold/10 rounded-lg p-6 hover:border-gold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-gold mb-2">{t.tournaments.epbfTitle}</h3>
              <p className="text-cream/50 text-sm leading-relaxed mb-4">{t.tournaments.epbfDescription}</p>
              <div className="space-y-2">
                <ExternalLink
                  href="https://www.epbf.com/tournaments/"
                  className="block text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.epbfCalendar}
                </ExternalLink>
                <ExternalLink
                  href="https://www.epbf.com/rankings/"
                  className="block text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.epbfRankings}
                </ExternalLink>
              </div>
            </div>

            {/* WPA */}
            <div className="bg-navy border border-gold/10 rounded-lg p-6 hover:border-gold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-gold mb-2">{t.tournaments.wpaTitle}</h3>
              <p className="text-cream/50 text-sm leading-relaxed mb-4">{t.tournaments.wpaDescription}</p>
              <div className="space-y-2">
                <ExternalLink
                  href="https://wpapool.com/ranking/"
                  className="block text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.wpaRankings}
                </ExternalLink>
                <ExternalLink
                  href="https://wpapool.com/tournaments/"
                  className="block text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.wpaCalendar}
                </ExternalLink>
              </div>
            </div>

            {/* Predator */}
            <div className="bg-navy border border-gold/10 rounded-lg p-6 hover:border-gold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-gold mb-2">{t.tournaments.predatorTitle}</h3>
              <p className="text-cream/50 text-sm leading-relaxed mb-4">{t.tournaments.predatorDescription}</p>
              <div className="space-y-2">
                <ExternalLink
                  href="https://www.predatorchamptour.com"
                  className="block text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.predatorSchedule}
                </ExternalLink>
                <ExternalLink
                  href="https://www.predatorchamptour.com/results"
                  className="block text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.predatorResults}
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Organizations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <svg className="w-5 h-5 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 className="font-heading text-2xl md:text-3xl text-cream">{t.tournaments.sectionOrganizations}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matchroom */}
          <div className="group relative bg-navy-light border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
            <div className="relative p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-xl text-gold mb-1">{t.tournaments.matchroomTitle}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{t.tournaments.matchroomDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 ml-16">
                <ExternalLink
                  href="https://matchroompool.com"
                  className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.matchroomEvents}
                </ExternalLink>
                <span className="text-gold/20">|</span>
                <ExternalLink
                  href="https://matchroompool.com/results"
                  className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.matchroomResults}
                </ExternalLink>
              </div>
            </div>
          </div>

          {/* Nineball.news / WNT */}
          <div className="group relative bg-navy-light border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
            <div className="relative p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-xl text-gold mb-1">{t.tournaments.epbfTitle}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{t.tournaments.epbfDescription}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 ml-16">
                <ExternalLink
                  href="https://www.epbf.com/tournaments/"
                  className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.epbfCalendar}
                </ExternalLink>
                <span className="text-gold/20">|</span>
                <ExternalLink
                  href="https://www.epbf.com/rankings/"
                  className="inline-flex items-center text-sm text-gold/80 hover:text-gold transition-colors"
                >
                  {t.tournaments.epbfRankings}
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-light py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-cream mb-4">{t.tournaments.ctaTitle}</h2>
          <p className="text-cream/50 text-lg leading-relaxed mb-8">{t.tournaments.ctaDescription}</p>
          <Link
            href="/members"
            className="inline-block bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
          >
            {t.tournaments.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
