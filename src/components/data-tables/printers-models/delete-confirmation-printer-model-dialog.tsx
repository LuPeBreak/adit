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

export function DeleteConfirmationPrinterModelDialog({
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
    <BasicDialog open={open} onOpenChange={onOpenChange} title="Deletar Modelo">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja deletar o modelo{' '}
          <span className="font-semibold">{printerModel.name}</span>?
        </p>

        {printerModel._count.printers > 0 && (
          <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Este modelo possui{' '}
              {printerModel._count.printers} impressora(s) vinculada(s).
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Esta ação não pode ser desfeita.
        </p>

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
