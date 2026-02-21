CREATE TABLE IF NOT EXISTS ChatMessage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id)
);
CREATE INDEX IF NOT EXISTS idx_chatmessage_createdat ON ChatMessage(createdAt);
CREATE INDEX IF NOT EXISTS idx_chatmessage_userid ON ChatMessage(userId);
