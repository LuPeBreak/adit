'use client'

import { z } from 'zod'
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

export const userSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum([Role.ADMIN, Role.OPERATOR]),
})

export type UserColumnsType = z.infer<typeof userSchema>

export const userColumns: ColumnDef<UserColumnsType>[] = [
  {
    accessorKey: 'name',
    id: 'Nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'email',
    id: 'Email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    filterFn: 'includesString',
  },
  {
    accessorFn: (row) => {
      switch (row.role) {
        case Role.ADMIN:
          return 'Administrador'
        case Role.OPERATOR:
          return 'Operador'
        default:
          return ''
      }
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cargo" />
    ),
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
