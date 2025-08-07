'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'

export const getTonerRequests = withPermissions(
  [{ resource: 'tonerRequest', action: ['list'] }],
  async () => {
    const tonerRequests = await prisma.tonerRequest.findMany({
      select: {
        id: true,
        requesterName: true,
        status: true,
        createdAt: true,
        asset: {
          select: {
            tag: true,
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return tonerRequests.map((request) => ({
      id: request.id,
      requesterName: request.requesterName,
      assetTag: request.asset.tag,
      sector: request.asset.sector.name,
      department: request.asset.sector.department.name,
      status: request.status,
      createdAt: request.createdAt,
    }))
  },
)
