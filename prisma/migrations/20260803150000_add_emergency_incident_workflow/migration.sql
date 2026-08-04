ALTER TYPE "IncidentStatus" ADD VALUE IF NOT EXISTS 'FALSE_ALARM';
ALTER TYPE "IncidentStatus" ADD VALUE IF NOT EXISTS 'CLOSED';
ALTER TYPE "ChatRoomType" ADD VALUE IF NOT EXISTS 'INCIDENT';

DO $$ BEGIN
  CREATE TYPE "IncidentTimelineEvent" AS ENUM (
    'SOS_TRIGGERED',
    'GPS_ACTIVATED',
    'LIVE_STREAM_STARTED',
    'NOTIFICATIONS_SENT',
    'ESCALATED',
    'RESOLVED',
    'FALSE_ALARM',
    'CLOSED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "EmergencyNotificationEvent" AS ENUM (
    'SOS_TRIGGERED',
    'ESCALATED',
    'ALARM_TRIGGERED',
    'INCIDENT_CLOSED'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "EmergencyContactType" AS ENUM (
    'POLICE',
    'FIRE_SERVICE',
    'AMBULANCE',
    'ESTATE_SECURITY',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "EmergencyContactActionType" AS ENUM (
    'CALL',
    'SMS',
    'SUPER_ADMIN_ESCALATION'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "GuardSOS" ADD COLUMN IF NOT EXISTS "incidentId" TEXT;
ALTER TABLE "ChatRoom" ADD COLUMN IF NOT EXISTS "incidentId" TEXT;
ALTER TABLE "ChatRoom" ADD COLUMN IF NOT EXISTS "closedAt" TIMESTAMP(3);
ALTER TABLE "Incident" ADD COLUMN IF NOT EXISTS "silencedAt" TIMESTAMP(3);
ALTER TABLE "Incident" ADD COLUMN IF NOT EXISTS "silencedBy" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "GuardSOS_incidentId_key" ON "GuardSOS"("incidentId");
CREATE INDEX IF NOT EXISTS "GuardSOS_incidentId_idx" ON "GuardSOS"("incidentId");
CREATE UNIQUE INDEX IF NOT EXISTS "ChatRoom_incidentId_key" ON "ChatRoom"("incidentId");
CREATE INDEX IF NOT EXISTS "ChatRoom_incidentId_idx" ON "ChatRoom"("incidentId");

DO $$ BEGIN
  ALTER TABLE "GuardSOS" ADD CONSTRAINT "GuardSOS_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "IncidentTimelineEntry" (
  "id" TEXT NOT NULL,
  "incidentId" TEXT NOT NULL,
  "event" "IncidentTimelineEvent" NOT NULL,
  "actorId" TEXT,
  "actorRole" "Role",
  "note" TEXT,
  "location" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IncidentTimelineEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "IncidentChatParticipant" (
  "id" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IncidentChatParticipant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmergencyNotification" (
  "id" TEXT NOT NULL,
  "incidentId" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "event" "EmergencyNotificationEvent" NOT NULL,
  "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "metadata" JSONB,
  CONSTRAINT "EmergencyNotification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmergencyContact" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "EmergencyContactType" NOT NULL,
  "phone" TEXT NOT NULL,
  "smsPhone" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmergencyContactAction" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "incidentId" TEXT,
  "contactId" TEXT,
  "actorId" TEXT NOT NULL,
  "action" "EmergencyContactActionType" NOT NULL,
  "destination" TEXT NOT NULL,
  "note" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmergencyContactAction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "IncidentTimelineEntry_incidentId_createdAt_idx" ON "IncidentTimelineEntry"("incidentId", "createdAt");
CREATE INDEX IF NOT EXISTS "IncidentTimelineEntry_event_idx" ON "IncidentTimelineEntry"("event");
CREATE UNIQUE INDEX IF NOT EXISTS "IncidentChatParticipant_roomId_userId_key" ON "IncidentChatParticipant"("roomId", "userId");
CREATE INDEX IF NOT EXISTS "IncidentChatParticipant_userId_idx" ON "IncidentChatParticipant"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "EmergencyNotification_incidentId_recipientId_event_key" ON "EmergencyNotification"("incidentId", "recipientId", "event");
CREATE INDEX IF NOT EXISTS "EmergencyNotification_recipientId_deliveredAt_idx" ON "EmergencyNotification"("recipientId", "deliveredAt");
CREATE INDEX IF NOT EXISTS "EmergencyContact_estateId_isActive_idx" ON "EmergencyContact"("estateId", "isActive");
CREATE INDEX IF NOT EXISTS "EmergencyContactAction_estateId_createdAt_idx" ON "EmergencyContactAction"("estateId", "createdAt");
CREATE INDEX IF NOT EXISTS "EmergencyContactAction_incidentId_idx" ON "EmergencyContactAction"("incidentId");

DO $$ BEGIN
  ALTER TABLE "IncidentTimelineEntry" ADD CONSTRAINT "IncidentTimelineEntry_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "IncidentTimelineEntry" ADD CONSTRAINT "IncidentTimelineEntry_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "IncidentChatParticipant" ADD CONSTRAINT "IncidentChatParticipant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "IncidentChatParticipant" ADD CONSTRAINT "IncidentChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmergencyNotification" ADD CONSTRAINT "EmergencyNotification_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmergencyNotification" ADD CONSTRAINT "EmergencyNotification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmergencyContactAction" ADD CONSTRAINT "EmergencyContactAction_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "Estate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmergencyContactAction" ADD CONSTRAINT "EmergencyContactAction_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmergencyContactAction" ADD CONSTRAINT "EmergencyContactAction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "EmergencyContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "EmergencyContactAction" ADD CONSTRAINT "EmergencyContactAction_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
