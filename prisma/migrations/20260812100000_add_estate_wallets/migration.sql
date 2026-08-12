ALTER TABLE "Wallet"
  ALTER COLUMN "residentId" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "estateId" TEXT,
  ADD COLUMN IF NOT EXISTS "pinHash" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Wallet_estateId_key" ON "Wallet"("estateId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Wallet_estateId_fkey'
      AND table_name = 'Wallet'
  ) THEN
    ALTER TABLE "Wallet"
      ADD CONSTRAINT "Wallet_estateId_fkey"
      FOREIGN KEY ("estateId") REFERENCES "Estate"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

INSERT INTO "Wallet" ("id", "estateId", "balance", "createdAt", "updatedAt")
SELECT md5(random()::text || clock_timestamp()::text), "Estate"."id", 0, NOW(), NOW()
FROM "Estate"
LEFT JOIN "Wallet" ON "Wallet"."estateId" = "Estate"."id"
WHERE "Wallet"."id" IS NULL;
