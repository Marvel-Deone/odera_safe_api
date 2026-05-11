-- DropIndex
DROP INDEX "VisitorLocation_trackingSessionId_idx";

-- AlterTable
ALTER TABLE "TrackingSession" ADD COLUMN     "currentLat" DOUBLE PRECISION,
ADD COLUMN     "currentLng" DOUBLE PRECISION,
ADD COLUMN     "lastLocationAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "TrackingSession_visitorId_idx" ON "TrackingSession"("visitorId");

-- CreateIndex
CREATE INDEX "TrackingSession_isActive_idx" ON "TrackingSession"("isActive");

-- CreateIndex
CREATE INDEX "TrackingSession_visitorId_isActive_idx" ON "TrackingSession"("visitorId", "isActive");

-- CreateIndex
CREATE INDEX "VisitorLocation_visitorId_idx" ON "VisitorLocation"("visitorId");

-- CreateIndex
CREATE INDEX "VisitorLocation_createdAt_idx" ON "VisitorLocation"("createdAt");

-- CreateIndex
CREATE INDEX "VisitorLocation_trackingSessionId_createdAt_idx" ON "VisitorLocation"("trackingSessionId", "createdAt");
