-- CreateEnum
CREATE TYPE "TonerRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DELIVERED', 'REJECTED');

-- CreateTable
CREATE TABLE "toner_request" (
    "id" TEXT NOT NULL,
    "requester_name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "requester_whatsapp" TEXT NOT NULL,
    "requester_email" TEXT NOT NULL,
    "selected_toner" TEXT NOT NULL,
    "status" "TonerRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "asset_id" TEXT NOT NULL,

    CONSTRAINT "toner_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "toner_request" ADD CONSTRAINT "toner_request_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
