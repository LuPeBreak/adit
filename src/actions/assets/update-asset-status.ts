'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  updateAssetStatusSchema,
  type UpdateAssetStatusData,
} from '@/lib/schemas/asset'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { AssetType } from '@/generated/prisma'

export const updateAssetStatusAction = withPermissions(
  [{ resource: 'asset', action: ['update'] }],
  async (session, data: UpdateAssetStatusData): Promise<ActionResponse> => {
    const validatedFields = updateAssetStatusSchema.safeParse(data)

    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { assetId, status, sectorId, notes } = validatedFields.data

    try {
      await prisma.$transaction(async (tx) => {
        // Verificar se o ativo existe
        const existingAsset = await tx.asset.findUnique({
          where: { id: assetId },
          select: { id: true, status: true, sectorId: true, assetType: true },
        })

        if (!existingAsset) {
          throw new Error('ASSET_NOT_FOUND')
        }

        // Checagem de escopo por cargo
        const role = session.user.role as string
        if (
          role === 'OPERATOR_PRINTERS' &&
          existingAsset.assetType !== AssetType.PRINTER
        ) {
          throw new Error('FORBIDDEN_TYPE')
        }
        if (
          role === 'OPERATOR_PHONES' &&
          existingAsset.assetType !== AssetType.PHONE
        ) {
          throw new Error('FORBIDDEN_TYPE')
        }

        // Verificar se houve mudança real no status ou setor
        const hasStatusChange = existingAsset.status !== status
        const hasSectorChange = existingAsset.sectorId !== sectorId

        if (!hasStatusChange && !hasSectorChange) {
          throw new Error('NO_CHANGES')
        }

        // Atualizar o ativo com o novo status e setor
        await tx.asset.update({
          where: { id: assetId },
          data: {
            status,
            sectorId,
          },
        })

        // Criar registro no histórico
        await tx.assetStatusHistory.create({
          data: {
            assetId,
            status,
            sectorId,
            changedBy: session.user.id,
            notes,
          },
        })
      })

      revalidatePath('/dashboard/assets')
      revalidatePath('/dashboard/printers')

      return createSuccessResponse()
    } catch (error) {
      console.error('Erro ao atualizar status do ativo:', error)

      if (error instanceof Error) {
        if (error.message === 'ASSET_NOT_FOUND') {
          return createErrorResponse(
            'Ativo não encontrado',
            'NOT_FOUND_ERROR',
            'assetId',
          )
        }
        if (error.message === 'NO_CHANGES') {
          return createErrorResponse(
            'Nenhuma alteração foi detectada',
            'VALIDATION_ERROR',
            'status',
          )
        }
        if (error.message === 'FORBIDDEN_TYPE') {
          return createErrorResponse(
            'Seu cargo só pode atualizar o status do seu tipo de ativo',
            'PERMISSION_ERROR',
          )
        }
      }

      if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2025') {
          return createErrorResponse(
            'Ativo não encontrado',
            'NOT_FOUND_ERROR',
            'assetId',
          )
        }
        if (
          error.code === 'P2003' &&
          'meta' in error &&
          typeof error.meta === 'object' &&
          error.meta !== null &&
          'constraint' in error.meta
        ) {
          if (
            error.meta.constraint === 'asset_sector_id_fkey' ||
            error.meta.constraint === 'asset_status_history_sector_id_fkey'
          ) {
            return createErrorResponse(
              'Setor não encontrado',
              'NOT_FOUND_ERROR',
              'sectorId',
            )
          }
          if (
            error.meta.constraint === 'asset_status_history_changed_by_fkey'
          ) {
            return createErrorResponse(
              'Usuário não encontrado',
              'NOT_FOUND_ERROR',
              'changedBy',
            )
          }
        }
      }

      return createErrorResponse(
        'Erro interno do servidor ao atualizar status do ativo',
        'INTERNAL_SERVER_ERROR',
      )
    }
  },
)
