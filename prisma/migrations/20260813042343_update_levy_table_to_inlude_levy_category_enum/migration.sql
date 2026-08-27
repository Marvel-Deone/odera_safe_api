/*
  Warnings:

  - Changed the type of `category` on the `Levy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LevyCategory" AS ENUM ('ADMIN_LEVY', 'MONTHLY_RESIDENT_LEVY');

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_residentId_fkey";

-- AlterTable
ALTER TABLE "Levy" DROP COLUMN "category",
ADD COLUMN     "category" "LevyCategory" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Levy_estateId_category_period_key" ON "Levy"("estateId", "category", "period");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
