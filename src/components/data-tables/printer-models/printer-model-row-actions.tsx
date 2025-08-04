'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PrinterModelDialogForm } from './printer-model-dialog-form'
import type { PrinterModelRowActionsProps } from './printer-models-table-types'
import { DeletePrinterModelConfirmationDialog } from './delete-printer-model-confirmation-dialog'

export function PrinterModelRowActions({ row }: PrinterModelRowActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const printerModel = row.original

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <Trash className="text-destructive" />
            <span className="text-destructive">Deletar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PrinterModelDialogForm
        initialData={{
          id: printerModel.id,
          name: printerModel.name,
          toners: printerModel.toners,
        }}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DeletePrinterModelConfirmationDialog
        printerModel={printerModel}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  )
}
