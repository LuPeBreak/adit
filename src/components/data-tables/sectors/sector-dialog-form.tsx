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
import { createSectorAction } from '@/actions/sectors/create-sector'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { updateSectorAction } from '@/actions/sectors/update-sector'
import { createSectorSchema, type CreateSectorData } from '@/lib/schemas/sector'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { getDepartments } from '@/actions/departments/get-departments'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type SectorFormValues = CreateSectorData

export interface SectorFormData {
  id?: string
  name: string
  manager: string
  managerEmail: string
  departmentId: string
}

interface SectorDialogFormProps {
  initialData?: SectorFormData
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Department {
  id: string
  name: string
}

export function SectorDialogForm({
  initialData,
  open,
  onOpenChange,
}: SectorDialogFormProps) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [departmentOpen, setDepartmentOpen] = useState(false)
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)

  const form = useForm<SectorFormValues>({
    resolver: zodResolver(createSectorSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      manager: initialData?.manager ?? '',
      managerEmail: initialData?.managerEmail ?? '',
      departmentId: initialData?.departmentId ?? '',
    },
  })

  const isUpdateMode = !!initialData

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  useEffect(() => {
    if (open) {
      loadDepartments()
    }
  }, [open])

  async function loadDepartments() {
    setIsLoadingDepartments(true)
    try {
      const departmentsData = await getDepartments()
      setDepartments(departmentsData)
    } catch (error) {
      console.error('Erro ao carregar secretarias:', error)
      toast.error('Erro ao carregar secretarias')
    } finally {
      setIsLoadingDepartments(false)
    }
  }

  async function onSubmit(data: SectorFormValues) {
    if (isUpdateMode) {
      if (!initialData?.id) {
        toast.error('Erro: ID do setor não encontrado para atualização.')
        return
      }
      const response = await updateSectorAction({
        ...data,
        id: initialData.id,
      })
      if (!response.success) {
        toast.error(response.error?.message || 'Erro ao atualizar setor')
        return
      }
      toast.success('Setor atualizado com sucesso')
    } else {
      const response = await createSectorAction(data)
      if (!response.success) {
        toast.error(response.error?.message || 'Erro ao criar setor')
        return
      }
      form.reset()
      toast.success('Setor criado com sucesso')
    }

    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isUpdateMode ? 'Editar Setor' : 'Criar Setor'}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="departmentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Secretaria</FormLabel>
                <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={departmentOpen}
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                        disabled={isLoadingDepartments}
                      >
                        {isLoadingDepartments ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Carregando...
                          </>
                        ) : field.value ? (
                          departments.find(
                            (department) => department.id === field.value,
                          )?.name
                        ) : (
                          'Selecione uma secretaria'
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="container max-h-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar secretaria..." />
                      <CommandList>
                        <CommandEmpty>
                          Nenhuma secretaria encontrada.
                        </CommandEmpty>
                        <CommandGroup>
                          {departments.map((department) => (
                            <CommandItem
                              key={department.id}
                              value={department.name}
                              onSelect={() => {
                                form.setValue('departmentId', department.id)
                                setDepartmentOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === department.id
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {department.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor</FormLabel>
                <FormControl>
                  <Input placeholder="Desenvolvimento" {...field} />
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
                <FormLabel>Responsável do Setor</FormLabel>
                <FormControl>
                  <Input placeholder="João Silva Santos" {...field} />
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
                    placeholder="desenvolvimento@example.com"
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
            {isUpdateMode ? 'Salvar Alterações' : 'Criar Setor'}
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
