import { createEmailWrapper } from '../shared/email-wrapper'

export interface UserCreatedEmailData {
  // Dados do usuário criado
  userName: string
  userEmail: string
  userPassword: string

  // URL do sistema
  loginUrl: string
}

function createUserCreatedEmailTemplate(data: UserCreatedEmailData): string {
  const content = `
        <!-- Welcome Badge -->
        <div style="padding: 20px; text-align: center; background-color: #f0f9ff; border-bottom: 3px solid #0ea5e9;">
          <div style="display: inline-block; padding: 12px 24px; background-color: white; border-radius: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <span style="font-size: 20px; margin-right: 8px;">🎉</span>
            <span style="color: #0369a1; font-weight: 600; font-size: 16px;">Conta Criada com Sucesso</span>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            Olá <strong>${data.userName}</strong>,
          </p>
          
          <p style="color: #374151; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
            Sua conta foi criada com sucesso no Sistema ADIT! Agora você pode acessar todas as funcionalidades disponíveis para gerenciar ativos de TI da Prefeitura Municipal de Barra Mansa.
          </p>

          <!-- Login Credentials -->
          <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #6b7280;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">🔑 Suas Credenciais de Acesso</h3>
            <p style="margin: 8px 0; color: #374151;"><strong>Email:</strong> ${data.userEmail}</p>
            <p style="margin: 8px 0; color: #374151;"><strong>Senha:</strong> ${data.userPassword}</p>
          </div>

          <!-- Login Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              🚀 Acessar Sistema
            </a>
          </div>

          <!-- Security Tips -->
          <div style="margin: 25px 0; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">🔒 Dicas de Segurança</h3>
            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
              • Não compartilhe sua senha com terceiros<br>
              • Altere sua senha regularmente<br>
              • Sempre faça logout ao terminar de usar o sistema
            </p>
          </div>
        </div>
  `

  return createEmailWrapper({
    title: 'Bem-vindo ao Sistema ADIT',
    content,
  })
}

export function createUserCreatedNotificationTemplate(
  data: UserCreatedEmailData,
): string {
  return createUserCreatedEmailTemplate(data)
}
