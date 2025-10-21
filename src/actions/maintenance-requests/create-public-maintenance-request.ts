'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  publicMaintenanceRequestSchema,
  type PublicMaintenanceRequestData,
} from '@/lib/schemas/public-maintenance-request'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { sendEmail } from '@/lib/notifications/services/email-service'
import { sendWhatsApp } from '@/lib/notifications/services/whatsapp-service'
import {
  createMaintenanceRequestNotificationTemplate,
  createMaintenanceRequestConfirmationTemplate,
} from '@/lib/notifications/templates/maintenance-request/email-template'
import { createMaintenanceRequestConfirmationWhatsAppTemplate } from '@/lib/notifications/templates/maintenance-request/whatsapp-template'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { normalizeWhatsappNumber } from '@/lib/utils/contact-formatter'
import { AssetStatus, MaintenanceStatus } from '@/generated/prisma'

export async function createPublicMaintenanceRequestAction(
  data: PublicMaintenanceRequestData,
): Promise<ActionResponse<void>> {
  const validatedFields = publicMaintenanceRequestSchema.safeParse(data)
  if (!validatedFields.success) {
    const firstError = validatedFields.error.errors[0]
    return createErrorResponse(
      firstError.message,
      'VALIDATION_ERROR',
      firstError.path[0]?.toString(),
    )
  }

  const {
    assetId,
    requesterName,
    registrationNumber,
    requesterEmail,
    requesterWhatsApp,
    description,
  } = validatedFields.data

  try {
    // Buscar o ativo pelo ID e verificar se existe pedido pendente
    const asset = await prisma.asset.findUnique({
      where: {
        id: assetId,
        status: AssetStatus.USING, // Apenas ativos em uso
      },
      select: {
        id: true,
        tag: true,
        assetType: true,
        status: true,
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
        maintenanceRequests: {
          where: {
            status: {
              in: [
                MaintenanceStatus.PENDING,
                MaintenanceStatus.ANALYZING,
                MaintenanceStatus.MAINTENANCE,
              ],
            },
          },
          select: {
            id: true,
          },
          take: 1,
        },
      },
    })

    if (!asset) {
      return createErrorResponse(
        'Ativo não encontrado ou não está em uso. Apenas ativos em uso podem ter pedidos de manutenção.',
        'NOT_FOUND_ERROR',
        'assetId',
      )
    }

    if (asset.maintenanceRequests.length > 0) {
      return createErrorResponse(
        'Já existe um pedido de manutenção em andamento para este ativo. Aguarde a conclusão do pedido existente antes de criar um novo.',
        'VALIDATION_ERROR',
        'assetId',
      )
    }

    // Criar o pedido de manutenção
    await prisma.maintenanceRequest.create({
      data: {
        assetId: asset.id,
        requesterName,
        registrationNumber,
        requesterEmail,
        requesterWhatsApp,
        description,
        status: MaintenanceStatus.PENDING,
      },
    })

    // Executar notificações em paralelo para melhor performance
    const notificationPromises: Promise<unknown>[] = []

    // Email para a equipe de TI (somente se configurado)
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && adminEmail.trim().length > 0) {
      notificationPromises.push(
        sendEmail({
          to: adminEmail,
          subject: `Novo Pedido de Manutenção - ${asset.tag}`,
          html: createMaintenanceRequestNotificationTemplate({
            requesterName,
            requesterEmail,
            requesterWhatsApp,
            department: asset.sector.department.name,
            sector: asset.sector.name,
            assetTag: asset.tag,
            assetType: getAssetTypeLabel(asset.assetType),
            description,
            notes: description,
            status: 'PENDING',
          }),
        }),
      )
    } else {
      console.warn(
        'ADMIN_EMAIL não configurado. Notificação para equipe de TI não será enviada.',
      )
    }

    // Email de confirmação para o solicitante
    notificationPromises.push(
      sendEmail({
        to: requesterEmail,
        subject: `Confirmação de Pedido de Manutenção - ${asset.tag}`,
        html: createMaintenanceRequestConfirmationTemplate({
          requesterName,
          requesterEmail,
          requesterWhatsApp,
          department: asset.sector.department.name,
          sector: asset.sector.name,
          assetTag: asset.tag,
          assetType: getAssetTypeLabel(asset.assetType),
          description,
          notes: description,
          status: 'PENDING',
        }),
      }),
    )

    // WhatsApp de confirmação para o solicitante (somente se número normalizado válido)
    const normalizedWhatsApp = normalizeWhatsappNumber(requesterWhatsApp)
    if (normalizedWhatsApp && normalizedWhatsApp.length === 13) {
      notificationPromises.push(
        sendWhatsApp({
          to: normalizedWhatsApp,
          message: createMaintenanceRequestConfirmationWhatsAppTemplate({
            requesterName,
            assetTag: asset.tag,
            assetType: getAssetTypeLabel(asset.assetType),
            department: asset.sector?.department?.name || 'Não informado',
            sector: asset.sector?.name || 'Não informado',
            description,
            status: 'PENDING',
          }),
        }),
      )
    } else {
      console.warn(
        'Número de WhatsApp do solicitante inválido. Mensagem não será enviada.',
      )
    }

    // Aguardar todas as notificações (sem bloquear em caso de erro)
    await Promise.allSettled(notificationPromises)

    // Revalidar cache das páginas relacionadas
    revalidatePath('/dashboard/maintenance-requests')

    return createSuccessResponse()
  } catch (error) {
    console.error('Erro ao criar pedido de manutenção:', error)
    return createErrorResponse('Erro interno do servidor')
  }
}
