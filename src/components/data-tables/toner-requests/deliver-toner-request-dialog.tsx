'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BasicDialog } from '@/components/basic-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { TonerRequestsColumnType } from './toner-requests-table-types'
import { deliverTonerRequestAction } from '@/actions/toner-requests/deliver-toner-request'
import { formatRelativeDate } from '@/lib/utils/format-date'
import {
  deliverTonerRequestSchema,
  type DeliverTonerRequestData,
} from '@/lib/schemas/toner-request'

interface DeliverTonerRequestDialogProps {
  tonerRequest: TonerRequestsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeliverTonerRequestDialog({
  tonerRequest,
  open,
  onOpenChange,
}: DeliverTonerRequestDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DeliverTonerRequestData>({
    resolver: zodResolver(deliverTonerRequestSchema),
    defaultValues: {
      tonerRequestId: tonerRequest.id,
      deliveryNote: '',
    },
  })

  async function onSubmit(data: DeliverTonerRequestData) {
    setIsLoading(true)
    try {
      const response = await deliverTonerRequestAction(data)
      if (response.success) {
        toast.success('Pedido marcado como entregue com sucesso')
        onOpenChange(false)
        form.reset()
      } else {
        toast.error(
          response.error?.message || 'Erro ao marcar pedido como entregue',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Marcar como Entregue"
      description={`Tem certeza que deseja marcar o pedido de "${tonerRequest.requesterName}" como entregue?`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Confirmação:</strong> O pedido será marcado como entregue,
              finalizando o processo de solicitação.
            </p>
          </div>

          <div className="rounded-md bg-green-50 p-3 border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Detalhes do Pedido:</strong>
            </p>
            <ul className="text-sm text-green-700 mt-1 space-y-1">
              <li>
                • <strong>Requerente:</strong> {tonerRequest.requesterName}
              </li>
              <li>
                • <strong>Toner Requerido:</strong>{' '}
                <span className="font-mono">{tonerRequest.selectedToner}</span>
              </li>
              <li>
                • <strong>Patrimônio:</strong> {tonerRequest.assetTag}
              </li>
              <li>
                • <strong>Setor:</strong> {tonerRequest.sector}
              </li>
              <li>
                • <strong>Secretaria:</strong> {tonerRequest.department}
              </li>
              <li>
                • <strong>Data do Pedido:</strong>{' '}
                {formatRelativeDate(tonerRequest.createdAt)}
              </li>
            </ul>
          </div>

          <FormField
            control={form.control}
            name="deliveryNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nota de Entrega (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Fulano2 pegou o toner para Fulano1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                form.reset()
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Marcar como Entregue
            </Button>
          </div>
        </form>
      </Form>
    </BasicDialog>
  )
}
