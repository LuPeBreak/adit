import { AlertCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RefreshButton } from '@/components/refresh-button'
import { cn } from '@/lib/utils'

type ErrorType = 'error' | 'warning' | 'critical'

interface ErrorAlertProps {
  title?: string
  message?: string
  type?: ErrorType
  showRefreshButton?: boolean
  refreshButtonText?: string
  onRefresh?: () => void | Promise<void>
  className?: string
  children?: React.ReactNode
}

const errorConfig = {
  error: {
    icon: AlertCircle,
    variant: 'destructive' as const,
    defaultTitle: 'Erro ao carregar dados',
  },
  warning: {
    icon: AlertTriangle,
    variant: 'default' as const,
    defaultTitle: 'Atenção',
  },
  critical: {
    icon: XCircle,
    variant: 'destructive' as const,
    defaultTitle: 'Erro crítico',
  },
}

export function ErrorAlert({
  title,
  message = 'Ocorreu um erro inesperado ao carregar os dados.',
  type = 'error',
  showRefreshButton = true,
  refreshButtonText = 'Tentar novamente',
  onRefresh,
  className,
  children,
}: ErrorAlertProps) {
  const config = errorConfig[type]
  const Icon = config.icon
  const alertTitle = title || config.defaultTitle

  return (
    <Alert variant={config.variant} className={cn('max-w-2xl', className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="font-semibold">{alertTitle}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm leading-relaxed">{message}</p>

        {children && <div className="text-sm">{children}</div>}

        {showRefreshButton && (
          <div className="pt-1">
            <RefreshButton
              text={refreshButtonText}
              onRefresh={onRefresh}
              variant={type === 'critical' ? 'destructive' : 'outline'}
            />
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
