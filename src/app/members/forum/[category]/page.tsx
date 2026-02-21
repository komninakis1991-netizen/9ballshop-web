"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { FORUM_CATEGORIES, isValidCategory } from "@/lib/forumCategories";
import { timeAgo } from "@/lib/relativeTime";
import UserAvatar from "@/components/forum/UserAvatar";
import CategoryBar from "@/components/forum/CategoryBar";

const categoryNameKeys: Record<string, string> = {
  strategy: "categoryStrategy",
  technique: "categoryTechnique",
  "gear-reviews": "categoryGearReviews",
  "training-drills": "categoryTrainingDrills",
  "mental-game": "categoryMentalGame",
  coaching: "categoryCoaching",
  "match-analysis": "categoryMatchAnalysis",
  "tournament-talk": "categoryTournamentTalk",
  "table-maintenance": "categoryTableMaintenance",
  "off-topic": "categoryOffTopic",
};

type Post = {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
  _count: { comments: number };
};

function formatTime(dateString: string, t: Record<string, string>) {
  const { key, value } = timeAgo(dateString);
  const template = t[key] || key;
  return value !== undefined ? template.replace("{n}", String(value)) : template;
}

export default function CategoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.membershipStatus !== "active") { router.push("/members"); return; }
    if (!isValidCategory(category)) { router.push("/members/forum"); return; }

    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/forum/posts?category=${category}&page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setTotalPages(data.totalPages);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }

    fetchPosts();
  }, [user, authLoading, router, category, page]);

  if (authLoading || !user || user.membershipStatus !== "active") {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <p className="text-cream/50">{t.members.loadingForum}</p>
      </div>
    );
  }

  const catInfo = FORUM_CATEGORIES.find((c) => c.slug === category);
  const nameKey = categoryNameKeys[category] as keyof typeof t.members;
  const categoryName = (t.members[nameKey] as string) || category;
  const membersT = t.members as Record<string, string>;

  return (
    <div className="bg-navy min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Link href="/members/forum" className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3 inline-block hover:text-gold transition-colors">
            &larr; {t.members.backToForum}
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl text-cream mt-3 flex items-center justify-center gap-3">
            {catInfo && <span>{catInfo.icon}</span>}
            {categoryName}
          </h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="mb-6">
          <CategoryBar active={category} />
        </div>

        <div className="flex justify-end mb-6">
          <Link
            href={`/members/forum/${category}/new`}
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-2.5 rounded transition-colors text-sm uppercase tracking-wider"
          >
            {t.members.newPost}
          </Link>
        </div>

        {loading ? (
          <p className="text-cream/40 text-center py-10">{t.members.loadingForum}</p>
        ) : posts.length === 0 ? (
          <p className="text-cream/40 text-center py-10">{t.members.noPosts}</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const snippet = post.content.length > 120
                ? post.content.slice(0, 120) + "..."
                : post.content;
              return (
                <Link
                  key={post.id}
                  href={`/members/forum/${category}/${post.id}`}
                  className="block bg-navy-light border border-gold/10 rounded-lg p-5 hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <UserAvatar name={post.user.name || post.user.email} size={36} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-cream font-medium truncate">{post.title}</h3>
                        {post.videoUrl && (
                          <svg className="w-4 h-4 text-gold/50 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-cream/40 text-sm mt-1 line-clamp-2">{snippet}</p>
                      <div className="flex items-center gap-3 text-xs text-cream/40 mt-2">
                        <span>{post.user.name || post.user.email}</span>
                        <span>&middot;</span>
                        <span>{formatTime(post.createdAt, membersT)}</span>
                        <span>&middot;</span>
                        <span>{post._count.comments} {t.members.comments.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-gold text-navy"
                    : "bg-navy-light border border-gold/10 text-cream/60 hover:border-gold/30"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
