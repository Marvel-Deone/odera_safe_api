-- AlterTable
ALTER TABLE "Resident" ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "activationCodeExpiresAt" TIMESTAMP(3),
ALTER COLUMN "block" DROP NOT NULL;
