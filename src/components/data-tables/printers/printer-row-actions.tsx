'use client'

import { useState } from 'react'
import { Pencil, Trash, History, Waypoints } from 'lucide-react'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'
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
import type { Role } from '@/generated/prisma'

export function PrinterRowActions({ row }: PrinterRowActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const printer = row.original

  // Permissions (síncrono via role)
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return <RowActionsButton />

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { printer: ['delete'] },
    role: session.user.role as Role,
  })
  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { printer: ['update'] },
    role: session.user.role as Role,
  })
  const canUpdateAsset = authClient.admin.checkRolePermission({
    permissions: { asset: ['update'] },
    role: session.user.role as Role,
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RowActionsButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canUpdate && (
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <Pencil />
              Editar
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="text-destructive" />
              <span className="text-destructive">Deletar</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {canUpdateAsset && (
            <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
              <Waypoints />
              Atualizar Estado
            </DropdownMenuItem>
          )}
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

      {canDelete && (
        <DeletePrinterConfirmationDialog
          printer={printer}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </>
  )
}
