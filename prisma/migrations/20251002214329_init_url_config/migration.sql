-- CreateTable
CREATE TABLE "UrlConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "host" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pageInternal" TEXT NOT NULL,
    "ctas" JSONB,
    "analyticsSnippet" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "UrlConfig_host_path_idx" ON "UrlConfig"("host", "path");

-- CreateIndex
CREATE UNIQUE INDEX "UrlConfig_host_path_key" ON "UrlConfig"("host", "path");
