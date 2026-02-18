"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface ShopCategoriesProps {
  categoryData: Array<{
    key: string;
    label: string;
    count: number;
    coverImage: string | null;
  }>;
}

export default function ShopCategories({ categoryData }: ShopCategoriesProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.shop.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">
            {t.shop.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryData.map((cat) => (
            <Link
              key={cat.key}
              href={`/shop/category/${cat.key}`}
              className="group relative block rounded-lg overflow-hidden aspect-[4/3] bg-navy-light border border-gold/10 hover:border-gold/40 transition-all duration-300"
            >
              {cat.coverImage ? (
                <img
                  src={cat.coverImage}
                  alt={t.categories[cat.key] || cat.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 bg-navy-light" />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Text */}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h2 className="font-heading text-xl text-cream group-hover:text-gold transition-colors">
                  {t.categories[cat.key] || cat.label}
                </h2>
                <p className="text-cream/50 text-sm mt-1">
                  {cat.count} {cat.count !== 1 ? t.shop.productCountPlural : t.shop.productCount}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
