'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { MaintenanceRequestsColumnType } from '@/components/data-tables/maintenance-requests/maintenance-requests-table-types'

export const getMaintenanceRequests = withPermissions(
  [{ resource: 'maintenanceRequest', action: ['list'] }],
  async (): Promise<ActionResponse<MaintenanceRequestsColumnType[]>> => {
    try {
      const maintenanceRequests = await prisma.maintenanceRequest.findMany({
        select: {
          id: true,
          requesterName: true,
          registrationNumber: true,
          requesterEmail: true,
          requesterWhatsApp: true,
          description: true,
          status: true,
          createdAt: true,
          asset: {
            select: {
              tag: true,
              status: true,
              sectorId: true,
              assetType: true,
              sector: {
                select: {
                  name: true,
                  department: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          history: {
            select: {
              status: true,
              notes: true,
              changedAt: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              changedAt: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const mappedRequests = maintenanceRequests.map((request) => ({
        id: request.id,
        requesterName: request.requesterName,
        registrationNumber: request.registrationNumber,
        requesterEmail: request.requesterEmail,
        requesterWhatsApp: request.requesterWhatsApp,
        description: request.description,
        assetTag: request.asset.tag,
        assetStatus: request.asset.status,
        assetSectorId: request.asset.sectorId,
        assetType: request.asset.assetType,
        sector: request.asset.sector.name,
        department: request.asset.sector.department.name,
        status: request.status,
        createdAt: request.createdAt,
        lastStatusUpdateStatus: request.history[0]?.status || null,
        lastStatusUpdateNotes: request.history[0]?.notes || null,
        lastStatusUpdateChangedAt: request.history[0]?.changedAt || null,
        lastStatusUpdateUserName: request.history[0]?.user.name || null,
      }))

      return createSuccessResponse(mappedRequests)
    } catch (error) {
      console.error('Erro ao buscar pedidos de manutenção:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
