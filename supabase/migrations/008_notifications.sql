-- ============================================================
-- NOTIFICATIONS SYSTEM — 9BallShop Community
--
-- Table, enum, indexes, RLS, triggers (reply, like, badge),
-- and Supabase Realtime publication.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 0. ENUM
-- ────────────────────────────────────────────────────────────

CREATE TYPE notification_type AS ENUM ('reply', 'like', 'badge', 'mention');


-- ────────────────────────────────────────────────────────────
-- 1. TABLE
-- ────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  type        notification_type NOT NULL,
  message     text NOT NULL,
  link        text DEFAULT '',
  is_read     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

COMMENT ON TABLE notifications IS 'In-app notifications for replies, likes, badges, and mentions.';


-- ────────────────────────────────────────────────────────────
-- 2. INDEXES
-- ────────────────────────────────────────────────────────────

CREATE INDEX idx_notifications_user_unread
  ON notifications (user_id, is_read, created_at DESC)
  WHERE is_read = false;

CREATE INDEX idx_notifications_user_created
  ON notifications (user_id, created_at DESC);


-- ────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "Notifications: users can read own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update (mark read) their own notifications
CREATE POLICY "Notifications: users can update own"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Notifications: users can delete own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Triggers use SECURITY DEFINER which bypasses RLS entirely.
-- This policy allows only admins to insert manually (e.g. via dashboard).
-- Normal users cannot insert notifications directly.
CREATE POLICY "Notifications: admins can insert"
  ON notifications FOR INSERT
  WITH CHECK (is_admin());


-- ────────────────────────────────────────────────────────────
-- 4. TRIGGER: Reply notification
--    Fires when a new post is created.
--    Notifies the thread author (if not self-replying).
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_on_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_thread_author_id uuid;
  v_thread_title     text;
  v_replier_username text;
BEGIN
  -- Get thread info
  SELECT author_id, title
  INTO v_thread_author_id, v_thread_title
  FROM threads
  WHERE id = NEW.thread_id;

  -- Don't notify yourself
  IF v_thread_author_id IS NULL OR v_thread_author_id = NEW.author_id THEN
    RETURN NEW;
  END IF;

  -- Get replier's username
  SELECT username INTO v_replier_username
  FROM profiles
  WHERE id = NEW.author_id;

  INSERT INTO notifications (user_id, type, message, link)
  VALUES (
    v_thread_author_id,
    'reply',
    '💬 ' || COALESCE(v_replier_username, 'Someone') || ' replied to your thread: ' || COALESCE(v_thread_title, 'Untitled'),
    'thread.html?id=' || NEW.thread_id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_notify_reply
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_reply();


-- ────────────────────────────────────────────────────────────
-- 5. TRIGGER: Like notification
--    Fires when someone likes a post.
--    Notifies the post author (if not self-liking).
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_on_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_author_id  uuid;
  v_thread_id       uuid;
  v_thread_title    text;
  v_liker_username  text;
BEGIN
  -- Get post info
  SELECT p.author_id, p.thread_id, t.title
  INTO v_post_author_id, v_thread_id, v_thread_title
  FROM posts p
  JOIN threads t ON t.id = p.thread_id
  WHERE p.id = NEW.post_id;

  -- Don't notify yourself
  IF v_post_author_id IS NULL OR v_post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get liker's username
  SELECT username INTO v_liker_username
  FROM profiles
  WHERE id = NEW.user_id;

  INSERT INTO notifications (user_id, type, message, link)
  VALUES (
    v_post_author_id,
    'like',
    '👍 ' || COALESCE(v_liker_username, 'Someone') || ' liked your post in: ' || COALESCE(v_thread_title, 'Untitled'),
    'thread.html?id=' || v_thread_id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_like_notify
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_like();


-- ────────────────────────────────────────────────────────────
-- 6. TRIGGER: Badge notification
--    Fires when a badge is granted to a user.
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_on_badge()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_badge_name text;
  v_badge_icon text;
BEGIN
  SELECT name, icon INTO v_badge_name, v_badge_icon
  FROM badges
  WHERE id = NEW.badge_id;

  INSERT INTO notifications (user_id, type, message, link)
  VALUES (
    NEW.user_id,
    'badge',
    '🏆 You earned the ' || COALESCE(v_badge_name, 'Unknown') || ' badge!',
    'profile.html?u=' || (SELECT username FROM profiles WHERE id = NEW.user_id)
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_badge_notify
  AFTER INSERT ON user_badges
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_badge();


-- ────────────────────────────────────────────────────────────
-- 7. Enable Supabase Realtime on notifications
-- ────────────────────────────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;


-- ============================================================
-- DONE
-- ============================================================
