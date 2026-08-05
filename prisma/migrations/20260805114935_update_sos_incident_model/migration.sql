-- CreateEnum
CREATE TYPE "AdminSosCategory" AS ENUM ('SECURITY_EMERGENCY', 'POLICE_ASSISTANCE', 'FIRE_EMERGENCY', 'MEDICAL_EMERGENCY', 'ESTATE_WIDE_EMERGENCY', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IncidentTimelineEvent" ADD VALUE 'ACKNOWLEDGED';
ALTER TYPE "IncidentTimelineEvent" ADD VALUE 'SILENCED';
ALTER TYPE "IncidentTimelineEvent" ADD VALUE 'EMERGENCY_CONTACT_CALLED';
ALTER TYPE "IncidentTimelineEvent" ADD VALUE 'EMERGENCY_MESSAGE_SENT';
