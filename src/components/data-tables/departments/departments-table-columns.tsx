'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { DepartmentsColumnType } from './departments-table-types'
import { DepartmentRowActions } from './department-row-actions'

export const departmentsTableColumns: ColumnDef<DepartmentsColumnType>[] = [
  {
    accessorKey: 'name',
    id: 'Nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'acronym',
    id: 'Sigla',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'manager',
    id: 'Responsável',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'managerEmail',
    id: 'Email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    enableGlobalFilter: false,
    cell: ({ row }) => <DepartmentRowActions row={row} />,
  },
]
