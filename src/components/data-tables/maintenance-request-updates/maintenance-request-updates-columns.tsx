'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import { MaintenanceRequestUpdatesColumnType } from './maintenance-request-updates-types'
import { getMaintenanceStatusBadge } from '@/lib/utils/get-status-badge'
import type { MaintenanceStatus } from '@/generated/prisma'
import { formatRelativeDate } from '@/lib/utils/format-date'

export const maintenanceRequestUpdatesTableColumns: ColumnDef<MaintenanceRequestUpdatesColumnType>[] =
  [
    {
      accessorKey: 'user',
      id: 'Usuário',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
    },
    {
      accessorKey: 'notes',
      id: 'Observação',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
    },
    {
      accessorKey: 'changedAt',
      id: 'Data da Atualização',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
      cell: ({ row }) => {
        return <span>{formatRelativeDate(new Date(row.original.changedAt))}</span>
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
        return getMaintenanceStatusBadge(cell.getValue() as MaintenanceStatus)
      },
    },
    
  ]
