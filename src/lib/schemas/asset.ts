import { z } from 'zod'
import { AssetStatus, AssetType } from '@/generated/prisma'

// Schema para atualização de status do ativo
export const updateAssetStatusSchema = z.object({
  assetId: z.string().cuid('ID do ativo inválido'),
  status: z.nativeEnum(AssetStatus, { message: 'O status é obrigatório' }),
  sectorId: z.string().cuid('ID do setor inválido'),
  notes: z
    .string()
    .max(100, 'As observações devem ter no máximo 100 caracteres')
    .optional(),
})

export const getAssetHistoryByTagSchema = z.object({
  tag: z.string().min(1, 'Número de patrimônio é obrigatório'),
})

export const getAssetsMetricsByTypeSchema = z.object({
  assetType: z.nativeEnum(AssetType).optional(),
})

export type UpdateAssetStatusData = z.infer<typeof updateAssetStatusSchema>
export type GetAssetHistoryByTagData = z.infer<
  typeof getAssetHistoryByTagSchema
>
export type GetAssetsMetricsByTypeData = z.infer<
  typeof getAssetsMetricsByTypeSchema
>
