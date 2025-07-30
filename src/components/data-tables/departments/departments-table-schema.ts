import type { Row } from '@tanstack/react-table'
import z from 'zod'

export const departmentSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  manager: z.string(),
  managerEmail: z.string().email(),
})

export type DepartmentsColumnType = z.infer<typeof departmentSchema>

export interface DepartmentRowActionsProps {
  row: Row<DepartmentsColumnType>
}
