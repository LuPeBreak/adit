'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { TonerRequestsColumnType } from '@/components/data-tables/toner-requests/toner-requests-table-types'

export const getTonerRequests = withPermissions(
  [{ resource: 'tonerRequest', action: ['list'] }],
  async (): Promise<ActionResponse<TonerRequestsColumnType[]>> => {
    try {
      const tonerRequests = await prisma.tonerRequest.findMany({
        select: {
          id: true,
          requesterName: true,
          registrationNumber: true,
          requesterEmail: true,
          requesterWhatsApp: true,
          selectedToner: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          notes: true,
          printer: {
            select: {
              asset: {
                select: {
                  tag: true,
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const mappedRequests = tonerRequests.map((request) => ({
        id: request.id,
        requesterName: request.requesterName,
        registrationNumber: request.registrationNumber,
        requesterEmail: request.requesterEmail,
        requesterWhatsApp: request.requesterWhatsApp,
        selectedToner: request.selectedToner,
        assetTag: request.printer.asset.tag,
        sector: request.printer.asset.sector.name,
        department: request.printer.asset.sector.department.name,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        notes: request.notes,
      }))

      return createSuccessResponse(mappedRequests)
    } catch (error) {
      console.error('Erro ao buscar pedidos de toner:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
