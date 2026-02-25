-- ============================================================
-- Auto Badge Checker — Option B (PL/pgSQL)
--
-- A SECURITY DEFINER function that checks all auto-grantable
-- badges for a given user and inserts any newly earned ones.
-- Called from triggers on posts, threads, and likes tables.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. Core function: check_and_grant_badges(user_id)
--    Returns a TABLE of newly granted badge info.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION check_and_grant_badges(p_user_id uuid)
RETURNS TABLE (
  badge_id    integer,
  badge_name  text,
  badge_icon  text,
  badge_type  badge_type
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_count      integer;
  v_thread_count    integer;
  v_likes_received  integer;
  v_streak          integer;
  v_badge           record;
BEGIN
  -- ── Fetch user stats ──
  SELECT
    p.post_count,
    p.thread_count,
    p.likes_received
  INTO v_post_count, v_thread_count, v_likes_received
  FROM profiles p
  WHERE p.id = p_user_id;

  IF NOT FOUND THEN
    RETURN;  -- user doesn't exist
  END IF;

  -- ── Calculate 7-day posting streak ──
  -- Count consecutive days with at least one post, starting from today going back
  WITH daily_posts AS (
    SELECT DISTINCT (created_at AT TIME ZONE 'UTC')::date AS post_date
    FROM posts
    WHERE author_id = p_user_id
      AND created_at >= (now() - interval '30 days')
  ),
  numbered AS (
    SELECT
      post_date,
      post_date - (ROW_NUMBER() OVER (ORDER BY post_date DESC))::int AS grp
    FROM daily_posts
  ),
  streaks AS (
    SELECT grp, COUNT(*) AS streak_len, MAX(post_date) AS streak_end
    FROM numbered
    GROUP BY grp
  )
  SELECT COALESCE(MAX(streak_len), 0)
  INTO v_streak
  FROM streaks
  WHERE streak_end >= CURRENT_DATE - 1;  -- streak must include today or yesterday

  -- ── Check each auto badge ──
  FOR v_badge IN
    SELECT b.id, b.name, b.icon, b.badge_type AS btype
    FROM badges b
    WHERE b.is_auto = true
      -- Skip badges this user already has
      AND NOT EXISTS (
        SELECT 1 FROM user_badges ub
        WHERE ub.user_id = p_user_id AND ub.badge_id = b.id
      )
    ORDER BY b.id
  LOOP
    -- Evaluate criteria by badge name
    IF (v_badge.name = 'First Post'        AND (v_post_count >= 1 OR v_thread_count >= 1))
    OR (v_badge.name = 'Conversationalist' AND v_post_count >= 50)
    OR (v_badge.name = 'Community Voice'   AND v_post_count >= 200)
    OR (v_badge.name = 'Helpful'           AND v_likes_received >= 25)
    OR (v_badge.name = 'Top Contributor'   AND v_likes_received >= 100)
    OR (v_badge.name = 'Hot Streak'        AND v_streak >= 7)
    THEN
      -- Grant the badge
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;

      -- Return this as a newly granted badge
      badge_id   := v_badge.id;
      badge_name := v_badge.name;
      badge_icon := v_badge.icon;
      badge_type := v_badge.btype;
      RETURN NEXT;
    END IF;
  END LOOP;

  RETURN;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 2. Trigger function: runs check_and_grant_badges for the
--    relevant user after INSERT on posts, threads, or likes.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_check_badges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Determine the user to check based on the source table
  IF TG_TABLE_NAME = 'posts' THEN
    target_user_id := NEW.author_id;
  ELSIF TG_TABLE_NAME = 'threads' THEN
    target_user_id := NEW.author_id;
  ELSIF TG_TABLE_NAME = 'likes' THEN
    -- For likes, check the *post author* (they received the like)
    SELECT author_id INTO target_user_id
    FROM posts WHERE id = NEW.post_id;
  ELSE
    RETURN NEW;
  END IF;

  IF target_user_id IS NOT NULL THEN
    PERFORM check_and_grant_badges(target_user_id);
  END IF;

  RETURN NEW;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 3. Attach triggers
-- ────────────────────────────────────────────────────────────

-- After a new post (reply)
CREATE TRIGGER on_post_check_badges
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_badges();

-- After a new thread
CREATE TRIGGER on_thread_check_badges
  AFTER INSERT ON threads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_badges();

-- After a new like (grant badge to the post author who received the like)
CREATE TRIGGER on_like_check_badges
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_check_badges();


-- ────────────────────────────────────────────────────────────
-- 4. Optional: pg_cron job to sweep ALL users (catch-up)
--    Run once per hour. Checks every user who has posted.
--    Requires pg_cron extension (enabled by default on Supabase).
-- ────────────────────────────────────────────────────────────

-- Enable pg_cron if not already enabled
-- CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Schedule a sweep every hour at minute :15
-- SELECT cron.schedule(
--   'check-badges-sweep',
--   '15 * * * *',
--   $$
--     SELECT check_and_grant_badges(id)
--     FROM profiles
--     WHERE post_count > 0 OR thread_count > 0 OR likes_received > 0;
--   $$
-- );

-- To remove the cron job:
-- SELECT cron.unschedule('check-badges-sweep');
