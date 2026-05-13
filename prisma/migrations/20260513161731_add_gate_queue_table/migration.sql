-- CreateEnum
CREATE TYPE "GateQueueStatus" AS ENUM ('WAITING', 'APPROVED', 'DENIED', 'COMPLETED', 'PROCESSED');

-- CreateTable
CREATE TABLE "GateQueue" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "status" "GateQueueStatus" NOT NULL DEFAULT 'WAITING',
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GateQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GateQueue_visitorId_status_key" ON "GateQueue"("visitorId", "status");

-- AddForeignKey
ALTER TABLE "GateQueue" ADD CONSTRAINT "GateQueue_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateQueue" ADD CONSTRAINT "GateQueue_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
