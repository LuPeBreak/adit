'use client'

import { BasicDialog } from '@/components/basic-dialog'
import type { TonerRequestsColumnType } from './toner-requests-table-types'
import { getTonerRequestStatusBadge } from '@/lib/utils/get-status-badge'
import { formatFullDate } from '@/lib/utils/format-date'

interface TonerRequestDetailsDialogProps {
  tonerRequest: TonerRequestsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TonerRequestDetailsDialog({
  tonerRequest,
  open,
  onOpenChange,
}: TonerRequestDetailsDialogProps) {
  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do Pedido de Toner"
      description={`Informações completas do pedido de "${tonerRequest.requesterName}"`}
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {/* Informações do Requerente */}
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">
            📋 Informações do Requerente
          </h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-blue-700">Nome:</span>
                <p className="text-blue-600">{tonerRequest.requesterName}</p>
              </div>
              <div>
                <span className="font-medium text-blue-700">Matrícula:</span>
                <p className="text-blue-600">
                  {tonerRequest.registrationNumber}
                </p>
              </div>
            </div>
            <div>
              <span className="font-medium text-blue-700">E-mail:</span>
              <p className="text-blue-600 break-all">
                {tonerRequest.requesterEmail}
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-700">WhatsApp:</span>
              <p className="text-blue-600">{tonerRequest.requesterWhatsApp}</p>
            </div>
          </div>
        </div>

        {/* Informações do Pedido */}
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3">
            🖨️ Informações do Pedido
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-green-700">
                Toner Requerido:
              </span>
              <p className="text-green-600 font-mono">
                {tonerRequest.selectedToner}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">Patrimônio:</span>
              <p className="text-green-600">{tonerRequest.assetTag}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Setor:</span>
              <p className="text-green-600">{tonerRequest.sector}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Secretaria:</span>
              <p className="text-green-600">{tonerRequest.department}</p>
            </div>
          </div>
        </div>

        {/* Status e Data */}
        <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            📊 Status e Cronologia
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status Atual:</span>
              <div className="mt-1">
                {getTonerRequestStatusBadge(tonerRequest.status)}
              </div>
            </div>

            {tonerRequest.notes && (
              <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200">
                <span className="font-medium text-yellow-800">Observação:</span>
                <p className="text-yellow-700 mt-1">{tonerRequest.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-700">
                  Data do Pedido:
                </span>
                <p className="text-gray-600">
                  {formatFullDate(tonerRequest.createdAt)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Última Atualização:
                </span>
                <p className="text-gray-600">
                  {formatFullDate(tonerRequest.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicDialog>
  )
}
