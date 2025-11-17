import { Role } from '@/generated/prisma'

// Função auxiliar para converter o valor do enum para um label amigável
export const getRoleLabel = (role: Role): string => {
  switch (role) {
    case Role.ADMIN:
      return 'Administrador'
    case Role.OPERATOR_ASSETS:
      return 'Operador de Ativos'
    case Role.OPERATOR_PRINTERS:
      return 'Operador de Impressoras'
    case Role.OPERATOR_PHONES:
      return 'Operador de Telefonia'
    case Role.OPERATOR_ORG:
      return 'Operador Organizacional'
    default:
      return role // Retorna o próprio valor se não houver um mapeamento específico
  }
}

// Mapeamento dinâmico dos cargos (valor do enum -> texto para o usuário)
export const roles = Object.values(Role).map((role) => ({
  value: role,
  label: getRoleLabel(role),
}))
