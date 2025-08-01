'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BasicDialog } from '@/components/basic-dialog'
import { deletePrinterModelAction } from '@/actions/printer-models/delete-printer-model'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { PrinterModelsColumnType } from './printer-models-table-types'

interface DeleteConfirmationPrinterModelDialogProps {
  printerModel: PrinterModelsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeletePrinterModelConfirmationDialog({
  printerModel,
  open,
  onOpenChange,
}: DeleteConfirmationPrinterModelDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      const response = await deletePrinterModelAction({ id: printerModel.id })
      if (response.success) {
        toast.success('Modelo deletado com sucesso')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao deletar modelo')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deletar Modelo"
      description={`Tem certeza que deseja deletar o modelo "${printerModel.name}"?`}
    >
      <div className="space-y-4">
        {printerModel._count.printers > 0 && (
          <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
            <p className="text-sm text-destructive">
              <strong>Atenção:</strong> Este modelo possui{' '}
              {printerModel._count.printers} impressora(s) vinculada(s). Esta
              ação não pode ser desfeita.
            </p>
          </div>
        )}

        {printerModel._count.printers === 0 && (
          <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
            <p className="text-sm text-destructive">
              <strong>Atenção:</strong> Esta ação irá remover permanentemente o
              modelo e todos os dados associados. Esta ação não pode ser
              desfeita.
            </p>
          </div>
        )}

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
