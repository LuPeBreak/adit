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
import { sendEmail } from '@/lib/notifications/services/email-service'
import { createUserPasswordUpdatedEmailTemplate } from '@/lib/notifications/templates/user/email-template'
import prisma from '@/lib/prisma'

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
      // Buscar dados do usuário antes de atualizar a senha
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      if (!user) {
        return createErrorResponse(
          'Usuário não encontrado',
          'NOT_FOUND_ERROR',
          'id',
        )
      }

      await auth.api.setUserPassword({
        body: {
          userId,
          newPassword: password,
        },
        headers: await headers(),
      })

      // Envio de email de notificação sobre alteração de senha
      const baseUrl = process.env.BETTER_AUTH_URL || ''
      const loginUrl = `${baseUrl}/login`

      try {
        await sendEmail({
          to: user.email,
          subject: 'Senha Alterada - Sistema ADIT',
          html: createUserPasswordUpdatedEmailTemplate({
            userName: user.name,
            userEmail: user.email,
            newPassword: password,
            loginUrl,
          }),
        })

        console.log(
          'Email de alteração de senha enviado com sucesso para:',
          user.email,
        )
      } catch (emailError) {
        console.error('Erro ao enviar email de alteração de senha:', emailError)
        // Não falha a atualização da senha se o email não for enviado
      }

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
