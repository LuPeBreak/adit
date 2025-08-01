'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { BasicDialog } from '@/components/basic-dialog'
import { createPrinterModelAction } from '@/actions/printer-models/create-printer-model'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { updatePrinterModelAction } from '@/actions/printer-models/update-printer-model'
import { Loader2, Plus, X } from 'lucide-react'
import {
  printerModelFormSchema,
  type PrinterModelFormValues,
} from '@/lib/schemas/printer-model'

export interface PrinterModelFormData {
  id?: string
  name: string
  toners: string[]
}

interface PrinterModelDialogFormProps {
  initialData?: PrinterModelFormData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrinterModelDialogForm({
  initialData,
  open,
  onOpenChange,
}: PrinterModelDialogFormProps) {
  const form = useForm<PrinterModelFormValues>({
    resolver: zodResolver(printerModelFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      toners: initialData?.toners?.map((t) => ({ value: t })) ?? [
        { value: '' },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'toners',
  })

  const isUpdateMode = !!initialData

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          toners:
            initialData.toners.length > 0
              ? initialData.toners.map((t) => ({ value: t }))
              : [{ value: '' }],
        })
      } else {
        form.reset({
          name: '',
          toners: [{ value: '' }],
        })
      }
    }
  }, [initialData, open, form])

  async function onSubmit(data: PrinterModelFormValues) {
    const filteredToners = data.toners
      .map((toner) => toner.value)
      .filter((toner) => toner.trim() !== '')

    if (filteredToners.length === 0) {
      toast.error('É necessário informar pelo menos um toner.')
      return
    }

    const submitData = {
      name: data.name,
      toners: filteredToners,
    }

    try {
      if (isUpdateMode) {
        if (!initialData?.id) {
          toast.error('Erro: ID do modelo não encontrado para atualização.')
          return
        }
        const response = await updatePrinterModelAction({
          ...submitData,
          id: initialData.id,
        })
        if (!response.success) {
          toast.error(response.error?.message || 'Erro ao atualizar modelo.')
        } else {
          toast.success('Modelo atualizado com sucesso.')
          onOpenChange(false)
        }
      } else {
        const response = await createPrinterModelAction(submitData)
        if (!response.success) {
          toast.error(response.error?.message || 'Erro ao criar modelo.')
        } else {
          toast.success('Modelo criado com sucesso.')
          onOpenChange(false)
        }
      }
    } catch {
      toast.error('Ocorreu um erro inesperado.')
    }
  }

  const addToner = () => {
    append({ value: '' })
  }

  const removeToner = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isUpdateMode ? 'Editar Modelo' : 'Criar Modelo'}
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
                <FormLabel>Nome do Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="HP LaserJet Pro M404n" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Toners</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`toners.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="CF258A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeToner(index)}
                  disabled={fields.length === 1}
                  className="mt-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addToner}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Toner
            </Button>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isUpdateMode ? 'Salvar Alterações' : 'Criar Modelo'}
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
