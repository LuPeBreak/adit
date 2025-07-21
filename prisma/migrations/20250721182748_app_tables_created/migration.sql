-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('PRINTER');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('USING', 'STOCK', 'BROKEN', 'MAINTENANCE', 'RESERVED');

-- CreateTable
CREATE TABLE "asset" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "asset_type" "AssetType" NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "sector_id" TEXT NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "printer" (
    "id" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "printer_model_id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "printer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "printer_model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "toner" TEXT[],

    CONSTRAINT "printer_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "manager_email" TEXT NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "manager_email" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asset_tag_key" ON "asset"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "printer_assetId_key" ON "printer"("assetId");

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer" ADD CONSTRAINT "printer_printer_model_id_fkey" FOREIGN KEY ("printer_model_id") REFERENCES "printer_model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "printer" ADD CONSTRAINT "printer_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sector" ADD CONSTRAINT "sector_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
