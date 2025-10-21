import { z } from 'zod'
import { MaintenanceStatus, AssetStatus } from '@/generated/prisma'
import {
  createFullNameValidation,
  createEmailValidation,
} from '@/lib/validations/name-validations'

// Schema para criação pública de pedidos de manutenção
export const createPublicMaintenanceRequestSchema = z.object({
  assetId: z
    .string({ message: 'O ativo é obrigatório' })
    .min(1, 'O ativo é obrigatório'),
  requesterName: createFullNameValidation('nome do requerente', 50),
  registrationNumber: z
    .string({ message: 'A matrícula é obrigatória' })
    .min(5, 'A matrícula deve ter no mínimo 5 dígitos')
    .regex(/^\d+$/, 'A matrícula deve conter apenas números'),
  requesterEmail: createEmailValidation('e-mail', 50),
  requesterWhatsApp: z
    .string({ message: 'O WhatsApp é obrigatório' })
    .min(10, 'WhatsApp deve ter no mínimo 10 dígitos')
    .regex(/^\d+$/, 'WhatsApp deve conter apenas números'),
  description: z
    .string({ message: 'A descrição do problema é obrigatória' })
    .min(10, 'A descrição deve ter no mínimo 10 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres'),
})

export type CreatePublicMaintenanceRequestData = z.infer<
  typeof createPublicMaintenanceRequestSchema
>

// Schema para buscar atualizações de pedidos de manutenção
export const getMaintenanceRequestsUpdatesSchema = z.object({
  id: z.string().cuid('ID do pedido de manutenção inválido'),
})

export type GetMaintenanceRequestsUpdatesData = z.infer<
  typeof getMaintenanceRequestsUpdatesSchema
>

// Schema para atualização de status de pedidos de manutenção
export const updateMaintenanceRequestStatusSchema = z.object({
  id: z.string().cuid('ID do pedido de manutenção inválido'),
  status: z.nativeEnum(MaintenanceStatus, { message: 'Status inválido' }),
  notes: z
    .string({ message: 'As observações são obrigatórias' })
    .min(1, 'As observações são obrigatórias')
    .max(200, 'As observações devem ter no máximo 200 caracteres'),
  assetUpdate: z
    .object({
      updateAsset: z.boolean(),
      status: z
        .nativeEnum(AssetStatus, {
          message: 'Status do ativo inválido',
        })
        .optional(),
      sectorId: z.string().cuid('ID do setor inválido').optional(),
    })
    .optional(),
})

export type UpdateMaintenanceRequestStatusData = z.infer<
  typeof updateMaintenanceRequestStatusSchema
>
