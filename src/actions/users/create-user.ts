'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth/auth'
import { withPermissions } from '@/lib/auth/with-permissions'
import {
  createErrorResponse,
  createSuccessResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { createUserSchema, type CreateUserData } from '@/lib/schemas/user'

export const createUserAction = withPermissions(
  [{ resource: 'user', action: ['create'] }],
  async (session, data: CreateUserData): Promise<ActionResponse> => {
    const validatedFields = createUserSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { email, name, role, password } = validatedFields.data

    try {
      const result = await auth.api.createUser({
        body: {
          email,
          password,
          name,
          role,
        },
      })

      if (!result || !result.user) {
        return createErrorResponse('Erro ao criar usuário')
      }

      // TODO: Implementar envio de email com credenciais de login
      // Aqui seria enviado um email com:
      // - Nome do usuário
      // - Email de login
      // - Senha (se gerada automaticamente)
      // - Link para o sistema
      // - Instruções de primeiro acesso

      console.log('TODO: Enviar email de boas-vindas para:', email)
      console.log('Credenciais:', {
        email,
        password: '[senha definida pelo admin]',
      })

      revalidatePath('/dashboard/users')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao criar usuário:', error)

      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message
        if (
          errorMessage.includes('already exists') ||
          errorMessage.includes('duplicate')
        ) {
          return createErrorResponse(
            'Email já está em uso',
            'DUPLICATE_ERROR',
            'email',
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
