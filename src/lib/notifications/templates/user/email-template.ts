export interface UserCreatedEmailData {
  // Dados do usuário criado
  userName: string
  userEmail: string
  userPassword: string

  // URL do sistema
  loginUrl: string
}

function createUserCreatedEmailTemplate(data: UserCreatedEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao Sistema ADIT</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Sistema ADIT - PMBM</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Prefeitura Municipal de Barra Mansa</p>
        </div>

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
            Sua conta foi criada com sucesso no Sistema ADIT da Prefeitura Municipal de Barra Mansa! 
            Agora você pode acessar o sistema e utilizar todas as funcionalidades disponíveis para seu perfil.
          </p>

          <!-- Login Credentials -->
          <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #6b7280;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">🔐 Suas Credenciais de Acesso</h3>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${data.userEmail}</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Senha:</strong> <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${data.userPassword}</code></p>
            </div>
          </div>

          <!-- Access Instructions -->
          <div style="margin: 25px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h3 style="margin: 0 0 15px 0; color: #d97706; font-size: 16px;">📋 Instruções de Primeiro Acesso</h3>
            <ol style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.6;">
              <li style="margin: 8px 0;">Acesse o sistema através do link abaixo</li>
              <li style="margin: 8px 0;">Faça login com o email e senha fornecidos</li>
              <li style="margin: 8px 0;">Recomendamos alterar sua senha no primeiro acesso</li>
              <li style="margin: 8px 0;">Explore as funcionalidades disponíveis para seu perfil</li>
            </ol>
          </div>

          <!-- Access Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              🚀 Acessar Sistema ADIT
            </a>
          </div>

          <!-- Security Notice -->
          <div style="margin: 25px 0; padding: 15px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
            <h3 style="margin: 0 0 10px 0; color: #dc2626; font-size: 14px;">🔒 Importante - Segurança</h3>
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
              • Mantenha suas credenciais em segurança<br>
              • Não compartilhe sua senha com terceiros<br>
              • Altere sua senha regularmente<br>
              • Sempre faça logout ao terminar de usar o sistema
            </p>
          </div>
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

export function createUserCreatedNotificationTemplate(
  data: UserCreatedEmailData,
): string {
  return createUserCreatedEmailTemplate(data)
}
