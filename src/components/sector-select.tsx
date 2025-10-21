'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import { getSectors } from '@/actions/sectors/get-sectors'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateAcronymWithFallback } from '@/lib/utils/generate-acronym'

interface Sector {
  id: string
  name: string
  departmentName: string
}

interface SectorSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SectorSelect({
  value,
  onValueChange,
  placeholder = 'Selecione um setor',
  disabled = false,
  className,
}: SectorSelectProps) {
  const [open, setOpen] = useState(false)
  const [sectors, setSectors] = useState<Sector[]>([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    // Carrega setores na inicialização do componente
    if (sectors.length === 0) {
      loadSectors()
    }
  }, [sectors.length])

  const loadSectors = async () => {
    setIsLoading(true)
    try {
      const response = await getSectors()
      if (response.success && response.data) {
        setSectors(response.data)
      }
    } catch (error) {
      console.error('Erro ao carregar setores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedSector = sectors.find((sector) => sector.id === value)
  const getDisplayText = (sector: Sector) =>
    `${generateAcronymWithFallback(sector.departmentName)} - ${sector.name}`

  // Função para busca que inclui tanto a sigla quanto o nome completo
  const getSearchText = (sector: Sector) =>
    `${sector.departmentName} ${generateAcronymWithFallback(sector.departmentName)} ${sector.name}`

  // Função de filtro customizada para o Command
  const filterFunction = (value: string, search: string) => {
    const searchTerm = search.toLowerCase()
    const sectorText = value.toLowerCase()
    return sectorText.includes(searchTerm) ? 1 : 0
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between',
            !value && 'text-muted-foreground',
            className,
          )}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : selectedSector ? (
            getDisplayText(selectedSector)
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[200px] p-0">
        <Command filter={filterFunction}>
          <CommandInput placeholder="Buscar secretaria ou setor..." />
          <CommandList>
            <CommandEmpty>Nenhum setor encontrado.</CommandEmpty>
            <CommandGroup>
              {sectors.map((sector) => (
                <CommandItem
                  key={sector.id}
                  value={getSearchText(sector)}
                  onSelect={() => {
                    onValueChange(sector.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === sector.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {getDisplayText(sector)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
