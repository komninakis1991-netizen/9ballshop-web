export const FORUM_CATEGORIES = [
  { slug: "strategy", icon: "🎯" },
  { slug: "technique", icon: "🎱" },
  { slug: "gear-reviews", icon: "🏆" },
  { slug: "training-drills", icon: "📋" },
  { slug: "mental-game", icon: "🧠" },
  { slug: "coaching", icon: "🎓" },
  { slug: "match-analysis", icon: "📊" },
  { slug: "tournament-talk", icon: "🏅" },
  { slug: "table-maintenance", icon: "🔧" },
  { slug: "off-topic", icon: "💬" },
] as const;

export type ForumCategorySlug = (typeof FORUM_CATEGORIES)[number]["slug"];

export function isValidCategory(slug: string): slug is ForumCategorySlug {
  return FORUM_CATEGORIES.some((c) => c.slug === slug);
}
