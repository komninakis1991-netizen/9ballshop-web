-- ============================================================
-- Increment thread view count — RPC function
-- Called via: supabase.rpc('increment_view_count', { thread_id: '...' })
-- Uses a single atomic UPDATE to avoid race conditions.
-- ============================================================

CREATE OR REPLACE FUNCTION increment_view_count(p_thread_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE threads
  SET view_count = view_count + 1
  WHERE id = p_thread_id;
END;
$$;
