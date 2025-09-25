import { maskWhatsappNumber } from './contact-formatter'

export interface ApprovalWhatsAppData {
  requesterName: string
  selectedToner: string
  printerTag: string
  printerModel: string
}

export interface RejectionWhatsAppData {
  requesterName: string
  rejectionReason: string
  selectedToner: string
  printerTag: string
  printerModel: string
}

export interface NewRequestNotificationWhatsAppData {
  requesterName: string
  requesterWhatsApp: string
  department: string
  sector: string
  printerTag: string
  printerModel: string
  selectedToner: string
}

export interface RequestConfirmationWhatsAppData {
  requesterName: string
  selectedToner: string
  printerTag: string
  printerModel: string
}

export interface DeliveryWhatsAppData {
  requesterName: string
  selectedToner: string
  printerTag: string
  printerModel: string
  deliveryNote?: string
}

export interface MaintenanceRequestConfirmationWhatsAppData {
  requesterName: string
  assetTag: string
  assetType: string
  description: string
}

export function createApprovalWhatsAppTemplate(
  data: ApprovalWhatsAppData,
): string {
  return `✅ *PEDIDO DE TONER APROVADO*

Olá *${data.requesterName}*!

Ótimas notícias! Seu pedido de toner foi aprovado pela equipe de TI.

📝 *Detalhes do pedido:*
• Toner: ${data.selectedToner}
• Nº Patrimônio: ${data.printerTag}
• Modelo da Impressora: ${data.printerModel}

📦 *Próximos passos:*
Se você está no prédio da prefeitura, a equipe de TI fará a entrega e instalação do toner. Caso contrário, retire na sala de informática.

📞 *Contato:*
• WhatsApp: ${maskWhatsappNumber(process.env.ADMIN_WHATSAPP || '')}
• Email: ${process.env.ADMIN_EMAIL}

🕒 *Horário de retirada:*
Segunda a sexta-feira: 8h às 12h e 14h às 17h

---
*Equipe de TI - PMBM*`
}

export function createDeliveryWhatsAppTemplate(
  data: DeliveryWhatsAppData,
): string {
  return `📦 *TONER ENTREGUE*

Olá *${data.requesterName}*!

Seu toner foi entregue com sucesso! O pedido foi finalizado pela equipe de TI.

📝 *Detalhes do pedido:*
• Toner: ${data.selectedToner}
• Nº Patrimônio: ${data.printerTag}
• Modelo da Impressora: ${data.printerModel}
${
  data.deliveryNote
    ? `
📝 *Observações da entrega:*
${data.deliveryNote}
`
    : ''
}
✅ *Status:*
Pedido finalizado com sucesso. O toner foi entregue e está pronto para uso.

📞 *Contato:*
• WhatsApp: ${maskWhatsappNumber(process.env.ADMIN_WHATSAPP || '')}
• Email: ${process.env.ADMIN_EMAIL}

🕒 *Horário de atendimento:*
Segunda a sexta-feira: 8h às 12h e 14h às 17h

---
*Equipe de TI - PMBM*`
}

export function createRejectionWhatsAppTemplate(
  data: RejectionWhatsAppData,
): string {
  return `❌ *PEDIDO DE TONER REJEITADO*

Olá *${data.requesterName}*,

Infelizmente, seu pedido de toner foi rejeitado pela equipe de TI.

📝 *Detalhes do pedido:*
• Toner: ${data.selectedToner}
• Nº Patrimônio: ${data.printerTag}
• Modelo da Impressora: ${data.printerModel}

❌ *Motivo da rejeição:*
${data.rejectionReason}

💡 *Próximos passos:*
Se você acredita que houve um equívoco ou deseja esclarecer a situação, entre em contato com a equipe de TI.

📞 *Contato:*
• WhatsApp: ${maskWhatsappNumber(process.env.ADMIN_WHATSAPP || '')}
• Email: ${process.env.ADMIN_EMAIL}

🕒 *Horário de atendimento:*
Segunda a sexta-feira: 8h às 12h e 14h às 17h

---
*Equipe de TI - PMBM*`
}

export function createNewRequestNotificationWhatsAppTemplate(
  data: NewRequestNotificationWhatsAppData,
): string {
  return `📋 *NOVO PEDIDO DE TONER*

Um novo pedido de toner foi criado no sistema ADIT e aguarda análise.

👤 *Solicitante:*
• Nome: ${data.requesterName}
• WhatsApp: ${data.requesterWhatsApp}
• Departamento: ${data.department}
• Setor: ${data.sector}

🖨️ *Informações da Impressora:*
• Nº Patrimônio: ${data.printerTag}
• Modelo: ${data.printerModel}
• Toner Solicitado: ${data.selectedToner}

⏰ *Ação Necessária:*
Acesse o sistema ADIT para analisar e processar este pedido.

🔗 *Link do Sistema:*
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/toner-requests

---
*Sistema ADIT - Notificação Automática*`
}

export function createRequestConfirmationWhatsAppTemplate(
  data: RequestConfirmationWhatsAppData,
): string {
  return `✅ *PEDIDO DE TONER RECEBIDO*

Olá *${data.requesterName}*!

Seu pedido de toner foi recebido com sucesso e está sendo processado pela nossa equipe.

📋 *Resumo do Pedido:*
• Nº Patrimônio: ${data.printerTag}
• Modelo da Impressora: ${data.printerModel}
• Toner Solicitado: ${data.selectedToner}
• Status: *Aguardando Análise*

📧 *Próximos passos:*
Você receberá uma mensagem quando seu pedido for aprovado ou rejeitado pela equipe de TI.

🕒 *Tempo de análise:*
Normalmente processamos os pedidos em até 2 horas.

---
*Equipe de TI - PMBM*`
}

export function createMaintenanceRequestConfirmationWhatsAppTemplate(
  data: MaintenanceRequestConfirmationWhatsAppData,
): string {
  return `✅ *PEDIDO DE MANUTENÇÃO RECEBIDO*

Olá *${data.requesterName}*!

Seu pedido de manutenção foi recebido com sucesso e está sendo processado pela nossa equipe.

📋 *Resumo do Pedido:*
• Nº Patrimônio: ${data.assetTag}
• Tipo do Equipamento: ${data.assetType}
• Descrição: ${data.description}
• Status: *Aguardando Análise*

📧 *Próximos passos:*
Nossa equipe de TI entrará em contato para prosseguir com o atendimento ou solicitar mais informações se necessário.

🕒 *Tempo de análise:*
Normalmente processamos os pedidos em até 4 horas úteis.

---
*Equipe de TI - PMBM*`
}
