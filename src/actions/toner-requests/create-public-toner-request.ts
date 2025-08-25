'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  publicTonerRequestSchema,
  type PublicTonerRequestData,
} from '@/lib/schemas/public-toner-request'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { sendEmail } from '@/lib/utils/email-service'
import {
  createNewRequestNotificationTemplate,
  createRequestConfirmationTemplate,
} from '@/lib/utils/email-templates'
import { sendWhatsApp } from '@/lib/utils/whatsapp-service'
import { createRequestConfirmationWhatsAppTemplate } from '@/lib/utils/whatsapp-templates'

export async function createPublicTonerRequestAction(
  data: PublicTonerRequestData,
): Promise<ActionResponse<void>> {
  const validatedFields = publicTonerRequestSchema.safeParse(data)
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
    selectedToner,
  } = validatedFields.data

  try {
    // Verificar se o asset existe e é uma impressora
    const asset = await prisma.asset.findFirst({
      where: {
        id: assetId,
        assetType: 'PRINTER',
        printer: {
          isNot: null,
        },
      },
      select: {
        id: true,
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
        printer: {
          select: {
            printerModel: {
              select: {
                name: true,
                toners: true,
              },
            },
          },
        },
      },
    })

    if (!asset) {
      return createErrorResponse(
        'Impressora não encontrada',
        'NOT_FOUND_ERROR',
        'assetId',
      )
    }

    // Verificar se o toner selecionado é válido para esta impressora
    const availableToners = asset.printer?.printerModel?.toners || []
    if (!availableToners.includes(selectedToner)) {
      return createErrorResponse(
        'Toner selecionado não é compatível com esta impressora',
        'VALIDATION_ERROR',
        'selectedToner',
      )
    }

    // Criar o pedido de toner
    await prisma.tonerRequest.create({
      data: {
        assetId,
        requesterName,
        registrationNumber,
        requesterEmail,
        requesterWhatsApp,
        selectedToner,
        status: 'PENDING',
      },
    })

    // Enviar emails de notificação
    // Email para a equipe de TI
    await sendEmail({
      email: process.env.ADMIN_EMAIL!,
      subject: 'Novo Pedido de Toner - Sistema ADIT',
      message: createNewRequestNotificationTemplate({
        requesterName,
        requesterEmail,
        requesterWhatsApp,
        department: asset?.sector?.department?.name || 'N/A',
        sector: asset?.sector?.name || 'N/A',
        printerModel: asset?.printer?.printerModel?.name || 'N/A',
        selectedToner,
        printerTag: asset?.tag || 'N/A',
      }),
    })

    // Enviar confirmação para o solicitante
    await sendEmail({
      email: requesterEmail,
      subject: 'Pedido de Toner Recebido - Equipe de TI PMBM',
      message: createRequestConfirmationTemplate({
        requesterName,
        requesterEmail,
        selectedToner,
        printerTag: asset?.tag || 'N/A',
        printerModel: asset?.printer?.printerModel?.name || 'N/A',
      }),
    })

    // Enviar mensagem WhatsApp para a equipe de TI
    // await sendWhatsApp({
    //   number: process.env.ADMIN_WHATSAPP!,
    //   text: createNewRequestNotificationWhatsAppTemplate({
    //     requesterName,
    //     requesterWhatsApp,
    //     department: asset?.sector?.department?.name || 'N/A',
    //     sector: asset?.sector?.name || 'N/A',
    //     printerModel: asset?.printer?.printerModel?.name || 'N/A',
    //     selectedToner,
    //     printerTag: asset?.tag || 'N/A',
    //   }),
    // })

    // Enviar confirmação WhatsApp para o solicitante
    await sendWhatsApp({
      number: `55${requesterWhatsApp}`,
      text: createRequestConfirmationWhatsAppTemplate({
        requesterName,
        selectedToner,
        printerTag: asset?.tag || 'N/A',
        printerModel: asset?.printer?.printerModel?.name || 'N/A',
      }),
    })

    revalidatePath('/dashboard/toner-requests')

    return createSuccessResponse()
  } catch (error) {
    console.error('Erro ao criar pedido público de toner:', error)

    return createErrorResponse(
      'Erro interno do servidor. Tente novamente mais tarde.',
      'INTERNAL_ERROR',
    )
  }
}
