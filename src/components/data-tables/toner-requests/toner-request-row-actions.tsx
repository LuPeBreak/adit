'use client'

import { useState } from 'react'
import { Check, X, Truck, Eye } from 'lucide-react'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TonerRequestRowActionsProps } from './toner-requests-table-types'
import { TonerRequestStatus } from '@/generated/prisma'
import { getTonerRequestStatusLabel } from '@/lib/utils/get-status-label'
import { UpdateTonerRequestStatusDialog } from './update-toner-request-status-dialog'
import { TonerRequestDetailsDialog } from './toner-request-details-dialog'
import { getValidStatusTransitions } from '@/lib/status-transition-rules/toner/transition-rules'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'

export function TonerRequestRowActions({ row }: TonerRequestRowActionsProps) {
  const tonerRequest = row.original
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [targetStatus, setTargetStatus] = useState<TonerRequestStatus | null>(
    null,
  )

  const availableTargets = getValidStatusTransitions(tonerRequest.status)

  // Permissions (síncrono via role)
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return <RowActionsButton />
  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { tonerRequest: ['update'] },
    role: session.user.role as Role,
  })

  return (
    <>
      <TonerRequestDetailsDialog
        tonerRequest={tonerRequest}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      {targetStatus && (
        <UpdateTonerRequestStatusDialog
          tonerRequest={tonerRequest}
          targetStatus={targetStatus}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RowActionsButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setIsDetailsDialogOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>

          {/* Ações de atualização de status baseadas nas transições disponíveis */}
          {availableTargets.length > 0 && canUpdate && (
            <>
              <DropdownMenuSeparator />
              {availableTargets.map((status) => {
                const label = getTonerRequestStatusLabel(status)
                const onClick = () => {
                  setTargetStatus(status)
                  setIsUpdateDialogOpen(true)
                }

                // Escolher ícone e cor por status alvo
                switch (status) {
                  case TonerRequestStatus.APPROVED:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        <span className="text-green-600">{label}</span>
                      </DropdownMenuItem>
                    )
                  case TonerRequestStatus.REJECTED:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <X className="mr-2 h-4 w-4 text-destructive" />
                        <span className="text-destructive">{label}</span>
                      </DropdownMenuItem>
                    )
                  case TonerRequestStatus.DELIVERED:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
                        <Truck className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="text-blue-600">{label}</span>
                      </DropdownMenuItem>
                    )
                  default:
                    return (
                      <DropdownMenuItem key={status} onClick={onClick}>
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
