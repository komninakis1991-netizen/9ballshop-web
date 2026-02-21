"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { FORUM_CATEGORIES, isValidCategory } from "@/lib/forumCategories";
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

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function NewPostPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const paramCategory = params.category as string;
  const [selectedCategory, setSelectedCategory] = useState(paramCategory);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.membershipStatus !== "active") { router.push("/members"); return; }
    if (!isValidCategory(paramCategory)) { router.push("/members/forum"); return; }
  }, [user, authLoading, router, paramCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: selectedCategory,
          title,
          content,
          videoUrl: videoUrl.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/members/forum/${selectedCategory}/${data.post.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create post");
        setSubmitting(false);
      }
    } catch {
      setError("Failed to create post");
      setSubmitting(false);
    }
  };

  if (authLoading || !user || user.membershipStatus !== "active") {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <p className="text-cream/50">{t.members.loadingForum}</p>
      </div>
    );
  }

  const catInfo = FORUM_CATEGORIES.find((c) => c.slug === selectedCategory);
  const nameKey = categoryNameKeys[selectedCategory] as keyof typeof t.members;
  const categoryName = (t.members[nameKey] as string) || selectedCategory;
  const youtubeId = getYouTubeId(videoUrl);

  return (
    <div className="bg-navy min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Link href={`/members/forum/${selectedCategory}`} className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3 inline-block hover:text-gold transition-colors">
            &larr; {t.members.backToCategory}
          </Link>
          <h1 className="font-heading text-3xl text-cream mt-3 flex items-center justify-center gap-3">
            {catInfo && <span>{catInfo.icon}</span>}
            {t.members.newPost} — {categoryName}
          </h1>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <div className="mb-6">
          <CategoryBar active={selectedCategory} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded p-3">
              {error}
            </p>
          )}

          {/* Category selector */}
          <div>
            <label className="block text-cream/70 text-sm mb-2">{t.members.allCategories}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-navy-light border border-gold/10 rounded px-4 py-3 text-cream focus:outline-none focus:border-gold/40 transition-colors"
            >
              {FORUM_CATEGORIES.map((cat) => {
                const nk = categoryNameKeys[cat.slug] as keyof typeof t.members;
                return (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {t.members[nk] as string}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-cream/70 text-sm mb-2">{t.members.postTitle}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.members.postTitlePlaceholder}
              required
              className="w-full bg-navy-light border border-gold/10 rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-cream/70 text-sm mb-2">{t.members.postContent}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.members.postContentPlaceholder}
              required
              rows={10}
              className="w-full bg-navy-light border border-gold/10 rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors resize-y"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-cream/70 text-sm mb-2">{t.members.videoUrl}</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder={t.members.videoUrlPlaceholder}
              className="w-full bg-navy-light border border-gold/10 rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors"
            />
            {youtubeId && (
              <div className="mt-3 rounded overflow-hidden border border-gold/10">
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full max-w-sm"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {submitting ? t.members.submittingPost : t.members.submitPost}
          </button>
        </form>
      </section>
    </div>
  );
}
