'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  updateDepartmentSchema,
  type UpdateDepartmentData,
} from '@/lib/schemas/department'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const updateDepartmentAction = withPermissions(
  [{ resource: 'department', action: ['update'] }],
  async (_, data: UpdateDepartmentData): Promise<ActionResponse> => {
    const validatedFields = updateDepartmentSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { id, ...departmentData } = validatedFields.data

    try {
      await prisma.department.update({
        where: { id },
        data: departmentData,
      })

      revalidatePath('/dashboard/departments')

      return createSuccessResponse()
    } catch (error) {
      // depois podemos mandar isso para uma ferramenta de monitoramento como Sentry
      console.error('Erro ao atualizar secretaria:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Secretaria não encontrada',
            'NOT_FOUND_ERROR',
            'id',
          )
        }
        if (error.code === 'P2002') {
          const target = (error as { meta?: { target?: string[] } }).meta
            ?.target
          if (target?.includes('name')) {
            return createErrorResponse(
              'Já existe uma secretaria com este nome',
              'DUPLICATE_ERROR',
              'name',
            )
          }
          if (target?.includes('acronym')) {
            return createErrorResponse(
              'Já existe uma secretaria com esta sigla',
              'DUPLICATE_ERROR',
              'acronym',
            )
          }
          return createErrorResponse(
            'Já existe uma secretaria com estes dados',
            'DUPLICATE_ERROR',
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
