'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Role } from '@/generated/prisma'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { UsersColumnType } from './users-table-types'

export const usersTableColumns: ColumnDef<UsersColumnType>[] = [
  {
    accessorKey: 'name',
    id: 'Nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'email',
    id: 'Email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    filterFn: 'includesString',
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      switch (cell.getValue()) {
        case Role.ADMIN:
          return 'Administrador'
        case Role.OPERATOR:
          return 'Operador'
        default:
          return ''
      }
    },
    id: 'Cargo',
    enableGlobalFilter: false,
  },
  {
    id: 'actions',
    enableHiding: false,
    enableGlobalFilter: false,
    cell: (/** { row } */) => {
      // const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar Usuário</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Deletar usuário
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Banir Usuário
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
