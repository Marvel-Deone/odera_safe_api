-- CreateEnum
CREATE TYPE "FinanceRecordType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "EstateFinanceRecord" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "type" "FinanceRecordType" NOT NULL,
    "category" TEXT,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstateFinanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EstateFinanceRecord_estateId_idx" ON "EstateFinanceRecord"("estateId");

-- CreateIndex
CREATE INDEX "EstateFinanceRecord_estateId_type_idx" ON "EstateFinanceRecord"("estateId", "type");

-- CreateIndex
CREATE INDEX "EstateFinanceRecord_recordedAt_idx" ON "EstateFinanceRecord"("recordedAt");

-- AddForeignKey
ALTER TABLE "EstateFinanceRecord" ADD CONSTRAINT "EstateFinanceRecord_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateFinanceRecord" ADD CONSTRAINT "EstateFinanceRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
