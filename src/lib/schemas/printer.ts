import { z } from 'zod'
import { AssetStatus } from '@/generated/prisma'

export const createPrinterSchema = z.object({
  serialNumber: z
    .string({ message: 'O número serial é obrigatório' })
    .min(3, 'O número serial deve ter no mínimo 3 caracteres'),
  ipAddress: z
    .string({ message: 'O endereço IP é obrigatório' })
    .ip('Endereço IP inválido'),
  tag: z
    .string()
    .min(1, 'Número do patrimônio é obrigatório')
    .regex(/^TI-\d{5}$/, {
      message:
        'Número do patrimônio deve seguir o formato TI-00001 (TI- seguido de 5 números)',
    }),
  status: z.nativeEnum(AssetStatus, {
    message: 'Status inválido',
  }),
  sectorId: z
    .string({ message: 'O setor é obrigatório' })
    .cuid('ID do setor inválido'),
  printerModelId: z
    .string({ message: 'O modelo da impressora é obrigatório' })
    .cuid('ID do modelo inválido'),
})

// Schema para edição admin - usando omit do create e adicionando id
export const updatePrinterAdminSchema = createPrinterSchema
  .omit({
    status: true,
    sectorId: true, // sectorId não é editável no formulário de update
  })
  .extend({
    id: z.string().cuid('ID da impressora inválido'),
  })

// Schema para operadores (campos limitados - não pode atualizar serialNumber e tag)
export const updatePrinterOperatorSchema = updatePrinterAdminSchema.omit({
  serialNumber: true,
  tag: true,
})

export const deletePrinterSchema = z.object({
  id: z.string().cuid('ID da impressora inválido'),
})

export type UpdatePrinterOperatorData = z.infer<
  typeof updatePrinterOperatorSchema
>

export type CreatePrinterData = z.infer<typeof createPrinterSchema>
export type UpdatePrinterAdminData = z.infer<typeof updatePrinterAdminSchema>
export type DeletePrinterData = z.infer<typeof deletePrinterSchema>
