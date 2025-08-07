'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BasicDialog } from '@/components/basic-dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { TonerRequestsColumnType } from './toner-requests-table-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { rejectTonerRequestAction } from '@/actions/toner-requests/reject-toner-request'
import {
  rejectTonerRequestSchema,
  type RejectTonerRequestData,
} from '@/lib/schemas/toner-request'
import { formatRelativeDate } from '@/lib/utils/format-date'

interface RejectTonerRequestDialogProps {
  tonerRequest: TonerRequestsColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RejectTonerRequestDialog({
  tonerRequest,
  open,
  onOpenChange,
}: RejectTonerRequestDialogProps) {
  const form = useForm<RejectTonerRequestData>({
    resolver: zodResolver(rejectTonerRequestSchema),
    defaultValues: {
      tonerRequestId: tonerRequest.id,
      rejectionReason: '',
    },
  })

  async function onSubmit(data: RejectTonerRequestData) {
    const response = await rejectTonerRequestAction(data)
    if (response.success) {
      toast.success('Pedido rejeitado com sucesso')
      onOpenChange(false)
      form.reset()
    } else {
      toast.error(response.error?.message || 'Erro ao rejeitar pedido')
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rejeitar Pedido de Toner"
      description={`Tem certeza que deseja rejeitar o pedido de "${tonerRequest.requesterName}"?`}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
          <p className="text-sm text-destructive">
            <strong>Atenção:</strong> O pedido será marcado como rejeitado e o
            solicitante será notificado por email com o motivo da rejeição.
          </p>
        </div>

        <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Detalhes do Pedido:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-1 space-y-1">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da rejeição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descreva o motivo da rejeição..."
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
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Rejeitar Pedido
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </BasicDialog>
  )
}
