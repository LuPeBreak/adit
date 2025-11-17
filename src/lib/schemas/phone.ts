import { z } from 'zod'
import { PhoneType, AssetStatus } from '@/generated/prisma'

export const createPhoneSchema = z.object({
  phoneNumber: z
    .string({ message: 'O número do telefone é obrigatório' })
    .min(8, 'O número do telefone deve ter no mínimo 8 dígitos')
    .max(12, 'O número do telefone deve ter no máximo 12 dígitos')
    .regex(/^\d+$/, 'O número do telefone deve conter apenas números'),
  brand: z
    .string({ message: 'A marca do telefone é obrigatória' })
    .min(1, 'A marca do telefone é obrigatória')
    .max(50, 'A marca do telefone deve ter no máximo 50 caracteres')
    .trim(),
  phoneType: z.nativeEnum(PhoneType, {
    message: 'Tipo de telefone inválido',
  }),
  ipAddress: z
    .string()
    .ip({ message: 'Endereço IP inválido' })
    .nullable()
    .optional(),
  serialNumber: z
    .string({ message: 'O número de série é obrigatório' })
    .min(1, 'O número de série é obrigatório')
    .max(50, 'O número de série deve ter no máximo 50 caracteres')
    .trim(),
  tag: z
    .string()
    .min(1, 'Número do patrimônio é obrigatório')
    .regex(/^TI-\d{5}$/, {
      message:
        'Número do patrimônio deve seguir o formato TI-00001 (TI- seguido de 5 números)',
    }),
  status: z.nativeEnum(AssetStatus, {
    message: 'Status do ativo inválido',
  }),
  sectorId: z
    .string({ message: 'O setor é obrigatório' })
    .cuid('Setor inválido'),
})

// Schema para edição admin - usando omit do create e adicionando id
export const updatePhoneAdminSchema = createPhoneSchema
  .omit({
    status: true,
    sectorId: true,
  })
  .extend({
    id: z.string().cuid('ID do telefone inválido'),
  })

// Schema para operadores (campos limitados - não pode atualizar tag e serialNumber)
export const updatePhoneOperatorSchema = updatePhoneAdminSchema.omit({
  tag: true,
  serialNumber: true,
})

export const deletePhoneSchema = z.object({
  id: z.string().cuid('ID do telefone inválido'),
})

export type CreatePhoneData = z.infer<typeof createPhoneSchema>
export type UpdatePhoneAdminData = z.infer<typeof updatePhoneAdminSchema>
export type UpdatePhoneOperatorData = z.infer<typeof updatePhoneOperatorSchema>
export type DeletePhoneData = z.infer<typeof deletePhoneSchema>
