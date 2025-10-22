import {
  BaseEmailData,
  StatusConfig,
  createBaseEmailTemplate,
} from '../shared/base-email-template'

// Tipos de ação do usuário
type UserActionType = 'CREATED' | 'PASSWORD_UPDATED'

// Interface específica do usuário que estende a base
export interface UserEmailData extends BaseEmailData {
  // Dados específicos do usuário
  name: string
  email: string
  password: string
  loginUrl: string

  // Tipo de ação
  actionType: UserActionType
}

// Configurações de status para ações de usuário
const statusConfigs: Record<UserActionType, StatusConfig> = {
  CREATED: {
    title: 'Conta Criada',
    icon: '👤',
    color: '#047857',
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  PASSWORD_UPDATED: {
    title: 'Senha Alterada',
    icon: '🔑',
    color: '#047857',
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
}

function getStatusMessage(data: UserEmailData): string {
  switch (data.actionType) {
    case 'CREATED':
      return `Sua conta foi criada com sucesso no sistema ADIT! Abaixo estão suas credenciais de acesso:`

    case 'PASSWORD_UPDATED':
      return `Sua senha foi alterada pelo administrador do sistema. Abaixo estão suas novas credenciais de acesso:`

    default:
      return 'Atualização sobre sua conta no sistema ADIT.'
  }
}

function createStandardUserEmailTemplate(data: UserEmailData): string {
  const config = statusConfigs[data.actionType]

  // Verificação de segurança
  if (!config) {
    console.error('Status config not found for:', data.actionType)
    return `<p>Erro: Configuração não encontrada para a ação ${data.actionType}</p>`
  }

  const statusMessage = getStatusMessage(data)

  // Conteúdo específico do usuário (única parte que não é duplicada)
  const credentialsLabel =
    data.actionType === 'PASSWORD_UPDATED'
      ? 'Suas Novas Credenciais'
      : 'Suas Credenciais'
  const passwordLabel =
    data.actionType === 'PASSWORD_UPDATED' ? 'Nova Senha' : 'Senha'

  // Instruções de primeiro acesso apenas para conta criada
  const securityTipsContent =
    data.actionType === 'CREATED'
      ? `
        <li>Altere sua senha no primeiro acesso</li>
        <li>Use uma senha forte com pelo menos 8 caracteres</li>
        <li>Não compartilhe suas credenciais com terceiros</li>
        <li>Faça logout ao terminar de usar o sistema</li>
      `
      : `
        <li>Use uma senha forte com pelo menos 8 caracteres</li>
        <li>Não compartilhe suas credenciais com terceiros</li>
        <li>Faça logout ao terminar de usar o sistema</li>
      `

  // Instruções de primeiro acesso apenas para conta criada
  const firstAccessInstructions =
    data.actionType === 'CREATED'
      ? `
    <!-- First Access Instructions -->
    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
      <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">📋 Instruções de Primeiro Acesso</h3>
      <ol style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
        <li><strong>Faça login</strong> usando o email e senha fornecidos acima</li>
        <li><strong>Altere sua senha</strong> imediatamente após o primeiro acesso</li>
        <li><strong>Configure seu perfil</strong> com suas informações pessoais</li>
        <li><strong>Explore o sistema</strong> e familiarize-se com as funcionalidades</li>
      </ol>
    </div>
  `
      : ''

  const specificContent = `
    <!-- User Credentials -->
    <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
      <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">🔐 ${credentialsLabel}</h3>
      <p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> ${data.email}</p>
      <p style="margin: 8px 0; color: #374151;"><strong>${passwordLabel}:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${data.password}</code></p>
    </div>

    ${firstAccessInstructions}

    <!-- Action Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.loginUrl}" style="display: inline-block; padding: 12px 30px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Acessar Sistema
      </a>
    </div>

    <!-- Security Tips -->
     <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
       <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">🛡️ Dicas de Segurança</h3>
       <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.6; list-style-type: disc;">
         ${securityTipsContent}
       </ul>
     </div>
  `

  // Usa o template base - elimina toda a duplicação!
  return createBaseEmailTemplate(
    data,
    config,
    statusMessage,
    specificContent,
    false, // não é notificação para admin
    false, // não é atualização de status
  )
}

// Interfaces de compatibilidade para manter a API existente
export interface UserCreatedEmailData {
  // Dados do usuário criado
  userName: string
  userEmail: string
  userPassword: string

  // URL do sistema
  loginUrl: string
}

export function createUserCreatedNotificationTemplate(
  data: UserCreatedEmailData,
): string {
  const userEmailData: UserEmailData = {
    name: data.userName,
    email: data.userEmail,
    password: data.userPassword,
    loginUrl: data.loginUrl,
    requesterName: data.userName,
    requesterEmail: data.userEmail,
    actionType: 'CREATED',
  }

  return createStandardUserEmailTemplate(userEmailData)
}

export function createUserPasswordUpdatedEmailTemplate(data: {
  userName: string
  userEmail: string
  newPassword: string
  loginUrl: string
}): string {
  const userEmailData: UserEmailData = {
    name: data.userName,
    email: data.userEmail,
    password: data.newPassword,
    loginUrl: data.loginUrl,
    requesterName: data.userName,
    requesterEmail: data.userEmail,
    actionType: 'PASSWORD_UPDATED',
  }

  return createStandardUserEmailTemplate(userEmailData)
}
