'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'

export const getSectors = withPermissions(
  [{ resource: 'sector', action: ['list'] }],
  async () => {
    const sectors = await prisma.sector.findMany({
      select: {
        id: true,
        name: true,
        manager: true,
        managerEmail: true,
      },
    })

    return sectors
  },
)
