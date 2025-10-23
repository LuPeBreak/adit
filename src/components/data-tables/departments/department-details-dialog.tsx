'use client'

import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react'
import { BasicDialog } from '@/components/basic-dialog'
import type { DepartmentsColumnType } from './departments-table-types'
import { formatPhoneNumber } from '@/lib/utils/contact-formatter'

interface DepartmentDetailsDialogProps {
  department: DepartmentsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentDetailsDialog({
  department,
  open,
  onOpenChange,
}: DepartmentDetailsDialogProps) {
  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes da Secretaria"
      description={department.name}
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
                <p className="text-blue-600">{department.name}</p>
              </div>
              <div>
                <span className="font-medium text-blue-700">Sigla:</span>
                <p className="text-blue-600 font-mono">{department.acronym}</p>
              </div>
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
              <p className="text-green-600">{department.manager}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-700">Email:</span>
              <a
                href={`mailto:${department.managerEmail}`}
                className="text-green-600 hover:text-green-800 underline"
              >
                {department.managerEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        {(department.contact || department.address || department.website) && (
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800 mb-3">
              📞 Informações de Contato
            </h3>
            <div className="space-y-3 text-sm">
              {department.contact && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-700">Contato:</span>
                  <p className="text-amber-600 font-mono">
                    {formatPhoneNumber(department.contact)}
                  </p>
                </div>
              )}
              {department.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-medium text-amber-700">
                      Endereço:
                    </span>
                    <p className="text-amber-600">{department.address}</p>
                  </div>
                </div>
              )}
              {department.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-amber-700">Website:</span>
                  <a
                    href={department.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-800 underline flex items-center gap-1"
                  >
                    {department.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BasicDialog>
  )
}
