// ============================================================
// check-badges — Supabase Edge Function (Option A)
//
// Checks all auto-grantable badges for a given user and
// inserts any newly earned ones into user_badges.
//
// POST /functions/v1/check-badges
// Body: { "user_id": "uuid" }
// Returns: { "new_badges": [ { id, name, icon, badge_type } ] }
//
// Deploy: npx supabase functions deploy check-badges
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Badge criteria definitions ──
// Each auto badge has a name (matching the DB seed) and a check function.
interface UserStats {
  post_count: number;
  thread_count: number;
  likes_received: number;
  streak: number;
}

interface BadgeRow {
  id: number;
  name: string;
  icon: string;
  badge_type: string;
  is_auto: boolean;
}

const badgeCriteria: Record<string, (s: UserStats) => boolean> = {
  "First Post": (s) => s.post_count >= 1 || s.thread_count >= 1,
  Conversationalist: (s) => s.post_count >= 50,
  "Community Voice": (s) => s.post_count >= 200,
  Helpful: (s) => s.likes_received >= 25,
  "Top Contributor": (s) => s.likes_received >= 100,
  "Hot Streak": (s) => s.streak >= 7,
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Create admin client (bypasses RLS) ──
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // ── 1. Fetch user profile stats ──
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("post_count, thread_count, likes_received")
      .eq("id", user_id)
      .single();

    if (profileErr || !profile) {
      return new Response(
        JSON.stringify({ error: "User not found", details: profileErr?.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 2. Calculate 7-day posting streak ──
    const streak = await calculateStreak(supabaseAdmin, user_id);

    const stats: UserStats = {
      post_count: profile.post_count ?? 0,
      thread_count: profile.thread_count ?? 0,
      likes_received: profile.likes_received ?? 0,
      streak,
    };

    // ── 3. Fetch all auto badges ──
    const { data: allBadges, error: badgeErr } = await supabaseAdmin
      .from("badges")
      .select("id, name, icon, badge_type, is_auto")
      .eq("is_auto", true)
      .order("id");

    if (badgeErr || !allBadges) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch badges", details: badgeErr?.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 4. Fetch user's existing badges ──
    const { data: existingBadges } = await supabaseAdmin
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", user_id);

    const existingIds = new Set(
      (existingBadges ?? []).map((b: { badge_id: number }) => b.badge_id),
    );

    // ── 5. Check criteria and grant new badges ──
    const newBadges: { id: number; name: string; icon: string; badge_type: string }[] = [];

    for (const badge of allBadges as BadgeRow[]) {
      // Skip if already earned
      if (existingIds.has(badge.id)) continue;

      // Skip if no criteria function defined
      const check = badgeCriteria[badge.name];
      if (!check) continue;

      // Check criteria
      if (check(stats)) {
        // Grant the badge
        const { error: insertErr } = await supabaseAdmin
          .from("user_badges")
          .insert({ user_id, badge_id: badge.id });

        // Unique constraint violation = already has it (race condition guard)
        if (insertErr && insertErr.code !== "23505") {
          console.error(`Failed to grant badge ${badge.name}:`, insertErr);
          continue;
        }

        if (!insertErr) {
          newBadges.push({
            id: badge.id,
            name: badge.name,
            icon: badge.icon,
            badge_type: badge.badge_type,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        user_id,
        stats,
        new_badges: newBadges,
        total_checked: allBadges.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("check-badges error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

// ────────────────────────────────────────────────────
// Streak Calculator
// Counts consecutive days with at least one post,
// starting from today/yesterday going backwards.
// ────────────────────────────────────────────────────

async function calculateStreak(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<number> {
  // Fetch distinct post dates from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: posts } = await supabase
    .from("posts")
    .select("created_at")
    .eq("author_id", userId)
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: false });

  if (!posts || posts.length === 0) return 0;

  // Also check threads (starting a thread counts as activity)
  const { data: threads } = await supabase
    .from("threads")
    .select("created_at")
    .eq("author_id", userId)
    .gte("created_at", thirtyDaysAgo.toISOString());

  // Collect unique dates (UTC)
  const dateSet = new Set<string>();

  for (const p of posts) {
    dateSet.add(new Date(p.created_at).toISOString().slice(0, 10));
  }
  for (const t of threads ?? []) {
    dateSet.add(new Date(t.created_at).toISOString().slice(0, 10));
  }

  // Sort descending
  const sortedDates = [...dateSet].sort().reverse();

  if (sortedDates.length === 0) return 0;

  // The streak must include today or yesterday
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0; // No recent activity, streak is broken
  }

  // Count consecutive days from the most recent date backwards
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1] + "T00:00:00Z");
    const curr = new Date(sortedDates[i] + "T00:00:00Z");
    const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
    } else {
      break; // Gap found, streak ends
    }
  }

  return streak;
}
