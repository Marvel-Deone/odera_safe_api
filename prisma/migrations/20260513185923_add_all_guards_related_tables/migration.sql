-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('DAY', 'NIGHT', 'STANDBY', 'REST');

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'LATE', 'ABSENT', 'HALF_DAY', 'OFF_DUTY');

-- CreateEnum
CREATE TYPE "ShiftSwapReason" AS ENUM ('PERSONAL_EMERGENCY', 'MEDICAL', 'FAMILY', 'FATIGUE', 'OTHER');

-- CreateEnum
CREATE TYPE "ShiftSwapStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GuardSOSCategory" AS ENUM ('INTRUDER', 'PHYSICAL_CONFRONTATION', 'ARMED_THREAT', 'SUSPECT_FLEEING', 'PERSONAL_INJURY', 'CIVIL_DISTURBANCE');

-- CreateEnum
CREATE TYPE "GuardSOSStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "GuardShift" (
    "id" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "shiftDate" TIMESTAMP(3) NOT NULL,
    "shiftType" "ShiftType" NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "zone" TEXT,
    "status" "ShiftStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardAttendance" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "clockInAt" TIMESTAMP(3),
    "clockInLatitude" DOUBLE PRECISION,
    "clockInLongitude" DOUBLE PRECISION,
    "clockInPhotoUrl" TEXT,
    "clockOutAt" TIMESTAMP(3),
    "clockOutLatitude" DOUBLE PRECISION,
    "clockOutLongitude" DOUBLE PRECISION,
    "clockOutPhotoUrl" TEXT,
    "handoverNotes" TEXT,
    "minutesLate" INTEGER NOT NULL DEFAULT 0,
    "minutesWorked" INTEGER NOT NULL DEFAULT 0,
    "overtimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "attendanceStatus" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatrolCheckpoint" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "requiredFrequency" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatrolCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatrolScan" (
    "id" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "checkpointId" TEXT NOT NULL,
    "shiftId" TEXT,
    "estateId" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "distanceFromSite" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "PatrolScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftSwapRequest" (
    "id" TEXT NOT NULL,
    "requesterGuardId" TEXT NOT NULL,
    "targetGuardId" TEXT NOT NULL,
    "requesterShiftId" TEXT NOT NULL,
    "targetShiftId" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "reason" "ShiftSwapReason" NOT NULL,
    "details" TEXT,
    "status" "ShiftSwapStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guardId" TEXT,
    "guardShiftId" TEXT,

    CONSTRAINT "ShiftSwapRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardSOS" (
    "id" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "category" "GuardSOSCategory" NOT NULL,
    "zone" TEXT,
    "message" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "GuardSOSStatus" NOT NULL DEFAULT 'ACTIVE',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolutionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardSOS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuardShift_guardId_shiftDate_idx" ON "GuardShift"("guardId", "shiftDate");

-- CreateIndex
CREATE INDEX "GuardShift_estateId_shiftDate_idx" ON "GuardShift"("estateId", "shiftDate");

-- CreateIndex
CREATE UNIQUE INDEX "GuardAttendance_shiftId_key" ON "GuardAttendance"("shiftId");

-- CreateIndex
CREATE INDEX "GuardAttendance_guardId_clockInAt_idx" ON "GuardAttendance"("guardId", "clockInAt");

-- CreateIndex
CREATE UNIQUE INDEX "PatrolCheckpoint_code_key" ON "PatrolCheckpoint"("code");

-- CreateIndex
CREATE INDEX "PatrolCheckpoint_estateId_zone_idx" ON "PatrolCheckpoint"("estateId", "zone");

-- CreateIndex
CREATE INDEX "PatrolScan_guardId_scannedAt_idx" ON "PatrolScan"("guardId", "scannedAt");

-- CreateIndex
CREATE INDEX "PatrolScan_checkpointId_scannedAt_idx" ON "PatrolScan"("checkpointId", "scannedAt");

-- CreateIndex
CREATE INDEX "ShiftSwapRequest_requesterGuardId_status_idx" ON "ShiftSwapRequest"("requesterGuardId", "status");

-- CreateIndex
CREATE INDEX "ShiftSwapRequest_targetGuardId_status_idx" ON "ShiftSwapRequest"("targetGuardId", "status");

-- CreateIndex
CREATE INDEX "GuardSOS_guardId_createdAt_idx" ON "GuardSOS"("guardId", "createdAt");

-- CreateIndex
CREATE INDEX "GuardSOS_status_createdAt_idx" ON "GuardSOS"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "GuardShift" ADD CONSTRAINT "GuardShift_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardShift" ADD CONSTRAINT "GuardShift_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardAttendance" ADD CONSTRAINT "GuardAttendance_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "GuardShift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardAttendance" ADD CONSTRAINT "GuardAttendance_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolCheckpoint" ADD CONSTRAINT "PatrolCheckpoint_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolScan" ADD CONSTRAINT "PatrolScan_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolScan" ADD CONSTRAINT "PatrolScan_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "PatrolCheckpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolScan" ADD CONSTRAINT "PatrolScan_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "GuardShift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolScan" ADD CONSTRAINT "PatrolScan_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_requesterGuardId_fkey" FOREIGN KEY ("requesterGuardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_targetGuardId_fkey" FOREIGN KEY ("targetGuardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_requesterShiftId_fkey" FOREIGN KEY ("requesterShiftId") REFERENCES "GuardShift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_targetShiftId_fkey" FOREIGN KEY ("targetShiftId") REFERENCES "GuardShift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftSwapRequest" ADD CONSTRAINT "ShiftSwapRequest_guardShiftId_fkey" FOREIGN KEY ("guardShiftId") REFERENCES "GuardShift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardSOS" ADD CONSTRAINT "GuardSOS_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardSOS" ADD CONSTRAINT "GuardSOS_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
