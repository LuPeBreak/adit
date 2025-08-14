import { z } from 'zod'
import { Role } from '@/generated/prisma'
import {
  createFullNameValidation,
  createEmailValidation,
} from '@/lib/validations/name-validations'

// Schema para criação de usuário
export const createUserSchema = z.object({
  name: createFullNameValidation('nome completo', 50),
  email: createEmailValidation('email', 50),
  role: z.nativeEnum(Role, { message: 'O cargo é obrigatório' }),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export const banUserSchema = z.object({
  userId: z.string().min(1, 'O ID do usuário é obrigatório'),
  banReason: z
    .string({ message: 'O motivo do banimento é obrigatório' })
    .min(1, 'O motivo do banimento é obrigatório')
    .max(100, 'O motivo do banimento deve ter no máximo 100 caracteres')
    .refine((reason) => {
      const withoutSpaces = reason.replace(/\s/g, '')
      return withoutSpaces.length >= 5
    }, 'O motivo do banimento deve ter no mínimo 5 caracteres úteis')
    .refine(
      (reason) => !/^\d+$/.test(reason.trim()),
      'O motivo do banimento não pode conter apenas números',
    )
    .refine((reason) => {
      const trimmed = reason.trim()
      const words = trimmed.split(/\s+/).filter((word) => word.length > 0)
      return words.length >= 1 && words.some((word) => word.length >= 3)
    }, 'O motivo do banimento deve conter pelo menos uma palavra com 3+ caracteres'),
})

export const unbanUserSchema = z.object({
  userId: z.string().min(1, 'O ID do usuário é obrigatório'),
})

// Schema para atualização de cargo do usuário
export const updateUserRoleSchema = z.object({
  id: z.string().min(1, 'O ID é obrigatório'),
  role: z.nativeEnum(Role, { message: 'O cargo é obrigatório' }),
})

// Schema para alteração de senha do usuário
export const updateUserPasswordSchema = z.object({
  id: z.string().min(1, 'O ID é obrigatório'),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

// Schema para atualização de perfil próprio do usuário
export const updateOwnProfileSchema = z.object({
  name: createFullNameValidation('nome completo', 50),
})

// Schema para alteração de senha própria do usuário
export const changeOwnPasswordSchema = z.object({
  currentPassword: z
    .string({ message: 'A senha atual é obrigatória' })
    .min(1, 'A senha atual é obrigatória'),
  newPassword: z
    .string({ message: 'A nova senha é obrigatória' })
    .min(8, 'A nova senha deve ter no mínimo 8 caracteres'),
})

export type CreateUserData = z.infer<typeof createUserSchema>
export type BanUserData = z.infer<typeof banUserSchema>
export type UnbanUserData = z.infer<typeof unbanUserSchema>
export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>
export type UpdateUserPasswordData = z.infer<typeof updateUserPasswordSchema>
export type UpdateOwnProfileData = z.infer<typeof updateOwnProfileSchema>
export type ChangeOwnPasswordData = z.infer<typeof changeOwnPasswordSchema>
