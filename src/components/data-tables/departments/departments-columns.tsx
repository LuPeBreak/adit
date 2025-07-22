'use client'

import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'

export const departmentSchema = z.object({
  name: z.string(),
  manager: z.string(),
  managerEmail: z.string().email(),
})

export type DepartmentColumnsType = z.infer<typeof departmentSchema>

export const departmentColumns: ColumnDef<DepartmentColumnsType>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'manager',
    header: 'Responsável',
  },
  {
    accessorKey: 'managerEmail',
    header: 'Email',
  },
]
