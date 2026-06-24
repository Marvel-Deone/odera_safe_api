DO $$ BEGIN
  CREATE TYPE "VehicleStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'PAYMENT_FAILED', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE "VehicleStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_FAILED';

DO $$ BEGIN
  CREATE TYPE "AccessDirection" AS ENUM ('ENTRY', 'EXIT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE "WalletTransactionType" ADD VALUE IF NOT EXISTS 'VEHICLE_REGISTRATION';
ALTER TYPE "WalletTransactionType" ADD VALUE IF NOT EXISTS 'HEAVY_VEHICLE_PASS';

DO $$ BEGIN
  CREATE TYPE "HeavyVehicleRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentOption" AS ENUM ('PAY_NOW', 'PAY_ON_ARRIVAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "EstateStreet" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EstateStreet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EstateSettings" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "freeVehicleLimit" INTEGER NOT NULL DEFAULT 1,
  "vehicleRegistrationFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EstateSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HeavyVehicleCategory" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "amount" DECIMAL(65,30) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HeavyVehicleCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Vehicle" (
  "id" TEXT NOT NULL,
  "residentId" TEXT NOT NULL,
  "plateNumber" TEXT NOT NULL,
  "vehicleType" TEXT NOT NULL,
  "make" TEXT NOT NULL,
  "model" TEXT,
  "color" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "registrationDocUrl" TEXT NOT NULL,
  "vehiclePhotoUrl" TEXT NOT NULL,
  "status" "VehicleStatus" NOT NULL DEFAULT 'PENDING',
  "approvedAt" TIMESTAMP(3),
  "approvedById" TEXT,
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS "VehicleAccessLog" (
  "id" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "plateNumber" TEXT NOT NULL,
  "gateName" TEXT NOT NULL,
  "direction" "AccessDirection" NOT NULL,
  "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VehicleAccessLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HeavyVehiclePass" (
  "id" TEXT NOT NULL,
  "residentId" TEXT NOT NULL,
  "heavyVehicleCategoryId" TEXT NOT NULL,
  "driverName" TEXT NOT NULL,
  "driverPhone" TEXT NOT NULL,
  "plateNumber" TEXT NOT NULL,
  "vehicleDescription" TEXT NOT NULL,
  "entryDate" TIMESTAMP(3) NOT NULL,
  "exitDate" TIMESTAMP(3) NOT NULL,
  "paymentOption" "PaymentOption" NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "status" "HeavyVehicleRequestStatus" NOT NULL DEFAULT 'PENDING',
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "approvedById" TEXT,
  "approvedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "HeavyVehiclePass_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "HeavyVehicleAccessLog" (
  "id" TEXT NOT NULL,
  "heavyVehiclePassId" TEXT NOT NULL,
  "gateName" TEXT NOT NULL,
  "direction" "AccessDirection" NOT NULL,
  "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HeavyVehicleAccessLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "EstateStreet_estateId_name_key" ON "EstateStreet"("estateId", "name");
CREATE INDEX IF NOT EXISTS "EstateStreet_estateId_idx" ON "EstateStreet"("estateId");
CREATE UNIQUE INDEX IF NOT EXISTS "EstateSettings_estateId_key" ON "EstateSettings"("estateId");
CREATE UNIQUE INDEX IF NOT EXISTS "HeavyVehicleCategory_estateId_name_key" ON "HeavyVehicleCategory"("estateId", "name");
CREATE INDEX IF NOT EXISTS "HeavyVehicleCategory_estateId_active_idx" ON "HeavyVehicleCategory"("estateId", "active");
CREATE UNIQUE INDEX IF NOT EXISTS "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");
CREATE INDEX IF NOT EXISTS "VehicleAccessLog_vehicleId_capturedAt_idx" ON "VehicleAccessLog"("vehicleId", "capturedAt");
CREATE INDEX IF NOT EXISTS "VehicleAccessLog_plateNumber_idx" ON "VehicleAccessLog"("plateNumber");
CREATE INDEX IF NOT EXISTS "HeavyVehiclePass_residentId_status_idx" ON "HeavyVehiclePass"("residentId", "status");
CREATE INDEX IF NOT EXISTS "HeavyVehiclePass_heavyVehicleCategoryId_idx" ON "HeavyVehiclePass"("heavyVehicleCategoryId");
CREATE INDEX IF NOT EXISTS "HeavyVehiclePass_plateNumber_idx" ON "HeavyVehiclePass"("plateNumber");
CREATE INDEX IF NOT EXISTS "HeavyVehicleAccessLog_heavyVehiclePassId_capturedAt_idx" ON "HeavyVehicleAccessLog"("heavyVehiclePassId", "capturedAt");

DO $$ BEGIN
  ALTER TABLE "EstateStreet" ADD CONSTRAINT "EstateStreet_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EstateSettings" ADD CONSTRAINT "EstateSettings_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "HeavyVehicleCategory" ADD CONSTRAINT "HeavyVehicleCategory_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "VehicleAccessLog" ADD CONSTRAINT "VehicleAccessLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "HeavyVehiclePass" ADD CONSTRAINT "HeavyVehiclePass_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "HeavyVehiclePass" ADD CONSTRAINT "HeavyVehiclePass_heavyVehicleCategoryId_fkey" FOREIGN KEY ("heavyVehicleCategoryId") REFERENCES "HeavyVehicleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "HeavyVehiclePass" ADD CONSTRAINT "HeavyVehiclePass_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "HeavyVehicleAccessLog" ADD CONSTRAINT "HeavyVehicleAccessLog_heavyVehiclePassId_fkey" FOREIGN KEY ("heavyVehiclePassId") REFERENCES "HeavyVehiclePass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
