"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import ProductCard from "@/components/ProductCard";
import BlogCard from "@/components/BlogCard";

interface HomeContentProps {
  featuredProducts: Array<{
    id: number;
    name: string;
    slug: string;
    price: number;
    currency: string;
    category: string;
    brand: string;
    images: string;
  }>;
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

export default function HomeContent({ featuredProducts, latestPosts }: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(135,10,10,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <p className="text-gold/70 text-sm uppercase tracking-[0.3em] mb-6 font-body">
            {t.home.heroSubtitle}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl text-cream mb-6 leading-tight">
            {t.home.heroTitle1}
            <span className="block text-gold">{t.home.heroTitle2}</span>
          </h1>
          <p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            {t.home.heroDescription}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/shop"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              {t.home.shopNow}
            </Link>
            <Link
              href="/about"
              className="border border-gold/40 hover:border-gold text-gold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              {t.home.ourStory}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.home.featuredSubtitle}</p>
          <h2 className="font-heading text-3xl md:text-4xl text-cream">{t.home.featuredTitle}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              currency={product.currency}
              category={product.category}
              brand={product.brand}
              images={product.images}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="text-gold hover:text-gold-light text-sm uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-gold pb-1"
          >
            {t.home.viewAll}
          </Link>
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-navy-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.home.curatorSubtitle}</p>
            <h2 className="font-heading text-3xl md:text-4xl text-cream mb-6">{t.home.curatorName}</h2>
            <p className="text-cream/60 text-lg leading-relaxed mb-8">
              {t.home.curatorDescription}
            </p>
            <Link
              href="/about"
              className="text-gold hover:text-gold-light text-sm uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-gold pb-1"
            >
              {t.home.readStory}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.home.blogSubtitle}</p>
          <h2 className="font-heading text-3xl md:text-4xl text-cream">{t.home.blogTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <BlogCard
              key={post.id}
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
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="text-gold hover:text-gold-light text-sm uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-gold pb-1"
          >
            {t.home.readAll}
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-navy-light py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.home.newsletterSubtitle}</p>
          <h2 className="font-heading text-3xl text-cream mb-4">{t.home.newsletterTitle}</h2>
          <p className="text-cream/50 mb-8">{t.home.newsletterDescription}</p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t.home.newsletterPlaceholder}
              className="flex-1 bg-navy border border-gold/20 rounded px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 text-sm"
            />
            <button
              type="submit"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider whitespace-nowrap"
            >
              {t.home.subscribe}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
