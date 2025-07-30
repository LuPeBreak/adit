'use client'

import { BasicDialog } from '@/components/basic-dialog'
import { toast } from 'sonner'
import type { DialogProps } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { deleteDepartmentAction } from '@/actions/departments/delete-department'

interface DeleteConfirmationDepartmentDialogProps extends DialogProps {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteConfirmationDepartmentDialog({
  id,
  open,
  onOpenChange,
}: DeleteConfirmationDepartmentDialogProps) {
  async function onDelete(id: string) {
    const response = await deleteDepartmentAction({
      id,
    })
    if (!response.success) {
      toast.error('Erro ao deletar secretaria')
      return
    }
    toast.success('Secretaria deletada com sucesso')
    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={'Deletar Secretaria'}
      description={'Tem certeza que deseja deletar esta secretaria? '}
    >
      <>
        <p className="text-red-700 font-bold">
          Essa é uma ação perigosa e irreversível!
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant={'outline'}
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => onDelete(id)}
            className="flex-1"
          >
            Deletar
          </Button>
        </div>
      </>
    </BasicDialog>
  )
}
