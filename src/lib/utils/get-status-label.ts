import { AssetStatus, TonerRequestStatus, AssetType } from '@/generated/prisma'

// Função para converter AssetStatus para label amigável
export function getAssetStatusLabel(status: AssetStatus): string {
  switch (status) {
    case AssetStatus.RESERVED:
      return 'Reservado'
    case AssetStatus.STOCK:
      return 'Em Estoque'
    case AssetStatus.USING:
      return 'Em Uso'
    case AssetStatus.MAINTENANCE:
      return 'Em Manutenção'
    case AssetStatus.BROKEN:
      return 'Quebrado'
    default:
      return status // Retorna o próprio valor se não houver um mapeamento específico
  }
}

// Função para converter TonerRequestStatus para label amigável
export function getTonerRequestStatusLabel(status: TonerRequestStatus): string {
  switch (status) {
    case TonerRequestStatus.PENDING:
      return 'Pendente'
    case TonerRequestStatus.APPROVED:
      return 'Aprovado'
    case TonerRequestStatus.DELIVERED:
      return 'Entregue'
    case TonerRequestStatus.REJECTED:
      return 'Rejeitado'
    default:
      return status // Retorna o próprio valor se não houver um mapeamento específico
  }
}

// Função para converter AssetType para label amigável
export function getAssetTypeLabel(type: AssetType): string {
  switch (type) {
    case AssetType.PRINTER:
      return 'Impressora'
    default:
      return type // Retorna o próprio valor se não houver um mapeamento específico
  }
}
