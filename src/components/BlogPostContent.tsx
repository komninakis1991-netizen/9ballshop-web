"use client";

import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/components/LanguageProvider";
import { localized } from "@/lib/localized";
import LocaleDate from "@/components/LocaleDate";
import BlogCard from "@/components/BlogCard";

interface BlogPostContentProps {
  post: {
    title: string;
    titleEl: string;
    content: string;
    contentEl: string;
    tags: string;
    tagsEl: string;
    coverImage: string;
    author: string;
    publishedAt: Date;
    mediumUrl: string;
  };
  relatedPosts: Array<{
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

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const { locale, t } = useLanguage();

  const title = localized(locale, post.title, post.titleEl);
  const content = localized(locale, post.content, post.contentEl);
  const tags: string[] = JSON.parse(
    localized(locale, post.tags, post.tagsEl)
  );

  return (
    <div className="bg-navy min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/blog" className="text-cream/40 hover:text-gold transition-colors">
            {t.blog.title}
          </Link>
          <span className="text-cream/20 mx-2">/</span>
          <span className="text-cream/60 line-clamp-1">{title}</span>
        </nav>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <div className="flex gap-2 mb-4 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="text-xs text-gold/70 bg-gold/10 px-3 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-3xl md:text-5xl text-cream leading-tight mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-cream/40">
            <span>{post.author}</span>
            <span>&middot;</span>
            <LocaleDate date={post.publishedAt} />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-gold max-w-none
          prose-headings:font-heading prose-headings:text-cream
          prose-p:text-cream/70 prose-p:leading-relaxed
          prose-li:text-cream/70
          prose-strong:text-cream
          prose-a:text-gold prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-gold/30 prose-blockquote:text-cream/50
          prose-hr:border-gold/10
        ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* Author Card */}
        <div className="mt-16 p-8 bg-navy-light border border-gold/10 rounded-lg">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-heading text-2xl">M</span>
            </div>
            <div>
              <h3 className="text-cream font-heading text-xl mb-2">{post.author}</h3>
              <p className="text-cream/50 text-sm leading-relaxed mb-3">
                {t.blog.authorBio}
              </p>
              {post.mediumUrl && (
                <a
                  href={post.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-sm hover:text-gold-light transition-colors"
                >
                  {t.blog.readOnMedium} &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="font-heading text-2xl text-cream mb-8">{t.blog.moreArticles}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <BlogCard
                key={p.id}
                title={p.title}
                titleEl={p.titleEl}
                slug={p.slug}
                excerpt={p.excerpt}
                excerptEl={p.excerptEl}
                coverImage={p.coverImage}
                publishedAt={p.publishedAt}
                tags={p.tags}
                tagsEl={p.tagsEl}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
