'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  updatePhoneAdminSchema,
  updatePhoneOperatorSchema,
  type UpdatePhoneAdminData,
  type UpdatePhoneOperatorData,
} from '@/lib/schemas/phone'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const updatePhoneAction = withPermissions(
  [{ resource: 'phone', action: ['update'] }],
  async (
    session,
    data: UpdatePhoneAdminData | UpdatePhoneOperatorData,
  ): Promise<ActionResponse> => {
    const isAdmin = session.user.role === 'ADMIN'

    // Validar dados baseado no papel do usuário
    const validatedFields = isAdmin
      ? updatePhoneAdminSchema.safeParse(data)
      : updatePhoneOperatorSchema.safeParse(data)

    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { id, ...updateData } = validatedFields.data

    try {
      await prisma.$transaction(async (tx) => {
        // Atualizar dados do telefone
        const updatedPhone = await tx.phone.update({
          where: { id },
          data: {
            phoneNumber: updateData.phoneNumber,
            brand: updateData.brand,
            phoneType: updateData.phoneType,
            ipAddress: updateData.ipAddress,
            serialNumber: updateData.serialNumber,
          },
        })

        // Atualizar dados do asset (apenas tag para administradores)
        if (isAdmin && (updateData as UpdatePhoneAdminData).tag) {
          await tx.asset.update({
            where: { id: updatedPhone.assetId },
            data: {
              tag: (updateData as UpdatePhoneAdminData).tag,
            },
          })
        }
      })

      revalidatePath('/dashboard/phones')
      revalidatePath('/dashboard/assets')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao atualizar telefone:', error)

      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'meta' in error &&
        typeof error.meta === 'object' &&
        error.meta !== null &&
        'target' in error.meta
      ) {
        if (error.code === 'P2002') {
          const target = error.meta?.target
          if (Array.isArray(target) && target.includes('tag')) {
            return createErrorResponse(
              'Já existe um ativo com este número de patrimônio',
              'DUPLICATE_ERROR',
              'tag',
            )
          }
          if (Array.isArray(target) && target.includes('phone_number')) {
            return createErrorResponse(
              'Já existe um telefone com este número',
              'DUPLICATE_ERROR',
              'phoneNumber',
            )
          }
          if (Array.isArray(target) && target.includes('serial_number')) {
            return createErrorResponse(
              'Já existe um telefone com este número de série',
              'DUPLICATE_ERROR',
              'serialNumber',
            )
          }
          if (Array.isArray(target) && target.includes('ip_address')) {
            return createErrorResponse(
              'Já existe um telefone com este endereço IP',
              'DUPLICATE_ERROR',
              'ipAddress',
            )
          }
        }
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Telefone não encontrado',
            'NOT_FOUND_ERROR',
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
