"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { FORUM_CATEGORIES } from "@/lib/forumCategories";
import { timeAgo } from "@/lib/relativeTime";
import UserAvatar from "@/components/forum/UserAvatar";

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

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
};

type Post = {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  createdAt: string;
  categorySlug: string;
  user: { id: number; name: string; email: string };
  comments: Comment[];
};

function formatTime(dateString: string, t: Record<string, string>) {
  const { key, value } = timeAgo(dateString);
  const template = t[key] || key;
  return value !== undefined ? template.replace("{n}", String(value)) : template;
}

function getVideoEmbed(url: string): { src: string } | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return { src: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }
  return null;
}

export default function PostDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.membershipStatus !== "active") { router.push("/members"); return; }

    async function fetchPost() {
      try {
        const res = await fetch(`/api/forum/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          router.push(`/members/forum/${category}`);
        }
      } catch {
        router.push(`/members/forum/${category}`);
      }
      setLoading(false);
    }

    fetchPost();
  }, [user, authLoading, router, category, postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);

    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });

      if (res.ok) {
        const data = await res.json();
        setPost((prev) =>
          prev ? { ...prev, comments: [...prev.comments, data.comment] } : prev,
        );
        setCommentText("");
      }
    } catch { /* ignore */ }
    setSubmittingComment(false);
  };

  if (authLoading || !user || user.membershipStatus !== "active" || loading) {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <p className="text-cream/50">{t.members.loadingForum}</p>
      </div>
    );
  }

  if (!post) return null;

  const catInfo = FORUM_CATEGORIES.find((c) => c.slug === category);
  const nameKey = categoryNameKeys[category] as keyof typeof t.members;
  const categoryName = (t.members[nameKey] as string) || category;
  const membersT = t.members as Record<string, string>;
  const videoEmbed = post.videoUrl ? getVideoEmbed(post.videoUrl) : null;

  return (
    <div className="bg-navy min-h-screen">
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(135,10,10,0.06)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-cream/40 mb-4 flex-wrap">
            <Link href="/members/forum" className="hover:text-gold transition-colors">
              {t.members.forumTitle}
            </Link>
            <span>&rsaquo;</span>
            <Link href={`/members/forum/${category}`} className="hover:text-gold transition-colors inline-flex items-center gap-1">
              {catInfo?.icon} {categoryName}
            </Link>
            <span>&rsaquo;</span>
            <span className="text-cream/60 truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        {/* Post */}
        <div className="bg-navy-light border border-gold/10 rounded-lg p-8 mb-8">
          <h1 className="font-heading text-2xl md:text-3xl text-cream mb-4">{post.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <UserAvatar name={post.user.name || post.user.email} size={36} />
            <div className="text-sm text-cream/40">
              <span className="text-cream/60 font-medium">{post.user.name || post.user.email}</span>
              <span className="mx-2">&middot;</span>
              <span>{formatTime(post.createdAt, membersT)}</span>
            </div>
          </div>

          {/* Video embed */}
          {videoEmbed && (
            <div className="relative w-full mb-6 rounded overflow-hidden border border-gold/10" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={videoEmbed.src}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded video"
              />
            </div>
          )}

          <div className="text-cream/70 leading-relaxed whitespace-pre-wrap">{post.content}</div>
        </div>

        {/* Comments */}
        <div className="mb-8">
          <h2 className="font-heading text-xl text-cream mb-6">
            {t.members.comments} ({post.comments.length})
          </h2>

          {post.comments.length === 0 ? (
            <p className="text-cream/40 text-sm">{t.members.noComments}</p>
          ) : (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="bg-navy-light border border-gold/5 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar name={comment.user.name || comment.user.email} size={28} />
                    <div className="text-sm text-cream/40">
                      <span className="font-medium text-cream/60">{comment.user.name || comment.user.email}</span>
                      <span className="mx-2">&middot;</span>
                      <span>{formatTime(comment.createdAt, membersT)}</span>
                    </div>
                  </div>
                  <p className="text-cream/70 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment */}
        <div className="bg-navy-light border border-gold/10 rounded-lg p-6">
          <h3 className="text-cream font-medium mb-4">{t.members.addComment}</h3>
          <form onSubmit={handleAddComment} className="space-y-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.members.commentPlaceholder}
              required
              rows={4}
              className="w-full bg-navy border border-gold/10 rounded px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors resize-y text-sm"
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-2.5 rounded transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {submittingComment ? t.members.submittingComment : t.members.submitComment}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
