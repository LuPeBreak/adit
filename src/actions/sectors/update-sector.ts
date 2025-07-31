'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { updateSectorSchema, type UpdateSectorData } from '@/lib/schemas/sector'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const updateSectorAction = withPermissions(
  [{ resource: 'sector', action: ['update'] }],
  async (_, data: UpdateSectorData): Promise<ActionResponse> => {
    const validatedFields = updateSectorSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { id, ...sectorData } = validatedFields.data

    try {
      await prisma.sector.update({
        where: { id },
        data: sectorData,
      })

      revalidatePath('/dashboard/sectors')

      return createSuccessResponse()
    } catch (error) {
      // depois podemos mandar isso para uma ferramenta de monitoramento como Sentry
      console.error('Erro ao atualizar setor:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Setor não encontrado',
            'NOT_FOUND_ERROR',
            'id',
          )
        }
        if (error.code === 'P2002') {
          return createErrorResponse(
            'Já existe um setor com este nome nesta secretaria',
            'DUPLICATE_ERROR',
            'name',
          )
        }
        if (error.code === 'P2003') {
          return createErrorResponse(
            'Secretaria não encontrada',
            'NOT_FOUND_ERROR',
            'departmentId',
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
