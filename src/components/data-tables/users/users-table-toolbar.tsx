'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Role } from '@/generated/prisma'

interface UsersTableToolbarProps<TData> {
  table?: Table<TData> // A prop é opcional para evitar erro no page.tsx ( server component )
}

// Função auxiliar para converter o valor do enum para um label amigável
const getRoleLabel = (role: Role): string => {
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
const roles = Object.values(Role).map((role) => ({
  value: role,
  label: getRoleLabel(role),
}))

export function UsersTableToolbar<TData>({
  table,
}: UsersTableToolbarProps<TData>) {
  if (!table) return null // Não renderiza se a table não foi injetada

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar por nome ou email..."
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select
          value={(table.getColumn('role')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) =>
            table
              .getColumn('role')
              ?.setFilterValue(value === 'ALL' ? '' : value)
          }
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Cargos</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
