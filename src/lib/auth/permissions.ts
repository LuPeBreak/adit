import { createAccessControl } from 'better-auth/plugins/access'
import {
  defaultStatements,
  adminAc,
  userAc,
} from 'better-auth/plugins/admin/access'

export const statement = {
  ...defaultStatements,
  asset: ['create', 'list', 'update', 'delete'],
  printer: ['create', 'list', 'update', 'delete'],
  printerModel: ['create', 'list', 'update', 'delete'],
  department: ['create', 'list', 'update', 'delete'],
  sector: ['create', 'list', 'update', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const OPERATOR = ac.newRole({
  asset: ['create', 'list', 'update'],
  printer: ['create', 'list', 'update'],
  printerModel: ['create', 'list', 'update', 'delete'],
  department: ['list'],
  sector: ['list'],
  ...userAc.statements,
})

export const ADMIN = ac.newRole({
  asset: ['create', 'list', 'update', 'delete'],
  printer: ['create', 'list', 'update', 'delete'],
  printerModel: ['create', 'list', 'update', 'delete'],
  department: ['create', 'list', 'update', 'delete'],
  sector: ['create', 'list', 'update', 'delete'],
  ...adminAc.statements,
})


// Tipagens 
export type Resource = keyof typeof statement;

export type PermissionOption = {
  [R in Resource]: {
    resource: R
    action?: (typeof statement)[R][number][]
  }
}[Resource]