'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Eye,
  History,
  Wrench,
  CheckCircle,
  XCircle,
} from 'lucide-react'
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
import { UpdateMaintenanceRequestStatusDialog } from './update-maintenance-request-status-dialog'
import Link from 'next/link'
import { getAvailableTargets } from '@/lib/maintenance/transition-rules'
import { getMaintenanceStatusLabel } from '@/lib/utils/get-status-label'
import { MaintenanceStatus } from '@/generated/prisma'

export function MaintenanceRequestRowActions({
  row,
}: MaintenanceRequestRowActionsProps) {
  const maintenanceRequest = row.original
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [targetStatus, setTargetStatus] = useState<MaintenanceStatus | null>(
    null,
  )

  return (
    <>
      <MaintenanceRequestDetailsDialog
        maintenanceRequest={maintenanceRequest}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      {targetStatus && (
        <UpdateMaintenanceRequestStatusDialog
          maintenanceRequest={maintenanceRequest}
          targetStatus={targetStatus}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
        />
      )}

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
            <Link
              href={`/dashboard/maintenance-requests/${maintenanceRequest.id}`}
            >
              <History className="mr-2 h-4 w-4" />
              Histórico
            </Link>
          </DropdownMenuItem>
          
          {/* Ações de atualização de status baseadas nas transições disponíveis */}
          {getAvailableTargets(maintenanceRequest.status).length > 0 && (
            <>
              <DropdownMenuSeparator />
              {getAvailableTargets(maintenanceRequest.status).map((status) => {
                const label = getMaintenanceStatusLabel(status)
                const onClick = () => {
                  setTargetStatus(status)
                  setIsUpdateDialogOpen(true)
                }
                // Escolher ícone e cor por status alvo
                switch (status) {
                  case MaintenanceStatus.ANALYZING:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <Eye className="mr-2 h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-600">{label}</span>
                      </DropdownMenuItem>
                    )
                  case MaintenanceStatus.MAINTENANCE:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <Wrench className="mr-2 h-4 w-4 text-purple-600" />
                        <span className="text-purple-600">{label}</span>
                      </DropdownMenuItem>
                    )
                  case MaintenanceStatus.COMPLETED:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        <span className="text-green-600">{label}</span>
                      </DropdownMenuItem>
                    )
                  case MaintenanceStatus.CANCELLED:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <XCircle className="mr-2 h-4 w-4 text-destructive" />
                        <span className="text-destructive">{label}</span>
                      </DropdownMenuItem>
                    )
                  default:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <MoreHorizontal className="mr-2 h-4 w-4" />
                        <span>{label}</span>
                      </DropdownMenuItem>
                    )
                }
              })}
            </>
          )}

          
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
