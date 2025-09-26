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
import { sendEmail } from '@/lib/utils/email-service'
import {
  createMaintenanceRequestNotificationTemplate,
  createMaintenanceRequestConfirmationTemplate,
} from '@/lib/utils/email-templates'
import { sendWhatsApp } from '@/lib/utils/whatsapp-service'
import { createMaintenanceRequestConfirmationWhatsAppTemplate } from '@/lib/utils/whatsapp-templates'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'

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
        status: 'USING', // Apenas ativos em uso
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
              in: ['PENDING', 'ANALYZING', 'MAINTENANCE'],
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
        status: 'PENDING',
      },
    })

    // Executar notificações em paralelo para melhor performance
    const notificationPromises = [
      // Email para a equipe de TI
      sendEmail({
        email: process.env.ADMIN_EMAIL!,
        subject: `Novo Pedido de Manutenção - ${asset.tag}`,
        message: createMaintenanceRequestNotificationTemplate({
          requesterName,
          requesterEmail,
          requesterWhatsApp,
          department: asset.sector.department.name,
          sector: asset.sector.name,
          assetInfo: `${asset.tag} (${getAssetTypeLabel(asset.assetType)})`,
          description,
        }),
      }),

      // Email de confirmação para o solicitante
      sendEmail({
        email: requesterEmail,
        subject: `Confirmação de Pedido de Manutenção - ${asset.tag}`,
        message: createMaintenanceRequestConfirmationTemplate({
          requesterName,
          requesterEmail,
          assetInfo: `${asset.tag} (${getAssetTypeLabel(asset.assetType)})`,
          description,
        }),
      }),

      // WhatsApp de confirmação para o solicitante
      sendWhatsApp({
        number: requesterWhatsApp.startsWith('55')
          ? requesterWhatsApp
          : `55${requesterWhatsApp}`,
        text: createMaintenanceRequestConfirmationWhatsAppTemplate({
          requesterName,
          assetTag: asset.tag,
          assetType: getAssetTypeLabel(asset.assetType),
          description,
        }),
      }),
    ]

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
