import { z } from 'zod'

export const printerModelFormSchema = z.object({
  name: z.string().min(1, { message: 'O nome do modelo é obrigatório.' }),
  toners: z
    .array(
      z.object({
        value: z.string().min(1, { message: 'O toner não pode ser vazio.' }),
      }),
    )
    .min(1, { message: 'É necessário pelo menos um toner.' }),
})

export const createPrinterModelSchema = z.object({
  name: z
    .string({ message: 'O nome do modelo é obrigatório' })
    .min(2, 'O nome do modelo deve ter no mínimo 2 caracteres'),
  toners: z
    .array(z.string().min(1, 'O toner não pode estar vazio'), {
      message: 'Pelo menos um toner é obrigatório',
    })
    .min(1, 'Pelo menos um toner é obrigatório')
    .refine((toners) => {
      const uniqueToners = new Set(toners.map((t) => t.trim().toLowerCase()))
      return uniqueToners.size === toners.length
    }, 'Não é possível ter toners duplicados'),
})

export const updatePrinterModelSchema = createPrinterModelSchema.extend({
  id: z.string().cuid('ID do modelo inválido'),
})

export const deletePrinterModelSchema = z.object({
  id: z.string().cuid('ID do modelo inválido'),
})

export type PrinterModelFormValues = z.infer<typeof printerModelFormSchema>
export type CreatePrinterModelData = z.infer<typeof createPrinterModelSchema>
export type UpdatePrinterModelData = z.infer<typeof updatePrinterModelSchema>
export type DeletePrinterModelData = z.infer<typeof deletePrinterModelSchema>
