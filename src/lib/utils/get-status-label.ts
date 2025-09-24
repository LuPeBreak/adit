import {
  AssetStatus,
  TonerRequestStatus,
  AssetType,
  PhoneType,
  MaintenanceStatus,
} from '@/generated/prisma'

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
    case AssetType.PHONE:
      return 'Telefone'
    default:
      return type // Retorna o próprio valor se não houver um mapeamento específico
  }
}

// Função para converter PhoneType para label amigável
export function getPhoneTypeLabel(type: PhoneType): string {
  switch (type) {
    case PhoneType.VOIP:
      return 'VoIP'
    case PhoneType.ANALOG:
      return 'Analógico'
    case PhoneType.DIGITAL:
      return 'Digital'
    default:
      return type // Retorna o próprio valor se não houver um mapeamento específico
  }
}

// Função para converter MaintenanceStatus para label amigável
export function getMaintenanceStatusLabel(status: MaintenanceStatus): string {
  switch (status) {
    case MaintenanceStatus.PENDING:
      return 'Pendente'
    case MaintenanceStatus.ANALYZING:
      return 'Analisando'
    case MaintenanceStatus.MAINTENANCE:
      return 'Manutenção'
    case MaintenanceStatus.COMPLETED:
      return 'Concluído'
    case MaintenanceStatus.CANCELLED:
      return 'Cancelado'
    default:
      return status // Retorna o próprio valor se não houver um mapeamento específico
  }
}
