'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  createPrinterModelSchema,
  type CreatePrinterModelData,
} from '@/lib/schemas/printer-model'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const createPrinterModelAction = withPermissions(
  [{ resource: 'printerModel', action: ['create'] }],
  async (_, data: CreatePrinterModelData): Promise<ActionResponse> => {
    const validatedFields = createPrinterModelSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { name, toners } = validatedFields.data

    try {
      await prisma.printerModel.create({
        data: {
          name,
          toners,
        },
      })

      revalidatePath('/dashboard/printer-models')

      return createSuccessResponse()
    } catch (error) {
      // depois podemos mandar isso para uma ferramenta de monitoramento como Sentry
      console.error('Erro ao criar modelo de impressora:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2002') {
          return createErrorResponse(
            'Já existe um modelo com este nome',
            'DUPLICATE_ERROR',
            'name',
          )
        }
      }

      return createErrorResponse(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'INTERNAL_ERROR',
      )
    }
  },
)
