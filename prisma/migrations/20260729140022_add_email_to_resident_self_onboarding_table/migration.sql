/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ResidentSelfOnboarding` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `ResidentSelfOnboarding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResidentSelfOnboarding" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ResidentSelfOnboarding_email_key" ON "ResidentSelfOnboarding"("email");
