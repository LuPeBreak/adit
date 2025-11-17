'use client'

import { useState } from 'react'
import { Pencil, Trash, Eye } from 'lucide-react'

import { DepartmentDialogForm } from './department-dialog-form'
import { DepartmentDetailsDialog } from './department-details-dialog'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DepartmentRowActionsProps } from './departments-table-types'
import { DeleteDepartmentConfirmationDialog } from './delete-department-confirmation-dialog'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'

export function DepartmentRowActions({ row }: DepartmentRowActionsProps) {
  const department = row.original
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  // Permissions
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return <RowActionsButton />

  const canDelete = authClient.admin.checkRolePermission({
    permissions: {
      department: ['delete'],
    },
    role: session.user.role as Role,
  })
  const canUpdate = authClient.admin.checkRolePermission({
    permissions: { department: ['update'] },
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

      <DepartmentDialogForm
        initialData={department}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DepartmentDetailsDialog
        department={department}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
      <DeleteDepartmentConfirmationDialog
        department={department}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  )
}
