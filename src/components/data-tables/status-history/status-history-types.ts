import { AssetStatus } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type StatusHistoryColumnType = {
  status: AssetStatus
  notes: string | null
  createdAt: Date
  sector: {
    name: string
    department: {
      name: string
    }
  }
  user: {
    name: string
    email: string
  }
}

export interface StatusHistoryRowActionsProps {
  row: Row<StatusHistoryColumnType>
}
