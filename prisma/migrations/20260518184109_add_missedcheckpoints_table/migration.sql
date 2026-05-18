/*
  Warnings:

  - Made the column `requiredFrequency` on table `PatrolCheckpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'RESOLVED');

-- AlterTable
ALTER TABLE "PatrolCheckpoint" ALTER COLUMN "requiredFrequency" SET NOT NULL;

-- CreateTable
CREATE TABLE "MissedCheckpointAlert" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "checkpointId" TEXT NOT NULL,
    "guardId" TEXT,
    "expectedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissedCheckpointAlert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MissedCheckpointAlert" ADD CONSTRAINT "MissedCheckpointAlert_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "PatrolCheckpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissedCheckpointAlert" ADD CONSTRAINT "MissedCheckpointAlert_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
