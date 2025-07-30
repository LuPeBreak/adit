'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
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
import type { DialogProps } from '@radix-ui/react-dialog'

const departmentFormSchema = z.object({
  name: z
    .string({ message: 'O nome da secretaria é obrigatório' })
    .min(5, 'O nome da secretaria deve ter no mínimo 5 caracteres'),
  manager: z
    .string({ message: 'O responsável da secretaria é obrigatório' })
    .min(5, 'O responsável da secretaria deve ter no mínimo 5 caracteres')
    .refine(
      (managerName) =>
        managerName.split(' ').filter((name) => name.length > 0).length >= 2,
      'O responsável da secretaria deve conter o nome e o sobrenome',
    ),
  managerEmail: z
    .string({
      message: 'O email do responsável da secretaria é obrigatório',
    })
    .email('O email do responsável da secretaria é inválido'),
})

type DepartmentFormValues = z.infer<typeof departmentFormSchema>

export interface DepartmentFormData {
  id?: string
  name: string
  manager: string
  managerEmail: string
}

interface DepartmentDialogFormProps extends DialogProps {
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
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      manager: initialData?.manager ?? '',
      managerEmail: initialData?.managerEmail ?? '',
    },
  })

  const isUpdateMode = !!initialData

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
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
        toast.error('Erro ao atualizar secretaria')
        return
      }
      toast.success('Secretaria atualizada com sucesso')
    } else {
      const response = await createDepartmentAction(data)
      if (!response.success) {
        toast.error('Erro ao criar secretaria')
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
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secretaria</FormLabel>
                <FormControl>
                  <Input placeholder="Tecnologia da Informação" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="Diego Soares Gomes" {...field} />
                </FormControl>
                <FormMessage />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{isUpdateMode ? 'Editar' : 'Criar'}</Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
