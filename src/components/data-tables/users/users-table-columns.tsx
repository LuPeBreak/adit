'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { UsersColumnType } from './users-table-types'
import { UserRowActions } from './user-row-actions'
import { InlineRoleEditor } from './inline-role-editor'
import { getUserStatusBadge } from '@/lib/utils/get-status-badge'

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
    cell: ({ row }) => {
      const user = row.original
      return <InlineRoleEditor userId={user.id} currentRole={user.role} />
    },
    id: 'Cargo',
    enableGlobalFilter: false,
  },
  {
    accessorKey: 'banned',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const user = row.original
      return getUserStatusBadge(!!user.banned)
    },
    id: 'Status',
    enableGlobalFilter: false,
  },
  {
    id: 'actions',
    enableHiding: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <UserRowActions row={row} />,
  },
]
