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
import { BasicDialog } from '@/components/basic-dialog'
import { createPrinterAction } from '@/actions/printers/create-printer'
import { updatePrinterAction } from '@/actions/printers/update-printer'
import { getSectors } from '@/actions/sectors/get-sectors'
import { getPrinterModels } from '@/actions/printer-models/get-printer-models'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
  createPrinterSchema,
  type CreatePrinterData,
  type UpdatePrinterData,
  type UpdatePrinterOperatorData,
} from '@/lib/schemas/printer'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetStatus } from '@/generated/prisma'
import type { PrintersColumnType } from './printers-table-types'
import { authClient } from '@/lib/auth/auth-client'
import { getAssetStatusLabel } from '@/lib/utils/get-status-label'

interface PrinterDialogFormProps {
  initialData?: PrintersColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Sector {
  id: string
  name: string
  departmentName: string
}

interface PrinterModel {
  id: string
  name: string
}

const assetStatusOptions = Object.values(AssetStatus).map((status) => ({
  value: status,
  label: getAssetStatusLabel(status),
}))

export function PrinterDialogForm({
  initialData,
  open,
  onOpenChange,
}: PrinterDialogFormProps) {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [printerModels, setPrinterModels] = useState<PrinterModel[]>([])
  const [sectorOpen, setSectorOpen] = useState(false)
  const [isLoadingSectors, setIsLoadingSectors] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  const { data: session } = authClient.useSession()

  const isUpdateMode = !!initialData
  const isAdmin = session?.user.role === 'ADMIN'

  const form = useForm<CreatePrinterData>({
    resolver: zodResolver(createPrinterSchema),
    defaultValues: {
      serialNumber: initialData?.serialNumber ?? '',
      ipAddress: initialData?.ipAddress ?? '',
      tag: initialData?.tag ?? '',
      status: initialData?.status ?? AssetStatus.USING,
      sectorId: initialData?.sectorId ?? '',
      printerModelId: initialData?.printerModelId ?? '',
    },
  })

  useEffect(() => {
    if (initialData && open) {
      form.reset({
        serialNumber: initialData.serialNumber,
        ipAddress: initialData.ipAddress,
        tag: initialData.tag,
        status: initialData.status,
        sectorId: initialData.sectorId,
        printerModelId: initialData.printerModelId,
      })
    }
  }, [initialData, form, open])

  useEffect(() => {
    if (open) {
      loadSectors()
      loadPrinterModels()
    }
  }, [open])

  async function loadSectors() {
    setIsLoadingSectors(true)
    try {
      const sectorsData = await getSectors()
      setSectors(sectorsData)
    } catch (error) {
      console.error('Erro ao carregar setores:', error)
      toast.error('Erro ao carregar setores')
    } finally {
      setIsLoadingSectors(false)
    }
  }

  async function loadPrinterModels() {
    setIsLoadingModels(true)
    try {
      const modelsData = await getPrinterModels()
      setPrinterModels(modelsData)
    } catch (error) {
      console.error('Erro ao carregar modelos:', error)
      toast.error('Erro ao carregar modelos de impressora')
    } finally {
      setIsLoadingModels(false)
    }
  }

  async function onSubmit(data: CreatePrinterData) {
    if (isUpdateMode) {
      if (!initialData?.id) {
        toast.error('Erro: ID da impressora não encontrado para atualização.')
        return
      }

      // Preparar dados baseado nas permissões do usuário
      const updateData: UpdatePrinterData | UpdatePrinterOperatorData = {
        id: initialData.id,
        ipAddress: data.ipAddress,
        status: data.status,
        sectorId: data.sectorId,
        printerModelId: data.printerModelId,
        ...(isAdmin && {
          serialNumber: data.serialNumber,
          tag: data.tag,
        }),
      }

      const response = await updatePrinterAction(updateData)
      if (!response.success) {
        toast.error(response.error?.message || 'Erro ao atualizar impressora')
        return
      }
      toast.success('Impressora atualizada com sucesso')
    } else {
      const response = await createPrinterAction(data)
      if (!response.success) {
        toast.error(response.error?.message || 'Erro ao criar impressora')
        return
      }
      form.reset()
      toast.success('Impressora criada com sucesso')
    }

    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isUpdateMode ? 'Editar Impressora' : 'Criar Impressora'}
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
                    <Input
                      placeholder="123456"
                      {...field}
                      disabled={isUpdateMode && !isAdmin}
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
                      placeholder="ABC123DEF456"
                      {...field}
                      disabled={isUpdateMode && !isAdmin}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isLoadingModels}>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {printerModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <FormLabel>Setor</FormLabel>
                <Popover open={sectorOpen} onOpenChange={setSectorOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={sectorOpen}
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                        disabled={isLoadingSectors}
                      >
                        {isLoadingSectors ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Carregando...
                          </>
                        ) : field.value ? (
                          (() => {
                            const sector = sectors.find(
                              (s) => s.id === field.value,
                            )
                            return sector
                              ? `${sector.departmentName} - ${sector.name}`
                              : 'Setor não encontrado'
                          })()
                        ) : (
                          'Selecione um setor'
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar setor..." />
                      <CommandList>
                        <CommandEmpty>Nenhum setor encontrado.</CommandEmpty>
                        <CommandGroup>
                          {sectors.map((sector) => (
                            <CommandItem
                              key={sector.id}
                              value={sector.id}
                              onSelect={() => {
                                form.setValue('sectorId', sector.id)
                                setSectorOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === sector.id
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {sector.departmentName} - {sector.name}
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

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isUpdateMode ? 'Salvar Alterações' : 'Criar Impressora'}
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
