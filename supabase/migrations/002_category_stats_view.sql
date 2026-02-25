-- ============================================================
-- Forum Category Stats — RPC function
-- Returns all categories with thread/post counts and latest thread info.
-- Called from the frontend via: supabase.rpc('get_categories_with_stats')
-- ============================================================

CREATE OR REPLACE FUNCTION get_categories_with_stats()
RETURNS TABLE (
  id              integer,
  name            text,
  slug            text,
  description     text,
  icon            text,
  color           text,
  sort_order      integer,
  allow_solved    boolean,
  thread_count    bigint,
  post_count      bigint,
  latest_thread_id         uuid,
  latest_thread_title      text,
  latest_thread_author     text,
  latest_thread_created_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.icon,
    c.color,
    c.sort_order,
    c.allow_solved,
    -- thread count
    COUNT(DISTINCT t.id)                          AS thread_count,
    -- post count = number of replies across all threads in this category
    COALESCE(SUM(t.reply_count), 0)               AS post_count,
    -- latest thread info (by last_activity_at)
    lt.id                                         AS latest_thread_id,
    lt.title                                      AS latest_thread_title,
    lp.username                                   AS latest_thread_author,
    lt.last_activity_at                           AS latest_thread_created_at
  FROM categories c
  LEFT JOIN threads t ON t.category_id = c.id
  LEFT JOIN LATERAL (
    SELECT t2.id, t2.title, t2.author_id, t2.last_activity_at
    FROM threads t2
    WHERE t2.category_id = c.id
    ORDER BY t2.last_activity_at DESC
    LIMIT 1
  ) lt ON true
  LEFT JOIN profiles lp ON lp.id = lt.author_id
  GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.color,
           c.sort_order, c.allow_solved,
           lt.id, lt.title, lp.username, lt.last_activity_at
  ORDER BY c.sort_order;
$$;


-- ============================================================
-- Community Stats — RPC function
-- Returns aggregate stats for the hero banner.
-- Called via: supabase.rpc('get_community_stats')
-- ============================================================

CREATE OR REPLACE FUNCTION get_community_stats()
RETURNS TABLE (
  total_members  bigint,
  total_threads  bigint,
  total_posts    bigint,
  total_countries bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    (SELECT COUNT(*)                   FROM profiles)                AS total_members,
    (SELECT COUNT(*)                   FROM threads)                 AS total_threads,
    (SELECT COUNT(*)                   FROM posts)                   AS total_posts,
    (SELECT COUNT(DISTINCT country)    FROM profiles WHERE country <> '') AS total_countries;
$$;
