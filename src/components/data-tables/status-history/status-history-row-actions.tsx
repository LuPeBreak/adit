'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { StatusHistoryRowActionsProps } from './status-history-types'
import { StatusHistoryDetailsDialog } from './status-history-details-dialog'

export function StatusHistoryRowActions({ row }: StatusHistoryRowActionsProps) {
  const statusHistory = row.original
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  return (
    <>
      <StatusHistoryDetailsDialog
        statusHistory={statusHistory}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RowActionsButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setIsDetailsDialogOpen(true)}>
            <Eye />
            <span>Detalhes</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
