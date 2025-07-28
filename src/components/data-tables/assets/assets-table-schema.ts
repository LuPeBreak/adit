import { AssetStatus, AssetType } from '@/generated/prisma'
import z from 'zod'

export const assetSchema = z.object({
  tag: z.string(),
  assetType: z.nativeEnum(AssetType),
  status: z.nativeEnum(AssetStatus),
  sector: z.string(),
  department: z.string(),
})

export type AssetsColumnType = z.infer<typeof assetSchema>
