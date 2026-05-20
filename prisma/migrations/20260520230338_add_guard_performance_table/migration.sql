-- CreateTable
CREATE TABLE "GuardPerformanceSnapshot" (
    "id" TEXT NOT NULL,
    "guardId" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "attendanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "patrolScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sosScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "incidentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "swapScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "penaltyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardPerformanceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuardPerformanceSnapshot_guardId_periodStart_idx" ON "GuardPerformanceSnapshot"("guardId", "periodStart");

-- CreateIndex
CREATE INDEX "GuardPerformanceSnapshot_estateId_periodStart_idx" ON "GuardPerformanceSnapshot"("estateId", "periodStart");

-- CreateIndex
CREATE INDEX "GuardPerformanceSnapshot_totalScore_idx" ON "GuardPerformanceSnapshot"("totalScore");

-- AddForeignKey
ALTER TABLE "GuardPerformanceSnapshot" ADD CONSTRAINT "GuardPerformanceSnapshot_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardPerformanceSnapshot" ADD CONSTRAINT "GuardPerformanceSnapshot_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
