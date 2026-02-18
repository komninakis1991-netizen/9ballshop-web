import { getPrisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import ShopCategories from "./ShopCategories";

export default async function ShopPage() {
  const prisma = await getPrisma();

  // Fetch count + one sample image per category in a single query
  const products = await prisma.product.findMany({
    select: { category: true, images: true },
  });

  const categoryData = CATEGORIES.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat.key);
    const count = catProducts.length;
    // Find first product with a valid image to use as cover
    let coverImage: string | null = null;
    for (const p of catProducts) {
      try {
        const imgs: string[] = JSON.parse(p.images);
        if (imgs.length > 0 && imgs[0].startsWith("http")) {
          coverImage = imgs[0];
          break;
        }
      } catch {
        // skip invalid JSON
      }
    }
    return { key: cat.key, label: cat.label, count, coverImage };
  }).filter((cat) => cat.count > 0);

  return <ShopCategories categoryData={categoryData} />;
}
