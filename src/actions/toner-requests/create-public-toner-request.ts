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
      include: {
        printer: {
          include: {
            printerModel: true,
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
    const availableToners = asset.printer?.printerModel.toners || []
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
