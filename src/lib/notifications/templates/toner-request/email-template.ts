import { TonerRequestStatus } from '@/generated/prisma'
import {
  BaseEmailData,
  StatusConfig,
  createBaseEmailTemplate,
} from '../shared/base-email-template'

// Interface específica do toner que estende a base
export interface TonerRequestEmailData extends BaseEmailData {
  // Dados específicos do toner/impressora
  selectedToner: string
  printerTag: string
  printerModel: string

  // Estado do pedido
  status: TonerRequestStatus
}

const statusConfigs: Record<TonerRequestStatus, StatusConfig> = {
  PENDING: {
    title: 'Novo Pedido de Toner',
    icon: '📝',
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    borderColor: '#6b7280',
  },
  APPROVED: {
    title: 'Pedido Aprovado',
    icon: '✅',
    color: '#047857',
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  REJECTED: {
    title: 'Pedido Rejeitado',
    icon: '❌',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  DELIVERED: {
    title: 'Toner Entregue',
    icon: '📦',
    color: '#7c3aed',
    backgroundColor: '#faf5ff',
    borderColor: '#8b5cf6',
  },
}

function getStatusMessage(
  data: TonerRequestEmailData,
  isNotification = false,
): string {
  switch (data.status) {
    case 'PENDING':
      if (isNotification) {
        // Mensagem para administradores - sem duplicar localização
        return `Um novo pedido de toner foi recebido de <strong>${data.requesterName}</strong>.`
      } else {
        // Mensagem para o solicitante
        return `Seu pedido de toner foi recebido com sucesso! Nossa equipe de TI irá analisar e responder em breve.`
      }

    case 'APPROVED':
      return `Ótimas notícias! Seu pedido de toner foi aprovado pela equipe de TI.`

    case 'REJECTED':
      return `Infelizmente, seu pedido de toner foi rejeitado pela equipe de TI.`

    case 'DELIVERED':
      return `Seu toner foi entregue com sucesso! O pedido foi finalizado pela equipe de TI.`

    default:
      return 'Atualização sobre seu pedido de toner.'
  }
}

function createStandardEmailTemplate(
  data: TonerRequestEmailData,
  isNotification = false,
): string {
  const config = statusConfigs[data.status]

  // Verificação de segurança
  if (!config) {
    console.error('Status config not found for:', data.status)
    return `<p>Erro: Configuração não encontrada para o status ${data.status}</p>`
  }

  const statusMessage = getStatusMessage(data, isNotification)

  // Conteúdo específico do toner (única parte que não é duplicada)
  const printerInfo = `${data.printerTag} (${data.printerModel})`
  const specificContent = `
    <!-- Printer Information -->
    <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #6b7280;">
      <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">🖨️ Impressora</h3>
      <p style="margin: 5px 0; color: #374151;"><strong>Patrimônio:</strong> ${printerInfo}</p>
      <p style="margin: 5px 0; color: #374151;"><strong>Toner Solicitado:</strong> ${data.selectedToner}</p>
    </div>
  `

  // Usa o template base - elimina toda a duplicação!
  return createBaseEmailTemplate(
    data,
    config,
    statusMessage,
    specificContent,
    isNotification,
  )
}

export function createTonerRequestNotificationTemplate(
  data: TonerRequestEmailData,
): string {
  return createStandardEmailTemplate(data, true)
}

export function createTonerRequestConfirmationTemplate(
  data: TonerRequestEmailData,
): string {
  return createStandardEmailTemplate(data, false)
}

export function createTonerRequestStatusUpdateTemplate(
  data: TonerRequestEmailData,
): string {
  return createStandardEmailTemplate(data, false)
}
