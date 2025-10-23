/*
  Warnings:

  - Added the required column `acronym` to the `department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `acronym` to the `sector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "department" ADD COLUMN     "acronym" TEXT NOT NULL,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "sector" ADD COLUMN     "acronym" TEXT NOT NULL,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "contact" TEXT;
