'use client'

import { useState } from 'react'
import { MoreHorizontal, Eye, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { MaintenanceRequestRowActionsProps } from './maintenance-requests-table-types'
import { MaintenanceRequestDetailsDialog } from './maintenance-request-details-dialog'
import Link from 'next/link'

export function MaintenanceRequestRowActions({ row }: MaintenanceRequestRowActionsProps) {
  const maintenanceRequest = row.original
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  return (
    <>
      <MaintenanceRequestDetailsDialog
        maintenanceRequest={maintenanceRequest}
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
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/dashboard/maintenance-requests/${maintenanceRequest.id}`}>
              <History className="mr-2 h-4 w-4"  />
              Histórico
            </Link>
          </DropdownMenuItem>

          
          
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}