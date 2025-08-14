import { z } from 'zod'
import {
  createEntityNameValidation,
  createFullNameValidation,
  createEmailValidation,
} from '@/lib/validations/name-validations'

export const createDepartmentSchema = z.object({
  name: createEntityNameValidation('nome da secretaria', 100),
  manager: createFullNameValidation('responsável da secretaria', 50),
  managerEmail: createEmailValidation('email do responsável da secretaria', 50),
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
