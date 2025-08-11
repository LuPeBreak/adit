'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { PrinterModelsColumnType } from '@/components/data-tables/printer-models/printer-models-table-types'

export const getPrinterModels = withPermissions(
  [{ resource: 'printerModel', action: ['list'] }],
  async (): Promise<ActionResponse<PrinterModelsColumnType[]>> => {
    try {
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

      return createSuccessResponse(printerModels)
    } catch (error) {
      console.error('Erro ao buscar modelos de impressora:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
