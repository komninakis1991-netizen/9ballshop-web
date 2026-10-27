CREATE TABLE IF NOT EXISTS "CoursePurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "customerEmail" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "CoursePurchase_stripeSessionId_key" ON "CoursePurchase"("stripeSessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "CoursePurchase_userId_courseSlug_key" ON "CoursePurchase"("userId", "courseSlug");
