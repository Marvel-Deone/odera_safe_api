-- AlterTable
ALTER TABLE "Guard" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "kycStatus" "KycStatus" NOT NULL DEFAULT 'NOT_SUBMITTED';
