'use server'

import type { MaintenanceRequestUpdatesColumnType } from '@/components/data-tables/maintenance-request-updates/maintenance-request-updates-types'
import type { AssetType } from '@/generated/prisma'
import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  getMaintenanceRequestsUpdatesSchema,
  type GetMaintenanceRequestsUpdatesData,
} from '@/lib/schemas/maintenance-request'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'

interface GetMaintenanceRequestsUpdatesResponse {
  maintenanceRequest: {
    requesterName: string
    description: string
    asset: {
      tag: string
      assetType: AssetType
    }
  }
  maintenanceRequestUpdates: MaintenanceRequestUpdatesColumnType[]
}

export const getMaintenanceRequestsUpdates = withPermissions(
  [{ resource: 'maintenanceRequest', action: ['list'] }],
  async (
    _,
    data: GetMaintenanceRequestsUpdatesData,
  ): Promise<ActionResponse<GetMaintenanceRequestsUpdatesResponse>> => {
    const validatedFields = getMaintenanceRequestsUpdatesSchema.safeParse(data)
    if (!validatedFields.success) {
      const firstError = validatedFields.error.errors[0]
      return createErrorResponse(
        firstError.message,
        'VALIDATION_ERROR',
        firstError.path[0]?.toString(),
      )
    }

    const { id } = validatedFields.data

    try {
      const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
        where: {
          id,
        },
        select: {
          requesterName: true,
          description: true,
          asset: {
            select: {
              tag: true,
              assetType: true,
            },
          },
        },
      })

      if (!maintenanceRequest) {
        return createErrorResponse('Pedido de manutenção não encontrado')
      }

      const maintenanceRequestUpdates =
        await prisma.maintenanceRequestHistory.findMany({
          where: {
            requestId: id,
          },
          orderBy: {
            changedAt: 'desc',
          },
          select: {
            status: true,
            changedAt: true,
            notes: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        })

      const mappedMaintenanceRequestUpdates = maintenanceRequestUpdates.map(
        (update) => ({
          status: update.status,
          changedAt: update.changedAt,
          user: update.user.name,
          notes: update.notes,
        }),
      )

      return createSuccessResponse({
        maintenanceRequest,
        maintenanceRequestUpdates: mappedMaintenanceRequestUpdates,
      })
    } catch (error) {
      console.error(
        `Erro ao buscar o histórico do pedido de manutenção ${id}:`,
        error,
      )
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
