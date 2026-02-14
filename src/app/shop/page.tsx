"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
}

const CATEGORIES = ["All", "Cues", "Shafts", "Balls", "Gloves", "Cases", "Accessories", "Tables", "Apparel"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const filtered = products.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name-asc": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">Browse Collection</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">Shop</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-wider px-4 py-2 rounded transition-colors ${
                  activeCategory === cat
                    ? "bg-gold text-navy font-semibold"
                    : "border border-gold/20 text-cream/60 hover:border-gold/50 hover:text-cream"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-navy-light border border-gold/20 text-cream/80 text-sm rounded px-3 py-2 focus:outline-none focus:border-gold/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-cream/40">Loading products...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40">No products found in this category.</p>
          </div>
        ) : (
          <>
            <p className="text-cream/40 text-sm mb-6">{sorted.length} product{sorted.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sorted.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  currency={product.currency}
                  category={product.category}
                  brand={product.brand}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="bg-navy min-h-screen flex items-center justify-center"><p className="text-cream/40">Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}
