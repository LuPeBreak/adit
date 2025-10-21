import { maskWhatsappNumber } from '@/lib/utils/contact-formatter'
import { TonerRequestStatus } from '@/generated/prisma'

export interface TonerRequestEmailData {
  // Dados básicos do solicitante
  requesterName: string
  requesterEmail: string
  requesterWhatsApp?: string
  department?: string
  sector?: string

  // Dados do toner/impressora
  selectedToner: string
  printerTag: string
  printerModel: string

  // Observações/notas (unifica rejectionReason e deliveryNote)
  notes?: string

  // Estado do pedido
  status: TonerRequestStatus
}

interface StatusConfig {
  title: string
  icon: string
  color: string
  backgroundColor: string
  borderColor: string
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

  // Informações da impressora
  const printerInfo = `${data.printerTag} (${data.printerModel})`

  // Seção de contato (apenas para notificações internas)
  const contactSection =
    isNotification && data.requesterWhatsApp
      ? `
    <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">📞 Contato do Solicitante</h3>
      <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${data.requesterEmail}</p>
      <p style="margin: 5px 0; color: #374151;"><strong>WhatsApp:</strong> ${maskWhatsappNumber(data.requesterWhatsApp)}</p>
    </div>
  `
      : ''

  // Seção de localização (apenas se disponível)
  const locationSection =
    data.department || data.sector
      ? `
    <div style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
      <h3 style="margin: 0 0 10px 0; color: #0369a1; font-size: 16px;">📍 Localização</h3>
      <p style="margin: 5px 0; color: #374151;"><strong>Secretaria:</strong> ${data.department || 'Não informado'}</p>
      <p style="margin: 5px 0; color: #374151;"><strong>Setor:</strong> ${data.sector || 'Não informado'}</p>
    </div>
  `
      : ''

  // Seção de observações (se disponível)
  const notesSection = data.notes
    ? `
    <div style="margin: 20px 0; padding: 15px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <h3 style="margin: 0 0 10px 0; color: #d97706; font-size: 16px;">📝 Observações</h3>
      <p style="margin: 0; color: #374151;">${data.notes}</p>
    </div>
  `
    : ''

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Sistema ADIT - PMBM</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Prefeitura Municipal de Barra Mansa</p>
        </div>

        <!-- Status Badge -->
        <div style="padding: 20px; text-align: center; background-color: ${config.backgroundColor}; border-bottom: 3px solid ${config.borderColor};">
          <div style="display: inline-block; padding: 12px 24px; background-color: white; border-radius: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <span style="font-size: 20px; margin-right: 8px;">${config.icon}</span>
            <span style="color: ${config.color}; font-weight: 600; font-size: 16px;">${config.title}</span>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          ${
            !isNotification
              ? `<p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            Olá <strong>${data.requesterName}</strong>,
          </p>`
              : ''
          }
          
          <p style="color: #374151; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
            ${statusMessage}
          </p>

          <!-- Printer Information -->
          <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #6b7280;">
            <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">🖨️ Impressora</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Patrimônio:</strong> ${printerInfo}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Toner Solicitado:</strong> ${data.selectedToner}</p>
          </div>

          ${locationSection}
          ${contactSection}
          ${notesSection}
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
            <strong>Equipe de TI - Prefeitura Municipal de Barra Mansa</strong>
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            Este é um e-mail automático. Para dúvidas, entre em contato com a equipe de TI.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
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
