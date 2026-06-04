/*
  Warnings:

  - The values [SECURITY_BREACH,SUSPICIOUS_ACTIVITY,VISITOR_DISPUTE,EQUIPMENT_FAILURE,FIRE_HAZARD,MEDICAL_EMERGENCY,THEFT,VANDALISM,NOISE_COMPLAINT] on the enum `IncidentCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `guardId` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the `MaintenanceTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IncidentCategory_new" AS ENUM ('SECURITY', 'MAINTENANCE', 'ACCESS_CONTROL', 'COMMUNITY', 'DELIVERY', 'PARKING', 'FACILITY', 'EMERGENCY', 'OTHER');
ALTER TABLE "Incident" ALTER COLUMN "category" TYPE "IncidentCategory_new" USING ("category"::text::"IncidentCategory_new");
ALTER TYPE "IncidentCategory" RENAME TO "IncidentCategory_old";
ALTER TYPE "IncidentCategory_new" RENAME TO "IncidentCategory";
DROP TYPE "public"."IncidentCategory_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IncidentStatus" ADD VALUE 'ASSIGNED';
ALTER TYPE "IncidentStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "IncidentStatus" ADD VALUE 'OVERDUE';
ALTER TYPE "IncidentStatus" ADD VALUE 'BREACHED';

-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'BREACHED';

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_guardId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceTicket" DROP CONSTRAINT "MaintenanceTicket_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceTicket" DROP CONSTRAINT "MaintenanceTicket_estateId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceTicket" DROP CONSTRAINT "MaintenanceTicket_residentId_fkey";

-- DropIndex
DROP INDEX "Incident_guardId_idx";

-- DropIndex
DROP INDEX "Incident_status_idx";

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "guardId",
ADD COLUMN     "afterPhotos" JSONB,
ADD COLUMN     "assignedToGuardId" TEXT,
ADD COLUMN     "assignedToUserId" TEXT,
ADD COLUMN     "beforePhotos" JSONB,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completionNote" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "priority" "TicketPriority",
ADD COLUMN     "reportedByGuardId" TEXT,
ADD COLUMN     "reportedByResidentId" TEXT,
ADD COLUMN     "residentRating" INTEGER,
ADD COLUMN     "slaDeadline" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "MaintenanceTicket";

-- CreateIndex
CREATE INDEX "Incident_category_idx" ON "Incident"("category");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_reportedByResidentId_fkey" FOREIGN KEY ("reportedByResidentId") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_reportedByGuardId_fkey" FOREIGN KEY ("reportedByGuardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_assignedToGuardId_fkey" FOREIGN KEY ("assignedToGuardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
