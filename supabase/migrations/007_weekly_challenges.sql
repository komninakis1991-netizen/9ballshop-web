-- ============================================================
-- Shot of the Week — weekly pool position challenges
--
-- Ball positions stored as JSONB array:
--   [{"n":"cue","x":25,"y":55}, {"n":9,"x":85,"y":12}, ...]
--   x/y are percentages (0–100) of the playing surface
--
-- Query current week:
--   SELECT * FROM weekly_challenges
--   WHERE year = extract(isoyear from now())
--     AND week_number = extract(week from now())
-- ============================================================


-- ── 1. Table ──

CREATE TABLE weekly_challenges (
  id              serial PRIMARY KEY,
  week_number     integer NOT NULL CHECK (week_number BETWEEN 1 AND 53),
  year            integer NOT NULL CHECK (year >= 2024),
  title           text NOT NULL,
  description     text NOT NULL DEFAULT '',
  ball_positions  jsonb NOT NULL DEFAULT '[]'::jsonb,
  difficulty      text NOT NULL DEFAULT 'medium'
                    CHECK (difficulty IN ('easy','medium','hard')),
  thread_id       uuid REFERENCES threads ON DELETE SET NULL,
  winner_user_id  uuid REFERENCES profiles ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (week_number, year)
);

CREATE INDEX idx_weekly_challenges_current
  ON weekly_challenges (year DESC, week_number DESC);


-- ── 2. Row Level Security ──

ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Weekly challenges: anyone can read"
  ON weekly_challenges FOR SELECT
  USING (true);

CREATE POLICY "Weekly challenges: admins can insert"
  ON weekly_challenges FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Weekly challenges: admins can update"
  ON weekly_challenges FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Weekly challenges: admins can delete"
  ON weekly_challenges FOR DELETE
  USING (is_admin());


-- ── 3. Seed — 4 sample challenges (weeks 9–12 of 2026) ──

INSERT INTO weekly_challenges
  (week_number, year, title, description, ball_positions, difficulty)
VALUES

-- Week 9 (Feb 23 – Mar 1): simple cut shot on the 9
(9, 2026,
 'The Corner Cut',
 'Last ball on the table. A thin cut on the 9-ball into the top corner pocket — simple in theory, but where exactly do you aim, and what happens to the cue ball after contact?',
 '[{"n":"cue","x":25,"y":55},{"n":9,"x":82,"y":14}]'::jsonb,
 'easy'),

-- Week 10 (Mar 2–8): snookered behind blockers, must kick
(10, 2026,
 'The Safety Escape',
 'Three balls left and your opponent left you snookered! The 8-ball blocks your direct path to the 7. Can you find a kick route off the rail — or is a safety the smarter play?',
 '[{"n":"cue","x":20,"y":68},{"n":7,"x":65,"y":25},{"n":8,"x":32,"y":48},{"n":9,"x":78,"y":72}]'::jsonb,
 'medium'),

-- Week 11 (Mar 9–15): bank the 9 cross-side
(11, 2026,
 'Cross-Side Bank',
 'The 9-ball is sitting near the top rail. Banking it cross-side into the bottom center pocket looks like the play — but how much speed do you use, and where does the cue ball end up?',
 '[{"n":"cue","x":15,"y":50},{"n":9,"x":60,"y":8}]'::jsonb,
 'medium'),

-- Week 12 (Mar 16–22): three-ball runout, position play
(12, 2026,
 'Shape on the Nine',
 'Three balls left: 7, 8, 9. You need to run out to win. The key is cue ball position from ball to ball — where do you leave the cue ball after the 7? And how do you get from the 8 to the 9?',
 '[{"n":"cue","x":68,"y":58},{"n":7,"x":28,"y":78},{"n":8,"x":50,"y":18},{"n":9,"x":85,"y":82}]'::jsonb,
 'hard');
