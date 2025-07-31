'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { PrinterModelsColumnType } from './printer-models-table-types'
import { DataTableColumnHeader } from '../data-table-column-header'

export const printerModelsTableColumns: ColumnDef<PrinterModelsColumnType>[] = [
  {
    accessorKey: 'name',
    id: 'Nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'toners',
    accessorFn: ({ toners }) => {
      return Array.from(toners as Array<string>).join(' || ')
    },
    id: 'Toners',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: '_count.printers',
    id: 'Quantidade de impressoras',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
]
