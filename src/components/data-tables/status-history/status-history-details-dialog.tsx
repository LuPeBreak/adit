'use client'

import { BasicDialog } from '@/components/basic-dialog'
import type { StatusHistoryColumnType } from './status-history-types'
import { getAssetStatusBadge } from '@/lib/utils/get-status-badge'
import { formatFullDate } from '@/lib/utils/format-date'

interface StatusHistoryDetailsDialogProps {
  statusHistory: StatusHistoryColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatusHistoryDetailsDialog({
  statusHistory,
  open,
  onOpenChange,
}: StatusHistoryDetailsDialogProps) {
  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do Histórico de Status"
      description="Informações completas da mudança de status"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {/* Informações do Responsável */}
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">
            👤 Responsável pela Atualização
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-blue-700">Nome:</span>
              <p className="text-blue-600">{statusHistory.user.name}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Email:</span>
              <p className="text-blue-600">{statusHistory.user.email}</p>
            </div>
          </div>
        </div>

        {/* Informações da Localização */}
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3">
            📍 Localização do Ativo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-green-700">Setor:</span>
              <p className="text-green-600">{statusHistory.sector.name}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Secretaria:</span>
              <p className="text-green-600">
                {statusHistory.sector.department.name}
              </p>
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
              <span className="font-medium text-gray-700">Estado:</span>
              <div className="mt-1">
                {getAssetStatusBadge(statusHistory.status)}
              </div>
            </div>

            {statusHistory.notes && (
              <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200">
                <span className="font-medium text-yellow-800">
                  Observações:
                </span>
                <p className="text-yellow-700 mt-1">{statusHistory.notes}</p>
              </div>
            )}

            <div>
              <span className="font-medium text-gray-700">
                Data da Atualização:
              </span>
              <p className="text-gray-600">
                {formatFullDate(statusHistory.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BasicDialog>
  )
}
