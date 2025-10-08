/*
  Warnings:

  - You are about to drop the column `allowedLanguages` on the `UrlConfig` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UrlConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pageInternal" TEXT NOT NULL,
    "ctas" JSONB,
    "analyticsSnippet" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UrlConfig" ("analyticsSnippet", "createdAt", "ctas", "host", "id", "pageInternal", "path", "updatedAt") SELECT "analyticsSnippet", "createdAt", "ctas", "host", "id", "pageInternal", "path", "updatedAt" FROM "UrlConfig";
DROP TABLE "UrlConfig";
ALTER TABLE "new_UrlConfig" RENAME TO "UrlConfig";
CREATE INDEX "UrlConfig_host_path_idx" ON "UrlConfig"("host", "path");
CREATE UNIQUE INDEX "UrlConfig_host_path_key" ON "UrlConfig"("host", "path");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
