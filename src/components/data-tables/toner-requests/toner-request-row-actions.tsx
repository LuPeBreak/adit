'use client'

import { useState } from 'react'
import { MoreHorizontal, Check, X, Truck, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { RejectTonerRequestDialog } from './reject-toner-request-dialog'
import { DeliverTonerRequestDialog } from './deliver-toner-request-dialog'
import { ApproveTonerRequestDialog } from './approve-toner-request-dialog'
import { TonerRequestDetailsDialog } from './toner-request-details-dialog'

export function TonerRequestRowActions({ row }: TonerRequestRowActionsProps) {
  const tonerRequest = row.original
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isDeliverDialogOpen, setIsDeliverDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Determinar quais ações estão disponíveis baseado no status atual
  const canApprove =
    tonerRequest.status === TonerRequestStatus.PENDING ||
    tonerRequest.status === TonerRequestStatus.REJECTED
  const canReject = tonerRequest.status === TonerRequestStatus.PENDING
  const canDeliver = tonerRequest.status === TonerRequestStatus.APPROVED

  return (
    <>
      <ApproveTonerRequestDialog
        tonerRequest={tonerRequest}
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      />
      <RejectTonerRequestDialog
        tonerRequest={tonerRequest}
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      />
      <DeliverTonerRequestDialog
        tonerRequest={tonerRequest}
        open={isDeliverDialogOpen}
        onOpenChange={setIsDeliverDialogOpen}
      />
      <TonerRequestDetailsDialog
        tonerRequest={tonerRequest}
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
            <span>Ver Detalhes</span>
          </DropdownMenuItem>

          {(canApprove || canReject || canDeliver) && <DropdownMenuSeparator />}

          {canApprove && (
            <DropdownMenuItem onClick={() => setIsApproveDialogOpen(true)}>
              <Check className="text-green-600" />
              <span className="text-green-600">Aprovar</span>
            </DropdownMenuItem>
          )}

          {canReject && (
            <DropdownMenuItem onClick={() => setIsRejectDialogOpen(true)}>
              <X className="text-destructive" />
              <span className="text-destructive">Rejeitar</span>
            </DropdownMenuItem>
          )}

          {canDeliver && (
            <DropdownMenuItem onClick={() => setIsDeliverDialogOpen(true)}>
              <Truck className="text-blue-600" />
              <span className="text-blue-600">Entregar</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
