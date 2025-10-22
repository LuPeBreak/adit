import { createEmailWrapper } from './email-wrapper'

// Interface base com campos comuns entre todos os templates
export interface BaseEmailData {
  // Dados básicos do solicitante
  requesterName: string
  requesterEmail: string
  requesterWhatsApp?: string
  department?: string
  sector?: string
  notes?: string
}

// Configuração de status (genérica para qualquer tipo)
export interface StatusConfig {
  title: string
  icon: string
  color: string
  backgroundColor: string
  borderColor: string
}

// Função para criar seção de contato (evita duplicação)
function createContactSection<T extends BaseEmailData>(
  data: T,
  isNotification: boolean,
): string {
  return isNotification && data.requesterWhatsApp
    ? `
    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">📞 Contato do Solicitante</h3>
      <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${data.requesterEmail}</p>
      <p style="margin: 5px 0; color: #374151;"><strong>WhatsApp:</strong> ${data.requesterWhatsApp}</p>
    </div>
  `
    : ''
}

// Função para criar seção de localização (evita duplicação)
function createLocationSection<T extends BaseEmailData>(data: T): string {
  return data.department || data.sector
    ? `
    <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0ea5e9;">
      <h3 style="color: #0369a1; margin: 0 0 10px 0; font-size: 16px;">📍 Localização</h3>
      <p style="margin: 5px 0; color: #374151;"><strong>Secretaria:</strong> ${data.department || 'Não informado'}</p>
      <p style="margin: 5px 0; color: #374151;"><strong>Setor:</strong> ${data.sector || 'Não informado'}</p>
    </div>
  `
    : ''
}

// Função para criar seção de observações (evita duplicação)
function createNotesSection<T extends BaseEmailData>(
  data: T,
  isStatusUpdate = false,
): string {
  // Para manutenção: observações apenas em atualizações de status
  // Para toner: observações sempre mostradas quando disponíveis
  const shouldShowNotes = data.notes

  return shouldShowNotes
    ? `
    <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
      <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📝 ${isStatusUpdate ? 'Observações Adicionais' : 'Observações'}</h3>
      <p style="margin: 0; color: #374151; line-height: 1.6;">${data.notes}</p>
    </div>
  `
    : ''
}

// Template base genérico - elimina toda a duplicação
export function createBaseEmailTemplate<T extends BaseEmailData>(
  data: T,
  statusConfig: StatusConfig,
  statusMessage: string,
  specificContent: string, // Conteúdo específico de cada tipo (toner/maintenance)
  isNotification = false,
  isStatusUpdate = false,
): string {
  // Seções comuns - sem prop drilling, acessa data diretamente
  const contactSection = createContactSection(data, isNotification)
  const locationSection = createLocationSection(data)
  const notesSection = createNotesSection(data, isStatusUpdate)

  const content = `
        <!-- Status Badge -->
        <div style="padding: 20px; text-align: center; background-color: ${statusConfig.backgroundColor}; border-bottom: 3px solid ${statusConfig.borderColor};">
          <div style="display: inline-block; padding: 12px 24px; background-color: white; border-radius: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <span style="font-size: 20px; margin-right: 8px;">${statusConfig.icon}</span>
            <span style="color: ${statusConfig.color}; font-weight: 600; font-size: 16px;">${statusConfig.title}</span>
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
          
          <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            ${statusMessage}
          </p>

          <!-- Conteúdo específico do tipo (toner/maintenance) -->
          ${specificContent}

          <!-- Seções comuns -->
          ${contactSection}
          ${locationSection}
          ${notesSection}
        </div>
  `

  return createEmailWrapper({
    title: statusConfig.title,
    content,
  })
}
