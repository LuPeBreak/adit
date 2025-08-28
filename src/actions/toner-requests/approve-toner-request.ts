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
import { sendEmail } from '@/lib/utils/email-service'
import { createApprovalEmailTemplate } from '@/lib/utils/email-templates'
import { sendWhatsApp } from '@/lib/utils/whatsapp-service'
import { createApprovalWhatsAppTemplate } from '@/lib/utils/whatsapp-templates'

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
          selectedToner: true,
          requesterEmail: true,
          requesterName: true,
          requesterWhatsApp: true,
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

      // Verificar se o status permite aprovação
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

      // Enviar email de aprovação
      await sendEmail({
        email: existingRequest.requesterEmail,
        subject: 'Pedido de Toner Aprovado - Equipe de TI PMBM',
        message: createApprovalEmailTemplate({
          requesterName: existingRequest.requesterName,
          requesterEmail: existingRequest.requesterEmail,
          selectedToner: existingRequest.selectedToner,
          printerTag: existingRequest.printer?.asset?.tag || 'N/A',
          printerModel: existingRequest.printer?.printerModel?.name || 'N/A',
        }),
      })

      // Enviar mensagem WhatsApp de aprovação
      await sendWhatsApp({
        number: `55${existingRequest.requesterWhatsApp}`,
        text: createApprovalWhatsAppTemplate({
          requesterName: existingRequest.requesterName,
          selectedToner: existingRequest.selectedToner,
          printerTag: existingRequest.printer?.asset?.tag || 'N/A',
          printerModel: existingRequest.printer?.printerModel?.name || 'N/A',
        }),
      })

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
