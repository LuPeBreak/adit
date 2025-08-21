'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { AssetsColumnType } from '@/components/data-tables/assets/assets-table-types'

export const getAssets = withPermissions(
  [{ resource: 'asset', action: ['list'] }],
  async (): Promise<ActionResponse<AssetsColumnType[]>> => {
    try {
      const assets = await prisma.asset.findMany({
        select: {
          id: true,
          tag: true,
          status: true,
          assetType: true,
          sector: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          tag: 'asc',
        },
      })

      const formattedAssets = assets.map((asset) => {
        return {
          id: asset.id,
          tag: asset.tag,
          assetType: asset.assetType,
          status: asset.status,
          sector: asset.sector.name,
          sectorId: asset.sector.id,
          department: asset.sector.department.name,
        }
      })

      return createSuccessResponse(formattedAssets)
    } catch (error) {
      console.error('Erro ao buscar ativos:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
