"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/components/LanguageProvider";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
  images: string;
  inStock: boolean;
}

export default function CategoryContent({
  categoryKey,
  categoryLabel,
  products,
}: {
  categoryKey: string;
  categoryLabel: string;
  products: Product[];
}) {
  const { t } = useLanguage();

  const sortOptions = [
    { label: t.category.sortNewest, value: "newest" },
    { label: t.category.sortPriceAsc, value: "price-asc" },
    { label: t.category.sortPriceDesc, value: "price-desc" },
    { label: t.category.sortNameAsc, value: "name-asc" },
  ];

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allBrands = useMemo(() => {
    const brands = new Set(products.map((p) => p.brand));
    return Array.from(brands).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const brand of allBrands) {
      counts[brand] = products.filter((p) => p.brand === brand).length;
    }
    return counts;
  }, [products, allBrands]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  };

  const clearAll = () => {
    setSelectedBrands(new Set());
    setPriceMin("");
    setPriceMax("");
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedBrands.size > 0 ||
    priceMin !== "" ||
    priceMax !== "" ||
    inStockOnly;

  const results = useMemo(() => {
    let filtered = products;

    if (selectedBrands.size > 0) {
      filtered = filtered.filter((p) => selectedBrands.has(p.brand));
    }
    if (priceMin !== "") {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) filtered = filtered.filter((p) => p.price >= min);
    }
    if (priceMax !== "") {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) filtered = filtered.filter((p) => p.price <= max);
    }
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [products, selectedBrands, priceMin, priceMax, inStockOnly, sortBy]);

  const filterPanel = (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <h3 className="text-cream font-heading text-sm uppercase tracking-widest mb-3">
          {t.category.brand}
        </h3>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedBrands.has(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gold/30 bg-navy text-gold accent-gold focus:ring-gold/30"
              />
              <span className="text-cream/70 text-sm group-hover:text-cream transition-colors flex-1">
                {brand}
              </span>
              <span className="text-cream/30 text-xs">{brandCounts[brand]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-cream font-heading text-sm uppercase tracking-widest mb-3">
          {t.category.priceRange}
        </h3>
        <p className="text-cream/30 text-xs mb-2">
          &euro;{priceBounds.min.toFixed(0)} &ndash; &euro;{priceBounds.max.toFixed(0)}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            min={0}
            className="w-full bg-navy border border-gold/15 rounded px-3 py-2 text-cream text-sm placeholder-cream/25 focus:outline-none focus:border-gold/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-cream/30 text-sm">&ndash;</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            min={0}
            className="w-full bg-navy border border-gold/15 rounded px-3 py-2 text-cream text-sm placeholder-cream/25 focus:outline-none focus:border-gold/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gold/30 bg-navy text-gold accent-gold focus:ring-gold/30"
          />
          <span className="text-cream/70 text-sm group-hover:text-cream transition-colors">
            {t.category.inStockOnly}
          </span>
        </label>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="text-gold/70 hover:text-gold text-xs uppercase tracking-wider transition-colors"
        >
          {t.category.clearAll}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/shop" className="text-cream/40 hover:text-gold transition-colors">
            {t.nav.shop}
          </Link>
          <span className="text-cream/20 mx-2">/</span>
          <span className="text-cream/80">{t.categories[categoryKey] || categoryLabel}</span>
        </nav>

        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.category.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">
            {t.categories[categoryKey] || categoryLabel}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 bg-navy-light border border-gold/10 rounded-xl p-5">
              {filterPanel}
            </div>
          </aside>

          {/* Mobile filter toggle + panel */}
          <div className="lg:hidden">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 border border-gold/20 rounded-lg px-4 py-2.5 text-cream/70 hover:border-gold/50 hover:text-cream transition-colors text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              {t.category.filters}
              {hasActiveFilters && (
                <span className="bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedBrands.size +
                    (priceMin !== "" || priceMax !== "" ? 1 : 0) +
                    (inStockOnly ? 1 : 0)}
                </span>
              )}
            </button>
            {filtersOpen && (
              <div className="mt-3 bg-navy-light border border-gold/10 rounded-xl p-5">
                {filterPanel}
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-cream/40 text-sm">
                {results.length} {results.length !== 1 ? t.shop.productCountPlural : t.shop.productCount}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-navy-light border border-gold/20 text-cream/80 text-sm rounded px-3 py-2 focus:outline-none focus:border-gold/50"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Grid */}
            {results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-cream/40 mb-3">
                  {t.category.noResults}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="text-gold text-sm hover:underline"
                  >
                    {t.category.clearAllLower}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((product) => (
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
