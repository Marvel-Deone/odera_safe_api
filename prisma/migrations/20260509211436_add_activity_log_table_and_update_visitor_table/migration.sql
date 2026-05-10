/*
  Warnings:

  - You are about to drop the column `visitDate` on the `Visitor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('VISITOR', 'STAFF', 'VEHICLE', 'SECURITY', 'WALLET', 'MAINTENANCE', 'COMMUNITY', 'SYSTEM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "VisitorStatus" ADD VALUE 'REVOKED';
ALTER TYPE "VisitorStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Visitor" DROP COLUMN "visitDate",
ADD COLUMN     "visit_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "category" "LogCategory" NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actorId" TEXT,
    "actorRole" "Role",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
