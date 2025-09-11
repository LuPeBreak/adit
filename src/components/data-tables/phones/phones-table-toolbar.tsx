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
import { AssetStatus, PhoneType } from '@/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  getAssetStatusLabel,
  getPhoneTypeLabel,
} from '@/lib/utils/get-status-label'

interface PhonesTableToolbarProps<TData> {
  table?: Table<TData> // A prop é opcional para evitar erro no page.tsx ( server component )
}

// Mapeamento dinâmico dos status (valor do enum -> texto para o usuário)
const statuses = Object.values(AssetStatus).map((status) => ({
  value: status,
  label: getAssetStatusLabel(status),
}))

// Mapeamento dinâmico dos tipos de telefone (valor do enum -> texto para o usuário)
const phoneTypes = Object.values(PhoneType).map((type) => ({
  value: type,
  label: getPhoneTypeLabel(type),
}))

export function PhonesTableToolbar<TData>({
  table,
}: PhonesTableToolbarProps<TData>) {
  if (!table) return null // Não renderiza se a table não foi injetada

  const isFiltered =
    table.getState().globalFilter ||
    table.getColumn('Estado')?.getFilterValue() ||
    table.getColumn('Tipo')?.getFilterValue()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar..."
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select
          value={(table.getColumn('Estado')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) =>
            table
              .getColumn('Estado')
              ?.setFilterValue(value === 'ALL' ? '' : value)
          }
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Estados</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('Tipo')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) =>
            table
              .getColumn('Tipo')
              ?.setFilterValue(value === 'ALL' ? '' : value)
          }
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Tipos</SelectItem>
            {phoneTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button
            variant="secondary"
            onClick={() => {
              table.setGlobalFilter('')
              table.getColumn('Estado')?.setFilterValue('')
              table.getColumn('Tipo')?.setFilterValue('')
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
