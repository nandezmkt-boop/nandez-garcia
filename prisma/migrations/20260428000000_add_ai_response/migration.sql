-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "aiResponse" TEXT;
ALTER TABLE "Lead" ADD COLUMN "aiResponseAt" TIMESTAMP(3);
ALTER TABLE "Lead" ADD COLUMN "aiError" TEXT;
