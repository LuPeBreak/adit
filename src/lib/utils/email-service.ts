interface EmailData {
  email: string
  subject: string
  message: string
}

export async function sendEmail(emailData: EmailData): Promise<void> {
  try {
    const response = await fetch(process.env.EMAIL_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      throw new Error(
        `Erro ao enviar email: ${response.status} - ${response.statusText}`,
      )
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw new Error('Falha no envio do email. Tente novamente mais tarde.')
  }
}
