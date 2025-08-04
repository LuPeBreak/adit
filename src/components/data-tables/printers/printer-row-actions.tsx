'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PrinterRowActionsProps } from './printers-table-types'
import { PrinterDialogForm } from './printer-dialog-form'
import { DeletePrinterConfirmationDialog } from './delete-printer-confirmation-dialog'
import { authClient } from '@/lib/auth/auth-client'

export function PrinterRowActions({ row }: PrinterRowActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data: session } = authClient.useSession()

  const printer = row.original
  const isAdmin = session?.user.role === 'ADMIN'

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
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            Editar Impressora
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive"
              >
                Deletar Impressora
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PrinterDialogForm
        initialData={printer}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {isAdmin && (
        <DeletePrinterConfirmationDialog
          printer={printer}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </>
  )
}
