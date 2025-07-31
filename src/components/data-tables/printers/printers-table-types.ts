import { AssetStatus } from '@/generated/prisma'

export type PrintersColumnType = {
  serialNumber: string
  ipAddress: string
  printerModel: string
  tag: string
  status: AssetStatus
  sector: string
  department: string
}
