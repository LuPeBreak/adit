'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { SectorsColumnType } from './sectors-table-schema'

export const sectorsTableColumns: ColumnDef<SectorsColumnType>[] = [
  {
    accessorKey: 'name',
    id: 'Nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'manager',
    id: 'Responsável',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Responsável" />
    ),
  },
  {
    accessorKey: 'managerEmail',
    id: 'Email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
]
