'use client'

import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'

export const departmentSchema = z.object({
  name: z.string(),
  manager: z.string(),
  managerEmail: z.string().email(),
})

export type DepartmentColumnsType = z.infer<typeof departmentSchema>

export const departmentColumns: ColumnDef<DepartmentColumnsType>[] = [
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
