'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PrinterModelDialogForm } from './printer-model-dialog-form'

export function CreatePrinterModelButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <PrinterModelDialogForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Modelo
      </Button>
    </>
  )
}
