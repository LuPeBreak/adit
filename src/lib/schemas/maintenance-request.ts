import { z } from 'zod'
import { MaintenanceStatus } from '@/generated/prisma'

export const getMaintenanceRequestsUpdatesSchema = z.object({
  id: z.string().cuid('ID do pedido de manutenção inválido'),
})

export type GetMaintenanceRequestsUpdatesData = z.infer<
  typeof getMaintenanceRequestsUpdatesSchema
>

export const updateMaintenanceRequestStatusSchema = z.object({
  id: z.string().cuid('ID do pedido de manutenção inválido'),
  status: z.nativeEnum(MaintenanceStatus, { message: 'Status inválido' }),
  notes: z
    .string({ message: 'As observações são obrigatórias' })
    .min(1, 'As observações são obrigatórias')
    .max(200, 'As observações devem ter no máximo 200 caracteres'),
})

export type UpdateMaintenanceRequestStatusData = z.infer<
  typeof updateMaintenanceRequestStatusSchema
>
