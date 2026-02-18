"use client";

import Link from "next/link";
import Image from "next/image";
import LocaleDate from "@/components/LocaleDate";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: Date;
  tags: string;
}

export default function BlogCard({ title, slug, excerpt, coverImage, publishedAt, tags }: BlogCardProps) {
  const parsedTags: string[] = JSON.parse(tags);

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-navy-light border border-gold/10 hover:border-gold/40 rounded-lg overflow-hidden transition-all duration-300"
    >
      <div className="relative h-48 bg-slate-mid">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gold/30 font-heading text-4xl">9</p>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-3 flex-wrap">
          {parsedTags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-gold/70 bg-gold/10 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-cream font-heading text-lg group-hover:text-gold transition-colors mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-cream/50 text-sm line-clamp-2 mb-3">{excerpt}</p>
        <p className="text-cream/30 text-xs">
          <LocaleDate date={publishedAt} />
        </p>
      </div>
    </Link>
  );
}
