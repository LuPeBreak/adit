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
import { BasicDialog } from '@/components/basic-dialog'
import { updatePrinterAction } from '@/actions/printers/update-printer'
// getSectors import removed as sectorId is not editable in update form
import { getPrinterModels } from '@/actions/printer-models/get-printer-models'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
  updatePrinterAdminSchema,
  updatePrinterOperatorSchema,
  type UpdatePrinterAdminData,
  type UpdatePrinterOperatorData,
} from '@/lib/schemas/printer'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth/auth-client'
import type { PrintersColumnType } from './printers-table-types'

interface UpdatePrinterDialogFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  printer: PrintersColumnType
}

// Sector interface removed as sectorId is not editable in update form

interface PrinterModel {
  id: string
  name: string
}

export function UpdatePrinterDialogForm({
  open,
  onOpenChange,
  printer,
}: UpdatePrinterDialogFormProps) {
  const { data: session } = authClient.useSession()
  const [printerModels, setPrinterModels] = useState<PrinterModel[]>([])
  const [printerModelOpen, setPrinterModelOpen] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'

  const form = useForm<UpdatePrinterAdminData | UpdatePrinterOperatorData>({
    resolver: zodResolver(
      isAdmin ? updatePrinterAdminSchema : updatePrinterOperatorSchema,
    ),
    defaultValues: {
      id: printer.id,
      serialNumber: printer.serialNumber,
      ipAddress: printer.ipAddress,
      tag: printer.tag,
      printerModelId: printer.printerModelId,
    },
  })

  useEffect(() => {
    if (open) {
      loadPrinterModels()
    }
  }, [open])

  useEffect(() => {
    if (open) {
      form.reset({
        id: printer.id,
        serialNumber: printer.serialNumber,
        ipAddress: printer.ipAddress,
        tag: printer.tag,
        printerModelId: printer.printerModelId,
      })
    }
  }, [printer, open, form])

  async function loadPrinterModels() {
    setIsLoadingModels(true)
    try {
      const response = await getPrinterModels()
      if (response.success && response.data) {
        const mappedModels = response.data.map((model) => ({
          id: model.id,
          name: model.name,
        }))
        setPrinterModels(mappedModels)
      } else {
        console.error('Erro ao carregar modelos:', response.error)
        toast.error('Erro ao carregar modelos de impressora')
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error)
      toast.error('Erro ao carregar modelos de impressora')
    } finally {
      setIsLoadingModels(false)
    }
  }

  async function onSubmit(
    data: UpdatePrinterAdminData | UpdatePrinterOperatorData,
  ) {
    try {
      const response = await updatePrinterAction(data)
      if (response.success) {
        toast.success('Impressora atualizada com sucesso!')
        onOpenChange(false)
      } else {
        toast.error(response.error?.message || 'Erro ao atualizar impressora')
      }
    } catch {
      toast.error('Erro ao atualizar impressora')
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Impressora"
      description="Atualize as informações da impressora."
      className="sm:max-w-[500px]"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Patrimônio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={'TI-00001'}
                      {...field}
                      disabled={!isAdmin}
                    />
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
                    <Input
                      placeholder={'Digite o número de série'}
                      {...field}
                      disabled={!isAdmin}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ipAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço IP</FormLabel>
                <FormControl>
                  <Input placeholder={'Digite o endereço IP'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="printerModelId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Modelo da Impressora</FormLabel>
                {
                  <Popover
                    open={printerModelOpen}
                    onOpenChange={setPrinterModelOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={printerModelOpen}
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={isLoadingModels}
                        >
                          {isLoadingModels ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Carregando...
                            </>
                          ) : field.value ? (
                            (() => {
                              const model = printerModels.find(
                                (m) => m.id === field.value,
                              )
                              return model
                                ? model.name
                                : 'Modelo não encontrado'
                            })()
                          ) : (
                            'Selecione um modelo'
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[200px] p-0">
                      <Command
                        filter={(value, search) => {
                          const modelText = value.toLowerCase()
                          const searchText = search.toLowerCase()
                          return modelText.includes(searchText) ? 1 : 0
                        }}
                      >
                        <CommandInput placeholder="Buscar modelo..." />
                        <CommandList>
                          <CommandEmpty>Nenhum modelo encontrado.</CommandEmpty>
                          <CommandGroup>
                            {printerModels.map((model) => (
                              <CommandItem
                                key={model.id}
                                value={model.name}
                                onSelect={() => {
                                  form.setValue('printerModelId', model.id)
                                  setPrinterModelOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === model.id
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {model.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                }
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {'Atualizando...'}
              </>
            ) : (
              'Atualizar Impressora'
            )}
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
