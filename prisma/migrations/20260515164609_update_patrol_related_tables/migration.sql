/*
  Warnings:

  - You are about to drop the column `code` on the `PatrolCheckpoint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qrCode]` on the table `PatrolCheckpoint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qrCode` to the `PatrolCheckpoint` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PatrolCheckpoint_code_key";

-- AlterTable
ALTER TABLE "PatrolCheckpoint" DROP COLUMN "code",
ADD COLUMN     "qrCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PatrolAlert" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "checkpointId" TEXT,
    "guardId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatrolAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatrolCheckpoint_qrCode_key" ON "PatrolCheckpoint"("qrCode");

-- AddForeignKey
ALTER TABLE "PatrolAlert" ADD CONSTRAINT "PatrolAlert_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "PatrolCheckpoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatrolAlert" ADD CONSTRAINT "PatrolAlert_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
