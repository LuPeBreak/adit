import { AssetStatus, AssetType } from '@/generated/prisma'

export type AssetsColumnType = {
  tag: string
  status: AssetStatus
  sector: string
  department: string
  assetType: AssetType
}
