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
import { TonerRequestStatus } from '@/generated/prisma'
import { Button } from '@/components/ui/button'
import { getTonerRequestStatusLabel } from '@/lib/utils/get-status-label'

interface TonerRequestsTableToolbarProps<TData> {
  table?: Table<TData> // A prop é opcional para evitar erro no page.tsx ( server component )
}

// Mapeamento dinâmico dos status (valor do enum -> texto para o usuário)
const statuses = Object.values(TonerRequestStatus).map((status) => ({
  value: status,
  label: getTonerRequestStatusLabel(status),
}))

export function TonerRequestsTableToolbar<TData>({
  table,
}: TonerRequestsTableToolbarProps<TData>) {
  if (!table) return null // Não renderiza se a table não foi injetada

  const isFiltered =
    table.getState().globalFilter || table.getColumn('Status')?.getFilterValue()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Requerente, patrimônio, setor..."
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select
          value={(table.getColumn('Status')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) =>
            table
              .getColumn('Status')
              ?.setFilterValue(value === 'ALL' ? '' : value)
          }
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button
            variant="secondary"
            onClick={() => {
              table.setGlobalFilter('')
              table.getColumn('Status')?.setFilterValue('')
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
