'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BasicDialog } from '@/components/basic-dialog'
import { unbanUserAction } from '@/actions/users/unban-user'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { UsersColumnType } from './users-table-types'

interface UnbanUserDialogProps {
  user: UsersColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnbanUserDialog({
  user,
  open,
  onOpenChange,
}: UnbanUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleUnban() {
    setIsLoading(true)
    try {
      const response = await unbanUserAction({ userId: user.id })
      if (response.success) {
        toast.success('Usuário desbanido com sucesso')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao desbanir usuário')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Desbanir Usuário"
      description={`Tem certeza que deseja desbanir o usuário "${user.name}"?`}
    >
      <div className="space-y-4">
        {user.banReason && (
          <div className="rounded-md bg-muted p-3 border">
            <p className="text-sm">
              <strong>Motivo do banimento:</strong> {user.banReason}
            </p>
          </div>
        )}

        <div className="rounded-md bg-green-50 p-3 border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Confirmação:</strong> O usuário poderá fazer login novamente
            após o desbloqueio.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUnban}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Desbanir Usuário
          </Button>
        </div>
      </div>
    </BasicDialog>
  )
}
