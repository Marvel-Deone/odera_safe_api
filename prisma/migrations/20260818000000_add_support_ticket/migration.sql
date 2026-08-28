CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'RESOLVED', 'CANCELLED');

CREATE TYPE "SupportTicketCategory" AS ENUM ('APP_ISSUE', 'BUG', 'ACCOUNT', 'PAYMENT', 'OTHER');

CREATE TYPE "SupportTicketTimelineEvent" AS ENUM ('CREATED', 'RESOLVED', 'CANCELLED');

ALTER TABLE "ResidentAssociate"
  ALTER COLUMN "idType" DROP NOT NULL,
  ALTER COLUMN "idNumber" DROP NOT NULL;

CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "estateId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "resolvedById" TEXT,
    "cancelledById" TEXT,
    "reference" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "SupportTicketCategory" NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'P3_ROUTINE',
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "resolutionNote" TEXT,
    "cancellationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SupportTicketTimelineEntry" (
    "id" TEXT NOT NULL,
    "supportTicketId" TEXT NOT NULL,
    "event" "SupportTicketTimelineEvent" NOT NULL,
    "actorId" TEXT,
    "actorRole" "Role",
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTicketTimelineEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SupportTicket_reference_key"
ON "SupportTicket"("reference");

CREATE INDEX "SupportTicket_estateId_idx"
ON "SupportTicket"("estateId");

CREATE INDEX "SupportTicket_estateId_status_idx"
ON "SupportTicket"("estateId", "status");

CREATE INDEX "SupportTicket_createdById_idx"
ON "SupportTicket"("createdById");

CREATE INDEX "SupportTicket_createdAt_idx"
ON "SupportTicket"("createdAt");

CREATE INDEX "SupportTicketTimelineEntry_supportTicketId_createdAt_idx"
ON "SupportTicketTimelineEntry"("supportTicketId", "createdAt");

ALTER TABLE "SupportTicket"
ADD CONSTRAINT "SupportTicket_estateId_fkey"
FOREIGN KEY ("estateId")
REFERENCES "Estate"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "SupportTicket"
ADD CONSTRAINT "SupportTicket_createdById_fkey"
FOREIGN KEY ("createdById")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "SupportTicket"
ADD CONSTRAINT "SupportTicket_resolvedById_fkey"
FOREIGN KEY ("resolvedById")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "SupportTicket"
ADD CONSTRAINT "SupportTicket_cancelledById_fkey"
FOREIGN KEY ("cancelledById")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "SupportTicket"
ADD CONSTRAINT "SupportTicket_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "SupportTicketTimelineEntry"
ADD CONSTRAINT "SupportTicketTimelineEntry_supportTicketId_fkey"
FOREIGN KEY ("supportTicketId")
REFERENCES "SupportTicket"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "SupportTicketTimelineEntry"
ADD CONSTRAINT "SupportTicketTimelineEntry_actorId_fkey"
FOREIGN KEY ("actorId")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;