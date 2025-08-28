import { z } from 'zod'
import {
  createFullNameValidation,
  createEmailValidation,
} from '@/lib/validations/name-validations'

export const publicTonerRequestSchema = z.object({
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

export type PublicTonerRequestData = z.infer<typeof publicTonerRequestSchema>
