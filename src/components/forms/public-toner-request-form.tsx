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
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  publicTonerRequestSchema,
  type PublicTonerRequestData,
} from '@/lib/schemas/public-toner-request'
import { createPublicTonerRequestAction } from '@/actions/toner-requests/create-public-toner-request'
import { getPublicPrintersAction } from '@/actions/printers/get-public-printers'
import { toast } from 'sonner'

type PrinterData = {
  assetId: string
  tag: string
  status: string
  sector: string
  department: string
  printerModel: string
  availableToners: string[]
}

interface PublicTonerRequestFormProps {
  onSuccess?: () => void
}

export function PublicTonerRequestForm({
  onSuccess,
}: PublicTonerRequestFormProps) {
  const [printers, setPrinters] = useState<PrinterData[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterData | null>(
    null,
  )
  const [open, setOpen] = useState(false)

  // Função para formatar WhatsApp
  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  // Função para extrair apenas números do WhatsApp
  const extractWhatsAppNumbers = (value: string) => {
    return value.replace(/\D/g, '')
  }

  const form = useForm<PublicTonerRequestData>({
    resolver: zodResolver(publicTonerRequestSchema),
    defaultValues: {
      assetId: '',
      requesterName: '',
      registrationNumber: '',
      requesterEmail: '',
      requesterWhatsApp: '',
      selectedToner: '',
    },
  })

  // Carregar impressoras
  useEffect(() => {
    async function loadPrinters() {
      try {
        const response = await getPublicPrintersAction()

        if (response.success && response.data) {
          setPrinters(response.data)
        } else {
          console.error('Erro ao carregar impressoras:', response.error)
          toast.error('Erro ao carregar impressoras')
        }
      } catch (error) {
        console.error('Erro ao carregar impressoras:', error)
        toast.error('Erro ao carregar impressoras')
      }
    }

    loadPrinters()
  }, [])

  // Resetar toner quando impressora muda
  useEffect(() => {
    form.setValue('selectedToner', '')
  }, [selectedPrinter, form])

  const onSubmit = async (data: PublicTonerRequestData) => {
    try {
      const result = await createPublicTonerRequestAction(data)

      if (result.success) {
        toast.success('Pedido de toner enviado com sucesso!')
        form.reset()
        setSelectedPrinter(null)
        onSuccess?.()
      } else {
        toast.error(result.error?.message || 'Erro ao enviar pedido')
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
      toast.error('Erro interno. Tente novamente.')
    }
  }

  const handlePrinterSelect = (printer: PrinterData) => {
    setSelectedPrinter(printer)
    form.setValue('assetId', printer.assetId)
    setOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Seleção de Impressora */}
        <FormField
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Impressora (Nº Patrimônio da TI)</FormLabel>
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
                      {selectedPrinter
                        ? `${selectedPrinter.tag} - ${selectedPrinter.printerModel}`
                        : form.formState.isSubmitting
                          ? 'Carregando impressoras...'
                          : 'Selecione uma impressora'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Pesquisar impressora..." />
                    <CommandList>
                      <CommandEmpty>
                        Nenhuma impressora encontrada.
                      </CommandEmpty>
                      <CommandGroup>
                        {printers.map((printer) => (
                          <CommandItem
                            key={printer.assetId}
                            value={printer.tag}
                            onSelect={() => handlePrinterSelect(printer)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedPrinter?.assetId === printer.assetId
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {printer.tag} - {printer.printerModel}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {printer.sector} - {printer.department}
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

        {/* Dados da Impressora Selecionada */}
        {selectedPrinter && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Dados da Impressora Selecionada
              </h4>
              <div className="space-y-1">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Patrimônio:</strong> {selectedPrinter.tag}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Modelo:</strong> {selectedPrinter.printerModel}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Setor:</strong> {selectedPrinter.sector}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Secretaria:</strong> {selectedPrinter.department}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                  ⚠️ Caso os dados acima estejam incorretos, entre em contato
                  com a TI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Seleção de Toner */}
        {selectedPrinter && (
          <FormField
            control={form.control}
            name="selectedToner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toner Desejado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o toner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedPrinter.availableToners.map((toner) => (
                      <SelectItem key={toner} value={toner}>
                        {toner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Dados do Requerente */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-foreground">
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
                  <Input placeholder="Digite sua matrícula" {...field} />
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
                    value={formatWhatsApp(field.value)}
                    onChange={(e) => {
                      const numbers = extractWhatsAppNumbers(e.target.value)
                      field.onChange(numbers)
                    }}
                    maxLength={15}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || !selectedPrinter}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
        </Button>
      </form>
    </Form>
  )
}
