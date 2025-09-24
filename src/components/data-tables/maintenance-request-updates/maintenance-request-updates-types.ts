import type { MaintenanceStatus } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type MaintenanceRequestUpdatesColumnType = {
  status: MaintenanceStatus
  changedAt: Date
  user: string
  notes: string | null
}

export interface MaintenanceRequestUpdatesRowActionsProps {
  row: Row<MaintenanceRequestUpdatesColumnType>
}
