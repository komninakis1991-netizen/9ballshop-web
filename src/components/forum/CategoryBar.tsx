"use client";

import Link from "next/link";
import { FORUM_CATEGORIES } from "@/lib/forumCategories";
import { useLanguage } from "@/components/LanguageProvider";

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

export default function CategoryBar({ active }: { active?: string }) {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
      <div className="flex gap-2 min-w-max">
        {FORUM_CATEGORIES.map((cat) => {
          const nameKey = categoryNameKeys[cat.slug] as keyof typeof t.members;
          const isActive = cat.slug === active;
          return (
            <Link
              key={cat.slug}
              href={`/members/forum/${cat.slug}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-gold text-navy"
                  : "bg-navy-light border border-gold/10 text-cream/60 hover:border-gold/30 hover:text-cream"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{t.members[nameKey] as string}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
