import { z } from 'zod'

// Schema para aprovar pedido de toner
export const approveTonerRequestSchema = z.object({
  tonerRequestId: z.string().min(1, 'ID do pedido é obrigatório'),
})

export type ApproveTonerRequestData = z.infer<typeof approveTonerRequestSchema>

// Schema para rejeitar pedido de toner
export const rejectTonerRequestSchema = z.object({
  tonerRequestId: z.string().min(1, 'ID do pedido é obrigatório'),
  rejectionReason: z
    .string()
    .min(1, 'Motivo da rejeição é obrigatório')
    .refine(
      (value) => value.replace(/\s/g, '').length >= 5,
      'O motivo da rejeição deve ter pelo menos 5 caracteres',
    ),
})

export type RejectTonerRequestData = z.infer<typeof rejectTonerRequestSchema>

// Schema para marcar pedido como entregue
export const deliverTonerRequestSchema = z.object({
  tonerRequestId: z.string().min(1, 'ID do pedido é obrigatório'),
  deliveryNote: z.string().optional(),
})

export type DeliverTonerRequestData = z.infer<typeof deliverTonerRequestSchema>
