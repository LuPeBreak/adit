'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { PrintersColumnType } from './printers-table-types'
import { AssetStatus } from '@/generated/prisma'
import { getColoredStatus } from '@/utils/get-colored-status'
import { PrinterRowActions } from './printer-row-actions'

export const printersTableColumns: ColumnDef<PrintersColumnType>[] = [
  {
    accessorKey: 'tag',
    id: 'N° Patrimônio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'ipAddress',
    id: 'Endereço ip',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'serialNumber',
    id: 'N° Serial',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'printerModel',
    id: 'Modelo',
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
    id: 'Estado',
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      return getColoredStatus(cell.getValue() as AssetStatus)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <PrinterRowActions row={row} />,
  },
]
