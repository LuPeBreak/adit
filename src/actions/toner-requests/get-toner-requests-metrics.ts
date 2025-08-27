'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import { TonerRequestStatus } from '@/generated/prisma'

// Tipagens para métricas de toner
interface TonerRequestsCurrentMonth {
  totalRequests: number
  deliveredRequests: number
  rejectedRequests: number
}

interface TonerRequestsMetrics {
  tonerRequestsCurrentMonth: TonerRequestsCurrentMonth
  pendingTonerRequests: number
}

export const getTonerRequestsMetrics = withPermissions(
  [{ resource: 'tonerRequest', action: ['list'] }],
  async (): Promise<ActionResponse<TonerRequestsMetrics>> => {
    try {
      // Datas para consultas de toner
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)

      // Métricas de toner do mês atual
      const [totalCurrentMonth, deliveredCurrentMonth, rejectedCurrentMonth] =
        await Promise.all([
          prisma.tonerRequest.count({
            where: {
              createdAt: { gte: startOfMonth, lte: endOfMonth },
            },
          }),
          prisma.tonerRequest.count({
            where: {
              status: TonerRequestStatus.DELIVERED,
              updatedAt: { gte: startOfMonth, lte: endOfMonth },
            },
          }),
          prisma.tonerRequest.count({
            where: {
              status: TonerRequestStatus.REJECTED,
              updatedAt: { gte: startOfMonth, lte: endOfMonth },
            },
          }),
        ])

      // Pedidos pendentes
      const pendingTonerRequests = await prisma.tonerRequest.count({
        where: { status: TonerRequestStatus.PENDING },
      })

      const metrics: TonerRequestsMetrics = {
        tonerRequestsCurrentMonth: {
          totalRequests: totalCurrentMonth,
          deliveredRequests: deliveredCurrentMonth,
          rejectedRequests: rejectedCurrentMonth,
        },
        pendingTonerRequests,
      }

      return createSuccessResponse(metrics)
    } catch (error) {
      console.error('Erro ao buscar métricas de pedidos de toner:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
