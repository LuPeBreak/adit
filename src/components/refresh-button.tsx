'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RefreshButtonProps {
  className?: string
  variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  text?: string
  onRefresh?: () => void | Promise<void>
  disabled?: boolean
}

export function RefreshButton({ 
  className,
  variant = 'outline',
  size = 'sm',
  text = 'Tentar novamente',
  onRefresh,
  disabled = false
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (disabled) return
    
    if (onRefresh) {
      // Apenas mostra loading state para refresh customizado
      if (isRefreshing) return
      
      setIsRefreshing(true)
      
      try {
        await onRefresh()
      } catch (error) {
        console.error('Erro ao atualizar:', error)
      } finally {
        setIsRefreshing(false)
      }
    } else {
      // Para reload da página, não precisa de loading state
      window.location.reload()
    }
  }

  const showLoadingState = onRefresh && isRefreshing

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={disabled || showLoadingState}
      className={cn('gap-2', className)}
      aria-label={showLoadingState ? 'Atualizando...' : text}
    >
      <RefreshCw className={cn(
        'h-4 w-4',
        showLoadingState && 'animate-spin'
      )} />
      {showLoadingState ? 'Atualizando...' : text}
    </Button>
  )
}