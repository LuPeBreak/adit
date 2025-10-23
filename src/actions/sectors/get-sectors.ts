'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { SectorsColumnType } from '@/components/data-tables/sectors/sectors-table-types'

export const getSectors = withPermissions(
  [{ resource: 'sector', action: ['list'] }],
  async (): Promise<ActionResponse<SectorsColumnType[]>> => {
    try {
      const sectors = await prisma.sector.findMany({
        select: {
          id: true,
          name: true,
          acronym: true,
          manager: true,
          managerEmail: true,
          contact: true,
          address: true,
          departmentId: true,
          department: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })

      const mappedSectors = sectors.map((sector) => ({
        id: sector.id,
        name: sector.name,
        acronym: sector.acronym,
        manager: sector.manager,
        managerEmail: sector.managerEmail,
        contact: sector.contact || undefined,
        address: sector.address || undefined,
        departmentId: sector.departmentId,
        departmentName: sector.department.name,
      }))

      return createSuccessResponse(mappedSectors)
    } catch (error) {
      console.error('Erro ao buscar setores:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
