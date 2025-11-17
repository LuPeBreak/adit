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

import { BasicDialog } from '@/components/basic-dialog'
import { updatePhoneAction } from '@/actions/phones/update-phone'

import { toast } from 'sonner'
import { useEffect } from 'react'
import {
  updatePhoneAdminSchema,
  updatePhoneOperatorSchema,
  type UpdatePhoneAdminData,
  type UpdatePhoneOperatorData,
} from '@/lib/schemas/phone'
import { Loader2 } from 'lucide-react'
import { PhoneType } from '@/generated/prisma'
import { authClient } from '@/lib/auth/auth-client'
import type { PhonesColumnType } from './phones-table-types'

interface UpdatePhoneDialogFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: PhonesColumnType
}

export function UpdatePhoneDialogForm({
  open,
  onOpenChange,
  phone,
}: UpdatePhoneDialogFormProps) {
  const { data: session } = authClient.useSession()

  const isAdmin = session?.user?.role === 'ADMIN'

  const form = useForm<UpdatePhoneAdminData | UpdatePhoneOperatorData>({
    resolver: zodResolver(
      isAdmin ? updatePhoneAdminSchema : updatePhoneOperatorSchema,
    ),
    defaultValues: {
      id: phone.id,
      phoneNumber: phone.phoneNumber,
      brand: phone.brand,
      phoneType: phone.phoneType,
      ipAddress: phone.ipAddress || undefined,
      serialNumber: phone.serialNumber,
      tag: phone.tag,
    },
  })

  const watchedPhoneType = form.watch('phoneType')

  useEffect(() => {
    if (open) {
      form.reset({
        id: phone.id,
        phoneNumber: phone.phoneNumber,
        brand: phone.brand,
        phoneType: phone.phoneType,
        ipAddress: phone.ipAddress || null,
        serialNumber: phone.serialNumber,
        tag: phone.tag,
      })
    }
  }, [phone, open, form])

  async function onSubmit(
    data: UpdatePhoneAdminData | UpdatePhoneOperatorData,
  ) {
    const response = await updatePhoneAction(data)
    if (!response.success) {
      toast.error(response.error?.message || 'Erro ao atualizar telefone')
      return
    }
    toast.success('Telefone atualizado com sucesso')
    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Telefone"
      className="sm:max-w-[600px]"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {isAdmin && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° Patrimônio</FormLabel>
                    <FormControl>
                      <Input placeholder="TI-00001" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="ABC123DEF456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="21063004" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Cisco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Telefone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Telefone'
            )}
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
