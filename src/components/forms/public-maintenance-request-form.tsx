'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  publicMaintenanceRequestSchema,
  type PublicMaintenanceRequestData,
} from '@/lib/schemas/public-maintenance-request'
import { createPublicMaintenanceRequestAction } from '@/actions/maintenance-requests/create-public-maintenance-request'
import {
  getPublicAssetsAction,
  type AssetData,
} from '@/actions/assets/get-public-assets'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { AssetType } from '@/generated/prisma'
import { toast } from 'sonner'
import { formatPhoneNumber } from '@/lib/utils/contact-formatter'

export function PublicMaintenanceRequestForm() {
  const [assets, setAssets] = useState<AssetData[]>([])
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null)
  const [open, setOpen] = useState(false)

  const form = useForm<PublicMaintenanceRequestData>({
    resolver: zodResolver(publicMaintenanceRequestSchema),
    defaultValues: {
      assetId: '',
      requesterName: '',
      registrationNumber: '',
      requesterEmail: '',
      requesterWhatsApp: '',
      description: '',
    },
  })

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const result = await getPublicAssetsAction()
        if (result.success && result.data) {
          setAssets(result.data)
        }
      } catch (error) {
        console.error('Erro ao carregar ativos:', error)
      }
    }

    loadAssets()
  }, [])

  const onSubmit = async (data: PublicMaintenanceRequestData) => {
    try {
      const result = await createPublicMaintenanceRequestAction(data)

      if (result.success) {
        toast.success('Pedido de manutenção enviado com sucesso!')
        form.reset()
        setSelectedAsset(null)
      } else {
        toast.error(result.error?.message || 'Erro ao enviar pedido')
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
      toast.error('Erro interno. Tente novamente.')
    }
  }

  const handleAssetSelect = (asset: AssetData) => {
    setSelectedAsset(asset)
    form.setValue('assetId', asset.assetId)
    setOpen(false)
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Informações do Equipamento */}
          <div className="space-y-3 sm:space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Informações do Equipamento
              </h3>
            </div>

            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ativo (Nº Patrimônio)</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={form.formState.isSubmitting}
                        >
                          {selectedAsset
                            ? `${selectedAsset.tag} - ${getAssetTypeLabel(selectedAsset.assetType as AssetType)}`
                            : form.formState.isSubmitting
                              ? 'Carregando ativos...'
                              : 'Selecione um ativo'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar por patrimônio..." />
                        <CommandList>
                          <CommandEmpty>Nenhum ativo encontrado.</CommandEmpty>
                          <CommandGroup>
                            {assets.map((asset) => (
                              <CommandItem
                                key={asset.assetId}
                                value={asset.tag}
                                onSelect={() => handleAssetSelect(asset)}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    selectedAsset?.assetId === asset.assetId
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {asset.tag} -{' '}
                                    {getAssetTypeLabel(
                                      asset.assetType as AssetType,
                                    )}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {asset.sector} - {asset.department}
                                  </span>
                                </div>
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

            {/* Dados do Ativo Selecionado */}
            {selectedAsset && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Dados do Ativo Selecionado
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Patrimônio:</strong> {selectedAsset.tag}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Tipo:</strong>{' '}
                      {getAssetTypeLabel(selectedAsset.assetType as AssetType)}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Setor:</strong> {selectedAsset.sector}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Secretaria:</strong> {selectedAsset.department}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                      ⚠️ Caso os dados acima estejam incorretos, entre em
                      contato com a TI.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Problema</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva detalhadamente o problema encontrado no equipamento..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dados do Requerente */}
          <div className="space-y-3 sm:space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                Dados do Requerente
              </h3>
            </div>

            <FormField
              control={form.control}
              name="requesterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua matrícula (apenas números)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requesterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu e-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requesterWhatsApp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(XX) XXXXX-XXXX"
                      value={formatPhoneNumber(field.value)}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/\D/g, '')
                        if (numbers.length <= 11) {
                          field.onChange(numbers)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 sm:h-10"
            disabled={form.formState.isSubmitting || !selectedAsset}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-sm sm:text-base">Enviando pedido...</span>
              </>
            ) : (
              <span className="text-sm sm:text-base">Enviar Pedido de Manutenção</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
