import type { Row } from '@tanstack/react-table'

export type DepartmentsColumnType = {
  id: string
  name: string
  manager: string
  managerEmail: string
}

export interface DepartmentRowActionsProps {
  row: Row<DepartmentsColumnType>
}
