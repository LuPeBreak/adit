'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth/auth'
import { withPermissions } from '@/lib/auth/with-permissions'
import {
  createErrorResponse,
  createSuccessResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import {
  updateUserPasswordSchema,
  type UpdateUserPasswordData,
} from '@/lib/schemas/user'

export const updateUserPasswordAction = withPermissions(
  [{ resource: 'user', action: ['set-password'] }], // Usando a mesma permissão por enquanto
  async (_, data: UpdateUserPasswordData): Promise<ActionResponse> => {
    const validatedFields = updateUserPasswordSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { id: userId, password } = validatedFields.data

    try {
      await auth.api.setUserPassword({
        body: {
          userId,
          newPassword: password,
        },
        headers: await headers(),
      })

      revalidatePath('/dashboard/users')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao atualizar senha do usuário:', error)

      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message
        if (errorMessage.includes('not found')) {
          return createErrorResponse(
            'Usuário não encontrado',
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
