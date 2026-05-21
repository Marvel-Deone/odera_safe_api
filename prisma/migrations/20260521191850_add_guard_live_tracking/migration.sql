-- CreateTable
CREATE TABLE "GuardLocation" (
    "id" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "batteryLevel" INTEGER,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuardLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuardLocation_guardId_recordedAt_idx" ON "GuardLocation"("guardId", "recordedAt");

-- CreateIndex
CREATE INDEX "GuardLocation_estateId_recordedAt_idx" ON "GuardLocation"("estateId", "recordedAt");

-- AddForeignKey
ALTER TABLE "GuardLocation" ADD CONSTRAINT "GuardLocation_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardLocation" ADD CONSTRAINT "GuardLocation_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
