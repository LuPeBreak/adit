import { z } from 'zod'
import { Role } from '@/generated/prisma'

// Schema para criação de usuário
export const createUserSchema = z.object({
  name: z
    .string({ message: 'O nome completo é obrigatório' })
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .refine(
      (name) => name.split(' ').filter((n) => n.length > 0).length >= 2,
      'O nome deve conter nome e sobrenome',
    ),
  email: z
    .string({ message: 'O email é obrigatório' })
    .email('O email é inválido'),
  role: z.nativeEnum(Role, { message: 'O cargo é obrigatório' }),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export const banUserSchema = z.object({
  userId: z.string(),
  banReason: z
    .string({ message: 'O motivo do banimento é obrigatório' })
    .min(5, 'O motivo do banimento deve ter no mínimo 5 caracteres'),
})

export const unbanUserSchema = z.object({
  userId: z.string(),
})

// Schema para atualização de cargo do usuário
export const updateUserRoleSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(Role, { message: 'O cargo é obrigatório' }),
})

// Schema para alteração de senha do usuário
export const updateUserPasswordSchema = z.object({
  id: z.string(),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type CreateUserData = z.infer<typeof createUserSchema>
export type BanUserData = z.infer<typeof banUserSchema>
export type UnbanUserData = z.infer<typeof unbanUserSchema>
export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>
export type UpdateUserPasswordData = z.infer<typeof updateUserPasswordSchema>
