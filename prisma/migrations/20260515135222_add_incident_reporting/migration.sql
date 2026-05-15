-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "IncidentCategory" AS ENUM ('SECURITY_BREACH', 'SUSPICIOUS_ACTIVITY', 'VISITOR_DISPUTE', 'EQUIPMENT_FAILURE', 'FIRE_HAZARD', 'MEDICAL_EMERGENCY', 'THEFT', 'VANDALISM', 'NOISE_COMPLAINT', 'OTHER');

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "IncidentCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "photos" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Incident_estateId_idx" ON "Incident"("estateId");

-- CreateIndex
CREATE INDEX "Incident_guardId_idx" ON "Incident"("guardId");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
