'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { DepartmentsColumnType } from '@/components/data-tables/departments/departments-table-types'

export const getDepartments = withPermissions(
  [{ resource: 'department', action: ['list'] }],
  async (): Promise<ActionResponse<DepartmentsColumnType[]>> => {
    try {
      const departments = await prisma.department.findMany({
        select: {
          id: true,
          name: true,
          acronym: true,
          manager: true,
          managerEmail: true,
          contact: true,
          address: true,
          website: true,
        },
        orderBy: {
          name: 'asc',
        },
      })

      const mappedDepartments = departments.map((department) => ({
        id: department.id,
        name: department.name,
        acronym: department.acronym,
        manager: department.manager,
        managerEmail: department.managerEmail,
        contact: department.contact || undefined,
        address: department.address || undefined,
        website: department.website || undefined,
      }))

      return createSuccessResponse(mappedDepartments)
    } catch (error) {
      console.error('Erro ao buscar secretarias:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
