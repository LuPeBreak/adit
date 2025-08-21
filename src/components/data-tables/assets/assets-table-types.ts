import { AssetStatus, AssetType } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type AssetsColumnType = {
  id: string
  tag: string
  status: AssetStatus
  sector: string
  sectorId: string
  department: string
  assetType: AssetType
}

export interface AssetRowActionsProps {
  row: Row<AssetsColumnType>
}
