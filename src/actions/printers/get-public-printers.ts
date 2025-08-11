'use server'

import prisma from '@/lib/prisma'

export async function getPublicPrintersAction() {
  const printers = await prisma.asset.findMany({
    where: {
      assetType: 'PRINTER',
      printer: {
        isNot: null,
      },
    },
    select: {
      id: true,
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
      printer: {
        select: {
          id: true,
          printerModel: {
            select: {
              name: true,
              toners: true,
            },
          },
        },
      },
    },
    orderBy: {
      tag: 'asc',
    },
  })

  const formattedPrinters = printers.map((asset) => ({
    assetId: asset.id,
    tag: asset.tag,
    status: asset.status,
    sector: asset.sector.name,
    department: asset.sector.department.name,
    printerModel: asset.printer?.printerModel.name || '',
    availableToners: asset.printer?.printerModel.toners || [],
  }))

  return formattedPrinters
}
