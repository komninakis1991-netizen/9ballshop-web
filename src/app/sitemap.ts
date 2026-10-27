import type { MetadataRoute } from "next";
import { getPrisma } from "@/lib/prisma";
import { COURSES, isForSale } from "@/lib/courses";

// Read from the live database on each request instead of at build time.
export const dynamic = "force-dynamic";

const BASE = "https://9ballshop.com";

const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/lessons", priority: 0.9 },
  { path: "/courses", priority: 0.9 },
  ...COURSES.filter(isForSale).map((c) => ({ path: `/courses/${c.slug}`, priority: 0.8 })),
  { path: "/el/mathimata-bilardou", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/blog", priority: 0.7 },
  { path: "/videos", priority: 0.6 },
  { path: "/tournaments", priority: 0.6 },
  { path: "/collaborate", priority: 0.5 },
  { path: "/custom-jerseys", priority: 0.5 },
  { path: "/members", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    priority: p.priority,
  }));

  try {
    const prisma = await getPrisma();
    const posts = await prisma.blogPost.findMany({
      select: { slug: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    for (const post of posts) {
      entries.push({
        url: `${BASE}/blog/${post.slug}`,
        lastModified: post.publishedAt,
        priority: 0.6,
      });
    }
  } catch {
    // Database unavailable: serve the static pages only.
  }

  return entries;
}
