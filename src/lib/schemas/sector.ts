import { z } from 'zod'

export const createSectorSchema = z.object({
  name: z
    .string({ message: 'O nome do setor é obrigatório' })
    .min(3, 'O nome do setor deve ter no mínimo 3 caracteres'),
  manager: z
    .string({ message: 'O responsável do setor é obrigatório' })
    .min(5, 'O responsável do setor deve ter no mínimo 5 caracteres')
    .refine(
      (managerName) =>
        managerName.split(' ').filter((name) => name.length > 0).length >= 2,
      'O responsável do setor deve conter o nome e o sobrenome',
    ),
  managerEmail: z
    .string({
      message: 'O email do responsável do setor é obrigatório',
    })
    .email('O email do responsável do setor é inválido'),
  departmentId: z
    .string({ message: 'A secretaria é obrigatória' })
    .cuid('ID da secretaria inválido'),
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
