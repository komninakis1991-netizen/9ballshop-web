"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Course } from "@/lib/courses";
import CourseBadge from "@/components/courses/CourseBadge";
import BuyCourseButton from "@/components/courses/BuyCourseButton";

export default function CourseContent({
  course,
  owned,
  notice,
}: {
  course: Course;
  owned: boolean;
  notice: "thanks" | "pending" | "canceled" | null;
}) {
  const { t, locale } = useLanguage();
  const c = t.courses;
  const tr = (x: { en: string; el: string }) => (locale === "el" ? x.el : x.en);
  const [active, setActive] = useState(0);
  const forSale = typeof course.priceEur === "number";
  const current = course.lessons[active];

  const perks = [c.perkLifetime, c.perkDevices, c.perkLanguage, c.perkSecure];

  return (
    <div className="bg-navy min-h-screen text-cream">
      {/* Header */}
      <section className="bg-[radial-gradient(ellipse_60%_80%_at_80%_0%,#1b5a44_0%,#0f3b2e_35%,#080d0b_75%)]">
        <div className="max-w-[1240px] mx-auto px-6 pt-10 pb-16 md:pt-14 md:pb-20 flex flex-col gap-6">
          <Link href="/courses" className="self-start text-sm font-bold text-[#9fc2b2] hover:text-gold">
            ← {c.back}
          </Link>

          {notice && (
            <div
              role="status"
              className={`rounded-2xl px-5 py-4 text-[15px] font-medium border ${
                notice === "thanks"
                  ? "bg-emerald/10 border-emerald/40 text-emerald"
                  : notice === "pending"
                    ? "bg-gold/10 border-gold/40 text-gold"
                    : "bg-white/5 border-white/15 text-cream/80"
              }`}
            >
              {notice === "thanks" ? c.thanks : notice === "pending" ? c.pending : c.canceled}
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-10">
            <div className="flex-[1_1_560px] min-w-0 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <CourseBadge course={course} size={56} />
                <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-gold">{tr(course.level)}</span>
              </div>
              <h1 className="font-heading font-black uppercase leading-[0.9] text-[clamp(48px,7vw,96px)]">{tr(course.title)}</h1>
              <p className="text-lg md:text-xl leading-relaxed text-[#c9cfc6] max-w-[640px]">{tr(course.description)}</p>
            </div>
            <div className="flex-[0_1_360px] min-w-0">
              {owned ? (
                <span className="inline-flex items-center min-h-[52px] rounded-full bg-emerald/15 text-emerald font-bold px-6">
                  ✓ {c.owned}
                </span>
              ) : forSale ? (
                <BuyCourseButton slug={course.slug} priceEur={course.priceEur as number} />
              ) : (
                <span className="inline-flex items-center min-h-[52px] rounded-full border border-[#2e463b] text-[#9fc2b2] font-bold px-6">
                  {c.comingSoon}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Player + lessons */}
      {course.lessons.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-6 py-14 md:py-20 flex flex-wrap gap-8">
          <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-line bg-navy-lighter">
              {owned && current?.videoId ? (
                <iframe
                  key={current.videoId}
                  src={`https://www.youtube-nocookie.com/embed/${current.videoId}?rel=0&modestbranding=1`}
                  title={tr(current.title)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                  <span className="w-16 h-16 rounded-full border-2 border-[#2e463b] flex items-center justify-center" aria-hidden="true">
                    {owned ? (
                      <svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#5f7a6d" /></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8a9b92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    )}
                  </span>
                  <p className="text-[#8a9b92]">{owned ? c.videoSoon : c.locked}</p>
                </div>
              )}
            </div>
            {current && <h2 className="font-heading font-extrabold uppercase text-3xl">{tr(current.title)}</h2>}
          </div>

          <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-3">
            <h2 className="text-[13px] font-bold tracking-[0.18em] uppercase text-gold font-body">
              {c.lessons} · {course.lessons.length}
            </h2>
            <ol className="flex flex-col gap-2">
              {course.lessons.map((lesson, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={i === active ? "true" : undefined}
                    className={`w-full min-h-[52px] flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
                      i === active ? "border-gold/60 bg-gold/10" : "border-line bg-navy-lighter hover:border-[#3e5a4e]"
                    }`}
                  >
                    <span className="w-8 text-sm font-bold text-[#8a9b92]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-medium">{tr(lesson.title)}</span>
                    {!owned && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f7a6d" strokeWidth="2" aria-label={c.locked}>
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Perks */}
      {forSale && !owned && (
        <section className="border-t border-line bg-navy-light">
          <div className="max-w-[1240px] mx-auto px-6 py-14 md:py-20 flex flex-wrap items-center justify-between gap-10">
            <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-5">
              <h2 className="font-heading font-black uppercase text-[clamp(36px,4.5vw,56px)] leading-[0.95]">{c.whatYouGet}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[#c9cfc6]">
                    <span className="w-6 h-6 rounded-full bg-gold/15 text-gold flex items-center justify-center text-sm" aria-hidden="true">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <BuyCourseButton slug={course.slug} priceEur={course.priceEur as number} />
          </div>
        </section>
      )}
    </div>
  );
}
