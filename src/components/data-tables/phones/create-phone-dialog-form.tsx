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
import { createPhoneAction } from '@/actions/phones/create-phone'

import { toast } from 'sonner'
import { createPhoneSchema, type CreatePhoneData } from '@/lib/schemas/phone'
import { Loader2 } from 'lucide-react'
import { AssetStatus, PhoneType } from '@/generated/prisma'
import { getAssetStatusLabel } from '@/lib/utils/get-status-label'

interface CreatePhoneDialogFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePhoneDialogForm({
  open,
  onOpenChange,
}: CreatePhoneDialogFormProps) {
  const form = useForm<CreatePhoneData>({
    resolver: zodResolver(createPhoneSchema),
    defaultValues: {
      phoneNumber: '',
      brand: '',
      phoneType: PhoneType.VOIP,
      serialNumber: '',
      tag: '',
      status: AssetStatus.USING,
      sectorId: '',
    },
  })

  const watchedPhoneType = form.watch('phoneType')

  async function onSubmit(data: CreatePhoneData) {
    const response = await createPhoneAction(data)
    if (!response.success) {
      toast.error(response.error?.message || 'Erro ao criar telefone')
      return
    }
    form.reset()
    toast.success('Telefone criado com sucesso')
    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Criar Telefone"
      className="sm:max-w-[600px]"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-busy={form.formState.isSubmitting}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Patrimônio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="TI-00001"
                      {...field}
                      aria-invalid={!!form.formState.errors.tag}
                      aria-describedby="phone-tag-error"
                    />
                  </FormControl>
                  <FormMessage id="phone-tag-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Serial</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC123DEF456"
                      {...field}
                      aria-invalid={!!form.formState.errors.serialNumber}
                      aria-describedby="phone-serial-error"
                    />
                  </FormControl>
                  <FormMessage id="phone-serial-error" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="21063004"
                      {...field}
                      autoFocus
                      autoComplete="tel"
                      aria-invalid={!!form.formState.errors.phoneNumber}
                      aria-describedby="phone-number-error"
                    />
                  </FormControl>
                  <FormMessage id="phone-number-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Marca"
                      {...field}
                      autoComplete="off"
                      aria-invalid={!!form.formState.errors.brand}
                      aria-describedby="phone-brand-error"
                    />
                  </FormControl>
                  <FormMessage id="phone-brand-error" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Telefone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PhoneType.VOIP}>VOIP</SelectItem>
                      <SelectItem value={PhoneType.ANALOG}>
                        Analógico
                      </SelectItem>
                      <SelectItem value={PhoneType.DIGITAL}>Digital</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {watchedPhoneType === PhoneType.VOIP && (
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço IP (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="192.168.1.100"
                        value={field.value ?? ''}
                        inputMode="numeric"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.trim() === ''
                              ? null
                              : e.target.value,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Inicial</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AssetStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {getAssetStatusLabel(status)}
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
                <FormLabel>Setor</FormLabel>
                <FormControl>
                  <SectorSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecione um setor"
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
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Criar Telefone
            </Button>
          </div>
        </form>
      </Form>
    </BasicDialog>
  )
}
