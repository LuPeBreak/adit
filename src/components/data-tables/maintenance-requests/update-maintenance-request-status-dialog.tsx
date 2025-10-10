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
import type { MaintenanceRequestsColumnType } from './maintenance-requests-table-types'
import {
  updateMaintenanceRequestStatusSchema,
  type UpdateMaintenanceRequestStatusData,
} from '@/lib/schemas/maintenance-request'
import { getMaintenanceStatusLabel, getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { updateMaintenanceRequestStatusAction } from '@/actions/maintenance-requests/update-maintenance-request-status'
import type { MaintenanceStatus } from '@/generated/prisma'

interface UpdateMaintenanceRequestStatusDialogProps {
  maintenanceRequest: MaintenanceRequestsColumnType
  targetStatus: MaintenanceStatus
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateMaintenanceRequestStatusDialog({
  maintenanceRequest,
  targetStatus,
  open,
  onOpenChange,
}: UpdateMaintenanceRequestStatusDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // status alvo é recebido via props

  const form = useForm<UpdateMaintenanceRequestStatusData>({
    resolver: zodResolver(updateMaintenanceRequestStatusSchema),
    defaultValues: {
      id: maintenanceRequest.id,
      status: targetStatus,
      notes: '',
    },
  })

  // Sincronizar o status e o id do formulário sempre que o alvo mudar
  useEffect(() => {
    form.setValue('id', maintenanceRequest.id)
    form.setValue('status', targetStatus)
  }, [form, maintenanceRequest.id, targetStatus])

  const onSubmit = async (values: UpdateMaintenanceRequestStatusData) => {
    setIsLoading(true)
    // Forçar uso do status alvo selecionado no menu, evitando qualquer dessincronização do form
    const result = await updateMaintenanceRequestStatusAction({
      id: maintenanceRequest.id,
      status: targetStatus,
      notes: values.notes,
    })
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
    // Garantir atualização dos dados da tabela e página de detalhes
    router.refresh()
    onOpenChange(false)
    form.reset()
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Atualizar status: ${getMaintenanceStatusLabel(maintenanceRequest.status)} → ${getMaintenanceStatusLabel(targetStatus)}`}
      description={`O status será atualizado para "${getMaintenanceStatusLabel(targetStatus)}".`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md border p-3 text-sm bg-muted">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="font-medium">N° Patrimônio:</span>
                <p className="text-muted-foreground font-mono">
                  {maintenanceRequest.assetTag}
                </p>
              </div>
              <div>
                <span className="font-medium">Tipo do ativo:</span>
                <p className="text-muted-foreground">
                  {getAssetTypeLabel(maintenanceRequest.assetType)}
                </p>
              </div>
              <div>
                <span className="font-medium">Solicitante:</span>
                <p className="text-muted-foreground">
                  {maintenanceRequest.requesterName}
                </p>
              </div>
              <div>
                <span className="font-medium">Defeito informado:</span>
                <p className="text-muted-foreground break-words">
                  {maintenanceRequest.description}
                </p>
              </div>
            </div>
          </div>

          {/* Campo de observações permanece obrigatório; status é definido via props */}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva a justificativa da mudança de status..."
                    className="min-h-[100px]"
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
                form.reset({
                  id: maintenanceRequest.id,
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