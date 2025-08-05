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
import { Button } from '@/components/ui/button'
import { roles } from '@/lib/utils/role-utils'

interface UsersTableToolbarProps<TData> {
  table?: Table<TData> // A prop é opcional para evitar erro no page.tsx ( server component )
}

export function UsersTableToolbar<TData>({
  table,
}: UsersTableToolbarProps<TData>) {
  if (!table) return null // Não renderiza se a table não foi injetada

  const isFiltered =
    table.getState().globalFilter || table.getColumn('Cargo')?.getFilterValue()

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
          value={(table.getColumn('Cargo')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) =>
            table
              .getColumn('Cargo')
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
        {isFiltered && (
          <Button
            variant="secondary"
            onClick={() => {
              table.setGlobalFilter('')
              table.getColumn('Cargo')?.setFilterValue('')
            }}
            className="h-8 px-2 lg:px-3"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  )
}
