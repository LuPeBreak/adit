'use server'

import { revalidatePath } from 'next/cache'
import { rejectTonerRequestSchema } from '@/lib/schemas/toner-request'
import { withPermissions } from '@/lib/auth/with-permissions'
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/types/action-response'
import type { ActionResponse } from '@/lib/types/action-response'
import type { RejectTonerRequestData } from '@/lib/schemas/toner-request'
import prisma from '@/lib/prisma'
import { TonerRequestStatus } from '@/generated/prisma'

export const rejectTonerRequestAction = withPermissions(
  [{ resource: 'tonerRequest', action: ['update'] }],
  async (_, data: RejectTonerRequestData): Promise<ActionResponse<void>> => {
    const validatedFields = rejectTonerRequestSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { tonerRequestId, rejectionReason } = validatedFields.data

    try {
      // Verificar se o pedido existe e pode ser rejeitado
      const existingRequest = await prisma.tonerRequest.findUnique({
        where: { id: tonerRequestId },
        select: {
          id: true,
          status: true,
          requesterEmail: true,
          requesterName: true,
        },
      })

      if (!existingRequest) {
        return createErrorResponse(
          'Pedido de toner não encontrado',
          'NOT_FOUND_ERROR',
          'tonerRequestId',
        )
      }

      // Verificar se o status permite rejeição
      if (existingRequest.status !== TonerRequestStatus.PENDING) {
        return createErrorResponse(
          'Este pedido não pode ser rejeitado no status atual',
          'INVALID_STATUS_ERROR',
          'status',
        )
      }

      // Atualizar o status para rejeitado e adicionar o motivo
      await prisma.tonerRequest.update({
        where: { id: tonerRequestId },
        data: {
          status: TonerRequestStatus.REJECTED,
          notes: rejectionReason, // Usar o campo notes para armazenar o motivo da rejeição
          updatedAt: new Date(),
        },
      })

      // TODO: Implementar envio de email de rejeição
      // Quando implementarmos o sistema de email, adicionar aqui:
      // await sendRejectionEmail({
      //   to: existingRequest.requesterEmail,
      //   requesterName: existingRequest.requesterName,
      //   tonerRequestId: tonerRequestId,
      //   rejectionReason: rejectionReason,
      // })

      revalidatePath('/dashboard/toner-requests')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao rejeitar pedido de toner:', error)

      return createErrorResponse(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'INTERNAL_ERROR',
      )
    }
  },
)
