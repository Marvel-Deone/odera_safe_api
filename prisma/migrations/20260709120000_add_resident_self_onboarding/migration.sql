DO $$ BEGIN
  CREATE TYPE "ResidentSelfOnboardingStatus" AS ENUM ('PENDING', 'ACTIVATED', 'EXPIRED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ResidentSelfOnboarding" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "houseNumber" TEXT NOT NULL,
  "residentAddress" TEXT NOT NULL,
  "whatsappPhone" TEXT NOT NULL,
  "activationCodeHash" TEXT NOT NULL,
  "activationCodeExpiresAt" TIMESTAMP(3) NOT NULL,
  "activatedAt" TIMESTAMP(3),
  "status" "ResidentSelfOnboardingStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResidentSelfOnboarding_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ResidentSelfOnboarding_whatsappPhone_key" ON "ResidentSelfOnboarding"("whatsappPhone");
CREATE INDEX IF NOT EXISTS "ResidentSelfOnboarding_estateId_status_idx" ON "ResidentSelfOnboarding"("estateId", "status");
CREATE INDEX IF NOT EXISTS "ResidentSelfOnboarding_whatsappPhone_idx" ON "ResidentSelfOnboarding"("whatsappPhone");

DO $$ BEGIN
  ALTER TABLE "ResidentSelfOnboarding" ADD CONSTRAINT "ResidentSelfOnboarding_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
