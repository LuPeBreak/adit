'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  deletePrinterModelSchema,
  type DeletePrinterModelData,
} from '@/lib/schemas/printer-model'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const deletePrinterModelAction = withPermissions(
  [{ resource: 'printerModel', action: ['delete'] }],
  async (_, data: DeletePrinterModelData): Promise<ActionResponse> => {
    const validatedFields = deletePrinterModelSchema.safeParse(data)
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
      await prisma.printerModel.delete({
        where: { id },
      })

      revalidatePath('/dashboard/printer-models')

      return createSuccessResponse()
    } catch (error) {
      // depois podemos mandar isso para uma ferramenta de monitoramento como Sentry
      console.error('Erro ao deletar modelo de impressora:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        // Erro de registro não encontrado
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Modelo de impressora não encontrado',
            'NOT_FOUND_ERROR',
            'id',
          )
        }

        // Erro de violação de chave estrangeira
        if (error.code === 'P2003') {
          return createErrorResponse(
            'Não é possível deletar este modelo pois ele possui impressoras vinculadas',
            'FOREIGN_KEY_ERROR',
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
