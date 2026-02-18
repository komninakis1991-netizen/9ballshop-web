import { getPrisma } from "@/lib/prisma";
import { CATEGORIES, isValidCategoryKey, categoryLabel } from "@/lib/categories";
import { notFound } from "next/navigation";
import CategoryContent from "./CategoryContent";

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ key: c.key }));
}

export default async function CategoryPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (!isValidCategoryKey(key)) notFound();

  const prisma = await getPrisma();
  const products = await prisma.product.findMany({
    where: { category: key },
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

  return <CategoryContent categoryKey={key} categoryLabel={categoryLabel(key)} products={products} />;
}
