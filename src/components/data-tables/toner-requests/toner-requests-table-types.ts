import { TonerRequestStatus } from '@/generated/prisma'

export type TonerRequestsColumnType = {
  id: string
  requesterName: string
  assetTag: string
  sector: string
  department: string
  status: TonerRequestStatus
  createdAt: Date
}
