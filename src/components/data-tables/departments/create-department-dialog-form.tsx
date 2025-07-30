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
import { useState } from 'react'
import { Plus } from 'lucide-react'

const createDepartmentFormSchema = z.object({
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
  managerEmail: z.string({
    message: 'O email do responsável da secretaria é obrigatório',
  }),
  // .email('O email do responsável da secretaria é inválido'),
})

type CreateDepartmentFormValues = z.infer<typeof createDepartmentFormSchema>

export function CreateDepartmentDialogForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const form = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentFormSchema),
    defaultValues: {
      name: '',
      manager: '',
      managerEmail: '',
    },
  })

  async function onCreateDepartment(data: CreateDepartmentFormValues) {
    const response = await createDepartmentAction(data)
    if (!response.success) {
      toast.error('Erro ao criar secretaria')
      return
    }
    toast.success('Secretaria criada com sucesso')
    setIsDialogOpen(false)
    form.reset()
  }

  return (
    <BasicDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      title={'Criar Secretaria'}
      trigger={
        <Button variant="outline" size={'sm'}>
          <Plus />
          Criar Secretaria
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onCreateDepartment)}
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
          <Button type="submit">Criar</Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
