/**
 * Gera uma sigla a partir do nome de uma secretaria, ignorando palavras conectivas
 *
 * @param name - Nome completo da secretaria
 * @returns Sigla gerada em maiúsculas
 *
 * @example
 * generateAcronym("Secretaria Municipal de Relações Institucionais e Governança Corporativa")
 * // retorna "SMRIGC"
 *
 * generateAcronym("Secretaria de Educação")
 * // retorna "SE"
 */
export function generateAcronym(name: string): string {
  // Palavras conectivas que devem ser ignoradas na geração da sigla
  const connectiveWords = new Set([
    'de',
    'da',
    'do',
    'das',
    'dos',
    'e',
    'em',
    'na',
    'no',
    'nas',
    'nos',
    'para',
    'por',
    'com',
    'sem',
    'sob',
    'sobre',
    'entre',
    'contra',
    'desde',
    'até',
    'através',
    'mediante',
    'durante',
    'perante',
    'segundo',
    'conforme',
    'a',
    'o',
    'as',
    'os',
    'um',
    'uma',
    'uns',
    'umas',
  ])

  return name
    .trim()
    .split(/\s+/) // Divide por espaços
    .filter((word) => {
      const lowerWord = word.toLowerCase()
      // Remove palavras conectivas e palavras muito curtas (menos de 2 caracteres)
      return !connectiveWords.has(lowerWord) && word.length >= 2
    })
    .map((word) => word.charAt(0).toUpperCase()) // Pega a primeira letra de cada palavra
    .join('') // Junta todas as letras
}

/**
 * Gera uma sigla com fallback para o nome original se a sigla ficar muito curta
 *
 * @param name - Nome completo da secretaria
 * @param minLength - Comprimento mínimo da sigla (padrão: 2)
 * @returns Sigla gerada ou nome original se a sigla for muito curta
 */
export function generateAcronymWithFallback(
  name: string,
  minLength: number = 2,
): string {
  const acronym = generateAcronym(name)

  // Se a sigla for muito curta, retorna o nome original
  if (acronym.length < minLength) {
    return name
  }

  return acronym
}
