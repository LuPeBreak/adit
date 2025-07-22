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
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: 'Email',
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
    header: 'Cargo',
    id: 'role',
    enableGlobalFilter: false,
  },
  {
    id: 'actions',
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const user = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copiar Id do usuário
            </DropdownMenuItem>
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
