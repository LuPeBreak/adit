'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'

// Exemplo 1: Usando withPermission com múltiplas permissões
export const getPrinters = withPermissions(
  [{ resource: 'printer', action: ['list'] }],
  async () => {
    const printers = await prisma.printer.findMany({
      select: {
        serialNumber: true,
        ipAddress: true,
        printerModel: {
          select: {
            name: true,
          },
        },
        asset: {
          select: {
            tag: true,
            status: true,
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
    })

    const formattedPrinters = printers.map((printer) => {
      return {
        serialNumber: printer.serialNumber,
        ipAddress: printer.ipAddress,
        printerModel: printer.printerModel.name,
        tag: printer.asset.tag,
        status: printer.asset.status,
        sector: printer.asset.sector.name,
        department: printer.asset.sector.department.name,
      }
    })

    return formattedPrinters
  },
)
