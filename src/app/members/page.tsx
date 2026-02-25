"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { FORUM_CATEGORIES } from "@/lib/forumCategories";

const categoryNameKeys: Record<string, string> = {
  announcements: "categoryAnnouncements",
  "training-lab": "categoryTrainingLab",
  "match-analysis": "categoryMatchAnalysis",
  "mental-game": "categoryMentalGame",
  "equipment-gear": "categoryEquipmentGear",
  tournaments: "categoryTournaments",
  introductions: "categoryIntroductions",
  "wins-progress": "categoryWinsProgress",
};

export default function MembersPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [subscribing, setSubscribing] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const res = await fetch("/api/members/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setSubscribing(false);
    }
  };

  const isActiveMember = user?.membershipStatus === "active";

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            Exclusive Community
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-6">
            {t.members.heroTitle}
          </h1>
          <p className="text-cream/50 text-lg leading-relaxed max-w-2xl mx-auto">
            {t.members.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {FORUM_CATEGORIES.map((cat) => {
            const nameKey = categoryNameKeys[cat.slug] as keyof typeof t.members;
            return (
              <div
                key={cat.slug}
                className="bg-navy-light border border-gold/10 rounded-lg p-5 text-center hover:border-gold/30 transition-colors"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <p className="text-cream/70 text-sm font-medium">
                  {t.members[nameKey] as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-navy-light py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl text-cream mb-10 text-center">
            {t.members.whatYouGetTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-navy border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-cream mb-3">
                {t.members.benefitDiscussionsTitle}
              </h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                {t.members.benefitDiscussionsText}
              </p>
            </div>

            <div className="bg-navy border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-cream mb-3">
                {t.members.benefitAccessTitle}
              </h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                {t.members.benefitAccessText}
              </p>
            </div>

            <div className="bg-navy border border-gold/10 rounded-lg p-8 hover:border-gold/30 transition-colors">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-cream mb-3">
                {t.members.benefitCommunityTitle}
              </h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                {t.members.benefitCommunityText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-lg mx-auto px-4 sm:px-6 py-20">
        <div className="bg-navy-light border border-gold/20 rounded-lg p-10 text-center">
          <h2 className="font-heading text-2xl text-cream mb-2">
            {t.members.pricingTitle}
          </h2>
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="font-heading text-5xl text-gold">{t.members.pricingPrice}</span>
            <span className="text-cream/40 text-lg">{t.members.pricingPeriod}</span>
          </div>
          <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
            {[
              t.members.pricingFeature1,
              t.members.pricingFeature2,
              t.members.pricingFeature3,
              t.members.pricingFeature4,
              t.members.pricingFeature5,
            ].map((feature, i) => (
              <li key={i} className="text-cream/70 text-sm flex items-start gap-2">
                <span className="text-gold mt-0.5 flex-shrink-0">&#10003;</span>
                {feature}
              </li>
            ))}
          </ul>

          {!loading && user && !isActiveMember && (
            <div className="mb-6">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-navy border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 text-sm"
                placeholder={t.members.promoCodePlaceholder}
              />
            </div>
          )}

          {loading ? (
            <div className="h-12" />
          ) : isActiveMember ? (
            <button
              onClick={() => router.push("/members/forum")}
              className="w-full bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              {t.members.ctaEnterForum}
            </button>
          ) : user ? (
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className="w-full bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {subscribing ? "..." : t.members.ctaJoin}
            </button>
          ) : (
            <Link
              href="/login"
              className="block w-full bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider text-center"
            >
              {t.members.ctaLogin}
            </Link>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-navy-light py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl text-cream mb-4">
            {t.members.contactTitle}
          </h2>
          <p className="text-cream/50 text-lg mb-8 leading-relaxed">
            {t.members.contactText}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://instagram.com/komninakis.m"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              {t.members.contactInstagram}
            </a>
            <a
              href="mailto:info@9ballshop.com"
              className="border border-gold/40 hover:border-gold text-gold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              {t.members.contactEmail}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
