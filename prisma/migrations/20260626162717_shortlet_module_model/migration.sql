-- CreateEnum
CREATE TYPE "ShortletStatus" AS ENUM ('INACTIVE', 'PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACTIVE', 'CHECKED_IN', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('ENTRY', 'EXIT');

-- AlterEnum
ALTER TYPE "WalletTransactionType" ADD VALUE 'SHORTLET_REGISTRATION';

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ShortletSettings" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "annualRegistrationFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortletSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortletProperty" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "listingUrl" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "annualFeePaid" BOOLEAN NOT NULL DEFAULT false,
    "annualFeeExpiresAt" TIMESTAMP(3),
    "annualFeeAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "regulationsAccepted" BOOLEAN NOT NULL,
    "status" "ShortletStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortletProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortletBooking" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "qrCode" TEXT,
    "qrPayload" TEXT,
    "smsCode" TEXT NOT NULL,
    "biometricRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" "BookingStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortletBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortletAccessLog" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "type" "AccessType" NOT NULL,
    "gateId" TEXT,
    "gateName" TEXT,
    "verifiedById" TEXT,
    "deniedReason" TEXT,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortletAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortletSettings_estateId_key" ON "ShortletSettings"("estateId");

-- CreateIndex
CREATE INDEX "ShortletProperty_residentId_status_idx" ON "ShortletProperty"("residentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ShortletBooking_qrPayload_key" ON "ShortletBooking"("qrPayload");

-- CreateIndex
CREATE UNIQUE INDEX "ShortletBooking_smsCode_key" ON "ShortletBooking"("smsCode");

-- CreateIndex
CREATE INDEX "ShortletBooking_propertyId_status_idx" ON "ShortletBooking"("propertyId", "status");

-- CreateIndex
CREATE INDEX "ShortletBooking_smsCode_idx" ON "ShortletBooking"("smsCode");

-- CreateIndex
CREATE INDEX "ShortletBooking_qrPayload_idx" ON "ShortletBooking"("qrPayload");

-- CreateIndex
CREATE INDEX "ShortletAccessLog_bookingId_createdAt_idx" ON "ShortletAccessLog"("bookingId", "createdAt");

-- CreateIndex
CREATE INDEX "ShortletAccessLog_verifiedById_idx" ON "ShortletAccessLog"("verifiedById");

-- AddForeignKey
ALTER TABLE "ShortletSettings" ADD CONSTRAINT "ShortletSettings_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortletProperty" ADD CONSTRAINT "ShortletProperty_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortletBooking" ADD CONSTRAINT "ShortletBooking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "ShortletProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortletAccessLog" ADD CONSTRAINT "ShortletAccessLog_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "ShortletBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortletAccessLog" ADD CONSTRAINT "ShortletAccessLog_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
