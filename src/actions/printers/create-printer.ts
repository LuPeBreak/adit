'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  createPrinterSchema,
  type CreatePrinterData,
} from '@/lib/schemas/printer'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { AssetType } from '@/generated/prisma'

export const createPrinterAction = withPermissions(
  [{ resource: 'printer', action: ['create'] }],
  async (_, data: CreatePrinterData): Promise<ActionResponse> => {
    const validatedFields = createPrinterSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { serialNumber, ipAddress, tag, status, sectorId, printerModelId } =
      validatedFields.data

    try {
      await prisma.$transaction(async (tx) => {
        const asset = await tx.asset.create({
          data: {
            tag,
            assetType: AssetType.PRINTER,
            status,
            sectorId,
          },
        })

        await tx.printer.create({
          data: {
            serialNumber,
            ipAddress,
            printerModelId,
            assetId: asset.id,
          },
        })
      })

      revalidatePath('/dashboard/printers')
      revalidatePath('/dashboard/assets')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao criar impressora:', error)

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
          if (Array.isArray(target) && target.includes('serial_number')) {
            return createErrorResponse(
              'Já existe uma impressora com este número serial',
              'DUPLICATE_ERROR',
              'serialNumber',
            )
          }
          if (Array.isArray(target) && target.includes('ip_address')) {
            return createErrorResponse(
              'Já existe uma impressora com este endereço IP',
              'DUPLICATE_ERROR',
              'ipAddress',
            )
          }
        }
        if (error.code === 'P2003' && 'field_name' in error.meta) {
          const meta = error.meta
          const fieldName = meta?.field_name
          if (fieldName === 'sectorId') {
            return createErrorResponse(
              'Setor não encontrado',
              'NOT_FOUND_ERROR',
              'sectorId',
            )
          }
          if (fieldName === 'printerModelId') {
            return createErrorResponse(
              'Modelo da impressora não encontrado',
              'NOT_FOUND_ERROR',
              'printerModelId',
            )
          }
        }
      }

      return createErrorResponse(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'INTERNAL_SERVER_ERROR',
      )
    }
  },
)
