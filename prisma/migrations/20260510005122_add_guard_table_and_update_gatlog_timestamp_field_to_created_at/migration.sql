/*
  Warnings:

  - You are about to drop the column `timestamp` on the `GateLog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GuardRole" AS ENUM ('GUARD', 'SUPER_GUARD');

-- AlterEnum
ALTER TYPE "GateAction" ADD VALUE 'DENY';

-- DropForeignKey
ALTER TABLE "GateLog" DROP CONSTRAINT "GateLog_guardId_fkey";

-- AlterTable
ALTER TABLE "GateLog" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "Guard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "role" "GuardRole" NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "zone_assignment" TEXT,
    "shift_pattern" TEXT,
    "duty_cycle" TEXT,
    "resumption_date" TIMESTAMP(3),
    "government_id_type" TEXT,
    "government_id_no" TEXT,
    "nin" TEXT,
    "height" TEXT,
    "build" TEXT,
    "distinguishing_marks" TEXT,
    "id_document_url" TEXT,
    "nok_name" TEXT,
    "nok_phone" TEXT,
    "nok_relationship" TEXT,
    "guarantor_name" TEXT,
    "guarantor_phone" TEXT,
    "guarantor_occupation" TEXT,
    "guarantor_work_address" TEXT,
    "guarantor_nin" TEXT,
    "guarantor_relationship" TEXT,
    "guarantor_letter_url" TEXT,
    "first_aid" BOOLEAN NOT NULL DEFAULT false,
    "fire_safety" BOOLEAN NOT NULL DEFAULT false,
    "qr_gate_ops" BOOLEAN NOT NULL DEFAULT false,
    "biometric_capture" BOOLEAN NOT NULL DEFAULT false,
    "crisis_response" BOOLEAN NOT NULL DEFAULT false,
    "female_screening" BOOLEAN NOT NULL DEFAULT false,
    "self_defence" BOOLEAN NOT NULL DEFAULT false,
    "cctv_operation" BOOLEAN NOT NULL DEFAULT false,
    "salary_band" TEXT,
    "bank_name" TEXT,
    "account_number" TEXT,
    "account_name" TEXT,
    "passport_photo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guard_userId_key" ON "Guard"("userId");

-- AddForeignKey
ALTER TABLE "Guard" ADD CONSTRAINT "Guard_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guard" ADD CONSTRAINT "Guard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateLog" ADD CONSTRAINT "GateLog_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateLog" ADD CONSTRAINT "GateLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
