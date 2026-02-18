import { getPrisma } from "@/lib/prisma";
import HomeContent from "./HomeContent";

export default async function Home() {
  const prisma = await getPrisma();
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
  });

  const latestPosts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <HomeContent
      featuredProducts={featuredProducts}
      latestPosts={latestPosts}
    />
  );
}
