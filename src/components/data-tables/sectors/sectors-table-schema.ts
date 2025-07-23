import z from 'zod'

export const sectorSchema = z.object({
  name: z.string(),
  manager: z.string(),
  managerEmail: z.string().email(),
})

export type SectorsColumnType = z.infer<typeof sectorSchema>
