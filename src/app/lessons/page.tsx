"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function LessonsPage() {
  const { t } = useLanguage();

  const sections = [
    { icon: "🎯", title: t.lessons.techniqueTitle, summary: t.lessons.techniqueSummary, details: t.lessons.techniqueDetails, points: t.lessons.techniquePoints },
    { icon: "♟️", title: t.lessons.strategyTitle, summary: t.lessons.strategySummary, details: t.lessons.strategyDetails, points: t.lessons.strategyPoints },
    { icon: "🧠", title: t.lessons.psychologyTitle, summary: t.lessons.psychologySummary, details: t.lessons.psychologyDetails, points: t.lessons.psychologyPoints },
  ];

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.lessons.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">
            {t.lessons.title}
          </h1>
          <p className="text-cream/50 text-lg mb-8">{t.lessons.intro}</p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-navy-light border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors"
            >
              <div className="text-4xl mb-4">{section.icon}</div>
              <h2 className="font-heading text-2xl text-cream mb-4">
                {section.title}
              </h2>
              <p className="text-cream/60 mb-6 leading-relaxed">
                {section.summary}
              </p>
              <p className="text-cream/50 text-sm mb-6 leading-relaxed">
                {section.details}
              </p>
              <ul className="space-y-2">
                {section.points.map((point, j) => (
                  <li
                    key={j}
                    className="text-cream/70 text-sm flex items-start gap-2"
                  >
                    <span className="text-gold mt-1 flex-shrink-0">&#9656;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How Lessons Work */}
      <section className="bg-navy-light py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl text-cream mb-10 text-center">
            {t.lessons.howTitle}
          </h2>
          <div className="space-y-6">
            {t.lessons.howSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <span className="text-gold font-heading text-sm">
                    {i + 1}
                  </span>
                </div>
                <p className="text-cream/70 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 border border-gold/10 rounded-lg">
            <p className="text-cream/60 leading-relaxed">{t.lessons.howGoal}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-cream/60 text-lg mb-8">{t.lessons.cta}</p>
          <Link
            href="https://instagram.com/komninakis.m"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
          >
            {t.lessons.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
