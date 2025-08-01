'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SectorDialogForm } from './sector-dialog-form'

export function CreateSectorButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <SectorDialogForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Setor
      </Button>
    </>
  )
}
