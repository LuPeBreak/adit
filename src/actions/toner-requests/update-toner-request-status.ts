'use server'

import { revalidatePath } from 'next/cache'
import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/types/action-response'
import type { ActionResponse } from '@/lib/types/action-response'
import { updateTonerRequestStatusSchema } from '@/lib/schemas/toner-request'
import type { UpdateTonerRequestStatusData } from '@/lib/schemas/toner-request'
import { TonerRequestStatus } from '@/generated/prisma'
import { sendEmail } from '@/lib/notifications/services/email-service'
import { sendWhatsApp } from '@/lib/notifications/services/whatsapp-service'
import { createTonerRequestStatusUpdateTemplate } from '@/lib/notifications/templates/toner-request/email-template'
import { createTonerRequestStatusUpdateWhatsAppTemplate } from '@/lib/notifications/templates/toner-request/whatsapp-template'
import { normalizeWhatsappNumber } from '@/lib/utils/contact-formatter'
import { canTransition } from '@/lib/status-transition-rules/toner/transition-rules'

export const updateTonerRequestStatusAction = withPermissions(
  [{ resource: 'tonerRequest', action: ['update'] }],
  async (
    session,
    data: UpdateTonerRequestStatusData,
  ): Promise<ActionResponse<{ notificationErrors: string[] }>> => {
    const validatedFields = updateTonerRequestStatusSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { id, status, notes } = validatedFields.data

    try {
      const existingRequest = await prisma.tonerRequest.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          requesterName: true,
          requesterEmail: true,
          requesterWhatsApp: true,
          selectedToner: true,
          printer: {
            select: {
              asset: {
                select: {
                  tag: true,
                  sector: {
                    select: {
                      name: true,
                      department: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
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
          'id',
        )
      }

      // Validar transições de status
      if (
        !canTransition(existingRequest.status as TonerRequestStatus, status)
      ) {
        return createErrorResponse(
          'Transição de status inválida para este pedido',
          'INVALID_STATUS_ERROR',
          'status',
        )
      }

      // Atualizar apenas o status
      await prisma.tonerRequest.update({
        where: { id },
        data: { status },
      })

      // Enviar notificações
      const notifications: Array<{
        channel: 'Email' | 'WhatsApp'
        promise: Promise<unknown>
      }> = [
        {
          channel: 'Email' as const,
          promise: sendEmail({
            to: existingRequest.requesterEmail,
            subject: 'Atualização de Status - Pedido de Toner',
            html: createTonerRequestStatusUpdateTemplate({
              requesterName: existingRequest.requesterName,
              requesterEmail: existingRequest.requesterEmail,
              requesterWhatsApp: existingRequest.requesterWhatsApp,
              department: existingRequest.printer.asset.sector.department.name,
              sector: existingRequest.printer.asset.sector.name,
              selectedToner: existingRequest.selectedToner,
              printerTag: existingRequest.printer.asset.tag,
              printerModel: existingRequest.printer.printerModel.name,
              notes,
              status,
            }),
          }),
        },
      ]

      // Adicionar WhatsApp se disponível
      if (existingRequest.requesterWhatsApp) {
        const normalizedWhatsApp = normalizeWhatsappNumber(
          existingRequest.requesterWhatsApp,
        )
        if (normalizedWhatsApp) {
          notifications.push({
            channel: 'WhatsApp' as const,
            promise: sendWhatsApp({
              to: normalizedWhatsApp,
              message: createTonerRequestStatusUpdateWhatsAppTemplate({
                requesterName: existingRequest.requesterName,
                selectedToner: existingRequest.selectedToner,
                printerTag: existingRequest.printer.asset.tag,
                printerModel: existingRequest.printer.printerModel.name,
                department:
                  existingRequest.printer.asset.sector.department.name,
                sector: existingRequest.printer.asset.sector.name,
                notes,
                status,
              }),
            }),
          })
        }
      }

      const results = await Promise.allSettled(
        notifications.map((n) => n.promise),
      )

      const notificationErrors: string[] = []
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          const ch = notifications[idx].channel
          console.error(
            `Erro ao enviar ${ch} de atualização de toner:`,
            result.reason,
          )
          notificationErrors.push(ch)
        }
      })

      // Revalidar páginas relacionadas
      revalidatePath('/dashboard/toner-requests')
      revalidatePath(`/dashboard/toner-requests/${id}`)

      return createSuccessResponse({ notificationErrors })
    } catch (error) {
      console.error('Erro ao atualizar status de toner:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
