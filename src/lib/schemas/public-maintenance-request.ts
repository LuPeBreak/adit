import { z } from 'zod'
import {
  createFullNameValidation,
  createEmailValidation,
} from '@/lib/validations/name-validations'

export const publicMaintenanceRequestSchema = z.object({
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

export type PublicMaintenanceRequestData = z.infer<
  typeof publicMaintenanceRequestSchema
>
