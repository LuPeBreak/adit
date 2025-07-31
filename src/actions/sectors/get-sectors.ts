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
        departmentId: true,
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return sectors.map((sector) => ({
      id: sector.id,
      name: sector.name,
      manager: sector.manager,
      managerEmail: sector.managerEmail,
      departmentId: sector.departmentId,
      departmentName: sector.department.name,
    }))
  },
)
