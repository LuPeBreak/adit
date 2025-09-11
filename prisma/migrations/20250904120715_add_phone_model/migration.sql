-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('VOIP', 'ANALOG', 'DIGITAL');

-- AlterEnum
ALTER TYPE "AssetType" ADD VALUE 'PHONE';

-- CreateTable
CREATE TABLE "phone" (
    "id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "phone_type" "PhoneType" NOT NULL,
    "ip_address" TEXT,
    "serial_number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "phone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phone_phone_number_key" ON "phone"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "phone_ip_address_key" ON "phone"("ip_address");

-- CreateIndex
CREATE UNIQUE INDEX "phone_serial_number_key" ON "phone"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "phone_assetId_key" ON "phone"("assetId");

-- AddForeignKey
ALTER TABLE "phone" ADD CONSTRAINT "phone_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
