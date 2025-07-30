'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DepartmentDialogForm } from './department-dialog-form'

export function CreateDepartmentButton() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <>
      <DepartmentDialogForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Secretaria
      </Button>
    </>
  )
}
