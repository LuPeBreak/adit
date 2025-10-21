import { TonerRequestStatus } from '@/generated/prisma'

export interface TonerRequestWhatsAppData {
  requesterName: string
  selectedToner: string
  printerTag: string
  printerModel: string
  department?: string
  sector?: string
  notes?: string
  status: TonerRequestStatus
}

const statusMessages: Record<TonerRequestStatus, string> = {
  PENDING: '📝 *Pedido de Toner Recebido*',
  APPROVED: '✅ *Pedido Aprovado*',
  REJECTED: '❌ *Pedido Rejeitado*',
  DELIVERED: '📦 *Toner Entregue*',
}

function createStandardWhatsAppTemplate(
  data: TonerRequestWhatsAppData,
): string {
  const statusMessage = statusMessages[data.status]
  const printerInfo = `${data.printerTag} (${data.printerModel})`

  // Informações de localização (se disponível)
  const locationInfo =
    data.department || data.sector
      ? `📍 *Localização:*\n• Secretaria: ${data.department || 'Não informado'}\n• Setor: ${data.sector || 'Não informado'}\n\n`
      : ''

  // Observações (se disponível)
  const notesInfo = data.notes ? `📝 *Observações:*\n${data.notes}\n\n` : ''

  let message = `${statusMessage}\n\n`
  message += `Olá *${data.requesterName}*!\n\n`

  switch (data.status) {
    case 'PENDING':
      message += `Seu pedido de toner foi recebido e está sendo analisado pela equipe de TI.\n\n`
      break
    case 'APPROVED':
      message += `Ótimas notícias! Seu pedido de toner foi aprovado pela equipe de TI.\n\n`
      break
    case 'REJECTED':
      message += `Infelizmente, seu pedido de toner foi rejeitado pela equipe de TI.\n\n`
      break
    case 'DELIVERED':
      message += `Seu toner foi entregue com sucesso! O pedido foi finalizado.\n\n`
      break
  }

  message += `🖨️ *Impressora:*\n• Patrimônio: ${printerInfo}\n• Toner: ${data.selectedToner}\n\n`
  message += locationInfo
  message += notesInfo
  message += `---\n*Sistema ADIT - PMBM*\n_Prefeitura Municipal de Barra Mansa_`

  return message
}

export function createTonerRequestConfirmationWhatsAppTemplate(
  data: TonerRequestWhatsAppData,
): string {
  return createStandardWhatsAppTemplate({ ...data, status: 'PENDING' })
}

export function createTonerRequestStatusUpdateWhatsAppTemplate(
  data: TonerRequestWhatsAppData,
): string {
  return createStandardWhatsAppTemplate(data)
}
