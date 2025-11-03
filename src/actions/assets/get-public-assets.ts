'use server'

import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export type AssetData = {
  assetId: string
  tag: string
  assetType: string
  sector: string
  department: string
}

export async function getPublicAssetsAction(): Promise<
  ActionResponse<AssetData[]>
> {
  try {
    const assets = await prisma.asset.findMany({
      where: {
        status: 'USING',
      },
      select: {
        id: true,
        tag: true,
        assetType: true,
        sector: {
          select: {
            name: true,
            department: {
              select: {
                acronym: true,
              },
            },
          },
        },
      },
      orderBy: {
        tag: 'asc',
      },
    })

    const formattedAssets = assets.map((asset) => ({
      assetId: asset.id,
      tag: asset.tag,
      assetType: asset.assetType,
      sector: asset.sector.name,
      department: asset.sector.department.acronym,
    }))

    return createSuccessResponse(formattedAssets)
  } catch (error) {
    console.error('Erro ao buscar ativos públicos:', error)
    return createErrorResponse('Erro interno do servidor')
  }
}
