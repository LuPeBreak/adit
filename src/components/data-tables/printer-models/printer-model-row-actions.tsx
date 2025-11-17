'use client'

import { useState } from 'react'
import { Pencil, Trash } from 'lucide-react'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'
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
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'

export function PrinterModelRowActions({ row }: PrinterModelRowActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const printerModel = row.original

  // Permissions (síncrono via role)
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return <RowActionsButton />

  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { printerModel: ['update'] },
    role: session.user.role as Role,
  })
  const canDelete = authClient.admin.checkRolePermission({
    permissions: { printerModel: ['delete'] },
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
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <Pencil />
              Editar
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
              <Trash className="text-destructive" />
              <span className="text-destructive">Deletar</span>
            </DropdownMenuItem>
          )}
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

      {canDelete && (
        <DeletePrinterModelConfirmationDialog
          printerModel={printerModel}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}
    </>
  )
}
