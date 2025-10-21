import { TonerRequestStatus } from '@/generated/prisma'
import { getTonerRequestStatusLabel } from '@/lib/utils/get-status-label'

const allowedTransitions: Record<TonerRequestStatus, TonerRequestStatus[]> = {
  [TonerRequestStatus.PENDING]: [
    TonerRequestStatus.APPROVED,
    TonerRequestStatus.REJECTED,
  ],
  [TonerRequestStatus.APPROVED]: [TonerRequestStatus.DELIVERED],
  [TonerRequestStatus.REJECTED]: [],
  [TonerRequestStatus.DELIVERED]: [],
}

export function canTransition(
  from: TonerRequestStatus,
  to: TonerRequestStatus,
): { allowed: boolean; reason?: string } {
  const allowed = allowedTransitions[from].includes(to)
  if (!allowed) {
    return {
      allowed: false,
      reason: `Transição de ${getTonerRequestStatusLabel(from)} para ${getTonerRequestStatusLabel(to)} não permitida`,
    }
  }
  return { allowed: true }
}

export function getValidStatusTransitions(
  current: TonerRequestStatus,
): TonerRequestStatus[] {
  return allowedTransitions[current]
}
