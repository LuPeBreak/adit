'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createSectorSchema, type CreateSectorData } from '@/lib/schemas/sector'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const createSectorAction = withPermissions(
  [{ resource: 'sector', action: ['create'] }],
  async (_, data: CreateSectorData): Promise<ActionResponse> => {
    const validatedFields = createSectorSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const {
      name,
      acronym,
      manager,
      managerEmail,
      contact,
      address,
      departmentId,
    } = validatedFields.data

    try {
      await prisma.sector.create({
        data: {
          name,
          acronym,
          manager,
          managerEmail,
          contact,
          address,
          departmentId,
        },
      })

      revalidatePath('/dashboard/sectors')

      return createSuccessResponse()
    } catch (error: unknown) {
      // depois podemos mandar isso para uma ferramenta de monitoramento como Sentry
      console.error('Erro ao criar setor:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2002') {
          const target = (error as { meta?: { target?: string[] } }).meta
            ?.target
          if (target?.includes('name')) {
            return createErrorResponse(
              'Já existe um setor com este nome nesta secretaria',
              'DUPLICATE_ERROR',
              'name',
            )
          }
          if (target?.includes('acronym')) {
            return createErrorResponse(
              'Já existe um setor com esta sigla nesta secretaria',
              'DUPLICATE_ERROR',
              'acronym',
            )
          }
          return createErrorResponse(
            'Já existe um setor com estes dados nesta secretaria',
            'DUPLICATE_ERROR',
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
