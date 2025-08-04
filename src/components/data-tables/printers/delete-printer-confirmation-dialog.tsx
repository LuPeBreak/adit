'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BasicDialog } from '@/components/basic-dialog'
import { deletePrinterAction } from '@/actions/printers/delete-printer'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { PrintersColumnType } from './printers-table-types'

interface DeletePrinterConfirmationDialogProps {
  printer: PrintersColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePrinterConfirmationDialog({
  printer,
  open,
  onOpenChange,
}: DeletePrinterConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      const response = await deletePrinterAction({ id: printer.id })
      if (response.success) {
        toast.success('Impressora deletada com sucesso')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao deletar impressora')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deletar Impressora"
      description={`Tem certeza que deseja deletar a impressora com patrimônio "${printer.tag}"?`}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
          <p className="text-sm text-destructive">
            <strong>Atenção:</strong> Esta ação irá remover permanentemente a
            impressora e o ativo associado (patrimônio {printer.tag}). Esta ação
            não pode ser desfeita.
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
