/*
  Warnings:

  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Gallery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Showcase` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Class_id_seq";

-- AlterTable
ALTER TABLE "Gallery" DROP CONSTRAINT "Gallery_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Gallery_id_seq";

-- AlterTable
ALTER TABLE "Showcase" DROP CONSTRAINT "Showcase_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Showcase_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Showcase_id_seq";
