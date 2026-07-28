DO $$ BEGIN
  CREATE TYPE "BusinessPaymentFrequency" AS ENUM ('MONTHLY', 'ANNUAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessHubStatus" AS ENUM ('ENABLED', 'DISABLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessCategory" AS ENUM ('CHURCH', 'SCHOOL', 'RELIGIOUS_ORGANIZATION', 'OFFICE', 'SHOP', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessRegistrationStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'ACTIVE', 'EXPIRED', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessPaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED', 'EXPIRED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE "WalletTransactionType" ADD VALUE IF NOT EXISTS 'BUSINESS_REGISTRATION';

CREATE TABLE IF NOT EXISTS "BusinessHubSettings" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "registrationFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "paymentFrequency" "BusinessPaymentFrequency" NOT NULL DEFAULT 'ANNUAL',
  "maxVehiclesAllowed" INTEGER NOT NULL DEFAULT 1,
  "status" "BusinessHubStatus" NOT NULL DEFAULT 'DISABLED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessHubSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessRegistration" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "residentId" TEXT NOT NULL,
  "category" "BusinessCategory" NOT NULL,
  "otherCategory" TEXT,
  "validDays" "Weekday"[],
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "maxVehiclesAllowed" INTEGER NOT NULL,
  "registrationFee" DECIMAL(65,30) NOT NULL,
  "paymentFrequency" "BusinessPaymentFrequency" NOT NULL,
  "registrationStatus" "BusinessRegistrationStatus" NOT NULL DEFAULT 'DRAFT',
  "paymentStatus" "BusinessPaymentStatus" NOT NULL DEFAULT 'UNPAID',
  "paidAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "suspendedAt" TIMESTAMP(3),
  "suspensionReason" TEXT,
  "passcode" TEXT NOT NULL,
  "qrPayload" TEXT NOT NULL,
  "qrCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessRegistration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessPayment" (
  "id" TEXT NOT NULL,
  "registrationId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "status" "BusinessPaymentStatus" NOT NULL,
  "reference" TEXT NOT NULL,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BusinessPayment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessAccessLog" (
  "id" TEXT NOT NULL,
  "registrationId" TEXT,
  "passcode" TEXT,
  "qrPayload" TEXT,
  "gateName" TEXT NOT NULL,
  "vehiclePlate" TEXT,
  "verifiedById" TEXT,
  "allowed" BOOLEAN NOT NULL,
  "deniedReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BusinessAccessLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BusinessHubSettings_estateId_key" ON "BusinessHubSettings"("estateId");
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessRegistration_passcode_key" ON "BusinessRegistration"("passcode");
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessRegistration_qrPayload_key" ON "BusinessRegistration"("qrPayload");
CREATE INDEX IF NOT EXISTS "BusinessRegistration_estateId_registrationStatus_idx" ON "BusinessRegistration"("estateId", "registrationStatus");
CREATE INDEX IF NOT EXISTS "BusinessRegistration_residentId_idx" ON "BusinessRegistration"("residentId");
CREATE INDEX IF NOT EXISTS "BusinessRegistration_paymentStatus_idx" ON "BusinessRegistration"("paymentStatus");
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessPayment_reference_key" ON "BusinessPayment"("reference");
CREATE INDEX IF NOT EXISTS "BusinessPayment_registrationId_idx" ON "BusinessPayment"("registrationId");
CREATE INDEX IF NOT EXISTS "BusinessPayment_status_idx" ON "BusinessPayment"("status");
CREATE INDEX IF NOT EXISTS "BusinessAccessLog_registrationId_idx" ON "BusinessAccessLog"("registrationId");
CREATE INDEX IF NOT EXISTS "BusinessAccessLog_verifiedById_idx" ON "BusinessAccessLog"("verifiedById");
CREATE INDEX IF NOT EXISTS "BusinessAccessLog_createdAt_idx" ON "BusinessAccessLog"("createdAt");

DO $$ BEGIN
  ALTER TABLE "BusinessHubSettings" ADD CONSTRAINT "BusinessHubSettings_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "BusinessRegistration" ADD CONSTRAINT "BusinessRegistration_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "BusinessRegistration" ADD CONSTRAINT "BusinessRegistration_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "BusinessPayment" ADD CONSTRAINT "BusinessPayment_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "BusinessRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "BusinessAccessLog" ADD CONSTRAINT "BusinessAccessLog_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "BusinessRegistration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "BusinessAccessLog" ADD CONSTRAINT "BusinessAccessLog_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
