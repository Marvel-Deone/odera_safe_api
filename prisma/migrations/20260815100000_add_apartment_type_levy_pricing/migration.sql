ALTER TABLE "EstateSettings"
  ADD COLUMN IF NOT EXISTS "applyApartmentType" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "ApartmentType" (
  "id" TEXT NOT NULL,
  "estateId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ApartmentType_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ApartmentType_estateId_name_key"
  ON "ApartmentType"("estateId", "name");

CREATE INDEX IF NOT EXISTS "ApartmentType_estateId_active_idx"
  ON "ApartmentType"("estateId", "active");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'ApartmentType_estateId_fkey'
      AND table_name = 'ApartmentType'
  ) THEN
    ALTER TABLE "ApartmentType"
      ADD CONSTRAINT "ApartmentType_estateId_fkey"
      FOREIGN KEY ("estateId") REFERENCES "Estate"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "Resident"
  ADD COLUMN IF NOT EXISTS "apartmentTypeId" TEXT;

CREATE INDEX IF NOT EXISTS "Resident_apartmentTypeId_idx"
  ON "Resident"("apartmentTypeId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Resident_apartmentTypeId_fkey'
      AND table_name = 'Resident'
  ) THEN
    ALTER TABLE "Resident"
      ADD CONSTRAINT "Resident_apartmentTypeId_fkey"
      FOREIGN KEY ("apartmentTypeId") REFERENCES "ApartmentType"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "LevyApartmentTypePrice" (
  "id" TEXT NOT NULL,
  "levyId" TEXT NOT NULL,
  "apartmentTypeId" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LevyApartmentTypePrice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LevyApartmentTypePrice_levyId_apartmentTypeId_key"
  ON "LevyApartmentTypePrice"("levyId", "apartmentTypeId");

CREATE INDEX IF NOT EXISTS "LevyApartmentTypePrice_apartmentTypeId_idx"
  ON "LevyApartmentTypePrice"("apartmentTypeId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'LevyApartmentTypePrice_levyId_fkey'
      AND table_name = 'LevyApartmentTypePrice'
  ) THEN
    ALTER TABLE "LevyApartmentTypePrice"
      ADD CONSTRAINT "LevyApartmentTypePrice_levyId_fkey"
      FOREIGN KEY ("levyId") REFERENCES "Levy"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'LevyApartmentTypePrice_apartmentTypeId_fkey'
      AND table_name = 'LevyApartmentTypePrice'
  ) THEN
    ALTER TABLE "LevyApartmentTypePrice"
      ADD CONSTRAINT "LevyApartmentTypePrice_apartmentTypeId_fkey"
      FOREIGN KEY ("apartmentTypeId") REFERENCES "ApartmentType"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
