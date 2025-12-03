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
import { BasicDialog } from '@/components/basic-dialog'
import { createDepartmentAction } from '@/actions/departments/create-department'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { updateDepartmentAction } from '@/actions/departments/update-department'
import {
  createDepartmentSchema,
  type CreateDepartmentData,
} from '@/lib/schemas/department'
import { Loader2 } from 'lucide-react'

type DepartmentFormValues = CreateDepartmentData

export interface DepartmentFormData {
  id?: string
  name: string
  acronym: string
  manager: string
  managerEmail: string
  contact?: string
  address?: string
  website?: string
}

interface DepartmentDialogFormProps {
  initialData?: DepartmentFormData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepartmentDialogForm({
  initialData,
  open,
  onOpenChange,
}: DepartmentDialogFormProps) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      acronym: initialData?.acronym ?? '',
      manager: initialData?.manager ?? '',
      managerEmail: initialData?.managerEmail ?? '',
      contact: initialData?.contact ?? '',
      address: initialData?.address ?? '',
      website: initialData?.website ?? '',
    },
  })

  const isUpdateMode = !!initialData

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name ?? '',
        acronym: initialData.acronym ?? '',
        manager: initialData.manager ?? '',
        managerEmail: initialData.managerEmail ?? '',
        contact: initialData.contact ?? '',
        address: initialData.address ?? '',
        website: initialData.website ?? '',
      })
    }
  }, [initialData, form])

  async function onSubmit(data: DepartmentFormValues) {
    if (isUpdateMode) {
      if (!initialData?.id) {
        toast.error('Erro: ID da secretaria não encontrado para atualização.')
        return
      }
      const response = await updateDepartmentAction({
        ...data,
        id: initialData.id,
      })
      if (!response.success) {
        toast.error(response.error?.message || 'Erro ao atualizar secretaria')
        return
      }
      toast.success('Secretaria atualizada com sucesso')
    } else {
      const response = await createDepartmentAction(data)
      if (!response.success) {
        toast.error(response.error?.message || 'Erro ao criar secretaria')
        return
      }
      form.reset()
      toast.success('Secretaria criada com sucesso')
    }

    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isUpdateMode ? 'Editar Secretaria' : 'Criar Secretaria'}
      className="sm:max-w-[600px]"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-busy={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secretaria</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tecnologia da Informação"
                    {...field}
                    autoFocus
                    aria-invalid={!!form.formState.errors.name}
                    aria-describedby="department-name-error"
                  />
                </FormControl>
                <FormMessage id="department-name-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="acronym"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sigla</FormLabel>
                <FormControl>
                  <Input
                    placeholder="TI"
                    {...field}
                    autoComplete="off"
                    aria-invalid={!!form.formState.errors.acronym}
                    aria-describedby="department-acronym-error"
                  />
                </FormControl>
                <FormMessage id="department-acronym-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável da Secretaria</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Diego Soares Gomes"
                    {...field}
                    autoComplete="name"
                    aria-invalid={!!form.formState.errors.manager}
                    aria-describedby="department-manager-error"
                  />
                </FormControl>
                <FormMessage id="department-manager-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="managerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email do Responsável</FormLabel>
                <FormControl>
                  <Input
                    id="managerEmail"
                    placeholder="informatica@example.com"
                    {...field}
                    autoComplete="email"
                    aria-invalid={!!form.formState.errors.managerEmail}
                    aria-describedby="department-managerEmail-error"
                  />
                </FormControl>
                <FormMessage id="department-managerEmail-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 99999-9999"
                    {...field}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={!!form.formState.errors.contact}
                    aria-describedby="department-contact-error"
                  />
                </FormControl>
                <FormMessage id="department-contact-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua das Flores, 123"
                    {...field}
                    autoComplete="street-address"
                    aria-invalid={!!form.formState.errors.address}
                    aria-describedby="department-address-error"
                  />
                </FormControl>
                <FormMessage id="department-address-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://secretaria.example.com"
                    {...field}
                    type="url"
                    autoComplete="url"
                    aria-invalid={!!form.formState.errors.website}
                    aria-describedby="department-website-error"
                  />
                </FormControl>
                <FormMessage id="department-website-error" />
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
              {isUpdateMode ? 'Salvar Alterações' : 'Criar Secretaria'}
            </Button>
          </div>
        </form>
      </Form>
    </BasicDialog>
  )
}
