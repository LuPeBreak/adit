import { TonerRequestStatus } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type TonerRequestsColumnType = {
  id: string
  requesterName: string
  registrationNumber: string
  requesterEmail: string
  requesterWhatsApp: string
  selectedToner: string
  assetTag: string
  sector: string
  department: string
  status: TonerRequestStatus
  createdAt: Date
  updatedAt: Date
  notes: string | null
}

export interface TonerRequestRowActionsProps {
  row: Row<TonerRequestsColumnType>
}
