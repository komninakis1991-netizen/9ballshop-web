"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface ProductCardProps {
  name: string;
  slug: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
  images?: string;
}

export default function ProductCard({ name, slug, price, currency, category, brand, images }: ProductCardProps) {
  const { t } = useLanguage();
  const imageList: string[] = images ? JSON.parse(images) : [];
  const hasImage = imageList.length > 0 && imageList[0].startsWith("http");

  return (
    <Link
      href={`/shop/${slug}`}
      className="group block bg-navy-light border border-gold/10 hover:border-gold/40 rounded-lg overflow-hidden transition-all duration-300"
    >
      <div className="aspect-square bg-slate-mid flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={imageList[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">{brand}</p>
            <p className="text-cream/40 font-heading text-lg">{t.categories[category] || category}</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-cream text-sm font-medium group-hover:text-gold transition-colors line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
        <p className="text-gold font-heading text-lg mt-2">
          {currency === "EUR" ? "\u20AC" : "$"}{price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
