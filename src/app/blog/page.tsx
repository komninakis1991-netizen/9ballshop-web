import { getPrisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";

export default async function BlogPage() {
  const prisma = await getPrisma();
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">Insights & Stories</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">Blog</h1>
          <p className="text-cream/50 mt-4 max-w-2xl mx-auto">
            Thoughts on billiards, performance, discipline, and the journey from Greece to America.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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
      </section>
    </div>
  );
}
