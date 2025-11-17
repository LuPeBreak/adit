'use client'

import { forwardRef } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = Omit<
  React.ComponentProps<typeof Button>,
  'variant' | 'className' | 'children'
>

// Botão padrão usado nos RowActions, compatível com DropdownMenuTrigger asChild
export const RowActionsButton = forwardRef<HTMLButtonElement, Props>(
  function RowActionsButton(props, ref) {
    return (
      <Button ref={ref} variant="ghost" className="h-8 w-8 p-0" {...props}>
        <span className="sr-only">Abrir menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    )
  },
)
