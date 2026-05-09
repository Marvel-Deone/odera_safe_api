/*
  Warnings:

  - A unique constraint covering the columns `[passCode]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sms_code]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `action` on the `GateLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `expiresAt` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passCode` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remaining_entries` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sms_code` to the `Visitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_entries` to the `Visitor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GateAction" AS ENUM ('CHECK_IN', 'CHECK_OUT');

-- AlterTable
ALTER TABLE "GateLog" DROP COLUMN "action",
ADD COLUMN     "action" "GateAction" NOT NULL;

-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "biometric_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "biometric_fee_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "checkedInAt" TIMESTAMP(3),
ADD COLUMN     "checkedOutAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gps_lat" DOUBLE PRECISION,
ADD COLUMN     "gps_lng" DOUBLE PRECISION,
ADD COLUMN     "passCode" TEXT NOT NULL,
ADD COLUMN     "plate_no" TEXT,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "qr_code" TEXT,
ADD COLUMN     "remaining_entries" INTEGER NOT NULL,
ADD COLUMN     "sms_code" TEXT NOT NULL,
ADD COLUMN     "total_entries" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_passCode_key" ON "Visitor"("passCode");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_sms_code_key" ON "Visitor"("sms_code");
