'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BasicDialog } from '@/components/basic-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { TonerRequestsColumnType } from '@/components/data-tables/toner-requests/toner-requests-table-types'
import {
  updateTonerRequestStatusSchema,
  type UpdateTonerRequestStatusData,
} from '@/lib/schemas/toner-request'
import { getTonerRequestStatusLabel } from '@/lib/utils/get-status-label'
import { updateTonerRequestStatusAction } from '@/actions/toner-requests/update-toner-request-status'
import type { TonerRequestStatus } from '@/generated/prisma'

interface UpdateTonerRequestStatusDialogProps {
  tonerRequest: TonerRequestsColumnType
  targetStatus: TonerRequestStatus
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateTonerRequestStatusDialog({
  tonerRequest,
  targetStatus,
  open,
  onOpenChange,
}: UpdateTonerRequestStatusDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<UpdateTonerRequestStatusData>({
    resolver: zodResolver(updateTonerRequestStatusSchema),
    defaultValues: {
      id: tonerRequest.id,
      status: targetStatus,
      notes: '',
    },
  })

  // Sincronizar o status e o id do formulário sempre que o alvo mudar
  useEffect(() => {
    form.setValue('id', tonerRequest.id)
    form.setValue('status', targetStatus)
    form.setValue('notes', '')
  }, [form, tonerRequest.id, targetStatus])

  const onSubmit = async (values: UpdateTonerRequestStatusData) => {
    setIsLoading(true)

    const data: UpdateTonerRequestStatusData = {
      id: tonerRequest.id,
      status: targetStatus,
      notes: values.notes,
    }

    const result = await updateTonerRequestStatusAction(data)
    setIsLoading(false)

    if (!result.success) {
      toast.error(result.error?.message || 'Falha ao atualizar status')
      return
    }

    toast.success('Status atualizado com sucesso')
    const failedNotifications = result.data?.notificationErrors || []
    if (failedNotifications.length > 0) {
      toast.warning(
        `Falha ao enviar notificações via: ${failedNotifications.join(', ')}`,
      )
    }

    // Garantir atualização dos dados da tabela
    router.refresh()
    onOpenChange(false)
    form.reset()
  }

  // Determinar se o campo de observações é obrigatório
  const isNotesRequired = targetStatus === 'REJECTED'
  const notesPlaceholder =
    targetStatus === 'REJECTED'
      ? 'Motivo da rejeição (obrigatório)...'
      : targetStatus === 'DELIVERED'
        ? 'Observações sobre a entrega (opcional)...'
        : 'Observações (opcional)...'

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Atualizar status: ${getTonerRequestStatusLabel(tonerRequest.status)} → ${getTonerRequestStatusLabel(targetStatus)}`}
      description={`O status será atualizado para "${getTonerRequestStatusLabel(targetStatus)}".`}
      className="sm:max-w-[560px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Informações do pedido */}
          <div className="rounded-md border p-3 bg-muted text-sm space-y-1">
            <div className="font-medium">{tonerRequest.requesterName}</div>
            <div className="text-muted-foreground">
              {tonerRequest.selectedToner}
            </div>
            <div className="text-muted-foreground font-mono">
              {tonerRequest.assetTag} - {tonerRequest.sector}
            </div>
          </div>

          {/* Campo de observações */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Observações
                  {isNotesRequired && (
                    <span className="text-destructive"> *</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={notesPlaceholder}
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                form.reset({
                  id: tonerRequest.id,
                  status: targetStatus,
                  notes: '',
                })
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar status
            </Button>
          </div>
        </form>
      </Form>
    </BasicDialog>
  )
}
