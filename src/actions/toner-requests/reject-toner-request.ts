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
import { sendEmail } from '@/lib/utils/email-service'
import { createRejectionEmailTemplate } from '@/lib/utils/email-templates'
import { sendWhatsApp } from '@/lib/utils/whatsapp-service'
import { createRejectionWhatsAppTemplate } from '@/lib/utils/whatsapp-templates'

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

      // Preparar dados para notificações
      const notificationData = {
        requesterName: existingRequest.requesterName,
        requesterEmail: existingRequest.requesterEmail,
        rejectionReason,
        selectedToner: existingRequest.selectedToner,
        printerTag: existingRequest.printer?.asset?.tag || 'N/A',
        printerModel: existingRequest.printer?.printerModel?.name || 'N/A',
      }

      const notificationErrors: string[] = []

      // Enviar email de rejeição
      try {
        await sendEmail({
          email: existingRequest.requesterEmail,
          subject: 'Pedido de Toner Rejeitado - Equipe de TI PMBM',
          message: createRejectionEmailTemplate(notificationData),
        })
      } catch (error) {
        console.error('Erro ao enviar email de rejeição:', error)
        notificationErrors.push('Email')
      }

      // Enviar mensagem WhatsApp de rejeição
      try {
        await sendWhatsApp({
          number: `55${existingRequest.requesterWhatsApp}`,
          text: createRejectionWhatsAppTemplate(notificationData),
        })
      } catch (error) {
        console.error('Erro ao enviar WhatsApp de rejeição:', error)
        notificationErrors.push('WhatsApp')
      }

      revalidatePath('/dashboard/toner-requests')

      // Retornar com informações sobre falhas de notificação
      if (notificationErrors.length > 0) {
        return createErrorResponse(
          `Pedido rejeitado com sucesso, mas falha ao enviar notificações via: ${notificationErrors.join(' e ')}. Verifique as configurações de ${notificationErrors.join(' e ')}.`,
          'NOTIFICATION_ERROR',
        )
      }

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
