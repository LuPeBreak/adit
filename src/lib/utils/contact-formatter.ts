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

/**
 * Formata número de telefone com máscara apropriada
 * @param phoneNumber - Número do telefone (8, 10 ou 11 dígitos)
 * @returns Número formatado com máscara
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || phoneNumber.length < 8) {
    return phoneNumber
  }

  if (phoneNumber.length === 8) {
    // Formato: XXXX-XXXX
    return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`
  } else if (phoneNumber.length === 10) {
    // Formato: (XX) XXXX-XXXX
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`
  } else if (phoneNumber.length === 11) {
    // Formato: (XX) XXXXX-XXXX
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7)}`
  }

  return phoneNumber
}
