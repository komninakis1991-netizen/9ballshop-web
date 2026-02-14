import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import BlogCard from "@/components/BlogCard";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
  });

  const latestPosts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="bg-navy min-h-screen">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,168,67,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <p className="text-gold/70 text-sm uppercase tracking-[0.3em] mb-6 font-body">
            Curated by Marios Komninakis
          </p>
          <h1 className="font-heading text-5xl md:text-7xl text-cream mb-6 leading-tight">
            Premium Billiards
            <span className="block text-gold">Equipment</span>
          </h1>
          <p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Discover the finest cues, shafts, and accessories from the world&apos;s most respected brands.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/shop"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="border border-gold/40 hover:border-gold text-gold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">Handpicked Selection</p>
          <h2 className="font-heading text-3xl md:text-4xl text-cream">Featured Products</h2>
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
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="text-gold hover:text-gold-light text-sm uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-gold pb-1"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-navy-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">The Curator</p>
            <h2 className="font-heading text-3xl md:text-4xl text-cream mb-6">Marios Komninakis</h2>
            <p className="text-cream/60 text-lg leading-relaxed mb-8">
              From the pool halls of Greece to the competitive tables of America, Marios has spent
              years mastering the art and science of billiards. Every product in our collection is
              personally vetted to meet the highest standards of quality and performance.
            </p>
            <Link
              href="/about"
              className="text-gold hover:text-gold-light text-sm uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-gold pb-1"
            >
              Read Full Story
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">Insights & Stories</p>
          <h2 className="font-heading text-3xl md:text-4xl text-cream">From the Blog</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              publishedAt={post.publishedAt}
              tags={post.tags}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="text-gold hover:text-gold-light text-sm uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-gold pb-1"
          >
            Read All Articles
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-navy-light py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">Stay Updated</p>
          <h2 className="font-heading text-3xl text-cream mb-4">Join the Club</h2>
          <p className="text-cream/50 mb-8">Get notified about new products, exclusive deals, and billiards insights.</p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-navy border border-gold/20 rounded px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 text-sm"
            />
            <button
              type="submit"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
