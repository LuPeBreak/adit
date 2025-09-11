'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SectorSelect } from '@/components/sector-select'
import { BasicDialog } from '@/components/basic-dialog'
import { updateAssetStatusAction } from '@/actions/assets/update-asset-status'

import { toast } from 'sonner'
import { useEffect } from 'react'
import {
  updateAssetStatusSchema,
  type UpdateAssetStatusData,
} from '@/lib/schemas/asset'
import { Loader2 } from 'lucide-react'
import { AssetStatus } from '@/generated/prisma'
import { getAssetStatusLabel } from '@/lib/utils/get-status-label'

interface UpdateAssetStatusFormProps {
  assetId: string
  currentStatus: AssetStatus
  currentSectorId: string
  assetTag: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const assetStatusOptions = Object.values(AssetStatus).map((status) => ({
  value: status,
  label: getAssetStatusLabel(status),
}))

export function UpdateAssetStatusForm({
  assetId,
  currentStatus,
  currentSectorId,
  assetTag,
  open,
  onOpenChange,
}: UpdateAssetStatusFormProps) {
  const form = useForm<UpdateAssetStatusData>({
    resolver: zodResolver(updateAssetStatusSchema),
    defaultValues: {
      assetId,
      status: currentStatus,
      sectorId: currentSectorId,
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        assetId,
        status: currentStatus,
        sectorId: currentSectorId,
        notes: '',
      })
    }
  }, [open, assetId, currentStatus, currentSectorId, form])

  async function onSubmit(data: UpdateAssetStatusData) {
    const response = await updateAssetStatusAction(data)
    if (!response.success) {
      toast.error(
        response.error?.message || 'Erro ao atualizar status do ativo',
      )
      return
    }

    toast.success('Status do ativo atualizado com sucesso')
    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Atualizar Status - ${assetTag}`}
      className="sm:max-w-[500px]"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assetStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sectorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secretaria - Setor</FormLabel>
                <FormControl>
                  <SectorSelect
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Observações sobre a mudança..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Atualizar Status
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
