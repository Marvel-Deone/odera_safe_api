/*
  Warnings:

  - You are about to drop the column `dob` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dob` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Resident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resident" ADD COLUMN     "dob" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dob",
DROP COLUMN "first_name",
DROP COLUMN "gender",
DROP COLUMN "last_name",
DROP COLUMN "phone";

-- CreateIndex
CREATE UNIQUE INDEX "Resident_email_key" ON "Resident"("email");
