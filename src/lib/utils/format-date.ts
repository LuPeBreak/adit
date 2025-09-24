import { formatDistanceToNow, format } from 'date-fns'
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

/**
 * Formata uma data completa em português brasileiro
 * Ex: "07 de agosto de 2025 às 09:15"
 */
export function formatFullDate(date: Date): string {
  return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  })
}

/**
 * Formata uma data em formato padrão brasileiro
 * Ex: "07/08/2025 09:15"
 */
export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', {
    locale: ptBR,
  })
}
