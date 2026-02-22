export const FORUM_CATEGORIES = [
  { slug: "announcements", icon: "📢" },
  { slug: "training-lab", icon: "🎯" },
  { slug: "match-analysis", icon: "📊" },
  { slug: "mental-game", icon: "🧠" },
  { slug: "equipment-gear", icon: "🎱" },
  { slug: "tournaments", icon: "🏆" },
  { slug: "introductions", icon: "👋" },
  { slug: "wins-progress", icon: "🏅" },
] as const;

export type ForumCategorySlug = (typeof FORUM_CATEGORIES)[number]["slug"];

export function isValidCategory(slug: string): slug is ForumCategorySlug {
  return FORUM_CATEGORIES.some((c) => c.slug === slug);
}
