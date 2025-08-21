'use client'

import { useState } from 'react'
import { MoreHorizontal, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
