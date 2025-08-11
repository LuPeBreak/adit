import { z } from 'zod'

export const publicTonerRequestSchema = z.object({
  assetId: z
    .string({ message: 'A impressora é obrigatória' })
    .cuid('ID da impressora inválido'),
  requesterName: z
    .string({ message: 'O nome do requerente é obrigatório' })
    .min(2, 'O nome deve ter no mínimo 2 caracteres'),
  registrationNumber: z
    .string({ message: 'A matrícula é obrigatória' })
    .min(5, 'A matrícula deve ter no mínimo 5 dígitos')
    .regex(/^\d+$/, 'A matrícula deve conter apenas números'),
  requesterEmail: z
    .string({ message: 'O e-mail é obrigatório' })
    .email('E-mail inválido'),
  requesterWhatsApp: z
    .string({ message: 'O WhatsApp é obrigatório' })
    .min(10, 'WhatsApp deve ter no mínimo 10 dígitos')
    .regex(/^\d+$/, 'WhatsApp deve conter apenas números'),
  selectedToner: z
    .string({ message: 'O toner é obrigatório' })
    .min(1, 'Selecione um toner'),
})

export type PublicTonerRequestData = z.infer<typeof publicTonerRequestSchema>
