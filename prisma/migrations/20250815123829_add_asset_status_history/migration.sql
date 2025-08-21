-- CreateTable
CREATE TABLE "asset_status_history" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "sector_id" TEXT NOT NULL,
    "changed_by" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset_status_history_asset_id_created_at_idx" ON "asset_status_history"("asset_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "asset_status_history_created_at_idx" ON "asset_status_history"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "asset_status_history" ADD CONSTRAINT "asset_status_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_status_history" ADD CONSTRAINT "asset_status_history_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_status_history" ADD CONSTRAINT "asset_status_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
