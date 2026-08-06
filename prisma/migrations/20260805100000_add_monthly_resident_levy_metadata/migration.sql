ALTER TABLE "Levy"
  ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'CUSTOM',
  ADD COLUMN IF NOT EXISTS "period" TEXT;

ALTER TABLE "LevyAssignment"
  ADD COLUMN IF NOT EXISTS "headCount" INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS "Levy_estateId_category_period_key" ON "Levy"("estateId", "category", "period");
