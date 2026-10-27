"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import BlogCard from "@/components/BlogCard";
import NewsletterForm from "@/components/NewsletterForm";
import NineBall from "@/components/NineBall";
import Reveal from "@/components/Reveal";

interface HomeContentProps {
  latestPosts: Array<{
    id: number;
    title: string;
    titleEl: string;
    slug: string;
    excerpt: string;
    excerptEl: string;
    coverImage: string;
    publishedAt: Date;
    tags: string;
    tagsEl: string;
  }>;
}

// From the "Psychology of pool" playlist on /videos.
const featuredVideos = [
  { id: "dK-NYnWvIyQ", title: "How to Learn Pool: 5 Tips to Improve Your Game" },
  { id: "ysTElGuJBBY", title: "How to Handle Wins and Losses, in Pool and in Life" },
  { id: "YphtHOV3qyM", title: "Negative Thoughts & Psychology During Matches" },
];

const btnPrimary =
  "inline-flex items-center justify-center min-h-[48px] rounded-full bg-gold hover:bg-gold-light text-navy font-bold px-7 py-3 text-base transition-colors";
const btnGhost =
  "inline-flex items-center justify-center min-h-[48px] rounded-full border-[1.5px] border-[#3e5a4e] hover:border-gold text-cream font-bold px-7 py-3 text-base transition-colors";
const kicker = "text-[13px] font-bold tracking-[0.18em] uppercase text-gold";
const h2 =
  "font-heading font-black uppercase leading-[0.95] text-cream text-[clamp(40px,5.2vw,72px)]";

export default function HomeContent({ latestPosts }: HomeContentProps) {
  const { t } = useLanguage();
  const h = t.home;

  const lessonCards = [
    { n: 1, ball: "bg-ball-1 text-[#0b0b0b]", title: t.lessons.techniqueTitle, text: t.lessons.techniqueSummary },
    { n: 2, ball: "bg-ball-2 text-white", title: t.lessons.strategyTitle, text: t.lessons.strategySummary },
    { n: 3, ball: "bg-ball-3 text-white", title: t.lessons.psychologyTitle, text: t.lessons.psychologySummary },
  ];

  return (
    <div className="bg-navy min-h-screen text-cream">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_60%_70%_at_68%_38%,#1b5a44_0%,#0f3b2e_38%,#080d0b_78%)]">
        <div className="max-w-[1240px] mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-wrap items-center gap-12">
          <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-7">
            <div className="flex items-center gap-3 text-[13px] font-bold tracking-[0.18em] uppercase text-[#9fc2b2]">
              <span className="w-7 h-7 rounded-full bg-cream text-navy inline-flex items-center justify-center text-xs tracking-normal">9</span>
              {h.heroKicker}
            </div>
            <h1 className="font-heading font-black uppercase leading-[0.88] text-[clamp(60px,9vw,128px)]">
              {h.heroLine1}
              <span className="block text-gold">{h.heroLine2}</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-[#c9cfc6] max-w-[540px]">{h.heroLead}</p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/lessons" className={btnPrimary}>{h.bookLesson}</Link>
              <a href="#method" className={btnGhost}>{h.seeMethod}</a>
            </div>
          </div>
          <div className="flex-[1_1_380px] min-w-0 flex justify-center">
            <NineBall />
          </div>
        </div>
      </section>

      {/* METHOD STRIP */}
      <div id="method" className="border-y border-line bg-navy-light overflow-hidden" aria-label={h.seeMethod}>
        <div className="marquee-track flex w-max gap-10 py-6 font-heading font-extrabold uppercase text-[26px] tracking-[0.06em] text-[#6f857b] whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-10 pr-10" aria-hidden={copy === 1}>
              {h.pillars.map((p) => (
                <span key={p} className="flex items-center gap-10">
                  {p}
                  <span className="text-gold text-lg">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* LESSONS */}
      <section className="max-w-[1240px] mx-auto px-6 py-24 md:py-32 flex flex-col gap-14">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <span className={kicker}>{h.lessonsKicker}</span>
            <h2 className={h2}>
              {h.lessonsTitle1}
              <br />
              {h.lessonsTitle2}
            </h2>
          </div>
          <p className="max-w-[420px] text-[17px] leading-relaxed text-[#aeb8b1]">{h.lessonsIntro}</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {lessonCards.map((c, i) => (
            <Reveal key={c.n} delay={i * 120}>
              <Link
                href="/lessons"
                className="group h-full flex flex-col gap-5 rounded-[20px] border border-line bg-navy-lighter p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#3e5a4e]"
              >
                <span className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg ${c.ball}`}>{c.n}</span>
                <h3 className="font-heading font-extrabold text-3xl uppercase text-cream">{c.title}</h3>
                <p className="text-[#aeb8b1] leading-relaxed">{c.text}</p>
                <span className="mt-auto font-bold text-gold group-hover:text-gold-light">{h.lessonsCta} →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-navy-light">
        <div className="max-w-[1240px] mx-auto px-6 py-24 md:py-32 flex flex-wrap items-center gap-14">
          <Reveal className="flex-[1_1_520px] min-w-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-3xl bg-[radial-gradient(ellipse_80%_120%_at_0%_0%,#1b5a44,#0f2a21_70%)] p-8 md:p-10 flex flex-col gap-2">
                <span className="font-heading font-black text-[clamp(72px,10vw,128px)] leading-none text-cream">2×</span>
                <span className="text-[#cfe6da] text-lg font-medium">{h.statChampion}</span>
              </div>
              <div className="rounded-3xl border border-line bg-navy-lighter p-7 flex flex-col gap-1">
                <span className="font-heading font-black text-6xl leading-none text-gold">100+</span>
                <span className="text-[#aeb8b1]">{h.statPlayers}</span>
              </div>
              <div className="rounded-3xl border border-line bg-navy-lighter p-7 flex flex-col gap-1">
                <span className="font-heading font-black text-6xl leading-none text-gold">EN/ΕΛ</span>
                <span className="text-[#aeb8b1]">{h.statLanguages}</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="flex-[1_1_400px] min-w-0 flex flex-col gap-5" delay={120}>
            <span className={kicker}>{h.aboutKicker}</span>
            <h2 className={h2}>{h.aboutTitle}</h2>
            <p className="text-[17px] leading-relaxed text-[#aeb8b1]">{h.curatorDescription}</p>
            <Link href="/about" className="self-start font-bold border-b-2 border-gold pb-1 hover:text-gold transition-colors">
              {h.readStory} →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* WATCH */}
      <section className="max-w-[1240px] mx-auto px-6 py-24 md:py-32 flex flex-col gap-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <span className={kicker}>{h.watchKicker}</span>
            <h2 className={h2}>{h.watchTitle}</h2>
          </div>
          <Link href="/videos" className="font-bold border-b-2 border-gold pb-1 hover:text-gold transition-colors">
            {h.watchAll} →
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredVideos.map((v, i) => (
            <Reveal key={v.id} delay={i * 120}>
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-line bg-slate-mid">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7z" fill="#080d0b" />
                      </svg>
                    </span>
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-snug text-cream group-hover:text-gold transition-colors font-body">
                  {v.title}
                </h3>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SPONSORS */}
      <section className="bg-navy-light border-t border-line">
        <Reveal className="max-w-[1240px] mx-auto px-6 py-20 md:py-24 flex flex-wrap items-center justify-between gap-10">
          <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-5">
            <span className={kicker}>{h.partnerKicker}</span>
            <h2 className={h2}>{h.partnerTitle}</h2>
            <p className="max-w-[560px] text-[17px] leading-relaxed text-[#aeb8b1]">{h.partnerText}</p>
          </div>
          <Link href="/collaborate" className={btnPrimary}>{h.partnerCta}</Link>
        </Reveal>
      </section>

      {/* COMMUNITY */}
      <section className="max-w-[1240px] mx-auto px-6 py-24 md:py-32">
        <Reveal>
          <div className="rounded-[28px] p-8 sm:p-12 md:p-16 bg-[radial-gradient(ellipse_70%_120%_at_100%_0%,#1b5a44,#0f2a21_60%)] flex flex-wrap items-center justify-between gap-10">
            <div className="flex-[1_1_480px] min-w-0 flex flex-col gap-4">
              <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-[#cfe6da]">{h.communityKicker}</span>
              <h2 className={h2}>{h.communityTitle}</h2>
              <p className="text-[17px] leading-relaxed text-[#cfe6da] max-w-[560px]">{h.communityDescription}</p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#cfe6da]/80 mt-2">
                {[h.communityFeature1, h.communityFeature2, h.communityFeature3].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/community/register.html"
                className="inline-flex items-center justify-center min-h-[52px] rounded-full bg-cream hover:bg-white text-navy font-bold px-8 py-3 text-[17px] transition-colors"
              >
                {h.communityJoin}
              </Link>
              <Link
                href="/community/forum.html"
                className="inline-flex items-center justify-center min-h-[52px] rounded-full border-[1.5px] border-[#cfe6da]/40 hover:border-cream text-cream font-bold px-8 py-3 text-[17px] transition-colors"
              >
                {h.communityForum}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* BLOG */}
      {latestPosts.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-6 pb-24 md:pb-32 flex flex-col gap-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <span className={kicker}>{h.blogKicker}</span>
              <h2 className={h2}>{h.blogTitle}</h2>
            </div>
            <Link href="/blog" className="font-bold border-b-2 border-gold pb-1 hover:text-gold transition-colors">
              {h.readAll} →
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {latestPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 120}>
                <BlogCard
                  title={post.title}
                  titleEl={post.titleEl}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  excerptEl={post.excerptEl}
                  coverImage={post.coverImage}
                  publishedAt={post.publishedAt}
                  tags={post.tags}
                  tagsEl={post.tagsEl}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER (free drills PDF) */}
      <NewsletterForm variant="full" />
    </div>
  );
}
