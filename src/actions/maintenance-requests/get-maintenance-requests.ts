'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { MaintenanceRequestsColumnType } from '@/components/data-tables/maintenance-requests/maintenance-requests-table-types'
import { AssetType, type Role } from '@/generated/prisma'

export const getMaintenanceRequests = withPermissions(
  [{ resource: 'maintenanceRequest', action: ['list'] }],
  async (session): Promise<ActionResponse<MaintenanceRequestsColumnType[]>> => {
    try {
      const role = session.user.role as Role
      const assetTypeFilter =
        role === 'OPERATOR_PRINTERS'
          ? AssetType.PRINTER
          : role === 'OPERATOR_PHONES'
            ? AssetType.PHONE
            : undefined
      const maintenanceRequests = await prisma.maintenanceRequest.findMany({
        where:
          assetTypeFilter !== undefined
            ? {
                asset: {
                  is: {
                    assetType: assetTypeFilter,
                  },
                },
              }
            : undefined,
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
        },
        orderBy: { createdAt: 'desc' },
      })

      // Transformar os dados para o formato esperado pela tabela
      const transformedRequests: MaintenanceRequestsColumnType[] =
        maintenanceRequests.map((request) => ({
          id: request.id,
          assetTag: request.asset.tag,
          assetStatus: request.asset.status,
          assetSectorId: request.asset.sectorId,
          requesterName: request.requesterName,
          registrationNumber: request.registrationNumber,
          requesterEmail: request.requesterEmail,
          requesterWhatsApp: request.requesterWhatsApp,
          description: request.description,
          assetType: request.asset.assetType,
          status: request.status,
          createdAt: request.createdAt,
          sector: request.asset.sector.name,
          department: request.asset.sector.department.name,
          lastStatusUpdateStatus: null,
          lastStatusUpdateNotes: null,
          lastStatusUpdateChangedAt: null,
          lastStatusUpdateUserName: null,
        }))

      return createSuccessResponse(transformedRequests)
    } catch (error) {
      console.error('Erro ao listar pedidos de manutenção:', error)
      return createErrorResponse('Erro interno do servidor ao listar pedidos')
    }
  },
)
