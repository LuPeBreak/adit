import { MaintenanceStatus } from '@/generated/prisma'

export interface MaintenanceRequestWhatsAppData {
  requesterName: string
  assetType: string
  assetTag: string
  department?: string
  sector?: string
  description?: string
  notes?: string
  status: MaintenanceStatus
}

const statusMessages: Record<MaintenanceStatus, string> = {
  PENDING: '📝 *Pedido de Manutenção Recebido*',
  ANALYZING: '🔍 *Manutenção em Análise*',
  MAINTENANCE: '🔧 *Manutenção em Andamento*',
  COMPLETED: '✅ *Manutenção Concluída*',
  CANCELLED: '❌ *Manutenção Cancelada*',
}

function createStandardWhatsAppTemplate(
  data: MaintenanceRequestWhatsAppData,
  isStatusUpdate = false,
): string {
  const statusMessage = statusMessages[data.status]
  const assetInfo = `${data.assetTag} (${data.assetType})`

  // Informações de localização do ativo (se disponível)
  const locationInfo =
    data.department || data.sector
      ? `📍 *Localização do Ativo:*\n• Secretaria: ${data.department || 'Não informado'}\n• Setor: ${data.sector || 'Não informado'}\n\n`
      : ''

  // Descrição do problema (apenas para confirmação, não para atualizações de status)
  const problemInfo =
    !isStatusUpdate && data.description
      ? `🔍 *Problema Relatado:*\n${data.description}\n\n`
      : ''

  // Observações adicionais (apenas para atualizações de status)
  const notesInfo =
    isStatusUpdate && data.notes ? `📝 *Observações:*\n${data.notes}\n\n` : ''

  let message = `${statusMessage}\n\n`
  message += `Olá *${data.requesterName}*!\n\n`

  switch (data.status) {
    case 'PENDING':
      message += `Seu pedido de manutenção foi recebido e está sendo analisado pela equipe de TI.\n\n`
      break
    case 'ANALYZING':
      message += `Seu pedido está sendo analisado pela equipe de TI.\n\n`
      break
    case 'MAINTENANCE':
      message += `Sua manutenção está em andamento. Nossa equipe está trabalhando no seu equipamento.\n\n`
      break
    case 'COMPLETED':
      message += `Sua manutenção foi concluída com sucesso! Seu equipamento está pronto para uso.\n\n`
      break
    case 'CANCELLED':
      message += `Seu pedido de manutenção foi cancelado.\n\n`
      break
  }

  message += `🔧 *Equipamento:* ${assetInfo}\n\n`
  message += locationInfo
  message += problemInfo
  message += notesInfo
  message += `---\n*Sistema ADIT - PMBM*\n_Prefeitura Municipal de Barra Mansa_`

  return message
}

export function createMaintenanceRequestConfirmationWhatsAppTemplate(
  data: MaintenanceRequestWhatsAppData,
): string {
  return createStandardWhatsAppTemplate({ ...data, status: 'PENDING' }, false)
}

export function createMaintenanceRequestStatusUpdateWhatsAppTemplate(
  data: MaintenanceRequestWhatsAppData,
): string {
  return createStandardWhatsAppTemplate(data, true)
}
