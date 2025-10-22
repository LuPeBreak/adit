import { MaintenanceStatus } from '@/generated/prisma'
import {
  BaseEmailData,
  StatusConfig,
  createBaseEmailTemplate,
} from '../shared/base-email-template'

export interface MaintenanceRequestEmailData extends BaseEmailData {
  // Dados do ativo/equipamento (específicos de manutenção)
  assetTag?: string
  assetType?: string
  assetInfo?: string
  description?: string

  // Estado do pedido
  status: MaintenanceStatus

  // Para templates de atualização de status
  newStatus?: string
}

const statusConfigs: Record<MaintenanceStatus, StatusConfig> = {
  PENDING: {
    title: 'Novo Pedido de Manutenção',
    icon: '🔧',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  ANALYZING: {
    title: 'Pedido em Análise',
    icon: '🔍',
    color: '#f59e0b',
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
  },
  MAINTENANCE: {
    title: 'Manutenção em Andamento',
    icon: '⚙️',
    color: '#f59e0b',
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
  },
  COMPLETED: {
    title: 'Manutenção Concluída',
    icon: '✅',
    color: '#047857',
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  CANCELLED: {
    title: 'Pedido Cancelado',
    icon: '❌',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
}

function getStatusMessage(
  data: MaintenanceRequestEmailData,
  isNotification = false,
): string {
  switch (data.status) {
    case 'PENDING':
      if (isNotification) {
        // Mensagem para administradores - sem duplicar localização
        return `Um novo pedido de manutenção foi recebido de <strong>${data.requesterName}</strong>.`
      }
      return `Seu pedido de manutenção foi recebido com sucesso! Nossa equipe técnica irá analisá-lo e você receberá uma notificação assim que houver uma atualização.`

    case 'ANALYZING':
      return `Recebemos seu pedido de manutenção e ele está sendo analisado pela equipe técnica. Você receberá uma notificação assim que houver uma atualização.`

    case 'MAINTENANCE':
      return `Sua solicitação de manutenção está em andamento. Nossa equipe técnica está trabalhando no reparo do equipamento.`

    case 'COMPLETED':
      return `Ótimas notícias! A manutenção do seu equipamento foi concluída com sucesso.`

    case 'CANCELLED':
      return `Seu pedido de manutenção foi cancelado.`

    default:
      return 'Atualização sobre seu pedido de manutenção.'
  }
}

function createStandardEmailTemplate(
  data: MaintenanceRequestEmailData,
  isNotification = false,
  isStatusUpdate = false,
): string {
  const config = statusConfigs[data.status]
  const statusMessage = getStatusMessage(data, isNotification)

  // Conteúdo específico de manutenção (única parte que não é duplicada)
  const assetInfo =
    data.assetInfo ||
    `${data.assetTag || 'N/A'} (${data.assetType || 'Equipamento'})`

  const specificContent = `
    <!-- Asset Information -->
    <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #6b7280;">
      <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">🖥️ Equipamento</h3>
      <p style="margin: 5px 0; color: #374151;"><strong>Patrimônio:</strong> ${assetInfo}</p>
      ${!isStatusUpdate && data.description ? `<p style="margin: 5px 0; color: #374151;"><strong>Descrição do Problema:</strong> ${data.description}</p>` : ''}
    </div>
  `

  // Usa o template base - elimina toda a duplicação!
  return createBaseEmailTemplate(
    data,
    config,
    statusMessage,
    specificContent,
    isNotification,
    isStatusUpdate,
  )
}

export function createMaintenanceRequestNotificationTemplate(
  data: MaintenanceRequestEmailData,
): string {
  return createStandardEmailTemplate(data, true, false)
}

export function createMaintenanceRequestStatusUpdateTemplate(
  data: MaintenanceRequestEmailData,
): string {
  return createStandardEmailTemplate(data, false, true)
}

export function createMaintenanceRequestConfirmationTemplate(
  data: MaintenanceRequestEmailData,
): string {
  return createStandardEmailTemplate(data, false, false)
}
