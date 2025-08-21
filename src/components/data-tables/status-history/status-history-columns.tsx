'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { StatusHistoryColumnType } from './status-history-types'
import { getAssetStatusBadge } from '@/lib/utils/get-status-badge'
import { formatRelativeDate } from '@/lib/utils/format-date'
import { StatusHistoryRowActions } from './status-history-row-actions'

export const statusHistoryColumns: ColumnDef<StatusHistoryColumnType>[] = [
  {
    accessorKey: 'sector.name',
    id: 'Setor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <span>{row.original.sector.name}</span>
    },
  },
  {
    accessorKey: 'sector.department.name',
    id: 'Secretaria',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <span>{row.original.sector.department.name}</span>
    },
  },
  {
    accessorKey: 'user.name',
    id: 'Responsável',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <span>{row.original.user.name}</span>
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'Data',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return <span>{formatRelativeDate(new Date(row.original.createdAt))}</span>
    },
  },
  {
    accessorKey: 'status',
    id: 'Estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      return getAssetStatusBadge(row.original.status)
    },
    enableGlobalFilter: false,
  },
  {
    id: 'actions',
    enableHiding: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <StatusHistoryRowActions row={row} />,
  },
]
