'use server'

import { revalidatePath } from 'next/cache'
import { approveTonerRequestSchema } from '@/lib/schemas/toner-request'
import { withPermissions } from '@/lib/auth/with-permissions'
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/types/action-response'
import type { ActionResponse } from '@/lib/types/action-response'
import type { ApproveTonerRequestData } from '@/lib/schemas/toner-request'
import prisma from '@/lib/prisma'
import { TonerRequestStatus } from '@/generated/prisma'

export const approveTonerRequestAction = withPermissions(
  [{ resource: 'tonerRequest', action: ['update'] }],
  async (_, data: ApproveTonerRequestData): Promise<ActionResponse<void>> => {
    const validatedFields = approveTonerRequestSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { tonerRequestId } = validatedFields.data

    try {
      // Verificar se o pedido existe e pode ser aprovado
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

      // Verificar se o status permite aprovação
      // REJECTED e DELIVERED são estados finais
      if (existingRequest.status !== TonerRequestStatus.PENDING) {
        return createErrorResponse(
          'Este pedido não pode ser aprovado no status atual',
          'INVALID_STATUS_ERROR',
          'status',
        )
      }

      // Atualizar o status para aprovado
      await prisma.tonerRequest.update({
        where: { id: tonerRequestId },
        data: {
          status: TonerRequestStatus.APPROVED,
          updatedAt: new Date(),
        },
      })

      // TODO: Implementar envio de email de aprovação
      // Quando implementarmos o sistema de email, adicionar aqui:
      // await sendApprovalEmail({
      //   to: existingRequest.requesterEmail,
      //   requesterName: existingRequest.requesterName,
      //   tonerRequestId: tonerRequestId,
      // })

      revalidatePath('/dashboard/toner-requests')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao aprovar pedido de toner:', error)

      return createErrorResponse(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'INTERNAL_ERROR',
      )
    }
  },
)
