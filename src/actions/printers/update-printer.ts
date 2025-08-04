'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  updatePrinterSchema,
  updatePrinterOperatorSchema,
  type UpdatePrinterData,
  type UpdatePrinterOperatorData,
} from '@/lib/schemas/printer'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

export const updatePrinterAction = withPermissions(
  [{ resource: 'printer', action: ['update'] }],
  async (
    session,
    data: UpdatePrinterData | UpdatePrinterOperatorData,
  ): Promise<ActionResponse> => {
    const isAdmin = session.user.role === 'ADMIN'

    // Validar dados baseado no papel do usuário
    const validatedFields = isAdmin
      ? updatePrinterSchema.safeParse(data)
      : updatePrinterOperatorSchema.safeParse(data)

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
        // Atualizar dados da impressora
        const updatedPrinter = await tx.printer.update({
          where: { id },
          data: {
            serialNumber: isAdmin
              ? (updateData as UpdatePrinterData).serialNumber
              : undefined,
            ipAddress: updateData.ipAddress,
            printerModelId: updateData.printerModelId,
          },
        })

        // Atualizar dados do asset
        await tx.asset.update({
          where: { id: updatedPrinter.assetId },
          data: {
            tag: isAdmin ? (updateData as UpdatePrinterData).tag : undefined,
            status: updateData.status,
            sectorId: updateData.sectorId,
          },
        })
      })

      revalidatePath('/dashboard/printers')
      revalidatePath('/dashboard/assets')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao atualizar impressora:', error)

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Impressora não encontrada',
            'NOT_FOUND_ERROR',
            'id',
          )
        }
        if (
          error.code === 'P2002' &&
          'meta' in error &&
          typeof error.meta === 'object' &&
          error.meta !== null &&
          'target' in error.meta
        ) {
          const target = error.meta.target
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
        if (
          error.code === 'P2003' &&
          'meta' in error &&
          typeof error.meta === 'object' &&
          error.meta !== null &&
          'modelName' in error.meta &&
          'constraint' in error.meta
        ) {
          if (
            error.meta.modelName === 'Asset' &&
            error.meta.constraint === 'asset_sector_id_fkey'
          ) {
            return createErrorResponse(
              'Setor não encontrado',
              'NOT_FOUND_ERROR',
              'sectorId',
            )
          }
          if (
            error.meta.modelName === 'Printer' &&
            error.meta.constraint === 'printer_printer_model_id_fkey'
          ) {
            return createErrorResponse(
              'Modelo da impressora não encontrado',
              'NOT_FOUND_ERROR',
              'printerModelId',
            )
          }
        }
      }
      return createErrorResponse(
        'Erro interno do servidor ao atualizar impressora',
        'INTERNAL_SERVER_ERROR',
      )
    }
  },
)
