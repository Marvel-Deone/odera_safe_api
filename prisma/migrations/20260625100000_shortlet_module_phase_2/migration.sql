ALTER TYPE "WalletTransactionType" ADD VALUE IF NOT EXISTS 'SHORTLET_REGISTRATION';
ALTER TYPE "ShortletStatus" ADD VALUE IF NOT EXISTS 'INACTIVE';

CREATE TABLE IF NOT EXISTS "ShortletSettings" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "annualRegistrationFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShortletSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ShortletSettings_estateId_key" ON "ShortletSettings"("estateId");

DO $$ BEGIN
  ALTER TABLE "ShortletSettings" ADD CONSTRAINT "ShortletSettings_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "ShortletProperty" ADD COLUMN IF NOT EXISTS "annualFeeAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "ShortletProperty" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);
ALTER TABLE "ShortletProperty" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "ShortletProperty" ADD COLUMN IF NOT EXISTS "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "ShortletProperty" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';

UPDATE "ShortletProperty"
SET "expiresAt" = COALESCE("expiresAt", "annualFeeExpiresAt")
WHERE "annualFeeExpiresAt" IS NOT NULL;

UPDATE "ShortletProperty"
SET "paymentStatus" = 'PAID',
    "paidAt" = COALESCE("paidAt", "createdAt")
WHERE "annualFeePaid" = true;

CREATE INDEX IF NOT EXISTS "ShortletProperty_residentId_status_idx" ON "ShortletProperty"("residentId", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "ShortletBooking_smsCode_key" ON "ShortletBooking"("smsCode");
ALTER TABLE "ShortletBooking" ADD COLUMN IF NOT EXISTS "qrPayload" TEXT;
ALTER TABLE "ShortletBooking" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS "ShortletBooking_qrPayload_key" ON "ShortletBooking"("qrPayload");
CREATE INDEX IF NOT EXISTS "ShortletBooking_propertyId_status_idx" ON "ShortletBooking"("propertyId", "status");
CREATE INDEX IF NOT EXISTS "ShortletBooking_smsCode_idx" ON "ShortletBooking"("smsCode");
CREATE INDEX IF NOT EXISTS "ShortletBooking_qrPayload_idx" ON "ShortletBooking"("qrPayload");

ALTER TABLE "ShortletAccessLog" ADD COLUMN IF NOT EXISTS "gateName" TEXT;
ALTER TABLE "ShortletAccessLog" ADD COLUMN IF NOT EXISTS "verifiedById" TEXT;
ALTER TABLE "ShortletAccessLog" ADD COLUMN IF NOT EXISTS "deniedReason" TEXT;
ALTER TABLE "ShortletAccessLog" ADD COLUMN IF NOT EXISTS "allowed" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ShortletAccessLog" ALTER COLUMN "bookingId" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "ShortletAccessLog_bookingId_createdAt_idx" ON "ShortletAccessLog"("bookingId", "createdAt");
CREATE INDEX IF NOT EXISTS "ShortletAccessLog_verifiedById_idx" ON "ShortletAccessLog"("verifiedById");

DO $$ BEGIN
  ALTER TABLE "ShortletAccessLog" ADD CONSTRAINT "ShortletAccessLog_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
