'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { AssetsColumnType } from './assets-table-types'
import { AssetStatus, AssetType } from '@/generated/prisma'
import { getAssetStatusBadge } from '@/lib/utils/get-status-badge'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { AssetRowActions } from './asset-row-actions'

export const assetsTableColumns: ColumnDef<AssetsColumnType>[] = [
  {
    accessorKey: 'tag',
    id: 'N° Patrimônio',
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
    accessorKey: 'assetType',
    id: 'Tipo do Ativo',
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      return getAssetTypeLabel(cell.getValue() as AssetType)
    },
  },
  {
    accessorKey: 'status',
    id: 'Estado',
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      return getAssetStatusBadge(cell.getValue() as AssetStatus)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <AssetRowActions row={row} />,
  },
]
