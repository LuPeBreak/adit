import z from 'zod'

export const departmentSchema = z.object({
  name: z.string(),
  manager: z.string(),
  managerEmail: z.string().email(),
})

export type DepartmentsColumnType = z.infer<typeof departmentSchema>
