-- DropIndex
DROP INDEX "PatrolCheckpoint_qrCode_key";

-- AlterTable
ALTER TABLE "PatrolCheckpoint" ALTER COLUMN "qrCode" DROP NOT NULL;
