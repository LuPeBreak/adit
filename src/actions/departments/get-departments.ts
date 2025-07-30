'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'

export const getDepartments = withPermissions(
  [{ resource: 'department', action: ['list'] }],
  async () => {
    const departments = await prisma.department.findMany({
      select: {
        name: true,
        manager: true,
        managerEmail: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return departments
  },
)
