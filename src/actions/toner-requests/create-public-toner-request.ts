'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  createPublicTonerRequestSchema,
  type CreatePublicTonerRequestData,
} from '@/lib/schemas/toner-request'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { sendEmail } from '@/lib/notifications/services/email-service'
import { sendWhatsApp } from '@/lib/notifications/services/whatsapp-service'
import {
  createTonerRequestNotificationTemplate,
  createTonerRequestConfirmationTemplate,
} from '@/lib/notifications/templates/toner-request/email-template'
import { createTonerRequestConfirmationWhatsAppTemplate } from '@/lib/notifications/templates/toner-request/whatsapp-template'
import { normalizeWhatsappNumber } from '@/lib/utils/contact-formatter'
import { TonerRequestStatus } from '@/generated/prisma'

export async function createPublicTonerRequestAction(
  data: CreatePublicTonerRequestData,
): Promise<ActionResponse> {
  const validatedFields = createPublicTonerRequestSchema.safeParse(data)
  if (!validatedFields.success) {
    const firstError = validatedFields.error.errors[0]
    return createErrorResponse(
      firstError.message,
      'VALIDATION_ERROR',
      firstError.path[0]?.toString(),
    )
  }

  const {
    printerId,
    requesterName,
    registrationNumber,
    requesterEmail,
    requesterWhatsApp,
    selectedToner,
  } = validatedFields.data

  try {
    // Buscar a impressora pelo ID, verificar compatibilidade e pedidos pendentes em uma única query
    const printer = await prisma.printer.findUnique({
      where: {
        id: printerId,
      },
      select: {
        id: true,
        asset: {
          select: {
            tag: true,
          },
        },
        printerModel: {
          select: {
            name: true,
            toners: true,
          },
        },
        tonerRequests: {
          where: {
            status: TonerRequestStatus.PENDING,
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          take: 1,
        },
      },
    })

    if (!printer) {
      return createErrorResponse(
        'Impressora não encontrada.',
        'NOT_FOUND_ERROR',
        'printerId',
      )
    }

    // Verificar se o toner é compatível com a impressora
    const compatibleToners = printer.printerModel?.toners
    if (!compatibleToners?.includes(selectedToner)) {
      return createErrorResponse(
        'O toner selecionado não é compatível com esta impressora.',
        'VALIDATION_ERROR',
        'selectedToner',
      )
    }

    // Verificar se já existe um pedido pendente para esta impressora
    if (printer.tonerRequests.length > 0) {
      return createErrorResponse(
        'Já existe um pedido de toner pendente para esta impressora. Aguarde a conclusão do pedido atual antes de solicitar um novo.',
        'VALIDATION_ERROR',
        'printerId',
      )
    }

    // Criar o pedido de toner
    await prisma.tonerRequest.create({
      data: {
        printerId: printer.id,
        requesterName,
        registrationNumber,
        requesterEmail,
        requesterWhatsApp,
        selectedToner,
        status: TonerRequestStatus.PENDING,
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
          subject: `Novo Pedido de Toner - ${printer.asset.tag}`,
          html: createTonerRequestNotificationTemplate({
            requesterName,
            requesterEmail,
            selectedToner,
            printerTag: printer.asset.tag,
            printerModel: printer.printerModel?.name || 'N/A',
            status: 'PENDING',
          }),
        }).catch((error) => {
          console.error('Erro ao enviar email para equipe de TI:', error)
        }),
      )
    }

    // Email de confirmação para o solicitante
    notificationPromises.push(
      sendEmail({
        to: requesterEmail,
        subject: 'Pedido de Toner Recebido - Equipe de TI PMBM',
        html: createTonerRequestConfirmationTemplate({
          requesterName,
          requesterEmail,
          selectedToner,
          printerTag: printer.asset.tag,
          printerModel: printer.printerModel?.name || 'N/A',
          status: 'PENDING',
        }),
      }).catch((error) => {
        console.error('Erro ao enviar email de confirmação:', error)
      }),
    )

    // WhatsApp de confirmação para o solicitante (somente se número normalizado válido)
    const normalizedWhatsApp = normalizeWhatsappNumber(requesterWhatsApp)
    if (normalizedWhatsApp && normalizedWhatsApp.length === 13) {
      notificationPromises.push(
        sendWhatsApp({
          to: normalizedWhatsApp,
          message: createTonerRequestConfirmationWhatsAppTemplate({
            requesterName,
            selectedToner,
            printerTag: printer.asset.tag,
            printerModel: printer.printerModel?.name || 'N/A',
            status: 'PENDING',
          }),
        }).catch((error) => {
          console.error('Erro ao enviar WhatsApp de confirmação:', error)
        }),
      )
    }

    // Aguardar todas as notificações (sem bloquear em caso de erro)
    await Promise.allSettled(notificationPromises)

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
