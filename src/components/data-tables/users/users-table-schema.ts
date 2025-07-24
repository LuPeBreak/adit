import { Role } from '@/generated/prisma'
import z from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
})

export type UsersColumnType = z.infer<typeof userSchema>
