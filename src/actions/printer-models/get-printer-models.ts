'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'

export const getPrinterModels = withPermissions(
  [{ resource: 'printerModel', action: ['list'] }],
  async () => {
    const printerModels = await prisma.printerModel.findMany({
      select: {
        id: true,
        name: true,
        toners: true,
        _count: {
          select: {
            printers: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return printerModels
  },
)
