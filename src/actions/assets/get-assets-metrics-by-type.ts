'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import {
  getAssetsMetricsByTypeSchema,
  type GetAssetsMetricsByTypeData,
} from '@/lib/schemas/asset'
import { AssetStatus } from '@/generated/prisma'

// Tipagens simplificadas
type AssetsByStatus = Record<AssetStatus, number>

interface AssetsMetrics {
  totalAssets: number
  assetsByStatus: AssetsByStatus
}

export const getAssetsMetricsByType = withPermissions(
  [{ resource: 'asset', action: ['list'] }],
  async (
    _,
    data?: GetAssetsMetricsByTypeData,
  ): Promise<ActionResponse<AssetsMetrics>> => {
    try {
      const validatedData = data
        ? getAssetsMetricsByTypeSchema.parse(data)
        : { assetType: undefined }
      const { assetType } = validatedData

      const assetFilter = assetType ? { assetType } : {}

      // 1. Total de ativos
      const totalAssets = await prisma.asset.count({ where: assetFilter })

      // 2. Ativos por status (totalmente otimizado com groupBy)
      const assetsByStatusRaw = await prisma.asset.groupBy({
        by: ['status'],
        where: assetFilter,
        _count: { status: true },
      })

      // Inicializa todos os status com 0 para garantir consistência
      const assetsByStatus: AssetsByStatus = {
        [AssetStatus.USING]: 0,
        [AssetStatus.MAINTENANCE]: 0,
        [AssetStatus.STOCK]: 0,
        [AssetStatus.BROKEN]: 0,
        [AssetStatus.RESERVED]: 0,
      }

      // Popula apenas os status que existem no resultado
      assetsByStatusRaw.forEach((item) => {
        assetsByStatus[item.status] = item._count.status
      })

      const metrics: AssetsMetrics = {
        totalAssets,
        assetsByStatus,
      }

      return createSuccessResponse(metrics)
    } catch (error) {
      console.error('Erro ao buscar métricas de ativos:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
