'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BasicDialog } from '@/components/basic-dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { TonerRequestsColumnType } from './toner-requests-table-types'
import { approveTonerRequestAction } from '@/actions/toner-requests/approve-toner-request'
import { formatRelativeDate } from '@/lib/utils/format-date'

interface ApproveTonerRequestDialogProps {
  tonerRequest: TonerRequestsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApproveTonerRequestDialog({
  tonerRequest,
  open,
  onOpenChange,
}: ApproveTonerRequestDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleApprove() {
    setIsLoading(true)
    try {
      const response = await approveTonerRequestAction({
        tonerRequestId: tonerRequest.id,
      })
      if (response.success) {
        toast.success('Pedido aprovado com sucesso')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao aprovar pedido')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Aprovar Pedido de Toner"
      description={`Tem certeza que deseja aprovar o pedido de "${tonerRequest.requesterName}"?`}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-3 border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Confirmação:</strong> O pedido será marcado como aprovado e
            o solicitante será notificado por email.
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Detalhes do Pedido:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-1 space-y-1">
            <li>
              • <strong>Requerente:</strong> {tonerRequest.requesterName}
            </li>
            <li>
              • <strong>Toner Requerido:</strong>{' '}
              <span className="font-mono">{tonerRequest.selectedToner}</span>
            </li>
            <li>
              • <strong>Patrimônio:</strong> {tonerRequest.assetTag}
            </li>
            <li>
              • <strong>Setor:</strong> {tonerRequest.sector}
            </li>
            <li>
              • <strong>Secretaria:</strong> {tonerRequest.department}
            </li>
            <li>
              • <strong>Data do Pedido:</strong>{' '}
              {formatRelativeDate(tonerRequest.createdAt)}
            </li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Aprovar Pedido
          </Button>
        </div>
      </div>
    </BasicDialog>
  )
}
