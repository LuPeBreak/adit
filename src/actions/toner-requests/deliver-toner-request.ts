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
import { sendEmail } from '@/lib/utils/email-service'
import { createDeliveryEmailTemplate } from '@/lib/utils/email-templates'
import { sendWhatsApp } from '@/lib/utils/whatsapp-service'
import { createDeliveryWhatsAppTemplate } from '@/lib/utils/whatsapp-templates'

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
          requesterWhatsApp: true,
          selectedToner: true,
          printer: {
            select: {
              asset: {
                select: {
                  tag: true,
                },
              },
              printerModel: {
                select: {
                  name: true,
                },
              },
            },
          },
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

      // Preparar dados para as notificações
      const notificationData = {
        requesterName: existingRequest.requesterName,
        selectedToner: existingRequest.selectedToner,
        printerTag: existingRequest.printer?.asset?.tag || 'N/A',
        printerModel: existingRequest.printer?.printerModel?.name || 'N/A',
        deliveryNote,
      }

      const notificationErrors: string[] = []

      // Enviar notificação por email
      try {
        await sendEmail({
          email: existingRequest.requesterEmail,
          subject: 'Toner Entregue - Pedido Finalizado',
          message: createDeliveryEmailTemplate(notificationData),
        })
      } catch (error) {
        console.error('Erro ao enviar email de entrega:', error)
        notificationErrors.push('Email')
      }

      // Enviar notificação por WhatsApp
      try {
        await sendWhatsApp({
          number: `55${existingRequest.requesterWhatsApp}`,
          text: createDeliveryWhatsAppTemplate(notificationData),
        })
      } catch (error) {
        console.error('Erro ao enviar WhatsApp de entrega:', error)
        notificationErrors.push('WhatsApp')
      }

      revalidatePath('/dashboard/toner-requests')

      // Retornar com informações sobre falhas de notificação
      if (notificationErrors.length > 0) {
        return createErrorResponse(
          `Pedido marcado como entregue com sucesso, mas falha ao enviar notificações via: ${notificationErrors.join(' e ')}. Verifique as configurações de ${notificationErrors.join(' e ')}.`,
          'NOTIFICATION_ERROR',
        )
      }

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
