'use client'

import { BasicDialog } from '@/components/basic-dialog'
import type { PhonesColumnType } from './phones-table-types'
import {
  getAssetStatusBadge,
  getPhoneTypeBadge,
} from '@/lib/utils/get-status-badge'
import { formatFullDate } from '@/lib/utils/format-date'
import { formatPhoneNumber } from '@/lib/utils/contact-formatter'
import { PhoneType } from '@/generated/prisma'

interface PhoneDetailsDialogProps {
  phone: PhonesColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PhoneDetailsDialog({
  phone,
  open,
  onOpenChange,
}: PhoneDetailsDialogProps) {

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do Telefone"
      description={`Informações completas do telefone ${phone.tag}`}
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {/* Informações Básicas */}
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">
            📞 Informações Básicas
          </h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-blue-700">
                  N° Patrimônio:
                </span>
                <p className="text-blue-600 font-mono">{phone.tag}</p>
              </div>
              <div>
                <span className="font-medium text-blue-700">N° Serial:</span>
                <p className="text-blue-600 font-mono">{phone.serialNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-blue-700">Número:</span>
                <p className="text-blue-600 font-mono">
                  {formatPhoneNumber(phone.phoneNumber)}
                </p>
              </div>
              <div>
                <span className="font-medium text-blue-700">Marca:</span>
                <p className="text-blue-600">{phone.brand}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-blue-700">Tipo:</span>
                <div className="mt-1">{getPhoneTypeBadge(phone.phoneType)}</div>
              </div>
              {phone.phoneType === PhoneType.VOIP && phone.ipAddress && (
                <div>
                  <span className="font-medium text-blue-700">
                    Endereço IP:
                  </span>
                  <p className="text-blue-600 font-mono">{phone.ipAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações de Localização */}
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3">
            🏢 Localização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-green-700">Setor:</span>
              <p className="text-green-600">{phone.sector}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Secretaria:</span>
              <p className="text-green-600">{phone.department}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            📊 Status do Ativo
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status Atual:</span>
              <div className="mt-1">{getAssetStatusBadge(phone.status)}</div>
            </div>
          </div>
        </div>

        {/* Seção de Cronologia */}
        <div className="rounded-md bg-purple-50 p-4 border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-3">
            📊 Cronologia
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-purple-100/50 rounded-lg border border-purple-200/50">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">
                  Telefone criado
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {formatFullDate(phone.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-100/50 rounded-lg border border-purple-200/50">
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-0.5 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">
                  Última atualização de status
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {formatFullDate(phone.lastStatusUpdate || phone.updatedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-100/50 rounded-lg border border-purple-200/50">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-0.5 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">
                  Última modificação
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {formatFullDate(phone.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicDialog>
  )
}