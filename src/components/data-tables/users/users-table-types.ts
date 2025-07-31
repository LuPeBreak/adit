import { Role } from '@/generated/prisma'

export type UsersColumnType = {
  id: string
  name: string
  email: string
  role: Role
}
