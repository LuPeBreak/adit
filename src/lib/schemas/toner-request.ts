import { z } from 'zod'
import { TonerRequestStatus } from '@/generated/prisma'
import {
  createFullNameValidation,
  createEmailValidation,
} from '@/lib/validations/name-validations'

// Schema para criação pública de pedidos de toner
export const createPublicTonerRequestSchema = z.object({
  printerId: z
    .string({ message: 'A impressora é obrigatória' })
    .cuid('ID da impressora inválido'),
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
  selectedToner: z
    .string({ message: 'O toner é obrigatório' })
    .min(1, 'Selecione um toner'),
})

export type CreatePublicTonerRequestData = z.infer<
  typeof createPublicTonerRequestSchema
>

// Schema para buscar atualizações de pedidos de toner
export const getTonerRequestsUpdatesSchema = z.object({
  id: z.string().cuid('ID do pedido de toner inválido'),
})

export type GetTonerRequestsUpdatesData = z.infer<
  typeof getTonerRequestsUpdatesSchema
>

// Schema para atualização de status de pedidos de toner
export const updateTonerRequestStatusSchema = z.object({
  id: z.string().cuid('ID do pedido de toner inválido'),
  status: z.nativeEnum(TonerRequestStatus, { message: 'Status inválido' }),
  notes: z
    .string({ message: 'As observações são obrigatórias' })
    .min(1, 'As observações são obrigatórias')
    .max(200, 'As observações devem ter no máximo 200 caracteres'),
})

export type UpdateTonerRequestStatusData = z.infer<
  typeof updateTonerRequestStatusSchema
>
