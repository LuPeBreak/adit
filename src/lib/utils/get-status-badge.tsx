import { Badge } from '@/components/ui/badge'
import { AssetStatus, TonerRequestStatus } from '@/generated/prisma'

// Classes base para padronizar o tamanho dos badges
const baseClasses = 'w-20 justify-center text-center'

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
