import { AssetStatus } from '@/generated/prisma'
import z from 'zod'

export const printerSchema = z.object({
  serialNumber: z.string(),
  ipAddress: z.string(),
  printerModel: z.string(),
  tag: z.string(),
  status: z.nativeEnum(AssetStatus),
  sector: z.string(),
  department: z.string(),
})

export type PrintersColumnType = z.infer<typeof printerSchema>
