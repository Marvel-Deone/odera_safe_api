ALTER TABLE "ResidentAssociate"
  ADD COLUMN IF NOT EXISTS "passcode" TEXT,
  ADD COLUMN IF NOT EXISTS "qrPayload" TEXT,
  ADD COLUMN IF NOT EXISTS "qrCode" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "ResidentAssociate_passcode_key"
  ON "ResidentAssociate"("passcode");

CREATE UNIQUE INDEX IF NOT EXISTS "ResidentAssociate_qrPayload_key"
  ON "ResidentAssociate"("qrPayload");

CREATE INDEX IF NOT EXISTS "ResidentAssociate_qrPayload_idx"
  ON "ResidentAssociate"("qrPayload");
