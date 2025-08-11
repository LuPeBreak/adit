'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { UsersColumnType } from '@/components/data-tables/users/users-table-types'

export const getUsers = withPermissions(
  [{ resource: 'user', action: ['list'] }],
  async (): Promise<ActionResponse<UsersColumnType[]>> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          banReason: true,
        },
        orderBy: {
          name: 'asc',
        },
      })

      return createSuccessResponse(users)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
