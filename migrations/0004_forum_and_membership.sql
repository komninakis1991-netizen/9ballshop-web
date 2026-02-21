-- Add membership fields to User
ALTER TABLE User ADD COLUMN membershipStatus TEXT NOT NULL DEFAULT 'none';
ALTER TABLE User ADD COLUMN membershipExpiresAt DATETIME;
ALTER TABLE User ADD COLUMN stripeSubscriptionId TEXT NOT NULL DEFAULT '';

-- Create ForumPost table
CREATE TABLE IF NOT EXISTS ForumPost (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  categorySlug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE INDEX IF NOT EXISTS idx_forumpost_categoryslug ON ForumPost(categorySlug);
CREATE INDEX IF NOT EXISTS idx_forumpost_userid ON ForumPost(userId);

-- Create ForumComment table
CREATE TABLE IF NOT EXISTS ForumComment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  postId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES ForumPost(id),
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE INDEX IF NOT EXISTS idx_forumcomment_postid ON ForumComment(postId);
CREATE INDEX IF NOT EXISTS idx_forumcomment_userid ON ForumComment(userId);
