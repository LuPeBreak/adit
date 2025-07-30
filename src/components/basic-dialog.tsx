'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { DialogProps } from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

interface BasicDialogProps extends DialogProps {
  title: string
  trigger?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  className?: string
}

export function BasicDialog({
  children,
  title,
  trigger,
  description,
  footer,
  className,
  ...dialogProps
}: BasicDialogProps) {
  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn('sm:max-w-[425px]', className)}>
        <DialogHeader className="pb-2 mb-4 border-b-2">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
