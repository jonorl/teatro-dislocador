-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "instagramId" TEXT;

-- AlterTable
ALTER TABLE "Showcase" ADD COLUMN     "instagramId" TEXT;

-- CreateTable
CREATE TABLE "InstagramPost" (
    "id" TEXT NOT NULL,
    "decision" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstagramPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_instagramId_key" ON "Class"("instagramId");

-- CreateIndex
CREATE UNIQUE INDEX "Showcase_instagramId_key" ON "Showcase"("instagramId");

