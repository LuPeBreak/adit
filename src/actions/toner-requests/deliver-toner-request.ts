'use server'

import { revalidatePath } from 'next/cache'
import { deliverTonerRequestSchema } from '@/lib/schemas/toner-request'
import { withPermissions } from '@/lib/auth/with-permissions'
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/types/action-response'
import type { ActionResponse } from '@/lib/types/action-response'
import type { DeliverTonerRequestData } from '@/lib/schemas/toner-request'
import prisma from '@/lib/prisma'
import { TonerRequestStatus } from '@/generated/prisma'

export const deliverTonerRequestAction = withPermissions(
  [{ resource: 'tonerRequest', action: ['update'] }],
  async (_, data: DeliverTonerRequestData): Promise<ActionResponse<void>> => {
    const validatedFields = deliverTonerRequestSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { tonerRequestId, deliveryNote } = validatedFields.data

    try {
      // Verificar se o pedido existe e pode ser marcado como entregue
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

      // Verificar se o status permite marcar como entregue
      if (existingRequest.status !== TonerRequestStatus.APPROVED) {
        return createErrorResponse(
          'Este pedido não pode ser marcado como entregue no status atual',
          'INVALID_STATUS_ERROR',
          'status',
        )
      }

      // Atualizar o status para entregue
      await prisma.tonerRequest.update({
        where: { id: tonerRequestId },
        data: {
          status: TonerRequestStatus.DELIVERED,
          notes: deliveryNote || null,
          updatedAt: new Date(),
        },
      })

      revalidatePath('/dashboard/toner-requests')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao marcar pedido como entregue:', error)

      return createErrorResponse(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'INTERNAL_ERROR',
      )
    }
  },
)
