-- ============================================================
-- Enable Supabase Realtime on the posts table
-- Required for: supabase.channel().on('postgres_changes', ...)
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE posts;
