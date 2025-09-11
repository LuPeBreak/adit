'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createPhoneSchema, type CreatePhoneData } from '@/lib/schemas/phone'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { AssetType } from '@/generated/prisma'

export const createPhoneAction = withPermissions(
  [
    { resource: 'phone', action: ['create'] },
    { resource: 'asset', action: ['create'] },
  ],
  async (session, data: CreatePhoneData): Promise<ActionResponse> => {
    const validatedFields = createPhoneSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const {
      phoneNumber,
      brand,
      phoneType,
      ipAddress,
      serialNumber,
      tag,
      status,
      sectorId,
    } = validatedFields.data

    try {
      await prisma.$transaction(async (tx) => {
        const asset = await tx.asset.create({
          data: {
            tag,
            assetType: AssetType.PHONE,
            status,
            sectorId,
          },
        })

        await tx.phone.create({
          data: {
            phoneNumber,
            brand,
            phoneType,
            ipAddress: ipAddress || null,
            serialNumber,
            assetId: asset.id,
          },
        })

        // Criar registro inicial no histórico de status
        await tx.assetStatusHistory.create({
          data: {
            assetId: asset.id,
            status,
            sectorId,
            changedBy: session.user.id,
            notes: 'Registro inicial - Telefone criado',
          },
        })
      })

      revalidatePath('/dashboard/phones')
      revalidatePath('/dashboard/assets')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao criar telefone:', error)

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
      }

      return createErrorResponse(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'INTERNAL_ERROR',
      )
    }
  },
)
