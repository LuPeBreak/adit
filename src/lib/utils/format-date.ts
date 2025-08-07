import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata uma data para mostrar o tempo relativo em português brasileiro
 * Ex: "há 2 horas", "há 3 dias", "há 1 semana"
 */
export function formatRelativeDate(date: Date): string {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  })
}
