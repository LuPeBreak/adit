'use server'

import type { StatusHistoryColumnType } from '@/components/data-tables/status-history/status-history-types'
import type { AssetType } from '@/generated/prisma'
import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  getAssetHistoryByTagSchema,
  type GetAssetHistoryByTagData,
} from '@/lib/schemas/asset'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

type AssetHistoryByTagResponse = {
  asset: {
    tag: string
    assetType: AssetType
  }
  assetHistory: StatusHistoryColumnType[]
}

export const getAssetHistoryByTagAction = withPermissions(
  [
    { resource: 'asset', action: ['list'] },
    { resource: 'assetHistory', action: ['list'] },
  ],
  async (
    _,
    data: GetAssetHistoryByTagData,
  ): Promise<ActionResponse<AssetHistoryByTagResponse>> => {
    const validatedFields = getAssetHistoryByTagSchema.safeParse(data)

    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { tag } = validatedFields.data

    try {
      const asset = await prisma.asset.findUnique({
        where: { tag },
        select: {
          tag: true,
          assetType: true,
          statusHistory: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              status: true,
              notes: true,
              createdAt: true,
              sector: {
                select: {
                  name: true,
                  department: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      if (!asset) {
        return createErrorResponse(
          'Ativo não encontrado',
          'NOT_FOUND_ERROR',
          'tag',
        )
      }

      return createSuccessResponse({
        asset: {
          tag: asset.tag,
          assetType: asset.assetType,
        },
        assetHistory: asset.statusHistory,
      })
    } catch (error) {
      console.error('Erro ao buscar ativo por tag:', error)
      return createErrorResponse(
        'Erro interno do servidor ao buscar ativo',
        'INTERNAL_SERVER_ERROR',
      )
    }
  },
)
