/*
  Warnings:

  - You are about to drop the column `toner` on the `printer_model` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "printer_model" DROP COLUMN "toner",
ADD COLUMN     "toners" TEXT[];
