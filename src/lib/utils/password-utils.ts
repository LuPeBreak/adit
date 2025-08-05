/**
 * Gera uma senha padrão baseada no nome do usuário
 * Formato: nome.sobrenome[4digitosaleatorios]
 * @param name - Nome completo do usuário (utilizará o primeiro e último nome)
 * @returns Senha gerada no formato padrão
 */
export function generateStandardPassword(name: string): string {
  const nameParts = name
    .toLowerCase()
    .split(' ')
    .filter((part) => part.length > 0)

  // Gera número aleatório entre 1000-9999 para manter 4 dígitos consistentes
  const MIN_NUMBER = 1000
  const MAX_NUMBER = 9999
  const randomNumber =
    Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER

  if (nameParts.length >= 2) {
    const firstName = nameParts[0]
    const lastName = nameParts[nameParts.length - 1] // Pega o último nome ao invés do segundo nome
    return `${firstName}.${lastName}${randomNumber}`
  }

  return `${nameParts[0] || 'user'}${randomNumber}`
}
