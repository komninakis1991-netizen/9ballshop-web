"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { Course } from "@/lib/courses";
import CourseBadge from "@/components/courses/CourseBadge";
import Reveal from "@/components/Reveal";

export default function CoursesContent({ courses, owned }: { courses: Course[]; owned: string[] }) {
  const { t, locale } = useLanguage();
  const c = t.courses;
  const tr = (x: { en: string; el: string }) => (locale === "el" ? x.el : x.en);

  return (
    <div className="bg-navy min-h-screen text-cream">
      <section className="bg-[radial-gradient(ellipse_60%_80%_at_80%_0%,#1b5a44_0%,#0f3b2e_35%,#080d0b_75%)]">
        <div className="max-w-[1240px] mx-auto px-6 pt-16 pb-20 md:pt-24 flex flex-col gap-6">
          <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-gold">{c.kicker}</span>
          <h1 className="font-heading font-black uppercase leading-[0.9] text-[clamp(52px,8vw,112px)] max-w-[900px]">{c.title}</h1>
          <p className="text-lg md:text-xl leading-relaxed text-[#c9cfc6] max-w-[620px]">{c.intro}</p>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => {
          const forSale = typeof course.priceEur === "number";
          const isOwned = owned.includes(course.slug);
          const lessonCount = course.lessons.length;
          return (
            <Reveal key={course.slug} delay={(i % 2) * 120}>
              <Link
                href={`/courses/${course.slug}`}
                className={`group h-full flex flex-col gap-5 rounded-[24px] border p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 ${
                  forSale ? "border-[#2e463b] bg-navy-lighter hover:border-gold/60" : "border-line bg-navy-light"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <CourseBadge course={course} />
                  <span
                    className={`text-xs font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full ${
                      isOwned ? "bg-emerald/15 text-emerald" : forSale ? "bg-gold/15 text-gold" : "bg-white/5 text-[#8a9b92]"
                    }`}
                  >
                    {isOwned ? c.owned : forSale ? `€${course.priceEur}` : c.comingSoon}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-sm text-[#8a9b92]">
                    {tr(course.level)}
                    {lessonCount > 0 && ` · ${lessonCount} ${c.lessonCount}`}
                  </span>
                  <h2 className="font-heading font-black uppercase text-4xl md:text-5xl leading-[0.95]">{tr(course.title)}</h2>
                  <p className="text-[#aeb8b1] text-[17px] leading-relaxed">{tr(course.tagline)}</p>
                </div>
                <span className="mt-auto font-bold text-gold group-hover:text-gold-light">
                  {isOwned ? c.open : c.viewCourse} →
                </span>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </div>
  );
}
