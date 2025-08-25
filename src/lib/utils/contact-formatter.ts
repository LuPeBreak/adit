/**
 * Utilitários para formatação de contatos da administração
 */

/**
 * Formata o WhatsApp com máscara
 * @param whatsapp - Número completo (ex: 5524999999999)
 * @returns Número mascarado no formato: (24) 99999-9999
 */
export function maskWhatsappNumber(whatsapp: string): string {
  // Remove o código do país (55) se presente
  const cleanNumber = whatsapp.startsWith('55')
    ? whatsapp.substring(2)
    : whatsapp

  if (cleanNumber.length !== 11) return whatsapp

  const areaCode = cleanNumber.substring(0, 2)
  const firstPart = cleanNumber.substring(2, 7)
  const secondPart = cleanNumber.substring(7, 11)

  return `(${areaCode}) ${firstPart}-${secondPart}`
}
