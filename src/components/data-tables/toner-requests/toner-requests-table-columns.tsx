'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { TonerRequestsColumnType } from './toner-requests-table-types'
import { TonerRequestStatus } from '@/generated/prisma'
import { getTonerRequestStatusBadge } from '@/lib/utils/get-status-badge'

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
]
