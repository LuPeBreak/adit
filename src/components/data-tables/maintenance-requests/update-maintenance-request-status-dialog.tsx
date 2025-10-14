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
import {
  getMaintenanceStatusLabel,
  getAssetStatusLabel,
} from '@/lib/utils/get-status-label'
import { updateMaintenanceRequestStatusAction } from '@/actions/maintenance-requests/update-maintenance-request-status'
import type { MaintenanceStatus } from '@/generated/prisma'
import { AssetStatus } from '@/generated/prisma'
import { Checkbox } from '@/components/ui/checkbox'
import { SectorSelect } from '@/components/sector-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  type AssetUpdateDefaults = NonNullable<
    UpdateMaintenanceRequestStatusData['assetUpdate']
  >
  const defaultAssetUpdate: AssetUpdateDefaults = {
    updateAsset: targetStatus === 'MAINTENANCE' || targetStatus === 'COMPLETED',
    status:
      targetStatus === 'MAINTENANCE'
        ? AssetStatus.MAINTENANCE
        : targetStatus === 'COMPLETED'
          ? AssetStatus.USING
          : undefined,
    sectorId: maintenanceRequest.assetSectorId,
  }

  const form = useForm<UpdateMaintenanceRequestStatusData>({
    resolver: zodResolver(updateMaintenanceRequestStatusSchema),
    defaultValues: {
      id: maintenanceRequest.id,
      status: targetStatus,
      notes: '',
      assetUpdate: defaultAssetUpdate,
    },
  })

  // Sincronizar o status e o id do formulário sempre que o alvo mudar
  useEffect(() => {
    form.setValue('id', maintenanceRequest.id)
    form.setValue('status', targetStatus)
    // Atualiza defaults do bloco de ativo ao mudar o status alvo
    form.setValue(
      'assetUpdate.updateAsset',
      targetStatus === 'MAINTENANCE' || targetStatus === 'COMPLETED',
    )
    form.setValue(
      'assetUpdate.status',
      targetStatus === 'MAINTENANCE'
        ? AssetStatus.MAINTENANCE
        : targetStatus === 'COMPLETED'
          ? AssetStatus.USING
          : undefined,
    )
    form.setValue('assetUpdate.sectorId', maintenanceRequest.assetSectorId)
  }, [
    form,
    maintenanceRequest.id,
    maintenanceRequest.assetSectorId,
    maintenanceRequest.assetStatus,
    targetStatus,
  ])

  const onSubmit = async (values: UpdateMaintenanceRequestStatusData) => {
    setIsLoading(true)
    // Forçar uso do status alvo selecionado no menu, evitando qualquer dessincronização do form
    const result = await updateMaintenanceRequestStatusAction({
      id: maintenanceRequest.id,
      status: targetStatus,
      notes: values.notes,
      assetUpdate: values.assetUpdate?.updateAsset
        ? {
            updateAsset: true,
            status: values.assetUpdate.status,
            sectorId: values.assetUpdate.sectorId,
          }
        : undefined,
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
      className="sm:max-w-[560px]"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md border p-3 bg-muted text-sm space-y-1">
            <div className="text-muted-foreground font-mono">
              {maintenanceRequest.assetTag}
            </div>
            <div className="text-muted-foreground">
              {maintenanceRequest.sector}
            </div>
            <div className="text-muted-foreground">
              {maintenanceRequest.department}
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

          {/* Botões intermediários removidos: manter apenas os botões finais do formulário */}

          {/* Atualização opcional do ativo */}
          <div className="mt-6 space-y-3">
            <FormField
              control={form.control}
              name="assetUpdate.updateAsset"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      disabled={targetStatus === 'MAINTENANCE' || targetStatus === 'COMPLETED'}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Atualizar ativo (status e/ou setor)</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Campos aparecem apenas quando marcado */}
            {form.watch('assetUpdate.updateAsset') && (
              <div className="space-y-4">
                {/* Status do ativo */}
                <FormField
                  control={form.control}
                  name="assetUpdate.status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status do ativo</FormLabel>
                      <Select
                        disabled={targetStatus === 'MAINTENANCE'}
                        value={field.value ?? ''}
                        onValueChange={(v) => field.onChange(v as AssetStatus)}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={targetStatus === 'MAINTENANCE'}
                          >
                            <SelectValue
                              placeholder={getAssetStatusLabel(
                                maintenanceRequest.assetStatus,
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(AssetStatus).map((st) => (
                            <SelectItem key={st} value={st}>
                              {getAssetStatusLabel(st)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Setor do ativo */}
                <FormField
                  control={form.control}
                  name="assetUpdate.sectorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setor</FormLabel>
                      <FormControl>
                        <SectorSelect
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                          placeholder="Selecione o setor"
                          className="w-[280px] sm:w-[360px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Botões de ação no final do formulário */}
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
                  assetUpdate: defaultAssetUpdate,
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