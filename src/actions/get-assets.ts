'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'

export const getAssets = withPermissions(
  [{ resource: 'asset', action: ['list'] }],
  async () => {
    const assets = await prisma.asset.findMany({
      select: {
        tag: true,
        status: true,
        assetType: true,
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
      },
    })

    const formattedAssets = assets.map((asset) => {
      return {
        tag: asset.tag,
        assetType: asset.assetType,
        status: asset.status,
        sector: asset.sector.name,
        department: asset.sector.department.name,
      }
    })

    return formattedAssets
  },
)
