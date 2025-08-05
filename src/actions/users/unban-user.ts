'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { unbanUserSchema } from '@/lib/schemas/user'
import { withPermissions } from '@/lib/auth/with-permissions'
import { auth } from '@/lib/auth/auth'
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/types/action-response'
import type { ActionResponse } from '@/lib/types/action-response'
import type { UnbanUserData } from '@/lib/schemas/user'

export const unbanUserAction = withPermissions(
  [{ resource: 'user', action: ['ban'] }],
  async (_, data: UnbanUserData): Promise<ActionResponse<void>> => {
    const validatedFields = unbanUserSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { userId } = validatedFields.data

    try {
      await auth.api.unbanUser({
        body: {
          userId,
        },
        headers: await headers(),
      })

      revalidatePath('/dashboard/users')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao desbanir usuário:', error)

      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message
        if (errorMessage.includes('not found')) {
          return createErrorResponse(
            'Usuário não encontrado',
            'NOT_FOUND_ERROR',
            'userId',
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
