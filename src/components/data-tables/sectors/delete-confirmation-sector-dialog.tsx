'use client'

import { BasicDialog } from '@/components/basic-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { deleteSectorAction } from '@/actions/sectors/delete-sector'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(false)

  async function onDelete() {
    setIsLoading(true)

    try {
      const response = await deleteSectorAction({
        id,
      })
      if (!response.success) {
        toast.error(response.error?.message || 'Erro ao deletar setor')
        return
      }
      toast.success('Setor deletado com sucesso')
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
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
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => onDelete()}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deletar
          </Button>
        </div>
      </>
    </BasicDialog>
  )
}
