import { createAccessControl } from 'better-auth/plugins/access'
import {
  defaultStatements,
  adminAc,
  userAc,
} from 'better-auth/plugins/admin/access'

export const statement = {
  ...defaultStatements,
  printer: ['create', 'read', 'update', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const OPERATOR = ac.newRole({
  printer: ['create', 'read', 'update'],
  ...userAc.statements,
})

export const ADMIN = ac.newRole({
  printer: ['create', 'read', 'update', 'delete'],
  ...adminAc.statements,
})
