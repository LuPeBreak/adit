'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BasicDialog } from '@/components/basic-dialog'
import { deleteDepartmentAction } from '@/actions/departments/delete-department'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { DepartmentsColumnType } from './departments-table-types'

interface DeleteDepartmentConfirmationDialogProps {
  department: DepartmentsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteDepartmentConfirmationDialog({
  department,
  open,
  onOpenChange,
}: DeleteDepartmentConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      const response = await deleteDepartmentAction({ id: department.id })
      if (response.success) {
        toast.success('Secretaria deletada com sucesso')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao deletar secretaria')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deletar Secretaria"
      description={`Tem certeza que deseja deletar a secretaria "${department.name}"?`}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
          <p className="text-sm text-destructive">
            <strong>Atenção:</strong> Só é possível deletar secretarias que não
            possuem setores associados. Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deletar
          </Button>
        </div>
      </div>
    </BasicDialog>
  )
}
