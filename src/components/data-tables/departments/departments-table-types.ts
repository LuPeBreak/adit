import type { Row } from '@tanstack/react-table'

export type DepartmentsColumnType = {
  id: string
  name: string
  acronym: string
  manager: string
  managerEmail: string
  contact?: string
  address?: string
  website?: string
}

export interface DepartmentRowActionsProps {
  row: Row<DepartmentsColumnType>
}
