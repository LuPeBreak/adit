'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  deleteDepartmentSchema,
  type DeleteDepartmentData,
} from '@/lib/schemas/department'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const deleteDepartmentAction = withPermissions(
  [{ resource: 'department', action: ['delete'] }],
  async (_, data: DeleteDepartmentData): Promise<ActionResponse> => {
    const validatedFields = deleteDepartmentSchema.safeParse(data)
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
      await prisma.department.delete({
        where: { id },
      })

      revalidatePath('/dashboard/departments')

      return createSuccessResponse()
    } catch (error) {
      // depois podemos mandar isso para uma ferramenta de monitoramento como Sentry
      console.error('Erro ao deletar secretaria:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        // Erro de registro não encontrado
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Secretaria não encontrada',
            'NOT_FOUND_ERROR',
            'id',
          )
        }

        // Erro de violação de chave estrangeira
        if (error.code === 'P2003') {
          return createErrorResponse(
            'Não é possível deletar esta secretaria pois ela possui setores vinculados',
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
