ALTER TYPE "ChatRoomType" ADD VALUE IF NOT EXISTS 'STREET';
ALTER TYPE "ChatRoomType" ADD VALUE IF NOT EXISTS 'SECURITY';
ALTER TYPE "ChatRoomType" ADD VALUE IF NOT EXISTS 'ADMIN_ONLY';

ALTER TABLE "Resident" ADD COLUMN IF NOT EXISTS "streetId" TEXT;
ALTER TABLE "ChatRoom" ADD COLUMN IF NOT EXISTS "streetId" TEXT;

CREATE INDEX IF NOT EXISTS "Resident_streetId_idx" ON "Resident"("streetId");
CREATE INDEX IF NOT EXISTS "ChatRoom_estateId_type_idx" ON "ChatRoom"("estateId", "type");
CREATE INDEX IF NOT EXISTS "ChatRoom_streetId_idx" ON "ChatRoom"("streetId");

DO $$ BEGIN
  ALTER TABLE "Resident" ADD CONSTRAINT "Resident_streetId_fkey" FOREIGN KEY ("streetId") REFERENCES "EstateStreet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_streetId_fkey" FOREIGN KEY ("streetId") REFERENCES "EstateStreet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

UPDATE "Resident" r
SET "streetId" = s."id"
FROM "EstateStreet" s
WHERE r."streetId" IS NULL
  AND r."estateId" = s."estateId"
  AND lower(trim(r."block")) = lower(trim(s."name"));

UPDATE "ChatRoom" c
SET "streetId" = s."id"
FROM "EstateStreet" s
WHERE c."streetId" IS NULL
  AND c."block" IS NOT NULL
  AND c."estateId" = s."estateId"
  AND lower(trim(c."block")) = lower(trim(s."name"));
