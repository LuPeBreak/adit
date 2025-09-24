import { MaintenanceStatus, AssetType } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type MaintenanceRequestsColumnType = {
  id: string
  assetTag: string
  requesterName: string
  registrationNumber: string
  requesterEmail: string
  requesterWhatsApp: string
  description: string
  assetType: AssetType
  status: MaintenanceStatus
  createdAt: Date
  sector: string
  department: string
  lastStatusUpdateStatus: MaintenanceStatus | null
  lastStatusUpdateNotes: string | null
  lastStatusUpdateChangedAt: Date | null
  lastStatusUpdateUserName: string | null
}

export interface MaintenanceRequestRowActionsProps {
  row: Row<MaintenanceRequestsColumnType>
}
