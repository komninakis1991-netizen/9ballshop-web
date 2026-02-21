"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { FORUM_CATEGORIES } from "@/lib/forumCategories";
import { timeAgo } from "@/lib/relativeTime";
import UserAvatar from "@/components/forum/UserAvatar";
import ForumChat from "@/components/forum/ForumChat";

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

type RecentPost = {
  id: number;
  title: string;
  categorySlug: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
  _count: { comments: number };
};

function formatTime(dateString: string, t: Record<string, string>) {
  const { key, value } = timeAgo(dateString);
  const template = t[key] || key;
  return value !== undefined ? template.replace("{n}", String(value)) : template;
}

function ForumHomeContent() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loadingData, setLoadingData] = useState(true);
  const justSubscribed = searchParams.get("subscribed") === "true";

  useEffect(() => {
    if (justSubscribed) {
      refreshUser();
    }
  }, [justSubscribed, refreshUser]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.membershipStatus !== "active") { router.push("/members"); return; }

    async function fetchData() {
      // Fetch all categories stats + recent posts in parallel
      const fetches = FORUM_CATEGORIES.map((cat) =>
        fetch(`/api/forum/posts?category=${cat.slug}&page=1`)
          .then((r) => (r.ok ? r.json() : { posts: [], total: 0 }))
          .catch(() => ({ posts: [], total: 0 }))
      );

      const results = await Promise.all(fetches);
      const statsMap: Record<string, number> = {};
      const allPosts: RecentPost[] = [];

      results.forEach((data, i) => {
        statsMap[FORUM_CATEGORIES[i].slug] = data.total;
        allPosts.push(...data.posts);
      });

      // Sort all posts by date, take latest 10
      allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setStats(statsMap);
      setRecentPosts(allPosts.slice(0, 10));
      setLoadingData(false);
    }

    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || !user || user.membershipStatus !== "active") {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <p className="text-cream/50">{t.members.loadingForum}</p>
      </div>
    );
  }

  const membersT = t.members as Record<string, string>;

  return (
    <div className="bg-navy min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.members.forumSubtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream mb-4">
            {t.members.forumTitle}
          </h1>
          {justSubscribed && (
            <p className="text-green-400 text-sm mt-2">{t.members.subscriptionSuccess}</p>
          )}
          <div className="mt-6">
            <Link
              href={`/members/forum/${FORUM_CATEGORIES[0].slug}/new`}
              className="inline-block bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              {t.members.newPost}
            </Link>
          </div>
        </div>
      </section>

      <ForumChat />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — Categories */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-lg text-cream mb-4">{t.members.allCategories}</h2>
            <div className="space-y-2">
              {FORUM_CATEGORIES.map((cat) => {
                const nameKey = categoryNameKeys[cat.slug] as keyof typeof t.members;
                const count = stats[cat.slug] ?? 0;
                return (
                  <Link
                    key={cat.slug}
                    href={`/members/forum/${cat.slug}`}
                    className="flex items-center gap-3 bg-navy-light border border-gold/10 rounded-lg p-3 hover:border-gold/30 transition-colors"
                  >
                    <span className="text-xl flex-shrink-0">{cat.icon}</span>
                    <span className="text-cream text-sm font-medium flex-1 min-w-0 truncate">
                      {t.members[nameKey] as string}
                    </span>
                    <span className="text-cream/30 text-xs flex-shrink-0">
                      {loadingData ? "..." : count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right column — Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-lg text-cream mb-4">{t.members.recentActivity}</h2>
            {loadingData ? (
              <p className="text-cream/40 text-center py-10">{t.members.loadingForum}</p>
            ) : recentPosts.length === 0 ? (
              <p className="text-cream/40 text-center py-10">{t.members.noPosts}</p>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => {
                  const catInfo = FORUM_CATEGORIES.find((c) => c.slug === post.categorySlug);
                  const nameKey = categoryNameKeys[post.categorySlug] as keyof typeof t.members;
                  return (
                    <Link
                      key={post.id}
                      href={`/members/forum/${post.categorySlug}/${post.id}`}
                      className="block bg-navy-light border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar name={post.user.name || post.user.email} size={36} />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-cream font-medium text-sm truncate">{post.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-cream/40">
                            <span>{post.user.name || post.user.email}</span>
                            <span className="inline-flex items-center gap-1 bg-gold/10 text-gold/70 px-2 py-0.5 rounded-full">
                              {catInfo?.icon} {t.members[nameKey] as string}
                            </span>
                            <span>{formatTime(post.createdAt, membersT)}</span>
                            <span>{post._count.comments} {t.members.comments.toLowerCase()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ForumHomePage() {
  return (
    <Suspense fallback={
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <p className="text-cream/50">Loading forum...</p>
      </div>
    }>
      <ForumHomeContent />
    </Suspense>
  );
}
