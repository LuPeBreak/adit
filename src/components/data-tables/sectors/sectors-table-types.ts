import type { Row } from '@tanstack/react-table'

export type SectorsColumnType = {
  id: string
  name: string
  manager: string
  managerEmail: string
  departmentId: string
  departmentName: string
}

export interface SectorRowActionsProps {
  row: Row<SectorsColumnType>
}
