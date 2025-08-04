'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PrinterDialogForm } from './printer-dialog-form'

export function CreatePrinterButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <PrinterDialogForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Impressora
      </Button>
    </>
  )
}
