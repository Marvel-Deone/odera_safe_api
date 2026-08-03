ALTER TABLE "ResidentAssociate"
  ADD COLUMN IF NOT EXISTS "userId" TEXT,
  ADD COLUMN IF NOT EXISTS "email" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "ResidentAssociate_userId_key" ON "ResidentAssociate"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "ResidentAssociate_email_key" ON "ResidentAssociate"("email");
CREATE INDEX IF NOT EXISTS "ResidentAssociate_userId_idx" ON "ResidentAssociate"("userId");

DO $$ BEGIN
  ALTER TABLE "ResidentAssociate" ADD CONSTRAINT "ResidentAssociate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
