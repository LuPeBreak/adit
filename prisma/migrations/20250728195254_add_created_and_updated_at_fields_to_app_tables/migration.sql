/*
  Warnings:

  - Added the required column `updatedAt` to the `asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `printer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `printer_model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "asset" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "department" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "printer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "printer_model" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sector" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
