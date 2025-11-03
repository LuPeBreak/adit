import type { Row } from '@tanstack/react-table'

export type SectorsColumnType = {
  id: string
  name: string
  acronym: string
  manager: string
  managerEmail: string
  contact?: string
  address?: string
  departmentId: string
  departmentName: string
  departmentAcronym: string
}

export interface SectorRowActionsProps {
  row: Row<SectorsColumnType>
}
