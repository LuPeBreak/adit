'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { TonerRequestsColumnType } from './toner-requests-table-types'
import { TonerRequestStatus } from '@/generated/prisma'
import { getTonerRequestStatusBadge } from '@/lib/utils/get-status-badge'
import { TonerRequestRowActions } from './toner-request-row-actions'
import { formatRelativeDate } from '@/lib/utils/format-date'

export const tonerRequestsTableColumns: ColumnDef<TonerRequestsColumnType>[] = [
  {
    accessorKey: 'requesterName',
    id: 'Requerente',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'assetTag',
    id: 'N° Patrimonio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'selectedToner',
    id: 'Toner Requerido',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'sector',
    id: 'Setor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'department',
    id: 'Secretaria',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'createdAt',
    id: 'Data do Pedido',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      const date = cell.getValue() as Date
      return formatRelativeDate(date)
    },
  },
  {
    accessorKey: 'status',
    id: 'Status',
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      return getTonerRequestStatusBadge(cell.getValue() as TonerRequestStatus)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <TonerRequestRowActions row={row} />,
  },
]
