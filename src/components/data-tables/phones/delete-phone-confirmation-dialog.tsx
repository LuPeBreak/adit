'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BasicDialog } from '@/components/basic-dialog'
import { deletePhoneAction } from '@/actions/phones/delete-phone'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { PhonesColumnType } from './phones-table-types'

interface DeletePhoneConfirmationDialogProps {
  phone: PhonesColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePhoneConfirmationDialog({
  phone,
  open,
  onOpenChange,
}: DeletePhoneConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      const response = await deletePhoneAction({ id: phone.id })
      if (response.success) {
        toast.success('Telefone deletado com sucesso')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao deletar telefone')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deletar Telefone"
      description={`Tem certeza que deseja deletar o telefone com patrimônio "${phone.tag}"?`}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
          <p className="text-sm text-destructive">
            <strong>Atenção:</strong> Esta ação irá remover permanentemente o
            telefone e o ativo associado (patrimônio {phone.tag}). Esta ação não
            pode ser desfeita.
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
