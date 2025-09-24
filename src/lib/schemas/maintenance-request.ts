import { z } from 'zod'

export const getMaintenanceRequestsUpdatesSchema = z.object({
  id: z.string().cuid('ID do pedido de manutenção inválido'),
})

export type GetMaintenanceRequestsUpdatesData = z.infer<
  typeof getMaintenanceRequestsUpdatesSchema
>
