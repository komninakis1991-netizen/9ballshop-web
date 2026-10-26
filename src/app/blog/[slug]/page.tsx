import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/BlogPostContent";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const prisma = await getPrisma();
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

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
