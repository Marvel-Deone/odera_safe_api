DO $$ BEGIN
  CREATE TYPE "ResidentAssociateCategory" AS ENUM ('STAFF', 'CO_RESIDENT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "NinVerificationStatus" AS ENUM ('NOT_SUBMITTED', 'VERIFIED', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ResidentAssociate" (
  "id" TEXT NOT NULL,
  "residentId" TEXT NOT NULL,
  "category" "ResidentAssociateCategory" NOT NULL DEFAULT 'CO_RESIDENT',
  "fullName" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'Co-resident',
  "idType" TEXT NOT NULL,
  "idNumber" TEXT NOT NULL,
  "faceCapture" TEXT,
  "workingDays" "Weekday"[],
  "entryTime" TEXT NOT NULL,
  "exitTime" TEXT NOT NULL,
  "ninVerificationStatus" "NinVerificationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
  "ninVerificationData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResidentAssociate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ResidentAssociate_residentId_idx" ON "ResidentAssociate"("residentId");
CREATE INDEX IF NOT EXISTS "ResidentAssociate_category_idx" ON "ResidentAssociate"("category");
CREATE INDEX IF NOT EXISTS "ResidentAssociate_ninVerificationStatus_idx" ON "ResidentAssociate"("ninVerificationStatus");

DO $$ BEGIN
  ALTER TABLE "ResidentAssociate" ADD CONSTRAINT "ResidentAssociate_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
