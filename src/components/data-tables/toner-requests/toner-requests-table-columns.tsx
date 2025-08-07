'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../data-table-column-header'
import type { TonerRequestsColumnType } from './toner-requests-table-types'
import { TonerRequestStatus } from '@/generated/prisma'
import { Badge } from '@/components/ui/badge'

function getStatusBadge(status: TonerRequestStatus) {
  const baseClasses = 'w-20 justify-center text-center'

  switch (status) {
    case TonerRequestStatus.PENDING:
      return (
        <Badge
          variant="outline"
          className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${baseClasses}`}
        >
          Pendente
        </Badge>
      )
    case TonerRequestStatus.APPROVED:
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 text-blue-700 border-blue-200 ${baseClasses}`}
        >
          Aprovado
        </Badge>
      )
    case TonerRequestStatus.DELIVERED:
      return (
        <Badge
          variant="outline"
          className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}
        >
          Entregue
        </Badge>
      )
    case TonerRequestStatus.REJECTED:
      return (
        <Badge
          variant="outline"
          className={`bg-red-50 text-red-700 border-red-200 ${baseClasses}`}
        >
          Rejeitado
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={baseClasses}>
          Desconhecido
        </Badge>
      )
  }
}

export const tonerRequestsTableColumns: ColumnDef<TonerRequestsColumnType>[] = [
  {
    accessorKey: 'requesterName',
    id: 'Requerente',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },
  {
    accessorKey: 'assetTag',
    id: 'N° Patrimonio',
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
    id: 'Status',
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ cell }) => {
      return getStatusBadge(cell.getValue() as TonerRequestStatus)
    },
  },
]
