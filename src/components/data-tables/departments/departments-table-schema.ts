import type { Row } from '@tanstack/react-table'
import type { Department } from '@/lib/schemas/department'

export type DepartmentsColumnType = Department

export interface DepartmentRowActionsProps {
  row: Row<DepartmentsColumnType>
}
