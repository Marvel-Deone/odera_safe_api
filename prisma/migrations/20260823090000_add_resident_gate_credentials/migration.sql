ALTER TABLE "Resident" ADD COLUMN "passcode" TEXT;
ALTER TABLE "Resident" ADD COLUMN "qrPayload" TEXT;
ALTER TABLE "Resident" ADD COLUMN "qrCode" TEXT;

CREATE UNIQUE INDEX "Resident_passcode_key" ON "Resident"("passcode");
CREATE UNIQUE INDEX "Resident_qrPayload_key" ON "Resident"("qrPayload");
CREATE INDEX "Resident_qrPayload_idx" ON "Resident"("qrPayload");
