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
import { SectorSelect } from '@/components/sector-select'
import { BasicDialog } from '@/components/basic-dialog'
import { createPrinterAction } from '@/actions/printers/create-printer'

import { getPrinterModels } from '@/actions/printer-models/get-printer-models'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
  createPrinterSchema,
  type CreatePrinterData,
} from '@/lib/schemas/printer'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetStatus } from '@/generated/prisma'
import { getAssetStatusLabel } from '@/lib/utils/get-status-label'

interface CreatePrinterDialogFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PrinterModel {
  id: string
  name: string
}

const assetStatusOptions = Object.values(AssetStatus).map((status) => ({
  value: status,
  label: getAssetStatusLabel(status),
}))

export function CreatePrinterDialogForm({
  open,
  onOpenChange,
}: CreatePrinterDialogFormProps) {
  const [printerModels, setPrinterModels] = useState<PrinterModel[]>([])
  const [printerModelOpen, setPrinterModelOpen] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  const form = useForm<CreatePrinterData>({
    resolver: zodResolver(createPrinterSchema),
    defaultValues: {
      serialNumber: '',
      ipAddress: '',
      tag: '',
      status: AssetStatus.USING,
      sectorId: '',
      printerModelId: '',
    },
  })

  useEffect(() => {
    if (open) {
      loadPrinterModels()
    }
  }, [open])

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

  async function onSubmit(data: CreatePrinterData) {
    const response = await createPrinterAction(data)
    if (!response.success) {
      toast.error(response.error?.message || 'Erro ao criar impressora')
      return
    }
    form.reset()
    toast.success('Impressora criada com sucesso')
    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Criar Impressora"
      className="sm:max-w-[600px]"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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

          <FormField
            control={form.control}
            name="ipAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço IP</FormLabel>
                <FormControl>
                  <Input placeholder="192.168.1.100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
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
              name="printerModelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Modelo</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sectorId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Secretaria - Setor</FormLabel>
                <SectorSelect
                  value={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Criar Impressora
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
