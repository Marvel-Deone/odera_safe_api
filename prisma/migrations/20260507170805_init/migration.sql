-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RESIDENT', 'GUARD');

-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'CHECKED_IN', 'CHECKED_OUT');

-- CreateEnum
CREATE TYPE "ResidentStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE');

-- CreateTable
CREATE TABLE "Estate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "totalHouses" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settings" JSONB,

    CONSTRAINT "Estate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "first_login" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estateId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "userId" TEXT,
    "status" "ResidentStatus" NOT NULL DEFAULT 'PENDING',
    "house_no" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "home_address" TEXT NOT NULL,
    "state_of_origin" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,
    "id_no" TEXT NOT NULL,
    "id_document_front" TEXT NOT NULL,
    "id_document_back" TEXT NOT NULL,
    "bvn" TEXT,
    "alternate_phone" TEXT,
    "next_of_kin_name" TEXT,
    "next_of_kin_phone" TEXT,
    "next_of_kin_email" TEXT,
    "next_of_kin_relationship" TEXT,
    "guarantor_name" TEXT NOT NULL,
    "guarantor_occupation" TEXT NOT NULL,
    "guarantor_work_address" TEXT NOT NULL,
    "guarantor_id_no" TEXT NOT NULL,
    "guarantor_id_relationship" TEXT NOT NULL,
    "signed_guarantor_letter_upload" TEXT NOT NULL,
    "vehicle_plate_no" TEXT NOT NULL,
    "vehicle_make" TEXT NOT NULL,
    "vehicle_color" TEXT,
    "proof_of_address_upload" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "tenancy_ownership_doc" TEXT NOT NULL,
    "wallet_pin" TEXT,
    "ndprConsentDataProcessing" BOOLEAN NOT NULL,
    "ndprConsentIdentity" BOOLEAN NOT NULL,
    "ndprConsentThirdParty" BOOLEAN NOT NULL,
    "ndprConsentGivenAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "status" "VisitorStatus" NOT NULL DEFAULT 'PENDING',
    "visitDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GateLog" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GateLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_userId_key" ON "Resident"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateLog" ADD CONSTRAINT "GateLog_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateLog" ADD CONSTRAINT "GateLog_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
