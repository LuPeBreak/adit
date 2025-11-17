import { Role } from '@/generated/prisma'

export const roleHome: Record<Role, string> = {
  ADMIN: '/dashboard',
  OPERATOR_ORG: '/dashboard/departments',
  OPERATOR_PRINTERS: '/dashboard/printers',
  OPERATOR_PHONES: '/dashboard/phones',
  OPERATOR_ASSETS: '/dashboard/assets',
}

export function getRoleHome(role?: Role | null): string {
  if (!role) return '/'
  return roleHome[role as Role] ?? '/'
}
