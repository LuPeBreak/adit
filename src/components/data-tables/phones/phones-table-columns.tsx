'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { PhonesColumnType } from './phones-table-types'
import { AssetStatus, PhoneType } from '@/generated/prisma'
import {
  getAssetStatusBadge,
  getPhoneTypeBadge,
} from '@/lib/utils/get-status-badge'
import { formatPhoneNumber } from '@/lib/utils/contact-formatter'
import { PhoneRowActions } from './phone-row-actions'

export const phonesTableColumns: ColumnDef<PhonesColumnType>[] = [
  {
    accessorKey: 'tag',
    id: 'N° Patrimônio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'phoneNumber',
    id: 'Telefone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      const phoneNumber = cell.getValue() as string
      return formatPhoneNumber(phoneNumber)
    },
  },
  {
    accessorKey: 'serialNumber',
    id: 'N° de Série',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'phoneType',
    id: 'Tipo',
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      return getPhoneTypeBadge(cell.getValue() as PhoneType)
    },
  },
  {
    accessorKey: 'department',
    id: 'Secretaria',
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
    cell: ({ row }) => <PhoneRowActions row={row} />,
  },
]
