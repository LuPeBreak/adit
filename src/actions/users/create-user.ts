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
import { sendEmail } from '@/lib/notifications/services/email-service'
import { createUserCreatedNotificationTemplate } from '@/lib/notifications/templates/user/email-template'

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

      // Envio de email de boas-vindas para o usuário criado
      const baseUrl = process.env.BETTER_AUTH_URL || ''
      const loginUrl = `${baseUrl}/login`

      try {
        await sendEmail({
          to: email,
          subject: 'Bem-vindo ao Sistema ADIT - PMBM',
          html: createUserCreatedNotificationTemplate({
            userName: name,
            userEmail: email,
            userPassword: password,
            loginUrl,
          }),
        })

        console.log('Email de boas-vindas enviado com sucesso para:', email)
      } catch (emailError) {
        console.error('Erro ao enviar email de boas-vindas:', emailError)
        // Não falha a criação do usuário se o email não for enviado
      }

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
