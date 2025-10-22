/**
 * Constantes compartilhadas para templates de notificação
 * Contém elementos reutilizáveis como headers, footers e assinaturas
 */

// Header padrão para todos os emails
export const EMAIL_HEADER = `
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Sistema ADIT - PMBM</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Prefeitura Municipal de Barra Mansa</p>
        </div>
`

// Footer padrão para todos os emails
export const EMAIL_FOOTER = `
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
            <strong>Equipe de TI - Prefeitura Municipal de Barra Mansa</strong>
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            Este é um e-mail automático. Para dúvidas, entre em contato com a equipe de TI.
          </p>
        </div>
`

// Assinatura padrão para todas as mensagens do WhatsApp
export const WHATSAPP_SIGNATURE = `---
*Sistema ADIT - PMBM*
_Prefeitura Municipal de Barra Mansa_`

// Estrutura HTML base para emails como string template
export const EMAIL_HTML_BASE = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      {{HEADER}}
      {{CONTENT}}
      {{FOOTER}}
    </div>
  </body>
</html>`
