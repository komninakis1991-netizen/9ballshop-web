import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireMember } from "@/lib/auth/requireMember";
import { FORUM_CATEGORIES } from "@/lib/forumCategories";

export async function GET() {
  const user = await requireMember();
  if (!user) {
    return NextResponse.json(
      { error: "Membership required" },
      { status: 403 },
    );
  }

  try {
    const prisma = await getPrisma();

    const counts = await Promise.all(
      FORUM_CATEGORIES.map((cat) =>
        prisma.forumPost.count({ where: { categorySlug: cat.slug } }),
      ),
    );

    const stats: Record<string, number> = {};
    FORUM_CATEGORIES.forEach((cat, i) => {
      stats[cat.slug] = counts[i];
    });

    return NextResponse.json({ stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Forum stats error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
