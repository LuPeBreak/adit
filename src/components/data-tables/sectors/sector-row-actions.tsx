'use client'

import { useState } from 'react'
import { Pencil, Trash, Eye } from 'lucide-react'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SectorRowActionsProps } from './sectors-table-types'
import { SectorDialogForm } from './sector-dialog-form'
import { SectorDetailsDialog } from './sector-details-dialog'
import { DeleteSectorConfirmationDialog } from './delete-sector-confirmation-dialog'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'

export function SectorRowActions({ row }: SectorRowActionsProps) {
  const sector = row.original
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Permissions (síncrono via role)
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return <RowActionsButton />

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { sector: ['delete'] },
    role: session.user.role as Role,
  })
  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { sector: ['update'] },
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
          <DropdownMenuItem onSelect={() => setIsDetailsDialogOpen(true)}>
            <Eye />
            Ver detalhes
          </DropdownMenuItem>
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

      <DeleteSectorConfirmationDialog
        sector={sector}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <SectorDetailsDialog
        sector={sector}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      <SectorDialogForm
        initialData={sector}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  )
}
