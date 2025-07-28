import z from 'zod'

export const printerModelSchema = z.object({
  name: z.string(),
  toners: z.array(z.string()),
  _count: z.object({
    printers: z.number(),
  }),
})

export type PrinterModelsColumnType = z.infer<typeof printerModelSchema>
