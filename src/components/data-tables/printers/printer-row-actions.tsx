'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash, History, Waypoints } from 'lucide-react'
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
import { UpdatePrinterDialogForm } from './update-printer-dialog-form'
import { DeletePrinterConfirmationDialog } from './delete-printer-confirmation-dialog'
import { UpdateAssetStatusForm } from '../assets/update-asset-status-dialog-form'
import { authClient } from '@/lib/auth/auth-client'
import Link from 'next/link'

export function PrinterRowActions({ row }: PrinterRowActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

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
            <Pencil />
            Editar
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="text-destructive" />
              <span className="text-destructive">Deletar</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
            <Waypoints />
            Atualizar Estado
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/assets/status-history/${printer.tag}`}>
              <History />
              Histórico de Estados
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdatePrinterDialogForm
        printer={printer}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <UpdateAssetStatusForm
        assetId={printer.assetId}
        currentStatus={printer.status}
        currentSectorId={printer.sectorId}
        assetTag={printer.tag}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
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
