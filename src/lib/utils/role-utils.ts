import { Role } from '@/generated/prisma'

// Função auxiliar para converter o valor do enum para um label amigável
export const getRoleLabel = (role: Role): string => {
  switch (role) {
    case Role.ADMIN:
      return 'Administrador'
    case Role.OPERATOR:
      return 'Operador'
    default:
      return role // Retorna o próprio valor se não houver um mapeamento específico
  }
}

// Mapeamento dinâmico dos cargos (valor do enum -> texto para o usuário)
export const roles = Object.values(Role).map((role) => ({
  value: role,
  label: getRoleLabel(role),
}))
