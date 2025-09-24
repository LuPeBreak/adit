import { Badge } from '@/components/ui/badge'
import {
  AssetStatus,
  TonerRequestStatus,
  PhoneType,
  MaintenanceStatus,
} from '@/generated/prisma'

// Classes base para padronizar o tamanho dos badges
const baseClasses = 'w-20 justify-center text-center'

// ========================================
// ASSET STATUS BADGES
// ========================================

// Função para criar badges de AssetStatus
export function getAssetStatusBadge(status: AssetStatus) {
  switch (status) {
    case AssetStatus.RESERVED:
      return (
        <Badge
          variant="outline"
          className={`bg-gray-50 text-gray-700 border-gray-200 ${baseClasses}`}
        >
          Reservado
        </Badge>
      )
    case AssetStatus.STOCK:
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 text-blue-700 border-blue-200 ${baseClasses}`}
        >
          Estoque
        </Badge>
      )
    case AssetStatus.USING:
      return (
        <Badge
          variant="outline"
          className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}
        >
          Em Uso
        </Badge>
      )
    case AssetStatus.MAINTENANCE:
      return (
        <Badge
          variant="outline"
          className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${baseClasses}`}
        >
          Manutenção
        </Badge>
      )
    case AssetStatus.BROKEN:
      return (
        <Badge
          variant="outline"
          className={`bg-red-50 text-red-700 border-red-200 ${baseClasses}`}
        >
          Quebrado
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={baseClasses}>
          Desconhecido
        </Badge>
      )
  }
}

// ========================================
// USER STATUS BADGES
// ========================================

// Função para criar badges de status de usuário (banido/ativo)
export function getUserStatusBadge(banned: boolean) {
  if (banned) {
    return (
      <Badge
        variant="outline"
        className={`bg-red-50 text-red-700 border-red-200 ${baseClasses}`}
      >
        Banido
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}
    >
      Ativo
    </Badge>
  )
}

// ========================================
// TONER REQUEST STATUS BADGES
// ========================================

// Função para criar badges de TonerRequestStatus
export function getTonerRequestStatusBadge(status: TonerRequestStatus) {
  switch (status) {
    case TonerRequestStatus.PENDING:
      return (
        <Badge
          variant="outline"
          className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${baseClasses}`}
        >
          Pendente
        </Badge>
      )
    case TonerRequestStatus.APPROVED:
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 text-blue-700 border-blue-200 ${baseClasses}`}
        >
          Aprovado
        </Badge>
      )
    case TonerRequestStatus.DELIVERED:
      return (
        <Badge
          variant="outline"
          className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}
        >
          Entregue
        </Badge>
      )
    case TonerRequestStatus.REJECTED:
      return (
        <Badge
          variant="outline"
          className={`bg-red-50 text-red-700 border-red-200 ${baseClasses}`}
        >
          Rejeitado
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={baseClasses}>
          Desconhecido
        </Badge>
      )
  }
}

// ========================================
// MAINTENANCE STATUS BADGES
// ========================================

// Função para criar badges de MaintenanceStatus
export function getMaintenanceStatusBadge(status: MaintenanceStatus) {
  switch (status) {
    case MaintenanceStatus.PENDING:
      return (
        <Badge
          variant="outline"
          className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${baseClasses}`}
        >
          Pendente
        </Badge>
      )
    case MaintenanceStatus.ANALYZING:
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 text-blue-700 border-blue-200 ${baseClasses}`}
        >
          Analisando
        </Badge>
      )
    case MaintenanceStatus.MAINTENANCE:
      return (
        <Badge
          variant="outline"
          className={`bg-orange-50 text-orange-700 border-orange-200 ${baseClasses}`}
        >
          Manutenção
        </Badge>
      )
    case MaintenanceStatus.COMPLETED:
      return (
        <Badge
          variant="outline"
          className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}
        >
          Concluído
        </Badge>
      )
    case MaintenanceStatus.CANCELLED:
      return (
        <Badge
          variant="outline"
          className={`bg-red-50 text-red-700 border-red-200 ${baseClasses}`}
        >
          Cancelado
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={baseClasses}>
          Desconhecido
        </Badge>
      )
  }
}

// ========================================
// PHONE TYPE BADGES
// ========================================

// Função para criar badges de PhoneType
export function getPhoneTypeBadge(phoneType: PhoneType) {
  switch (phoneType) {
    case PhoneType.VOIP:
      return (
        <Badge
          variant="outline"
          className={`bg-blue-50 text-blue-700 border-blue-200 ${baseClasses}`}
        >
          VoIP
        </Badge>
      )
    case PhoneType.ANALOG:
      return (
        <Badge
          variant="outline"
          className={`bg-green-50 text-green-700 border-green-200 ${baseClasses}`}
        >
          Analógico
        </Badge>
      )
    case PhoneType.DIGITAL:
      return (
        <Badge
          variant="outline"
          className={`bg-purple-50 text-purple-700 border-purple-200 ${baseClasses}`}
        >
          Digital
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={baseClasses}>
          Desconhecido
        </Badge>
      )
  }
}
