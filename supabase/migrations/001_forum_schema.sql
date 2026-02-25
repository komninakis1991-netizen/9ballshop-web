-- ============================================================
-- 9BALLSHOP COMMUNITY FORUM — Complete Database Schema
-- Run this in the Supabase SQL Editor as a single migration.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. ENUMS
-- ────────────────────────────────────────────────────────────

CREATE TYPE playing_level AS ENUM (
  'beginner', 'intermediate', 'advanced', 'semi_pro', 'professional'
);

CREATE TYPE badge_type AS ENUM ('gold', 'silver', 'bronze');

CREATE TYPE event_type AS ENUM ('major', 'ranking', 'open', 'local');

CREATE TYPE atmosphere AS ENUM ('casual', 'competitive', 'mixed');


-- ────────────────────────────────────────────────────────────
-- 1. PROFILES  (extends auth.users)
-- ────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username        text UNIQUE NOT NULL,
  avatar_url      text DEFAULT '',
  bio             text DEFAULT '',
  playing_level   playing_level DEFAULT 'beginner',
  fargo_rating    integer,
  cue_setup       text,
  favorite_chalk  text,
  home_club       text,
  country         text DEFAULT '',
  country_flag    text DEFAULT '',
  post_count      integer DEFAULT 0,
  thread_count    integer DEFAULT 0,
  likes_received  integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

COMMENT ON TABLE profiles IS 'Public profile extending Supabase auth.users';


-- ────────────────────────────────────────────────────────────
-- 2. CATEGORIES
-- ────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id              serial PRIMARY KEY,
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text DEFAULT '',
  icon            text DEFAULT '',
  color           text DEFAULT '#888888',
  sort_order      integer DEFAULT 0,
  topic_template  text,
  allow_solved    boolean DEFAULT false,
  created_at      timestamptz DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
-- 3. THREADS
-- ────────────────────────────────────────────────────────────

CREATE TABLE threads (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  body              text NOT NULL,
  author_id         uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  category_id       integer NOT NULL REFERENCES categories ON DELETE CASCADE,
  is_pinned         boolean DEFAULT false,
  is_locked         boolean DEFAULT false,
  is_solved         boolean DEFAULT false,
  solved_post_id    uuid,                       -- FK added after posts table exists
  view_count        integer DEFAULT 0,
  reply_count       integer DEFAULT 0,
  last_activity_at  timestamptz DEFAULT now(),
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
-- 4. POSTS  (replies to threads)
-- ────────────────────────────────────────────────────────────

CREATE TABLE posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body        text NOT NULL,
  author_id   uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  thread_id   uuid NOT NULL REFERENCES threads ON DELETE CASCADE,
  is_solution boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Now we can add the deferred FK from threads → posts
ALTER TABLE threads
  ADD CONSTRAINT fk_threads_solved_post
  FOREIGN KEY (solved_post_id) REFERENCES posts (id)
  ON DELETE SET NULL;


-- ────────────────────────────────────────────────────────────
-- 5. LIKES
-- ────────────────────────────────────────────────────────────

CREATE TABLE likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  post_id    uuid NOT NULL REFERENCES posts ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, post_id)
);


-- ────────────────────────────────────────────────────────────
-- 6. BADGES
-- ────────────────────────────────────────────────────────────

CREATE TABLE badges (
  id            serial PRIMARY KEY,
  name          text NOT NULL,
  description   text DEFAULT '',
  icon          text DEFAULT '',
  badge_type    badge_type NOT NULL,
  is_auto       boolean DEFAULT false,
  criteria_sql  text
);


-- ────────────────────────────────────────────────────────────
-- 7. USER_BADGES
-- ────────────────────────────────────────────────────────────

CREATE TABLE user_badges (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  badge_id   integer NOT NULL REFERENCES badges ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  UNIQUE (user_id, badge_id)
);


-- ────────────────────────────────────────────────────────────
-- 8. EVENTS
-- ────────────────────────────────────────────────────────────

CREATE TABLE events (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  date_start           date NOT NULL,
  date_end             date,
  location             text DEFAULT '',
  country_flag         text DEFAULT '',
  organizer            text DEFAULT '',
  event_type           event_type DEFAULT 'open',
  external_url         text,
  discussion_thread_id uuid REFERENCES threads ON DELETE SET NULL,
  created_at           timestamptz DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
-- 9. CLUBS
-- ────────────────────────────────────────────────────────────

CREATE TABLE clubs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  city              text DEFAULT '',
  country           text DEFAULT '',
  country_flag      text DEFAULT '',
  address           text DEFAULT '',
  table_count       integer DEFAULT 0,
  table_brand       text,
  table_size        text,
  hours             text,
  atmosphere        atmosphere DEFAULT 'mixed',
  nine_ball_friendly boolean DEFAULT true,
  avg_rating        numeric DEFAULT 0,
  review_count      integer DEFAULT 0,
  submitted_by      uuid REFERENCES profiles ON DELETE SET NULL,
  approved          boolean DEFAULT false,
  created_at        timestamptz DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
-- 10. CLUB_REVIEWS
-- ────────────────────────────────────────────────────────────

CREATE TABLE club_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id     uuid NOT NULL REFERENCES clubs ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  rating      integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text DEFAULT '',
  created_at  timestamptz DEFAULT now()
);


-- ────────────────────────────────────────────────────────────
-- 11. NEWSLETTER_SUBSCRIBERS
-- ────────────────────────────────────────────────────────────

CREATE TABLE newsletter_subscribers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_threads_category_id     ON threads (category_id);
CREATE INDEX idx_threads_last_activity   ON threads (last_activity_at DESC);
CREATE INDEX idx_threads_author_id       ON threads (author_id);
CREATE INDEX idx_posts_thread_id         ON posts (thread_id);
CREATE INDEX idx_posts_created_at        ON posts (created_at DESC);
CREATE INDEX idx_posts_author_id         ON posts (author_id);
CREATE INDEX idx_likes_post_id           ON likes (post_id);
CREATE INDEX idx_likes_user_id           ON likes (user_id);
CREATE INDEX idx_events_date_start       ON events (date_start);
CREATE INDEX idx_clubs_approved          ON clubs (approved);
CREATE INDEX idx_club_reviews_club_id    ON club_reviews (club_id);
CREATE INDEX idx_user_badges_user_id     ON user_badges (user_id);


-- ============================================================
-- HELPER: is_admin()
-- Checks if the current JWT has the 'admin' app_metadata role.
-- Set via: supabase.auth.admin.updateUserById(uid, { app_metadata: { role: 'admin' } })
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- ── profiles ────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: anyone can read"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Profiles: users can insert own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: users can update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── categories ──────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories: anyone can read"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Categories: admins can insert"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Categories: admins can update"
  ON categories FOR UPDATE
  USING (is_admin());

CREATE POLICY "Categories: admins can delete"
  ON categories FOR DELETE
  USING (is_admin());

-- ── threads ─────────────────────────────────────────────────

ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Threads: anyone can read"
  ON threads FOR SELECT
  USING (true);

CREATE POLICY "Threads: authenticated can insert"
  ON threads FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Threads: author can update"
  ON threads FOR UPDATE
  USING (auth.uid() = author_id OR is_admin());

CREATE POLICY "Threads: author can delete"
  ON threads FOR DELETE
  USING (auth.uid() = author_id OR is_admin());

-- ── posts ───────────────────────────────────────────────────

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts: anyone can read"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Posts: authenticated can insert"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Posts: author can update"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id OR is_admin());

CREATE POLICY "Posts: author can delete"
  ON posts FOR DELETE
  USING (auth.uid() = author_id OR is_admin());

-- ── likes ───────────────────────────────────────────────────

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes: anyone can read"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Likes: authenticated can insert"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Likes: user can delete own"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- ── badges ──────────────────────────────────────────────────

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges: anyone can read"
  ON badges FOR SELECT
  USING (true);

CREATE POLICY "Badges: admins can manage"
  ON badges FOR ALL
  USING (is_admin());

-- ── user_badges ─────────────────────────────────────────────

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User badges: anyone can read"
  ON user_badges FOR SELECT
  USING (true);

CREATE POLICY "User badges: admins can manage"
  ON user_badges FOR ALL
  USING (is_admin());

-- ── events ──────────────────────────────────────────────────

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events: anyone can read"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Events: admins can manage"
  ON events FOR ALL
  USING (is_admin());

-- ── clubs ───────────────────────────────────────────────────

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clubs: anyone can read approved"
  ON clubs FOR SELECT
  USING (approved = true OR auth.uid() = submitted_by OR is_admin());

CREATE POLICY "Clubs: authenticated can submit"
  ON clubs FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Clubs: admins can update (approve)"
  ON clubs FOR UPDATE
  USING (is_admin());

CREATE POLICY "Clubs: admins can delete"
  ON clubs FOR DELETE
  USING (is_admin());

-- ── club_reviews ────────────────────────────────────────────

ALTER TABLE club_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Club reviews: anyone can read"
  ON club_reviews FOR SELECT
  USING (true);

CREATE POLICY "Club reviews: authenticated can insert"
  ON club_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Club reviews: author can update"
  ON club_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Club reviews: author or admin can delete"
  ON club_reviews FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ── newsletter_subscribers ──────────────────────────────────

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Newsletter: admins can read"
  ON newsletter_subscribers FOR SELECT
  USING (is_admin());

CREATE POLICY "Newsletter: anyone can subscribe"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Newsletter: admins can delete"
  ON newsletter_subscribers FOR DELETE
  USING (is_admin());


-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- ── 1. Auto-create profile on auth.users insert ─────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ── 2. Increment profiles.post_count on new post ────────────

CREATE OR REPLACE FUNCTION increment_post_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET post_count = post_count + 1
  WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_created_update_profile
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_count();


-- ── 3. Decrement profiles.post_count on post delete ─────────

CREATE OR REPLACE FUNCTION decrement_post_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET post_count = GREATEST(post_count - 1, 0)
  WHERE id = OLD.author_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_post_deleted_update_profile
  AFTER DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION decrement_post_count();


-- ── 4. Increment profiles.thread_count on new thread ────────

CREATE OR REPLACE FUNCTION increment_thread_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET thread_count = thread_count + 1
  WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_thread_created_update_profile
  AFTER INSERT ON threads
  FOR EACH ROW
  EXECUTE FUNCTION increment_thread_count();


-- ── 5. Increment threads.reply_count + update last_activity_at on new post ──

CREATE OR REPLACE FUNCTION on_post_created_update_thread()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE threads
  SET reply_count      = reply_count + 1,
      last_activity_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_created_update_thread
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION on_post_created_update_thread();


-- ── 6. Decrement threads.reply_count on post delete ─────────

CREATE OR REPLACE FUNCTION on_post_deleted_update_thread()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE threads
  SET reply_count = GREATEST(reply_count - 1, 0)
  WHERE id = OLD.thread_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_post_deleted_update_thread
  AFTER DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION on_post_deleted_update_thread();


-- ── 7. Update likes_received + post likes_count on like insert ──

CREATE OR REPLACE FUNCTION on_like_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_author uuid;
BEGIN
  -- increment the post's like counter
  UPDATE posts
  SET likes_count = likes_count + 1
  WHERE id = NEW.post_id
  RETURNING author_id INTO post_author;

  -- increment the post author's total likes_received
  IF post_author IS NOT NULL THEN
    UPDATE profiles
    SET likes_received = likes_received + 1
    WHERE id = post_author;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION on_like_created();


-- ── 8. Reverse likes_received + post likes_count on like delete ──

CREATE OR REPLACE FUNCTION on_like_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_author uuid;
BEGIN
  UPDATE posts
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = OLD.post_id
  RETURNING author_id INTO post_author;

  IF post_author IS NOT NULL THEN
    UPDATE profiles
    SET likes_received = GREATEST(likes_received - 1, 0)
    WHERE id = post_author;
  END IF;

  RETURN OLD;
END;
$$;

CREATE TRIGGER on_like_deleted
  AFTER DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION on_like_deleted();


-- ── 9. Auto-set updated_at on threads ───────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER threads_set_updated_at
  BEFORE UPDATE ON threads
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();


-- ── 10. Update club avg_rating on review insert/delete ──────

CREATE OR REPLACE FUNCTION update_club_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_club_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_club_id := OLD.club_id;
  ELSE
    target_club_id := NEW.club_id;
  END IF;

  UPDATE clubs
  SET avg_rating    = COALESCE((SELECT AVG(rating)::numeric FROM club_reviews WHERE club_id = target_club_id), 0),
      review_count  = (SELECT COUNT(*) FROM club_reviews WHERE club_id = target_club_id)
  WHERE id = target_club_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

CREATE TRIGGER on_club_review_change
  AFTER INSERT OR UPDATE OR DELETE ON club_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_club_rating();


-- ============================================================
-- SEED DATA: CATEGORIES
-- ============================================================

INSERT INTO categories (name, slug, description, icon, color, sort_order, allow_solved) VALUES
  ('General 9-Ball Discussion', 'general',         'Talk about anything 9-ball related — rules, strategies, stories from the table.',     '🎱', '#F5C518', 1,  false),
  ('Tips & Technique',          'tips-technique',   'Share and ask for tips on shot-making, position play, break technique, and more.',    '🎯', '#1B7A3D', 2,  true),
  ('Tournament Talk',           'tournament-talk',  'Discuss upcoming and past tournaments, results, brackets, and predictions.',          '🏆', '#2E75B6', 3,  false),
  ('Video Analysis',            'video-analysis',   'Post match videos for feedback — break down shots, patterns, and decision-making.',   '📹', '#E74C3C', 4,  false),
  ('Cue & Equipment Talk',      'equipment',        'Reviews, comparisons, and questions about cues, shafts, tips, chalk, and gear.',      '🔧', '#95A5A6', 5,  false),
  ('Greek Pool Scene',          'greek-scene',      'Discuss tournaments, clubs, players, and news from the Greek billiards community.',   '🇬🇷', '#0D5EAF', 6,  false),
  ('International Scene',       'international',    'News and discussion from the global 9-ball and pool community.',                      '🌍', '#27AE60', 7,  false),
  ('Beginners Welcome',         'beginners',        'New to 9-ball? Ask anything — no question is too basic. We all started somewhere.',   '👶', '#F39C12', 8,  true),
  ('Pro Player Watch',          'pro-watch',        'Follow and discuss professional players, rankings, career stats, and storylines.',    '⭐', '#8E44AD', 9,  false),
  ('Player Lounge',             'lounge',           'Off-topic chat, introductions, memes, and everything not covered elsewhere.',         '💬', '#7F8C8D', 10, false),
  ('Club & Hall Directory',     'club-directory',   'Share and discover pool halls, clubs, and venues around the world.',                  '🏢', '#16A085', 11, false),
  ('Marketplace',               'marketplace',      'Buy, sell, or trade cues, equipment, and billiards-related items.',                   '📋', '#D35400', 12, false);


-- ============================================================
-- SEED DATA: BADGES
-- ============================================================

INSERT INTO badges (name, description, icon, badge_type, is_auto, criteria_sql) VALUES
  ('First Post',         'Created your first post',                       '🎱', 'bronze', true,  'post_count >= 1'),
  ('Conversationalist',  'Reached 50 posts',                              '💬', 'silver', true,  'post_count >= 50'),
  ('Community Voice',    'Reached 200 posts — a true community pillar',   '🗣️', 'gold',   true,  'post_count >= 200'),
  ('Helpful',            'Received 25 likes from the community',          '👍', 'silver', true,  'likes_received >= 25'),
  ('Top Contributor',    'Received 100 likes — your advice is valued',    '🏅', 'gold',   true,  'likes_received >= 100'),
  ('Hot Streak',         '7-day posting streak',                          '🔥', 'gold',   true,  NULL),
  ('Instructor',         'Recognized billiards coach or instructor',      '🎓', 'gold',   false, NULL),
  ('Tournament Player',  'Active competitive tournament player',          '🏆', 'gold',   false, NULL),
  ('Cue Technician',     'Recognized expert in cue repair & maintenance', '🔧', 'silver', false, NULL),
  ('Greek Player',       'Member of the Greek billiards community',       '🇬🇷', 'bronze', false, NULL);


-- ============================================================
-- DONE
-- ============================================================
-- Next steps:
--   1. Paste and run this in Supabase SQL Editor.
--   2. Set admin role on your user:
--        UPDATE auth.users
--        SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--        WHERE email = 'your@email.com';
--   3. Connect your frontend with supabase-js.
-- ============================================================
