'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DepartmentTableToolbarProps<TData> {
  table?: Table<TData> // A prop é opcional para evitar erro no page.tsx ( server component )
}

export function DepartmentTableToolbar<TData>({
  table,
}: DepartmentTableToolbarProps<TData>) {
  if (!table) return null // Não renderiza se a table não foi injetada

  const isFiltered = table.getState().globalFilter

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar ..."
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="secondary"
            onClick={() => {
              table.setGlobalFilter('')
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
