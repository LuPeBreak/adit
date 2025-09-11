'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { deletePhoneSchema, type DeletePhoneData } from '@/lib/schemas/phone'

export const deletePhoneAction = withPermissions(
  [
    { resource: 'phone', action: ['delete'] },
    { resource: 'asset', action: ['delete'] },
  ],
  async (_, data: DeletePhoneData): Promise<ActionResponse> => {
    const validatedFields = deletePhoneSchema.safeParse(data)
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
        const deletedPhone = await tx.phone.delete({
          where: { id },
        })

        await tx.asset.delete({
          where: { id: deletedPhone.assetId },
        })
      })

      revalidatePath('/dashboard/phones')
      revalidatePath('/dashboard/assets')

      return createSuccessResponse()
    } catch (error) {
      // depois podemos mandar isso para uma ferramenta de monitoramento como Sentry
      console.error('Erro ao deletar telefone:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        // Erro de registro não encontrado
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Telefone não encontrado',
            'NOT_FOUND_ERROR',
            'id',
          )
        }

        // Erro de violação de chave estrangeira
        if (error.code === 'P2003') {
          return createErrorResponse(
            'Não é possível deletar este telefone pois ele possui dependências',
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
