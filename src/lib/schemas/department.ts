import { z } from 'zod'

export const createDepartmentSchema = z.object({
  name: z
    .string({ message: 'O nome da secretaria é obrigatório' })
    .min(5, 'O nome da secretaria deve ter no mínimo 5 caracteres'),
  manager: z
    .string({ message: 'O responsável da secretaria é obrigatório' })
    .min(5, 'O responsável da secretaria deve ter no mínimo 5 caracteres')
    .refine(
      (managerName) =>
        managerName.split(' ').filter((name) => name.length > 0).length >= 2,
      'O responsável da secretaria deve conter o nome e o sobrenome',
    ),
  managerEmail: z
    .string({
      message: 'O email do responsável da secretaria é obrigatório',
    })
    .email('O email do responsável da secretaria é inválido'),
})

export const updateDepartmentSchema = createDepartmentSchema.extend({
  id: z.string().cuid('ID da secretaria inválido'),
})

export const deleteDepartmentSchema = z.object({
  id: z.string().cuid('ID da secretaria inválido'),
})

export type CreateDepartmentData = z.infer<typeof createDepartmentSchema>
export type UpdateDepartmentData = z.infer<typeof updateDepartmentSchema>
export type DeleteDepartmentData = z.infer<typeof deleteDepartmentSchema>
