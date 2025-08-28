'use server'

import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
type PrinterData = {
  printerId: string
  tag: string
  sector: string
  department: string
  printerModel: string
  availableToners: string[]
}

export async function getPublicPrintersAction(): Promise<
  ActionResponse<PrinterData[]>
> {
  try {
    const printers = await prisma.asset.findMany({
      where: {
        assetType: 'PRINTER',
        status: 'USING',
        printer: {
          isNot: null,
        },
      },
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
      printerId: asset.printer?.id || '',
      tag: asset.tag,
      sector: asset.sector.name,
      department: asset.sector.department.name,
      printerModel: asset.printer?.printerModel.name || '',
      availableToners: asset.printer?.printerModel.toners || [],
    }))

    return createSuccessResponse(formattedPrinters)
  } catch (error) {
    console.error('Erro ao buscar impressoras públicas:', error)
    return createErrorResponse('Erro interno do servidor')
  }
}
