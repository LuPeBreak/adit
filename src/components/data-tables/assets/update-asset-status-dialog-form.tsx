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
import { updateAssetStatusAction } from '@/actions/assets/update-asset-status'
import { getSectors } from '@/actions/sectors/get-sectors'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
  updateAssetStatusSchema,
  type UpdateAssetStatusData,
} from '@/lib/schemas/asset'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AssetStatus } from '@/generated/prisma'
import { getAssetStatusLabel } from '@/lib/utils/get-status-label'

interface UpdateAssetStatusFormProps {
  assetId: string
  currentStatus: AssetStatus
  currentSectorId: string
  assetTag: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Sector {
  id: string
  name: string
  departmentName: string
}

const assetStatusOptions = Object.values(AssetStatus).map((status) => ({
  value: status,
  label: getAssetStatusLabel(status),
}))

export function UpdateAssetStatusForm({
  assetId,
  currentStatus,
  currentSectorId,
  assetTag,
  open,
  onOpenChange,
}: UpdateAssetStatusFormProps) {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [sectorOpen, setSectorOpen] = useState(false)
  const [isLoadingSectors, setIsLoadingSectors] = useState(false)

  const form = useForm<UpdateAssetStatusData>({
    resolver: zodResolver(updateAssetStatusSchema),
    defaultValues: {
      assetId,
      status: currentStatus,
      sectorId: currentSectorId,
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        assetId,
        status: currentStatus,
        sectorId: currentSectorId,
        notes: '',
      })
      loadSectors()
    }
  }, [open, assetId, currentStatus, currentSectorId, form])

  async function loadSectors() {
    setIsLoadingSectors(true)
    try {
      const response = await getSectors()
      if (response.success && response.data) {
        const mappedSectors = response.data.map((sector) => ({
          id: sector.id,
          name: sector.name,
          departmentName: sector.departmentName,
        }))
        setSectors(mappedSectors)
      } else {
        console.error('Erro ao carregar setores:', response.error)
        toast.error('Erro ao carregar setores')
      }
    } catch (error) {
      console.error('Erro ao carregar setores:', error)
      toast.error('Erro ao carregar setores')
    } finally {
      setIsLoadingSectors(false)
    }
  }

  async function onSubmit(data: UpdateAssetStatusData) {
    const response = await updateAssetStatusAction(data)
    if (!response.success) {
      toast.error(
        response.error?.message || 'Erro ao atualizar status do ativo',
      )
      return
    }

    toast.success('Status do ativo atualizado com sucesso')
    onOpenChange(false)
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Atualizar Status - ${assetTag}`}
      className="sm:max-w-[500px]"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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
            name="sectorId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Secretaria - Setor</FormLabel>
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
                    <Command
                      filter={(value, search) => {
                        const sectorText = value.toLowerCase()
                        const searchText = search.toLowerCase()
                        return sectorText.includes(searchText) ? 1 : 0
                      }}
                    >
                      <CommandInput placeholder="Buscar setor..." />
                      <CommandList>
                        <CommandEmpty>Nenhum setor encontrado.</CommandEmpty>
                        <CommandGroup>
                          {sectors.map((sector) => (
                            <CommandItem
                              key={sector.id}
                              value={`${sector.departmentName} - ${sector.name}`}
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

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Observações sobre a mudança..."
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
            Atualizar Status
          </Button>
        </form>
      </Form>
    </BasicDialog>
  )
}
