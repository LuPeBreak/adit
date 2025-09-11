'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CreatePhoneDialogForm } from './create-phone-dialog-form'

export function CreatePhoneButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <CreatePhoneDialogForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Telefone
      </Button>
    </>
  )
}
