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
    .string({ message: 'O número do patrimônio é obrigatório' })
    .min(1, 'O número do patrimônio é obrigatório'),
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

// Schema para administradores (todos os campos incluindo status e setor)
export const updatePrinterAdminSchema = z.object({
  id: z.string().cuid('ID da impressora inválido'),
  serialNumber: z
    .string({ message: 'O número serial é obrigatório' })
    .min(3, 'O número serial deve ter no mínimo 3 caracteres')
    .optional(),
  ipAddress: z
    .string({ message: 'O endereço IP é obrigatório' })
    .ip('Endereço IP inválido')
    .optional(),
  tag: z
    .string({ message: 'O número do patrimônio é obrigatório' })
    .min(1, 'O número do patrimônio é obrigatório')
    .optional(),
  status: z
    .nativeEnum(AssetStatus, {
      message: 'Status inválido',
    })
    .optional(),
  sectorId: z
    .string({ message: 'O setor é obrigatório' })
    .cuid('ID do setor inválido')
    .optional(),
  printerModelId: z
    .string({ message: 'O modelo da impressora é obrigatório' })
    .cuid('ID do modelo inválido')
    .optional(),
})

// Schema para operadores (campos limitados - não pode atualizar serialNumber e tag)
export const updatePrinterOperatorSchema = z.object({
  id: z.string().cuid('ID da impressora inválido'),
  ipAddress: z
    .string({ message: 'O endereço IP é obrigatório' })
    .ip('Endereço IP inválido')
    .optional(),
  printerModelId: z
    .string({ message: 'O modelo da impressora é obrigatório' })
    .cuid('ID do modelo inválido')
    .optional(),
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
