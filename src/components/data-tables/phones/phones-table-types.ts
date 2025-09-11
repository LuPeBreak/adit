import { AssetStatus, PhoneType } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type PhonesColumnType = {
  id: string
  phoneNumber: string
  brand: string
  phoneType: PhoneType
  ipAddress: string | null
  serialNumber: string
  assetId: string
  tag: string
  status: AssetStatus
  sectorId: string
  sector: string
  department: string
  createdAt: Date
  updatedAt: Date
  lastStatusUpdate: Date
}

export interface PhoneRowActionsProps {
  row: Row<PhonesColumnType>
}
