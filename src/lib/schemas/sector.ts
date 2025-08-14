import { z } from 'zod'
import {
  createEntityNameValidation,
  createFullNameValidation,
  createEmailValidation,
} from '@/lib/validations/name-validations'

export const createSectorSchema = z.object({
  name: createEntityNameValidation('nome do setor', 80),
  manager: createFullNameValidation('responsável do setor', 50),
  managerEmail: createEmailValidation('email do responsável do setor', 50),
  departmentId: z
    .string({ message: 'A secretaria é obrigatória' })
    .cuid('Secretaria invalida'),
})

export const updateSectorSchema = createSectorSchema.extend({
  id: z.string().cuid('ID do setor inválido'),
})

export const deleteSectorSchema = z.object({
  id: z.string().cuid('ID do setor inválido'),
})

export type CreateSectorData = z.infer<typeof createSectorSchema>
export type UpdateSectorData = z.infer<typeof updateSectorSchema>
export type DeleteSectorData = z.infer<typeof deleteSectorSchema>
