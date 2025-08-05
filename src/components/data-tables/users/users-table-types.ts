import { Role } from '@/generated/prisma'
import type { Row } from '@tanstack/react-table'

export type UsersColumnType = {
  id: string
  name: string
  email: string
  role: Role
  banned: boolean | null
  banReason: string | null
}

export interface UserRowActionsProps {
  row: Row<UsersColumnType>
}
