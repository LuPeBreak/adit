import { MaintenanceStatus } from '@/generated/prisma'
import { getMaintenanceStatusLabel } from '@/lib/utils/get-status-label'

const allowedTransitions: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  [MaintenanceStatus.PENDING]: [
    MaintenanceStatus.ANALYZING,
    MaintenanceStatus.MAINTENANCE,
    MaintenanceStatus.COMPLETED,
    MaintenanceStatus.CANCELLED,
  ],
  [MaintenanceStatus.ANALYZING]: [
    MaintenanceStatus.MAINTENANCE,
    MaintenanceStatus.COMPLETED,
    MaintenanceStatus.CANCELLED,
  ],
  [MaintenanceStatus.MAINTENANCE]: [
    MaintenanceStatus.MAINTENANCE,
    MaintenanceStatus.COMPLETED,
    MaintenanceStatus.CANCELLED,
  ],
  [MaintenanceStatus.COMPLETED]: [],
  [MaintenanceStatus.CANCELLED]: [],
}

export function canTransition(
  from: MaintenanceStatus,
  to: MaintenanceStatus,
): { allowed: boolean; reason?: string } {
  const allowed = allowedTransitions[from].includes(to)
  if (!allowed) {
    return {
      allowed: false,
      reason: `Transição de ${getMaintenanceStatusLabel(from)} para ${getMaintenanceStatusLabel(to)} não permitida`,
    }
  }
  return { allowed: true }
}

export function getAvailableTargets(
  current: MaintenanceStatus,
): MaintenanceStatus[] {
  return allowedTransitions[current]
}
