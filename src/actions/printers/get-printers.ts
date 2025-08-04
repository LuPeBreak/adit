'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'

export const getPrinters = withPermissions(
  [{ resource: 'printer', action: ['list'] }],
  async () => {
    const printers = await prisma.printer.findMany({
      select: {
        id: true,
        serialNumber: true,
        ipAddress: true,
        printerModelId: true,
        printerModel: {
          select: {
            name: true,
          },
        },
        asset: {
          select: {
            id: true,
            tag: true,
            status: true,
            sectorId: true,
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
        asset: {
          tag: 'asc',
        },
      },
    })

    const formattedPrinters = printers.map((printer) => {
      return {
        id: printer.id,
        serialNumber: printer.serialNumber,
        ipAddress: printer.ipAddress,
        printerModelId: printer.printerModelId,
        printerModel: printer.printerModel.name,
        assetId: printer.asset.id,
        tag: printer.asset.tag,
        status: printer.asset.status,
        sectorId: printer.asset.sectorId,
        sector: printer.asset.sector.name,
        department: printer.asset.sector.department.name,
      }
    })

    return formattedPrinters
  },
)
