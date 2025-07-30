'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { DialogProps } from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

interface BasicDialogProps extends DialogProps {
  title: string
  trigger?: ReactNode
  description?: ReactNode
  footer?: ReactNode
}

export function BasicDialog({
  children,
  title,
  trigger,
  description,
  footer,
  ...dialogProps
}: BasicDialogProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size={'sm'}>
            {title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
