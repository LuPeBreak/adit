'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { banUserSchema } from '@/lib/schemas/user'
import { withPermissions } from '@/lib/auth/with-permissions'
import { auth } from '@/lib/auth/auth'
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/types/action-response'
import type { ActionResponse } from '@/lib/types/action-response'
import type { BanUserData } from '@/lib/schemas/user'

export const banUserAction = withPermissions(
  [{ resource: 'user', action: ['ban'] }],
  async (_, data: BanUserData): Promise<ActionResponse<void>> => {
    const validatedFields = banUserSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { userId, banReason } = validatedFields.data

    try {
      // Banir usuário usando Better Auth
      await auth.api.banUser({
        body: {
          userId,
          banReason,
        },
        headers: await headers(),
      })

      // Revalidar o cache da página de usuários
      revalidatePath('/dashboard/users')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao banir usuário:', error)

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
