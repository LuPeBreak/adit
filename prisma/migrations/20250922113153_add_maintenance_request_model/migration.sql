-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('PENDING', 'ANALYZING', 'MAINTENANCE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "maintenance_request" (
    "id" TEXT NOT NULL,
    "requester_name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "requester_email" TEXT NOT NULL,
    "requester_whatsapp" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "asset_id" TEXT NOT NULL,

    CONSTRAINT "maintenance_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_request_history" (
    "id" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL,
    "notes" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,

    CONSTRAINT "maintenance_request_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenance_request" ADD CONSTRAINT "maintenance_request_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_request_history" ADD CONSTRAINT "maintenance_request_history_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "maintenance_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_request_history" ADD CONSTRAINT "maintenance_request_history_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
