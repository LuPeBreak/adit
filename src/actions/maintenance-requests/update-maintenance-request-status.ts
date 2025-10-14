'use server'

import { revalidatePath } from 'next/cache'
import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import {
  updateMaintenanceRequestStatusSchema,
  type UpdateMaintenanceRequestStatusData,
} from '@/lib/schemas/maintenance-request'
import { canTransition } from '@/lib/maintenance/transition-rules'
import {
  getAssetTypeLabel,
  getMaintenanceStatusLabel,
  getAssetStatusLabel,
} from '@/lib/utils/get-status-label'
import { sendEmail } from '@/lib/utils/email-service'
import { sendWhatsApp } from '@/lib/utils/whatsapp-service'
import { createMaintenanceRequestStatusUpdateEmailTemplate } from '@/lib/utils/email-templates'
import { createMaintenanceRequestStatusUpdateWhatsAppTemplate } from '@/lib/utils/whatsapp-templates'
import { normalizeWhatsappNumber } from '@/lib/utils/contact-formatter'

export const updateMaintenanceRequestStatusAction = withPermissions(
  [{ resource: 'maintenanceRequest', action: ['update'] }],
  async (
    session,
    data: UpdateMaintenanceRequestStatusData,
  ): Promise<ActionResponse<{ notificationErrors: string[] }>> => {
    const validatedFields = updateMaintenanceRequestStatusSchema.safeParse(data)
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
      const existingRequest = await prisma.maintenanceRequest.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          requesterEmail: true,
          requesterName: true,
          requesterWhatsApp: true,
          asset: {
            select: {
              id: true,
              tag: true,
              status: true,
              sectorId: true,
              assetType: true,
            },
          },
        },
      })

      if (!existingRequest) {
        return createErrorResponse(
          'Pedido de manutenção não encontrado',
          'NOT_FOUND_ERROR',
          'id',
        )
      }

      // Validar transição de status corretamente
      const { allowed, reason } = canTransition(existingRequest.status, status)
      if (!allowed) {
        return createErrorResponse(
          reason || 'Transição de status inválida para este pedido',
          'INVALID_STATUS_ERROR',
          'status',
        )
      }

      // Atualizar status e registrar histórico em transação
      await prisma.$transaction(async (tx) => {
        await tx.maintenanceRequest.update({
          where: { id },
          data: {
            status,
          },
        })

        await tx.maintenanceRequestHistory.create({
          data: {
            requestId: id,
            status,
            notes,
            changedBy: session.user.id,
          },
        })

        // Atualização opcional do ativo (status e/ou setor)
        // Regras:
        // - Só executa se assetUpdate.updateAsset === true
        // - Se nenhum campo resultar em mudança, pula silenciosamente
        const assetUpdate = validatedFields.data.assetUpdate
        if (assetUpdate?.updateAsset && existingRequest.asset?.id) {
          const assetId = existingRequest.asset.id

          const currentStatus = existingRequest.asset.status
          const currentSectorId = existingRequest.asset.sectorId

          const desiredStatus =
            assetUpdate.status ??
            (status === 'MAINTENANCE' ? 'MAINTENANCE' : undefined)
          const desiredSectorId = assetUpdate.sectorId ?? currentSectorId

          const willChangeStatus =
            typeof desiredStatus !== 'undefined' &&
            desiredStatus !== currentStatus
          const willChangeSector = desiredSectorId !== currentSectorId

          if (willChangeStatus || willChangeSector) {
            const finalStatus = desiredStatus ?? currentStatus
            await tx.asset.update({
              where: { id: assetId },
              data: {
                status: finalStatus,
                sectorId: desiredSectorId,
              },
            })

            const autoNote = `Atualização automática pelo pedido de manutenção (${existingRequest.id}) — ${
              willChangeStatus
                ? `status: ${getAssetStatusLabel(finalStatus)}`
                : ''
            }${
              willChangeSector
                ? `${willChangeStatus ? '; ' : ''}setor atualizado`
                : ''
            }`

            await tx.assetStatusHistory.create({
              data: {
                assetId,
                status: finalStatus,
                sectorId: desiredSectorId,
                changedBy: session.user.id,
                notes: autoNote,
              },
            })
          }
        }
      })

      const assetTag = existingRequest.asset?.tag || 'N/A'
      const assetTypeLabel = existingRequest.asset?.assetType
        ? getAssetTypeLabel(existingRequest.asset.assetType)
        : 'N/A'
      const newStatusLabel = getMaintenanceStatusLabel(status)

      // Enviar notificações em paralelo e consolidar erros
      const notifications = [
        {
          channel: 'Email' as const,
          promise: sendEmail({
            email: existingRequest.requesterEmail,
            subject: 'Atualização de Status - Pedido de Manutenção',
            message: createMaintenanceRequestStatusUpdateEmailTemplate({
              requesterName: existingRequest.requesterName,
              assetTag,
              assetType: assetTypeLabel,
              newStatus: newStatusLabel,
              notes,
            }),
          }),
        },
        {
          channel: 'WhatsApp' as const,
          promise: sendWhatsApp({
            number: normalizeWhatsappNumber(existingRequest.requesterWhatsApp),
            text: createMaintenanceRequestStatusUpdateWhatsAppTemplate({
              requesterName: existingRequest.requesterName,
              assetTag,
              assetType: assetTypeLabel,
              newStatus: newStatusLabel,
              notes,
            }),
          }),
        },
      ]

      const results = await Promise.allSettled(
        notifications.map((n) => n.promise),
      )

      const notificationErrors: string[] = []
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          const ch = notifications[idx].channel
          if (ch === 'Email') {
            console.error(
              'Erro ao enviar email de atualização de manutenção:',
              result.reason,
            )
          } else if (ch === 'WhatsApp') {
            console.error(
              'Erro ao enviar WhatsApp de atualização de manutenção:',
              result.reason,
            )
          }
          notificationErrors.push(ch)
        }
      })

      // Revalidar páginas relacionadas
      revalidatePath('/dashboard/maintenance-requests')
      revalidatePath(`/dashboard/maintenance-requests/${id}`)
      revalidatePath('/dashboard/assets')
      revalidatePath('/dashboard/printers')

      // Sempre retornar sucesso para não bloquear atualização.
      // Se houve falhas de notificação, retornar no payload para informar o usuário do sistema.
      return createSuccessResponse({ notificationErrors })
    } catch (error) {
      console.error('Erro ao atualizar status de manutenção:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
