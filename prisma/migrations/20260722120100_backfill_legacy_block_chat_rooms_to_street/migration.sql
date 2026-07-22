UPDATE "ChatRoom"
SET "type" = 'STREET'
WHERE "type" = 'BLOCK'
  AND "streetId" IS NOT NULL;
