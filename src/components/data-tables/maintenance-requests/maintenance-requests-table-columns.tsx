'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import { MaintenanceRequestsColumnType } from './maintenance-requests-table-types'
import { formatDate } from '@/lib/utils/format-date'
import { getMaintenanceStatusBadge } from '@/lib/utils/get-status-badge'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { MaintenanceRequestRowActions } from './maintenance-request-row-actions'
import type { MaintenanceStatus } from '@/generated/prisma'

export const maintenanceRequestsTableColumns: ColumnDef<MaintenanceRequestsColumnType>[] =
  [
    {
      accessorKey: 'assetTag',
      id: 'N° Patrimônio',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
    },
    {
      accessorKey: 'assetType',
      id: 'Tipo do Ativo',
      enableGlobalFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
      cell: ({ row }) => {
        const assetType = row.original.assetType
        return getAssetTypeLabel(assetType)
      },
    },
    {
      accessorKey: 'requesterName',
      id: 'Solicitante',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
    },
    {
      accessorKey: 'createdAt',
      id: 'Data de Abertura',
      enableGlobalFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={column.id} />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
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
    {
      id: 'actions',
      enableHiding: false,
      enableGlobalFilter: false,
      cell: ({ row }) => <MaintenanceRequestRowActions row={row} />,
    },
  ]
