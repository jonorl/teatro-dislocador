-- The schema has had these since May, but no migration created them; prod got them outside migrations.
-- IF NOT EXISTS / DROP NOT NULL are no-ops where the database already matches, so this is safe on prod and fresh databases alike.

-- AlterTable
ALTER TABLE "Class" ADD COLUMN IF NOT EXISTS "image" TEXT;

-- AlterTable
ALTER TABLE "Showcase" ALTER COLUMN "image" DROP NOT NULL;
