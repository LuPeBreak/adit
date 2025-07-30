'use client'

import { BasicDialog } from '@/components/basic-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteSectorAction } from '@/actions/sectors/delete-sector'

interface DeleteConfirmationSectorDialogProps {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteConfirmationSectorDialog({
  id,
  open,
  onOpenChange,
}: DeleteConfirmationSectorDialogProps) {
  async function onDelete() {
    const response = await deleteSectorAction({
      id,
    })
    if (!response.success) {
      toast.error('Erro ao deletar setor')
      return
    }
    toast.success('Setor deletado com sucesso')
    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={'Deletar Setor'}
      description={'Tem certeza que deseja deletar este setor? '}
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
            onClick={() => onDelete()}
            className="flex-1"
          >
            Deletar
          </Button>
        </div>
      </>
    </BasicDialog>
  )
}
