import type { Row } from '@tanstack/react-table'
import z from 'zod'

export const sectorSchema = z.object({
  id: z.string(),
  name: z.string(),
  manager: z.string(),
  managerEmail: z.string().email(),
})

export type SectorsColumnType = z.infer<typeof sectorSchema>

export interface SectorRowActionsProps {
  row: Row<SectorsColumnType>
}
