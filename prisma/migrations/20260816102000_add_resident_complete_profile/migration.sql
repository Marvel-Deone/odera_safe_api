ALTER TABLE "Resident" ADD COLUMN "completeProfile" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Resident" r
SET "completeProfile" = true
FROM "Estate" e
LEFT JOIN "EstateSettings" es ON es."estateId" = e."id"
WHERE r."estateId" = e."id"
  AND (COALESCE(es."applyApartmentType", false) = false OR r."apartmentTypeId" IS NOT NULL)
  AND r."ndprConsentDataProcessing" = true
  AND r."ndprConsentIdentity" = true
  AND r."ndprConsentThirdParty" = true
  AND r."profileDeclaration" = true;
