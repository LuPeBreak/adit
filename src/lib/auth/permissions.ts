import { createAccessControl } from 'better-auth/plugins/access'
import {
  defaultStatements,
  adminAc,
  userAc,
} from 'better-auth/plugins/admin/access'

// Declaração de recursos e ações disponíveis
export const statement = {
  ...defaultStatements,
  asset: ['list', 'update', 'delete'],
  assetHistory: ['list'],
  printer: ['create', 'list', 'update', 'delete'],
  printerModel: ['create', 'list', 'update', 'delete'],
  phone: ['create', 'list', 'update', 'delete'],
  department: ['create', 'list', 'update', 'delete'],
  sector: ['create', 'list', 'update', 'delete'],
  tonerRequest: ['list', 'update'],
  maintenanceRequest: ['list', 'update'],
} as const

export const ac = createAccessControl(statement)

// Gestão Organizacional — somente departamentos e setores (sem delete)
export const OPERATOR_ORG = ac.newRole({
  department: ['create', 'list', 'update'],
  sector: ['create', 'list', 'update'],
  ...userAc.statements,
})

// Operações Gerais — pode atuar em telefones, impressoras e ativos
export const OPERATOR_ASSETS = ac.newRole({
  asset: ['list', 'update'],
  assetHistory: ['list'],
  printer: ['create', 'list', 'update'],
  printerModel: ['create', 'list', 'update'],
  phone: ['create', 'list', 'update'],
  tonerRequest: ['list', 'update'],
  maintenanceRequest: ['list', 'update'],
  department: ['list'],
  sector: ['list'],
  ...userAc.statements,
})

// Operações de Impressão — escopo restrito a impressoras e modelos
export const OPERATOR_PRINTERS = ac.newRole({
  printer: ['create', 'list', 'update'],
  printerModel: ['create', 'list', 'update'],
  maintenanceRequest: ['list', 'update'],
  tonerRequest: ['list', 'update'],
  asset: ['update'], // pode atualizar status apenas de impressoras (checado na ação)
  assetHistory: ['list'],
  sector: ['list'],
  ...userAc.statements,
})

// Operações de Telefonia — escopo restrito a telefones
export const OPERATOR_PHONES = ac.newRole({
  phone: ['create', 'list', 'update'],
  maintenanceRequest: ['list', 'update'],
  asset: ['update'], // pode atualizar status apenas de telefones (checado na ação)
  assetHistory: ['list'],
  sector: ['list'],
  ...userAc.statements,
})

// Administrador — acesso completo (sem criação direta de ativos)
export const ADMIN = ac.newRole({
  asset: ['list', 'update', 'delete'],
  assetHistory: ['list'],
  printer: ['create', 'list', 'update', 'delete'],
  printerModel: ['create', 'list', 'update', 'delete'],
  phone: ['create', 'list', 'update', 'delete'],
  department: ['create', 'list', 'update', 'delete'],
  sector: ['create', 'list', 'update', 'delete'],
  tonerRequest: ['list', 'update'],
  maintenanceRequest: ['list', 'update'],
  ...adminAc.statements,
})

// Tipagens
export type Resource = keyof typeof statement

export type PermissionOption = {
  [R in Resource]: {
    resource: R
    action?: (typeof statement)[R][number][]
  }
}[Resource]
