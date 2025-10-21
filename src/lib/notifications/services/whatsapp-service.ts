interface WhatsAppData {
  to: string
  message: string
}

export async function sendWhatsApp(whatsappData: WhatsAppData): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_API_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.EVOLUTION_API_GLOBAL_KEY || '',
          Authorization: `Bearer ${process.env.EVOLUTION_API_TOKEN}`,
        },
        body: JSON.stringify({
          number: whatsappData.to,
          text: whatsappData.message,
          linkPreview: false,
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Erro ao enviar WhatsApp: ${response.status} - ${response.statusText}. Detalhes: ${errorText}`,
      )
    }
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    throw new Error('Falha no envio do WhatsApp. Tente novamente mais tarde.')
  }
}
