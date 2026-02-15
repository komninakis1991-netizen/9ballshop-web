import { getPrisma } from "@/lib/prisma";
import ShopContent from "./ShopContent";

export default async function ShopPage() {
  const prisma = await getPrisma();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      currency: true,
      category: true,
      brand: true,
      images: true,
      inStock: true,
    },
  });

  return <ShopContent products={products} />;
}
