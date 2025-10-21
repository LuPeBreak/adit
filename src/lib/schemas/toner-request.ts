import { z } from 'zod'
import { TonerRequestStatus } from '@/generated/prisma'

// Schema unificado para atualização de status de pedidos de toner
export const updateTonerRequestStatusSchema = z
  .object({
    id: z.string().min(1, 'ID do pedido é obrigatório'),
    status: z.nativeEnum(TonerRequestStatus, {
      errorMap: () => ({ message: 'Status inválido' }),
    }),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Notes é obrigatório para REJECTED
      if (data.status === TonerRequestStatus.REJECTED) {
        return data.notes && data.notes.trim().length > 0
      }
      // Notes é opcional para APPROVED e DELIVERED
      return true
    },
    {
      message: 'Observação é obrigatória para pedidos rejeitados',
      path: ['notes'],
    },
  )

export type UpdateTonerRequestStatusData = z.infer<
  typeof updateTonerRequestStatusSchema
>
