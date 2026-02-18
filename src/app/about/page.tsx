"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.about.heroSubtitle}</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">
            {t.about.heroName}
          </h1>
          <p className="text-cream/50 text-lg">
            {t.about.heroDescription}
          </p>
        </div>
      </section>

      {/* Bio */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="space-y-8 text-cream/70 leading-relaxed text-lg">

          {/* Early years */}
          <div>
            <h2 className="font-heading text-2xl text-cream mb-4">
              {t.about.beginningsTitle}
            </h2>
            <p>
              {t.about.beginningsText}
            </p>
          </div>

          {/* Competitive rise */}
          <div>
            <h2 className="font-heading text-2xl text-cream mb-4">
              {t.about.championTitle}
            </h2>
            <p>
              {t.about.championText}
            </p>
          </div>

          {/* European stage */}
          <div>
            <h2 className="font-heading text-2xl text-cream mb-4">
              {t.about.europeanTitle}
            </h2>
            <p>
              {t.about.europeanText1}
            </p>
            <p className="mt-4">
              {t.about.europeanText2}
            </p>
          </div>

          {/* Coaching */}
          <div className="py-8 border-y border-gold/10">
            <h2 className="font-heading text-2xl text-cream mb-4">
              {t.about.coachTitle}
            </h2>
            <p>
              {t.about.coachText1}
            </p>
            <p className="mt-4">
              {t.about.coachText2}
            </p>
          </div>

          {/* Traveling & competing */}
          <div>
            <h2 className="font-heading text-2xl text-cream mb-4">
              {t.about.tournamentsTitle}
            </h2>
            <p>
              {t.about.tournamentsText1}
            </p>
            <p className="mt-4">
              {t.about.tournamentsText2}
            </p>
            <p className="mt-4">
              {t.about.tournamentsText3}
            </p>
          </div>

          {/* Today */}
          <div>
            <h2 className="font-heading text-2xl text-cream mb-4">
              {t.about.backTitle}
            </h2>
            <p>
              {t.about.backText}
            </p>
          </div>

          {/* Teaching & Content */}
          <div>
            <h2 className="font-heading text-2xl text-cream mb-4">
              {t.about.sharingTitle}
            </h2>
            <p>
              {t.about.sharingText1}{" "}
              <a href="https://youtube.com/@komninakis" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                {t.about.sharingYouTube}
              </a>{" "}
              {t.about.sharingText2}{" "}
              <a href="https://tiktok.com/@marioskomninakis" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                {t.about.sharingTikTok}
              </a>
              {t.about.sharingText3}
            </p>
            <p className="mt-4">
              {t.about.sharingText4}{" "}
              <a href="https://instagram.com/komninakis.m" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                {t.about.sharingInstagram}
              </a>
              ,{" "}
              <a href="https://facebook.com/komni91" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                {t.about.sharingFacebook}
              </a>
              , and{" "}
              <a href="https://medium.com/@marioskomninakis" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                {t.about.sharingMedium}
              </a>{" "}
              {t.about.sharingText5}
            </p>
          </div>

          {/* 9BallShop */}
          <div className="py-8 border-y border-gold/10">
            <h2 className="font-heading text-2xl text-cream mb-4">{t.about.visionTitle}</h2>
            <p>
              {t.about.visionText}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8">
            <div className="bg-navy-light border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">20+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">{t.about.statYears}</p>
            </div>
            <div className="bg-navy-light border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">100+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">{t.about.statCoached}</p>
            </div>
            <div className="bg-navy-light border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">20+</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">{t.about.statCountries}</p>
            </div>
            <div className="bg-navy-light border border-gold/10 rounded-lg p-6 text-center">
              <p className="text-gold font-heading text-3xl mb-2">2x</p>
              <p className="text-cream/40 text-sm uppercase tracking-wider">{t.about.statChampion}</p>
            </div>
          </div>

          {/* Connect */}
          <div className="text-center pt-8">
            <h2 className="font-heading text-2xl text-cream mb-6">{t.about.connectTitle}</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://facebook.com/komni91"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              <a
                href="https://instagram.com/komninakis.m"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a
                href="https://tiktok.com/@marioskomninakis"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                TikTok
              </a>
              <a
                href="https://youtube.com/@komninakis"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
              <a
                href="https://medium.com/@marioskomninakis"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
                Medium
              </a>
              <Link
                href="/blog"
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider"
              >
                {t.about.readBlog}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
