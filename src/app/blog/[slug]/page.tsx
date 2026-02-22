import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/BlogPostContent";

export async function generateStaticParams() {
  const prisma = await getPrisma();
  const posts = await prisma.blogPost.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const prisma = await getPrisma();
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post) notFound();

  const relatedPosts = await prisma.blogPost.findMany({
    where: { slug: { not: post.slug } },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <BlogPostContent
      post={post}
      relatedPosts={relatedPosts}
    />
  );
}
