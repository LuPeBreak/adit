/*
  Warnings:

  - You are about to drop the column `asset_id` on the `toner_request` table. All the data in the column will be lost.
  - Added the required column `printer_id` to the `toner_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "toner_request" DROP CONSTRAINT "toner_request_asset_id_fkey";

-- AlterTable
ALTER TABLE "toner_request" DROP COLUMN "asset_id",
ADD COLUMN     "printer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "toner_request" ADD CONSTRAINT "toner_request_printer_id_fkey" FOREIGN KEY ("printer_id") REFERENCES "printer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
