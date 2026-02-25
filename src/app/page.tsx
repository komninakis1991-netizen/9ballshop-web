import { getPrisma } from "@/lib/prisma";
import HomeContent from "./HomeContent";

export default async function Home() {
  const prisma = await getPrisma();

  const latestPosts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <HomeContent
      latestPosts={latestPosts}
    />
  );
}
