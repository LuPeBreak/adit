'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  deletePrinterSchema,
  type DeletePrinterData,
} from '@/lib/schemas/printer'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const deletePrinterAction = withPermissions(
  [
    { resource: 'printer', action: ['delete'] },
    { resource: 'asset', action: ['delete'] },
  ],
  async (_, data: DeletePrinterData): Promise<ActionResponse> => {
    const validatedFields = deletePrinterSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { id } = validatedFields.data

    try {
      await prisma.$transaction(async (tx) => {
        const deletedPrinter = await tx.printer.delete({
          where: { id },
        })

        await tx.asset.delete({
          where: { id: deletedPrinter.assetId },
        })
      })

      revalidatePath('/dashboard/printers')
      revalidatePath('/dashboard/assets')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao deletar impressora:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Impressora não encontrada',
            'NOT_FOUND_ERROR',
            'id',
          )
        }
      }

      return createErrorResponse(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'INTERNAL_ERROR',
      )
    }
  },
)
