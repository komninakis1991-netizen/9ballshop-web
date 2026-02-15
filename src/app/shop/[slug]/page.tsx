import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  const prisma = await getPrisma();
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const prisma = await getPrisma();
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, slug: { not: product.slug } },
    take: 4,
  });

  const currencySymbol = product.currency === "EUR" ? "\u20AC" : "$";
  const imageList: string[] = JSON.parse(product.images);
  const hasImage = imageList.length > 0 && imageList[0].startsWith("http");

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/shop" className="text-cream/40 hover:text-gold transition-colors">Shop</Link>
          <span className="text-cream/20 mx-2">/</span>
          <span className="text-cream/60">{product.category}</span>
          <span className="text-cream/20 mx-2">/</span>
          <span className="text-cream/80">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-navy-light border border-gold/10 rounded-lg flex items-center justify-center overflow-hidden">
            {hasImage ? (
              <img src={imageList[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <p className="text-gold/40 font-heading text-6xl mb-4">9</p>
                <p className="text-cream/30 text-sm uppercase tracking-widest">{product.brand}</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-2">{product.brand}</p>
            <h1 className="font-heading text-3xl md:text-4xl text-cream mb-4">{product.name}</h1>
            <p className="text-gold font-heading text-3xl mb-6">
              {currencySymbol}{product.price.toFixed(2)}
            </p>
            <div className="border-t border-gold/10 pt-6 mb-6">
              <p className="text-cream/70 leading-relaxed">{product.description}</p>
            </div>
            <div className="flex gap-4 items-center mb-6">
              <span className="text-cream/40 text-sm">Category:</span>
              <Link href={`/shop?category=${product.category}`} className="text-gold/80 hover:text-gold text-sm transition-colors">
                {product.category}
              </Link>
            </div>
            <div className="flex gap-4 items-center mb-8">
              <span className="text-cream/40 text-sm">Availability:</span>
              <span className={`text-sm ${product.inStock ? "text-emerald" : "text-red-400"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                currency: product.currency,
                brand: product.brand,
              }}
            />
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl text-cream mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  currency={p.currency}
                  category={p.category}
                  brand={p.brand}
                  images={p.images}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
