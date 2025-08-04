import { AssetStatus } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type PrintersColumnType = {
  id: string
  serialNumber: string
  ipAddress: string
  printerModelId: string
  printerModel: string
  assetId: string
  tag: string
  status: AssetStatus
  sectorId: string
  sector: string
  department: string
}

export interface PrinterRowActionsProps {
  row: Row<PrintersColumnType>
}
