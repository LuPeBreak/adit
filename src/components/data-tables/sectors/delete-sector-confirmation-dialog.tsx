'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BasicDialog } from '@/components/basic-dialog'
import { deleteSectorAction } from '@/actions/sectors/delete-sector'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { SectorsColumnType } from './sectors-table-types'

interface DeleteSectorConfirmationDialogProps {
  sector: SectorsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSectorConfirmationDialog({
  sector,
  open,
  onOpenChange,
}: DeleteSectorConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    try {
      const response = await deleteSectorAction({ id: sector.id })
      if (response.success) {
        toast.success('Setor deletado com sucesso')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao deletar setor')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deletar Setor"
      description={`Tem certeza que deseja deletar o setor "${sector.name}" da secretaria "${sector.departmentName}"?`}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
          <p className="text-sm text-destructive">
            <strong>Atenção:</strong> Esta ação irá remover permanentemente o
            setor. Esta ação não pode ser desfeita.
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
