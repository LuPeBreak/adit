'use client'

import { BasicDialog } from '@/components/basic-dialog'
import { getMaintenanceStatusBadge } from '@/lib/utils/get-status-badge'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { formatDate } from '@/lib/utils/format-date'
import { formatPhoneNumber } from '@/lib/utils/contact-formatter'
import type { MaintenanceRequestsColumnType } from './maintenance-requests-table-types'

interface MaintenanceRequestDetailsDialogProps {
  maintenanceRequest: MaintenanceRequestsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MaintenanceRequestDetailsDialog({
  maintenanceRequest,
  open,
  onOpenChange,
}: MaintenanceRequestDetailsDialogProps) {
  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da Solicitação de Manutenção"
      description={`Informações completas da solicitação de "${maintenanceRequest.requesterName}"`}
      className="max-w-4xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {/* Informações do Ativo */}
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">
            🏷️ Informações do Ativo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">N° Patrimônio:</span>
              <p className="text-blue-600 font-mono">
                {maintenanceRequest.assetTag}
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Tipo do Ativo:</span>
              <div className="mt-1 text-blue-600">
                {getAssetTypeLabel(maintenanceRequest.assetType)}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <span className="font-medium text-blue-700">Secretaria:</span>
              <p className="text-blue-600">{maintenanceRequest.department}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Setor:</span>
              <p className="text-blue-600">{maintenanceRequest.sector}</p>
            </div>
          </div>
        </div>

        {/* Informações da Solicitação */}
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3">
            📋 Informações da Solicitação
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-700">
                Descrição do Problema:
              </span>
              <p className="text-green-600 mt-1 p-2 bg-white rounded border">
                {maintenanceRequest.description}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">
                Data de Abertura:
              </span>
              <p className="text-green-600">
                {formatDate(maintenanceRequest.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Status e Histórico */}
        <div className="rounded-md bg-purple-50 p-4 border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-3">
            📊 Status e Histórico
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-purple-700">Status Atual:</span>
              <div className="mt-1">
                {getMaintenanceStatusBadge(maintenanceRequest.status)}
              </div>
            </div>

            {maintenanceRequest.lastStatusUpdateChangedAt && (
              <div className="mt-3 space-y-2">
                <span className="font-medium text-purple-700">
                  Última Atualização:
                </span>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium text-purple-700">Data:</span>
                      <p className="text-purple-600">
                        {formatDate(
                          maintenanceRequest.lastStatusUpdateChangedAt,
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-700">
                        Responsável:
                      </span>
                      <p className="text-purple-600">
                        {maintenanceRequest.lastStatusUpdateUserName}
                      </p>
                    </div>
                  </div>
                  {maintenanceRequest.lastStatusUpdateNotes && (
                    <div>
                      <span className="font-medium text-purple-700">
                        Observações:
                      </span>
                      <p className="text-purple-600 mt-1">
                        {maintenanceRequest.lastStatusUpdateNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informações do Solicitante */}
        <div className="rounded-md bg-orange-50 p-4 border border-orange-200">
          <h3 className="text-sm font-semibold text-orange-800 mb-3">
            👤 Informações do Solicitante
          </h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-orange-700">Nome:</span>
                <p className="text-orange-600">
                  {maintenanceRequest.requesterName}
                </p>
              </div>
              <div>
                <span className="font-medium text-orange-700">Matrícula:</span>
                <p className="text-orange-600">
                  {maintenanceRequest.registrationNumber}
                </p>
              </div>
            </div>
            <div>
              <span className="font-medium text-orange-700">E-mail:</span>
              <p className="text-orange-600 break-all">
                {maintenanceRequest.requesterEmail}
              </p>
            </div>
            <div>
              <span className="font-medium text-orange-700">WhatsApp:</span>
              <p className="text-orange-600">
                {formatPhoneNumber(maintenanceRequest.requesterWhatsApp)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BasicDialog>
  )
}
