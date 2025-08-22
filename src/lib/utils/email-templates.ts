export interface ApprovalEmailData {
  requesterName: string
  requesterEmail: string
  selectedToner: string
  printerTag: string
  printerModel: string
}

export interface RejectionEmailData {
  requesterName: string
  requesterEmail: string
  rejectionReason: string
  selectedToner: string
  printerTag: string
  printerModel: string
}

export interface NewRequestNotificationData {
  requesterName: string
  requesterEmail: string
  requesterWhatsApp: string
  department: string
  sector: string
  printerTag: string
  printerModel: string
  selectedToner: string
}

export interface RequestConfirmationData {
  requesterName: string
  requesterEmail: string
  selectedToner: string
  printerTag: string
  printerModel: string
}

export function createApprovalEmailTemplate(data: ApprovalEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin: 0; font-size: 24px;">✅ Pedido Aprovado</h1>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Olá <strong>${data.requesterName}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Ótimas notícias! Seu pedido de toner foi aprovado pela equipe de TI.
        </p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #047857; font-size: 14px; margin: 0; font-weight: 500;">
            📝 <strong>Detalhes do pedido:</strong><br>
            <strong>Toner:</strong> ${data.selectedToner}<br>
            <strong>Nº Patrimônio:</strong> ${data.printerTag}<br>
            <strong>Modelo da Impressora:</strong> ${data.printerModel}
          </p>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
            📦 <strong>Próximos passos:</strong><br>
            Se você está no prédio da prefeitura, a equipe de TI fará a entrega e instalação do toner. 
            Caso contrário, retire na sala de informática.
          </p>
        </div>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #1e40af; font-size: 14px; margin: 0;">
            📞 <strong>Contato:</strong><br>
              Whatsapp: (24) 98146-5782<br>
              Email: informatica@barramansa.rj.gov.br<br>
              <br>
            🕒 <strong>Horário de retirada:</strong><br>
              Segunda a sexta-feira: 8h às 12h e 14h às 17h
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Este é um email automático. Não responda a esta mensagem.
          </p>
        </div>
      </div>
    </div>
  `
}

export function createRejectionEmailTemplate(data: RejectionEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ef4444; margin: 0; font-size: 24px;">❌ Pedido Rejeitado</h1>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Olá <strong>${data.requesterName}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Infelizmente, seu pedido de toner foi rejeitado pela equipe de TI.
        </p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">
            📝 <strong>Detalhes do pedido:</strong><br>
            <strong>Toner:</strong> ${data.selectedToner}<br>
            <strong>Nº Patrimônio:</strong> ${data.printerTag}<br>
            <strong>Modelo da Impressora:</strong> ${data.printerModel}
          </p>
        </div>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #dc2626; font-size: 14px; margin: 0; font-weight: 500;">
            📝 <strong>Motivo da rejeição:</strong><br>
            ${data.rejectionReason}
          </p>
        </div>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">
            💡 <strong>Próximos passos:</strong><br>
            Se você acredita que houve um equívoco ou deseja esclarecer a situação, entre em contato com a equipe de TI.
          </p>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #92400e; font-size: 14px; margin: 0;">
            📞 <strong>Contato:</strong><br>
              Whatsapp: (24) 98146-5782<br>
              Email: informatica@barramansa.rj.gov.br<br>
              <br>
            🕒 <strong>Horário de atendimento:</strong><br>
            Segunda a sexta-feira: 8h às 12h e 14h às 17h
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Este é um email automático. Não responda a esta mensagem.
          </p>
        </div>
      </div>
    </div>
  `
}

export function createNewRequestNotificationTemplate(
  data: NewRequestNotificationData,
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">📋 Novo Pedido de Toner</h1>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Um novo pedido de toner foi criado no sistema ADIT e aguarda análise.
        </p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">📝 Detalhes do Pedido</h3>
          <p style="color: #1e40af; font-size: 14px; margin: 5px 0;"><strong>Solicitante:</strong> ${data.requesterName}</p>
          <p style="color: #1e40af; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${data.requesterEmail}</p>
          <p style="color: #1e40af; font-size: 14px; margin: 5px 0;"><strong>WhatsApp:</strong> ${data.requesterWhatsApp}</p>
          <p style="color: #1e40af; font-size: 14px; margin: 5px 0;"><strong>Departamento:</strong> ${data.department}</p>
          <p style="color: #1e40af; font-size: 14px; margin: 5px 0;"><strong>Setor:</strong> ${data.sector}</p>
        </div>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 16px;">🖨️ Informações da Impressora</h3>
          <p style="color: #15803d; font-size: 14px; margin: 5px 0;"><strong>Nº Patrimônio:</strong> ${data.printerTag}</p>
          <p style="color: #15803d; font-size: 14px; margin: 5px 0;"><strong>Modelo:</strong> ${data.printerModel}</p>
          <p style="color: #15803d; font-size: 14px; margin: 5px 0;"><strong>Toner Solicitado:</strong> ${data.selectedToner}</p>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
            ⏰ <strong>Ação Necessária:</strong><br>
            Acesse o sistema ADIT para analisar e processar este pedido.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/toner-requests" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
            Acessar Sistema ADIT
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Este é um email automático do Sistema ADIT. Não responda a esta mensagem.
          </p>
        </div>
      </div>
    </div>
  `
}

export function createRequestConfirmationTemplate(
  data: RequestConfirmationData,
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #22c55e; margin: 0; font-size: 24px;">✅ Pedido Recebido</h1>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Olá <strong>${data.requesterName}</strong>,
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Seu pedido de toner foi recebido com sucesso e está sendo processado pela nossa equipe.
        </p>
        
        <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 16px;">📋 Resumo do Pedido</h3>
          <p style="color: #15803d; font-size: 14px; margin: 5px 0;"><strong>Nº Patrimônio:</strong> ${data.printerTag}</p>
          <p style="color: #15803d; font-size: 14px; margin: 5px 0;"><strong>Modelo da Impressora:</strong> ${data.printerModel}</p>
          <p style="color: #15803d; font-size: 14px; margin: 5px 0;"><strong>Toner Solicitado:</strong> ${data.selectedToner}</p>
          <p style="color: #15803d; font-size: 14px; margin: 5px 0;"><strong>Status:</strong> Aguardando Análise</p>
        </div>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">
            📧 <strong>Próximos passos:</strong><br>
            Você receberá um email quando seu pedido for aprovado ou rejeitado pela equipe de TI.
          </p>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #92400e; font-size: 14px; margin: 0;">
            🕒 <strong>Tempo de análise:</strong><br>
            Normalmente processamos os pedidos em até 2 horas.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Este é um email automático. Não responda a esta mensagem.
          </p>
        </div>
      </div>
    </div>
  `
}
