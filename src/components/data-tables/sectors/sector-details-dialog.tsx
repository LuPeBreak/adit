'use client'

import { Building, Mail, Phone, MapPin } from 'lucide-react'
import { BasicDialog } from '@/components/basic-dialog'
import type { SectorsColumnType } from './sectors-table-types'
import { formatPhoneNumber } from '@/lib/utils/contact-formatter'

interface SectorDetailsDialogProps {
  sector: SectorsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SectorDetailsDialog({
  sector,
  open,
  onOpenChange,
}: SectorDetailsDialogProps) {
  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do Setor"
      description={sector.name}
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
        {/* Informações Básicas */}
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">
            🏢 Informações Básicas
          </h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-blue-700">Nome:</span>
                <p className="text-blue-600">{sector.name}</p>
              </div>
              <div>
                <span className="font-medium text-blue-700">Sigla:</span>
                <p className="text-blue-600 font-mono">{sector.acronym}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-700">Secretaria:</span>
              <p className="text-blue-600">{sector.departmentName}</p>
            </div>
          </div>
        </div>

        {/* Informações do Responsável */}
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3">
            👤 Responsável
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-700">Nome:</span>
              <p className="text-green-600">{sector.manager}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-700">Email:</span>
              <a
                href={`mailto:${sector.managerEmail}`}
                className="text-green-600 hover:text-green-800 underline"
              >
                {sector.managerEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        {(sector.contact || sector.address) && (
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 mb-3">
              📞 Informações de Contato
            </h3>
            <div className="space-y-3 text-sm">
              {sector.contact && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-700">Contato:</span>
                  <p className="text-amber-600 font-mono">
                    {formatPhoneNumber(sector.contact)}
                  </p>
                </div>
              )}
              {sector.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-medium text-amber-700">
                      Endereço:
                    </span>
                    <p className="text-amber-600">{sector.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BasicDialog>
  )
}
