'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { AssetsColumnType } from './assets-table-types'
import { AssetStatus, AssetType } from '@/generated/prisma'
import { getColoredStatus } from '@/lib/utils/get-colored-status'

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
      switch (cell.getValue()) {
        case AssetType.PRINTER:
          return 'Impressora'
        default:
          return ''
      }
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
      return getColoredStatus(cell.getValue() as AssetStatus)
    },
  },
]
